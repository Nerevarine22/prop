import { updateHyroTraderRuleFacts } from '../src/lib/data/hyroTraderRules';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { isDeepStrictEqual } from 'node:util';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { HYROTRADER_PAGE_PROFILE } from '../src/lib/data/standardizedFirmProfiles';
import { hyroPricingFact, updateHyroTraderPrograms, withHyroTraderPricing } from '../src/lib/data/hyroTraderPricing';
import type { FirmDatabaseRecord } from '../src/types/database';

async function main() {
  const key = JSON.parse(await readFile('serviceAccountKey.json', 'utf8'));
  if (key.project_id !== 'prop-24596') throw new Error('Unexpected Firebase project.');
  const db = getFirestore(initializeApp({ credential: cert(key) }));
  const ref = db.collection('firmRegistry').doc('firm-hyrotrader');
  const snapshot = await ref.get();
  const before = snapshot.data() as FirmDatabaseRecord | undefined;
  if (!before || before.slug !== 'hyrotrader' || !before.normalizedProfile || before.normalizedProfile.challengePrograms.status === 'ND') throw new Error('Expected HyroTrader record and programs are missing.');
  const stamp = new Date().toISOString();
  const update = JSON.parse(JSON.stringify({
    normalizedProfile: updateHyroTraderRuleFacts({
      ...before.normalizedProfile,
      challengePrograms: hyroPricingFact(updateHyroTraderPrograms(before.normalizedProfile.challengePrograms.value)),
      modularProfile: withHyroTraderPricing(before.normalizedProfile.modularProfile ?? HYROTRADER_PAGE_PROFILE),
    }),
    normalizedProfileV2: withHyroTraderPricing(before.normalizedProfileV2 ?? HYROTRADER_PAGE_PROFILE),
    pageProfileV2: withHyroTraderPricing(before.pageProfileV2 ?? HYROTRADER_PAGE_PROFILE),
    ...(before.draftPageProfileV2 ? { draftPageProfileV2: withHyroTraderPricing(before.draftPageProfileV2), draftUpdatedAt: stamp } : {}),
    publishedAt: stamp, updatedAt: stamp,
  }));
  console.log(JSON.stringify({ document: ref.path, fields: Object.keys(update), pricing: update.pageProfileV2.sections.find((s: { id: string }) => s.id === 'offers').blocks.filter((b: { type: string }) => b.type === 'table') }, null, 2));
  if (!process.argv.includes('--write')) { console.log('Dry run only; no database writes.'); return; }
  const backup = join(tmpdir(), `hyrotrader-before-pricing-${Date.now()}.json`);
  await writeFile(backup, JSON.stringify(before, null, 2));
  await db.runTransaction(async (transaction) => {
    const current = await transaction.get(ref);
    if (!current.updateTime?.isEqual(snapshot.updateTime!)) throw new Error('HyroTrader changed after preview; rerun before writing.');
    transaction.update(ref, update);
  });
  const after = (await ref.get()).data();
  if (!isDeepStrictEqual(after, { ...before, ...update })) throw new Error('Stored record differs from the expected update.');
  console.log(`Verified HyroTrader update. All fields outside the listed update preserved. Backup: ${backup}`);
}

main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });
