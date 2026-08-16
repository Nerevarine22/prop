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

Without Firebase environment variables, `/admin/database` shows an exact local preview and performs no remote writes.

## Publishing workflow

1. A newly discovered firm starts as `stub` + `draft`.
2. Research adds `primaryResearch` and `normalizedProfile`, then changes status
   to `researched`; unknown facts remain explicit `ND`.
3. Manual review may change it to `verified`.
4. Public comparison pages use complete `normalizedProfile` records; partial
   source ledgers remain available for research review.

The retired `firms` collection must not be recreated. New research work belongs in `firmRegistry`.
