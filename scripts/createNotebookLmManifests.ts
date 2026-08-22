import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PRIMARY_RESEARCH_BY_SLUG } from '../src/lib/data/firmPrimaryResearch';
import { FIRM_DATABASE_SEED } from '../src/lib/data/firmDatabaseSeed';

const outputDirectory = resolve(process.cwd(), 'research/notebooklm/manifests');
const requestedSlugs = process.argv
  .filter((argument) => argument.startsWith('--slug='))
  .map((argument) => argument.slice('--slug='.length));
const ledgerOnly = process.argv.includes('--ledger-only');
const includeLedger = ledgerOnly || process.argv.includes('--with-ledger');

function isUsableSource(url: string) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol)
      && !['x.com', 'twitter.com'].includes(parsed.hostname.replace(/^www\./, ''));
  } catch {
    return false;
  }
}

async function main() {
  const slugs = requestedSlugs.length
    ? requestedSlugs
    : Object.keys(PRIMARY_RESEARCH_BY_SLUG);
  await mkdir(outputDirectory, { recursive: true });

  for (const slug of slugs) {
    const research = PRIMARY_RESEARCH_BY_SLUG[slug];
    const record = FIRM_DATABASE_SEED.find((item) => item.slug === slug);
    if (!research || !record) throw new Error(`Missing research ledger or registry seed for ${slug}.`);

    const sourceMap = new Map<string, string>();
    for (const observation of research.observations) {
      const candidate = observation.field === 'officialWebsite'
        ? observation.value
        : observation.sourceUrl;
      if (!isUsableSource(candidate) || sourceMap.has(candidate)) continue;
      sourceMap.set(candidate, observation.field);
    }
    if (!sourceMap.size) throw new Error(`No usable official sources found for ${slug}.`);

    const ledgerText = [
      `Official-source research ledger for ${record.name}.`,
      `Checked at: ${research.checkedAt}.`,
      '',
      ...research.observations.flatMap((observation) => [
        `[${observation.field} · ${observation.status}]`,
        observation.value,
        `Source: ${observation.sourceUrl}`,
        ...(observation.notes ? [`Notes: ${observation.notes}`] : []),
        '',
      ]),
    ].join('\n');
    const manifest = {
      slug,
      name: record.name,
      notebookTitle: `PropHub research — ${record.name}`,
      googleDocTitle: `${record.name} — operating model and funding rules research`,
      promptPath: 'research/notebooklm/prompts/firm-research.md',
      sources: [
        ...(includeLedger ? [{
        type: 'text',
        label: 'Existing official-source research ledger',
        value: ledgerText,
        }] : []),
        ...(ledgerOnly ? [] : [...sourceMap].map(([value, field]) => ({
        type: 'url',
        label: field === 'officialWebsite'
          ? 'Official website'
          : `Official ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
        value,
        optional: includeLedger,
        }))),
      ],
    };
    const path = resolve(outputDirectory, `${slug}.local.json`);
    await writeFile(path, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    process.stdout.write(`${slug}: ${manifest.sources.length} sources\n`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown manifest generation error';
  process.stderr.write(`Manifest generation failed: ${message}\n`);
  process.exitCode = 1;
});
