import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { FIRM_NORMALIZED_PROFILES_BY_SLUG } from '../src/lib/data/firmNormalizedProfiles';
import { getFirmModularProfile } from '../src/lib/data/firmModularProfiles';
import { PRIMARY_RESEARCH_BY_SLUG } from '../src/lib/data/firmPrimaryResearch';
import type {
  FirmContentBlock,
  FirmContentFact,
  FirmNormalizedProfileV2,
  FirmProfileSection,
  NormalizedEvidence,
} from '../src/types/database';

type ReportSection = { title: string; body: string };

function argument(name: string) {
  return process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
}

function cleanMarkdown(value: string) {
  const lines = value.split(/\r?\n/);
  const withoutTables = lines.filter((line, index) => {
    if (!line.trim().startsWith('|')) return true;
    const previous = lines[index - 1]?.trim() ?? '';
    const next = lines[index + 1]?.trim() ?? '';
    return !(previous.startsWith('|') || next.startsWith('|'));
  });
  return withoutTables
    .join('\n')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*/g, '')
    .replace(/^\s*[-*]\s+/gm, '• ')
    .replace(/^\s*\d+\.\s+/gm, '• ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parseReport(markdown: string): ReportSection[] {
  const matches = [...markdown.matchAll(/^(?:#{2,3}\s+(?:\d+\.\s*)?(.+)|\*\*(?:\d+\.\s*)?([^*]+)\*\*)$/gm)];
  return matches.map((match, index) => {
    const start = (match.index ?? 0) + match[0].length;
    const end = matches[index + 1]?.index ?? markdown.length;
    return { title: (match[1] ?? match[2]).trim(), body: cleanMarkdown(markdown.slice(start, end)) };
  }).filter((section) => section.body.length > 0);
}

function categoryFor(title: string) {
  const value = title.toLowerCase();
  if (/source|conflict|unresolved/.test(value)) return 'sources';
  if (/token|reward|ecosystem|staking|nft/.test(value)) return 'rewards';
  if (/payout|compensation|withdraw/.test(value)) return 'payouts';
  if (/rule|risk|drawdown|permission|restriction|constraint/.test(value)) return 'trading';
  if (/offer|track|account|funding|pricing|progression|tier/.test(value)) return 'offers';
  if (/execution|settlement|technical|custody|market|venue/.test(value)) return 'trading';
  return 'overview';
}

function sectionFor(category: string, sections: FirmProfileSection[]) {
  const candidates: Record<string, RegExp> = {
    overview: /overview/i,
    offers: /offer|challenge|evaluation|track|pricing/i,
    trading: /trading|rule|execution|risk/i,
    payouts: /payout|withdraw/i,
    rewards: /reward|token|point/i,
    sources: /source|change|difference/i,
  };
  return sections.find((section) => candidates[category]?.test(`${section.id} ${section.tabLabel} ${section.title}`));
}

function evidenceFor(urls: string[], checkedAt: string): NormalizedEvidence[] {
  return [...new Set(urls)].map((sourceUrl) => ({ sourceUrl, checkedAt }));
}

function evidenceForFact(fact: FirmContentFact, fallback: NormalizedEvidence[]) {
  const urls = fact.sourceUrls ?? [];
  return {
    ...fact,
    value: fact.value || 'ND',
    status: fact.status ?? 'reported',
    evidence: fact.evidence?.length
      ? fact.evidence
      : urls.length
        ? evidenceFor(urls, fallback[0].checkedAt)
        : fallback,
  };
}

function normalizeBlockEvidence(block: FirmContentBlock, fallback: NormalizedEvidence[]): FirmContentBlock {
  if (block.type === 'text' || block.type === 'notice') {
    return { ...block, status: block.status ?? 'reported', evidence: block.evidence?.length ? block.evidence : fallback };
  }
  if (block.type === 'fact-grid') {
    return { ...block, items: block.items.map((fact) => evidenceForFact(fact, fallback)) };
  }
  if (block.type === 'record-list') {
    return {
      ...block,
      items: block.items.map((record) => ({
        ...record,
        ...(record.facts ? { facts: record.facts.map((fact) => evidenceForFact(fact, fallback)) } : {}),
      })),
    };
  }
  throw new Error(`Table block ${block.id} requires a manual migration before model-first sync.`);
}

async function main() {
  const slug = argument('slug');
  if (!slug) throw new Error('Use --slug=<firm-slug>.');
  const normalized = FIRM_NORMALIZED_PROFILES_BY_SLUG[slug];
  const ledger = PRIMARY_RESEARCH_BY_SLUG[slug];
  if (!normalized || !ledger) throw new Error(`Missing normalized profile or research ledger for ${slug}.`);

  const reportPath = resolve(process.cwd(), argument('report') ?? `research/notebooklm/runs/${slug}/report.md`);
  const outputPath = resolve(process.cwd(), argument('output') ?? `research/reviewed/${slug}.json`);
  const report = await readFile(reportPath, 'utf8');
  const reportSections = parseReport(report);
  if (!reportSections.length) throw new Error(`No report sections parsed from ${reportPath}.`);

  const base = getFirmModularProfile(normalized);
  const checkedAt = new Date().toISOString().slice(0, 10);
  const sourceUrls = ledger.observations.map((observation) => observation.sourceUrl);
  const fallbackEvidence = evidenceFor(sourceUrls, checkedAt);
  const sections = base.sections.map((section) => ({
    ...section,
    blocks: section.blocks.map((block) => normalizeBlockEvidence(block, fallbackEvidence)),
  }));

  for (const [index, reportSection] of reportSections.entries()) {
    const target = sectionFor(categoryFor(reportSection.title), sections) ?? sections[0];
    const paragraphs = reportSection.body.split(/\n{2,}/).filter(Boolean);
    if (!paragraphs.length) continue;
    target.blocks.unshift({
      id: `notebooklm-${index + 1}`,
      type: 'text',
      eyebrow: 'NotebookLM research brief',
      title: reportSection.title,
      paragraphs,
      status: 'reported',
      evidence: fallbackEvidence,
    });
  }

  const opening = reportSections.find((section) => /overview|identity|operating model/i.test(section.title)) ?? reportSections[0];
  const lifecycle = reportSections.find((section) => /lifecycle|journey|how it works/i.test(section.title));
  const profile: FirmNormalizedProfileV2 = {
    ...base,
    researchStandard: 'model-first-v1',
    researchMode: 'agent-assisted',
    checkedAt,
    operatingModel: {
      classification: {
        id: `${slug}-operating-model`,
        label: 'Operating model',
        value: base.modelTypes.map((value) => value.replaceAll('-', ' ')).join(' · '),
        status: 'reported',
        evidence: fallbackEvidence,
      },
      summary: {
        id: `${slug}-model-summary`,
        label: 'How the model works',
        value: opening.body.slice(0, 900),
        status: 'reported',
        note: 'Condensed from the NotebookLM research brief; editorial polishing is deferred.',
        evidence: fallbackEvidence,
      },
      lifecycle: [{
        id: `${slug}-lifecycle`,
        label: 'Trader lifecycle',
        value: (lifecycle?.body ?? opening.body).slice(0, 1200),
        status: 'reported',
        evidence: fallbackEvidence,
      }],
    },
    comparison: {
      ...base.comparison,
      capital: { ...base.comparison.capital, evidence: base.comparison.capital.evidence?.length ? base.comparison.capital.evidence : fallbackEvidence },
      entryCost: { ...base.comparison.entryCost, evidence: base.comparison.entryCost.evidence?.length ? base.comparison.entryCost.evidence : fallbackEvidence },
      profitSplit: { ...base.comparison.profitSplit, evidence: base.comparison.profitSplit.evidence?.length ? base.comparison.profitSplit.evidence : fallbackEvidence },
      maxDrawdown: { ...base.comparison.maxDrawdown, evidence: base.comparison.maxDrawdown.evidence?.length ? base.comparison.maxDrawdown.evidence : fallbackEvidence },
      payoutSchedules: { ...base.comparison.payoutSchedules, evidence: base.comparison.payoutSchedules.evidence?.length ? base.comparison.payoutSchedules.evidence : fallbackEvidence },
      executionModels: { ...base.comparison.executionModels, evidence: base.comparison.executionModels.evidence?.length ? base.comparison.executionModels.evidence : fallbackEvidence },
    },
    sections,
    sourcesInspected: [...new Map(ledger.observations.map((observation) => [observation.sourceUrl, {
      category: observation.field === 'officialWebsite' ? 'website' as const : observation.field === 'pricingCheckout' ? 'pricing-checkout' as const : observation.field === 'payoutPolicy' ? 'payout-policy' as const : observation.field === 'tokenRewards' ? 'token-rewards' as const : observation.field === 'rulebook' ? 'rulebook' as const : observation.field,
      url: observation.sourceUrl,
      checkedAt,
      outcome: 'accessed' as const,
      notes: observation.notes,
    }])).values()],
  };

  await writeFile(outputPath, `${JSON.stringify(profile, null, 2)}\n`, 'utf8');
  process.stdout.write(`Report-backed profile created: ${outputPath}\nSections: ${profile.sections.length}\nReport sections imported: ${reportSections.length}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown profile build error';
  process.stderr.write(`Report-backed profile build failed: ${message}\n`);
  process.exitCode = 1;
});
