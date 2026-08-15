# PropHub research database

PropHub uses the existing Firebase/Firestore stack. The canonical collection is `firmRegistry`.

## Record contract

Every document follows `FirmDatabaseRecord` from `src/types/database.ts`:

- `schemaVersion`: migration boundary, currently `1`;
- `id`, `slug`, `name`: stable identity;
- `links`: official website and X account;
- `brandAssets`: local logo path plus its source and verification status;
- `researchStatus`: `stub`, `researched`, or `verified`;
- `publicationStatus`: `draft`, `published`, or `archived`;
- `profile`: optional complete `PropFirm` research payload;
- `createdAt`, `updatedAt`: ISO timestamps.

An unknown research value is represented by an absent `profile`, never by fake numbers or empty rule strings.

## Initial dataset

`src/lib/data/firmDatabaseSeed.ts` contains 21 canonical records:

- Propr: `researched`, `published`, complete profile and sources;
- 20 other firms: `stub`, `draft`, identity and available links only.

The seed is idempotent. Running it again creates missing identities and only refreshes stable identity fields on existing documents; publication states and later research fields are preserved.

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
gitignored `serviceAccountKey.json` in the project root and run:

```bash
npm run db:seed
```

The command writes with merge semantics and then reads the collection back to
verify the record count and the complete Propr challenge payload.

Without Firebase environment variables, `/admin/database` shows an exact local preview and performs no remote writes.

## Publishing workflow

1. A newly discovered firm starts as `stub` + `draft`.
2. Primary-source collection is stored in `primaryResearch`. A published partial record appears as transparent research notes with unavailable fields left visible.
3. Normalization adds a complete `profile` and changes status to `researched`; manual review may later change it to `verified`.
4. Only complete `profile` records participate in structured comparison. Partial records remain browseable but cannot be added to comparison.

The public site, comparison tools and admin firm editor all use `firmRegistry`. The retired `firms` collection must not be recreated.
