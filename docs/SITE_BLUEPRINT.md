# PropHub site blueprint

## 1. Product definition

PropHub is an independent research and comparison hub for blockchain-native and crypto-focused proprietary trading firms.

Primary promise:

> Find the right on-chain prop firm. Compare the rules, proof and rewards before you pay.

Supporting statement:

> Independent research on crypto-native prop firms, evaluation rules, on-chain evidence and trader reward programs.

PropHub should help a trader answer four questions:

1. Is this firm suitable for my trading style?
2. What rules and costs can cause me to fail or lose money?
3. Which claims can be supported by primary or on-chain evidence?
4. Do points, tokens, airdrops or AI compatibility change the value of the offer?

## 2. Product boundaries

### Core now

- Prop firm directory
- Firm research profiles
- Side-by-side comparison
- Evaluation rules and account pricing
- Data provenance and verification status
- Points, token and airdrop research
- Coupon and promotion records

### Later

- On-chain payout monitoring
- Rule and price change monitoring
- AI trading tools and copilots
- Personalized firm matching
- Alerts, saved comparisons and trader accounts

AI tools must become a separate research vertical. They should not be mixed into firm rankings until there is a real evaluation methodology.

## 3. Information architecture

| Route | Purpose | Indexing |
| --- | --- | --- |
| `/` | Product narrative and selected research entry points | Index |
| `/prop-firms` | Canonical searchable firm directory | Index |
| `/prop-firms/[slug]` | Canonical firm entity and research profile | Index |
| `/compare` | Interactive comparison workspace | Index |
| `/rewards` | Points, token and airdrop research | Index |
| `/methodology` | Research, sourcing and verification policy | Index |
| `/coupons` | Coupon research and promotion records | Index after real verification starts |
| `/transparency` | Prototype for future evidence dashboards | Noindex while data is static |
| `/admin` | Internal content operations | Disallow and no public links |
| `/firms` | Legacy compatibility route | Redirect to `/prop-firms` |
| `/firms/[slug]` | Legacy compatibility route | Permanent redirect to canonical profile |

Future routes:

- `/payouts`
- `/research`
- `/research/[slug]`
- `/ai-tools`
- `/ai-tools/[slug]`
- `/changes`
- `/legal/privacy`
- `/legal/terms`
- `/legal/risk`
- `/legal/affiliate-disclosure`

## 4. Data trust model

Every public claim must have a data status.

### `mock`

Sample content used for product development. It must always be visibly labeled and must never be presented as current, live, verified or purchase guidance.

### `reported`

Information published by a firm or community source. The original source, access date and exact claim must be stored. Reported data is not an independent verification.

### `verified`

Information checked against primary documentation or independently inspectable evidence. The verification method, date, reviewer and source list must be stored.

### Required provenance fields

Each firm record must include:

- `dataStatus`
- `lastReviewedAt`
- `sources[]`
- `verification`
- `changeHistory[]`

Each source should contain:

- stable internal ID
- label
- source type
- source URL when available
- access date
- publication date when available
- research notes

Each verification record should contain:

- status
- verification method
- check date
- linked source IDs
- reviewer when applicable
- confidence level

## 5. Claim language rules

Never use the following labels unless the supporting system is active and inspectable:

- Live
- Real-time
- Verified daily
- Auto sync active
- On-chain verified
- Guaranteed
- Best
- Safest

Use these alternatives during development:

- Demo data
- Sample record
- Prototype
- Reported by the firm
- Last checked on [date]
- Verification pending

Ratings, reviews, trust scores, payout records and transaction hashes must be labeled as sample when they come from mock data.

## 6. Research workflow

1. Collect the official rulebook, pricing, payout policy, supported platforms and reward terms.
2. Normalize the data into comparable fields without hiding exceptions.
3. Save every primary source and access date.
4. Assign `reported` status when only the publisher claim is known.
5. Assign `verified` only after the defined verification method succeeds.
6. Record every meaningful rule, price or reward change.
7. Lower or expire the status when a source becomes stale or unavailable.

Verification should happen at field level in the future. A firm can have verified payout evidence while its airdrop claim remains only reported.

## 7. Design system direction

Design read: trust-first crypto research hub for traders, using an editorial data language instead of a promotional crypto aesthetic.

Design controls:

- Design variance: 5
- Motion intensity: 3
- Visual density: 6
- Theme: consistent dark theme for the current product phase
- Framework: Tailwind CSS 4 with semantic CSS variables
- Font: Space Grotesk through `next/font`

### Design principles

- Evidence before decoration
- One main accent color
- Semantic warning and information colors only when they communicate status
- Tabular figures for financial and trading metrics
- Cards only when they communicate grouping or hierarchy
- Research summaries should be readable without opening an interaction
- Dense tables belong in comparison and evidence tools, not the homepage hero
- Motion is limited to state feedback, loading and hierarchy

### Current semantic tokens

- Canvas: `--color-canvas`
- Surface: `--color-surface`
- Raised surface: `--color-surface-raised`
- Border: `--color-border`
- Primary text: `--color-text`
- Muted text: `--color-text-muted`
- Accent: `--color-accent`
- Warning: `--color-warning`
- Control radius: `--radius-control`
- Panel radius: `--radius-panel`

### Component rules

- A data status badge must appear near research records.
- `mock`, `reported` and `verified` must have distinct labels and tooltips.
- Buttons require hover, active and visible keyboard focus states.
- Loading states should match the shape of final content.
- Errors must be inline and actionable. Do not use `window.alert`.
- Do not use disabled-looking text as a link.
- Mobile layouts must be explicitly checked at 390 px width.
- Page zoom must never be disabled.

## 8. Content and voice

Voice should be direct, analytical and specific.

Use:

- plain English
- short sentences
- concrete trading terminology
- exact source and review dates
- explicit uncertainty

Avoid:

- hype
- fake urgency
- unsupported superlatives
- generic AI copy
- unexplained scores
- claims that a reward or airdrop is confirmed without a primary source

The site is not financial advice. Affiliate relationships must never change the research status or ranking calculation.

## 9. SEO foundation

Required for every indexable entity page:

- unique title and description
- canonical URL
- server-rendered primary content
- one descriptive H1
- clear internal links
- last reviewed date
- visible source list
- crawlable text summary
- appropriate Open Graph metadata

Global requirements:

- `metadataBase`
- title template
- sitemap
- robots rules
- Open Graph defaults
- Twitter card defaults
- redirects from legacy routes
- noindex for admin and unfinished evidence prototypes

Do not create thin filter pages for every parameter combination. Index a category page only when it has a stable URL, unique intent, useful copy and enough qualifying firms.

## 10. GEO foundation

Pages should be easy for answer engines to parse and cite.

Each research profile should eventually contain:

1. A two or three sentence answer-first summary.
2. A key facts table.
3. A clear separation between facts, firm claims and PropHub analysis.
4. Source links next to important claims.
5. Last checked dates.
6. Definitions for uncommon trading terms.
7. A change log.
8. Author and reviewer identity.

Structured data should only represent real visible content. Do not publish aggregate ratings or reviews in structured data while they are sample records.

`llms.txt` may be added later, but it cannot replace crawlable pages, citations or structured data.

## 11. Technical architecture

- Next.js App Router
- React Server Components by default
- Client Components only for filters, comparison, clipboard and other interactions
- Tailwind CSS 4
- Firebase Auth and Firestore when configured
- Local demo dataset as a development fallback

Rules:

- Public entity data should be loaded in a Server Component or server data layer.
- Interactive filters receive serializable initial data from the server.
- Secrets must never use `NEXT_PUBLIC_` variables.
- Firebase fallback must never grant admin access.
- Old Firestore records must be normalized before rendering.
- `npm run lint`, production build and browser route checks are required before handoff.

## 12. Security and admin rules

- Admin access requires Firebase Authentication.
- There are no demo credentials.
- There is no sessionStorage authentication fallback.
- Admin routes are excluded from crawling.
- Firestore security rules must enforce authorization independently from the UI.
- Publishing a record and marking it verified must become separate permissions.

## 13. Definition of done for a real firm profile

A firm profile is ready for indexing only when:

- its identity and official URL are confirmed;
- core rules have primary sources;
- every important field has a status;
- the last review date is visible;
- contradictions are resolved or explicitly documented;
- mock reviews and scores are removed;
- metadata is unique;
- canonical URL is correct;
- mobile and keyboard flows pass;
- no unsupported live or verified claim remains.

