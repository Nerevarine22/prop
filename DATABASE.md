# PropHub research database

PropHub uses the existing Firebase/Firestore stack. The canonical collection is `firmRegistry`.

## Record contract

Every document follows `FirmDatabaseRecord` from `src/types/database.ts`:

- `schemaVersion`: migration boundary, currently `1`;
- `id`, `slug`, `name`: stable identity;
- `links`: official website and X account;
- `brandAssets`: local logo path plus its first-party source and verification date;
- `primaryResearch`: field-level primary-source ledger for website identity,
  rulebook, FAQ, pricing/checkout, terms, payout policy and token/rewards;
- `normalizedProfile`: primary-source-only normalized evidence profile. Every
  canonical leaf is a fact with `reported`, `verified`, or `ND` status plus
  its URL and check date;
- `externalRatings`: a separate third-party reputation layer. Trustpilot
  snapshots store the displayed score, review count, source URL, capture date,
  and optional approximate bar distribution without being treated as primary
  research or as proof of rules, reserves, execution, or payout eligibility;
- `normalizedProfileV2`: canonical data-driven public profile for new research.
  It stores the project operating model, an ordered `sections[]` collection
  built from safe typed blocks (`text`,
  `fact-grid`, `record-list`, `table`, and `notice`) plus a small universal
  comparison projection. Blocks may carry presentation hints such as `steps`,
  `details`, or `tracks`, so the same safe renderer can match the project model
  without inventing fields from another firm. Raw HTML is never stored or
  rendered;
- `sourceDiscrepancies`: resolved differences between official sources,
  retaining the canonical and alternate values, both URLs, date and resolution basis;
- `researchStatus`: `stub`, `researched`, or `verified`;
- `publicationStatus`: `draft`, `published`, or `archived`;
- `profile`: optional legacy/UI `PropFirm` payload. It is deliberately separate
  because its numeric and boolean fields cannot safely represent `ND`;
- `createdAt`, `updatedAt`: ISO timestamps.

Every primary-research observation stores one value, its exact source URL, the
review timestamp and one of `reported`, `verified`, `conflict`, or `ND`. `ND`
means the value was not documented on the inspected first-party source. An
unknown normalized value is stored as literal `ND` inside a `NormalizedFact`.
Raw conflicting observations remain as audit evidence, but never become a
canonical normalized conflict. Rulebooks take precedence for trading rules;
otherwise the most specific formal policy or Terms is used. No zero, false,
empty array, or legacy demo value substitutes for an unknown value.

The public read path prefers a valid stored `normalizedProfileV2`. New research
must be authored model-first: inspect the project, define its actual operating
model, and then create only the sections and facts that belong to it. The old
`normalizedProfile` conversion remains a temporary compatibility path for firms
that have not yet been re-researched; it is not a template for new records.
Only the `comparison` projection is deliberately standardized across firms.

## Initial dataset

`src/lib/data/firmDatabaseSeed.ts` contains 21 canonical records:

- Propr: `researched`, `published`, normalized evidence profile plus the legacy UI profile;
- 20 other firms: `researched`, `draft`, identity, completed primary-source
  ledger, local logo and normalized evidence profile. Missing values remain explicit `ND`.

The August 15–16, 2026 research pass used only X profiles and first-party firm
domains. Aggregators and review sites were not used as fact sources. The
normalization sync updates only `normalizedProfile`, `researchStatus`, and
`updatedAt`; it does not change publication status, legacy `profile`, or the
retired `firms` collection.

The seed is idempotent. Existing documents receive only stable identity, links
and brand assets; later research and publication fields are preserved.

## Initialize Firestore

1. Create or select a Firebase project.
2. Configure these environment variables locally and in the deployment environment:

   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

3. Deploy `firestore.rules` and `firestore.indexes.json` using the Firebase CLI.
4. Sign in to the PropHub admin area.
5. Open `/admin/database` and select **Initialize Firestore**.

For a controlled server-side seed using a local service account, place the
gitignored `serviceAccountKey.json` in the project root and run `npm run db:seed`.

Validate the generated section-based profiles without touching Firestore:

```bash
npm run db:sync-modular
```

After reviewing the dry run, migrate only `normalizedProfileV2` for the existing
records with `npm run db:sync-modular:write`. The command verifies all 21
documents after the batch and does not update publication or research fields.

Validate a reviewed model-first profile without writing:

```bash
npm run db:sync-model-first
```

After review, write only that firm’s `normalizedProfileV2` with
`npm run db:sync-model-first:write`. For another reviewed slug, run
`npx tsx scripts/syncModelFirstFirm.ts --slug=<slug> [--write]`. The migration rejects
missing evidence and verifies that protected Firestore fields stay unchanged.

Without Firebase environment variables, `/admin/database` shows an exact local preview and performs no remote writes.

## Publishing workflow

1. A newly discovered firm starts as `stub` + `draft`.
2. Research defines the firm’s own operating model and writes a model-first
   `normalizedProfileV2`; it does not begin from another firm’s rule template.
   A value is `ND` only when it is relevant to this operating model and remains
   undocumented after the relevant primary sources were inspected.
3. Manual review may change it to `verified`.
4. Public profile pages render the ordered V2 sections. When a stored V2 record
   is absent, the read path derives it from `normalizedProfile` without changing
   Firestore. Comparison pages use only the universal V2 projection, not
   assumptions about evaluation steps or challenge phases.

The retired `firms` collection must not be recreated. New research work belongs in `firmRegistry`.
