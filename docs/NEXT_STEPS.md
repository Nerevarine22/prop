# PropHub next steps

The first four foundation items are now started: stabilization, honest mock labeling, provenance-ready data types, and the target information architecture.

## Priority 1: complete the design system

Create reusable primitives for page headers, data status, evidence rows, metric groups, filters, tables, empty states and alerts.

Why: removes inconsistent hardcoded colors, spacing and radii.

Impact: faster feature work, stronger brand recognition and fewer accessibility regressions.

## Priority 2: build the real research data pipeline

Choose the production database model, add field-level sources, verification jobs, stale-data rules and change history.

Why: the database is the main product moat.

Impact: makes comparison, alerts, SEO pages and future AI answers trustworthy.

## Priority 3: replace demo records with sourced firm profiles

Research a small launch set first. Verify official rules, pricing, payout policies, platforms and reward claims.

Why: ten accurate profiles are more valuable than hundreds of shallow listings.

Impact: establishes trust and creates the first indexable content.

## Priority 4: rebuild comparison around trader decisions

Add account-size normalization, rule exceptions, drawdown type, payout conditions, restricted strategies, reward value and source dates.

Why: current comparisons show values but do not explain the practical trade-off.

Impact: improves decision quality and affiliate conversion without relying on promotional rankings.

## Priority 5: develop rewards intelligence

Track points formulas, seasons, snapshots, token status, eligibility, dilution risks and official announcements.

Why: this is a meaningful differentiator from traditional prop directories.

Impact: attracts crypto-native traders and creates recurring update traffic.

## Priority 6: connect on-chain evidence

Map firm-controlled wallets and payout contracts, then link transactions to public explorers.

Why: a transparency dashboard is useful only when users can independently inspect the evidence.

Impact: turns the blockchain positioning into a defensible product feature.

## Priority 7: add editorial SEO and GEO content

Create sourced category pages, comparison guides, term definitions, update logs, author pages and firm change reports.

Why: entity pages alone will not cover all search and answer-engine intent.

Impact: improves crawl depth, topical authority, citations and organic acquisition.

## Priority 8: add AI tool research

Create a separate taxonomy for copilots, analytics, bots and execution tools. Define safety, custody, platform and evidence criteria before rankings.

Why: AI tools have different risks and evaluation criteria from prop firms.

Impact: expands the hub without weakening the clarity of the core product.

## Priority 9: production admin and publishing workflow

Add roles, approval states, draft preview, audit logs, field validation and Firestore security rules.

Why: a client-side admin interface is not enough for research governance.

Impact: prevents accidental publication and makes verification accountable.

## Priority 10: legal and commercial foundation

Prepare privacy, terms, risk disclosure, cookie policy and affiliate disclosure. Define how paid placements are labeled.

Why: the product influences financial purchasing decisions and may use affiliate links.

Impact: reduces legal risk and protects editorial credibility.

## Priority 11: analytics and feedback

Track directory filters, comparison creation, profile exits, source clicks and correction reports without collecting unnecessary personal data.

Why: product decisions need evidence about what traders actually compare.

Impact: improves navigation, content priorities and conversion measurement.

## Priority 12: quality and operations

Add automated tests, accessibility checks, Lighthouse budgets, uptime monitoring, backups and dependency update automation.

Why: trust also depends on reliability and predictable releases.

Impact: lowers regression risk as the dataset and product surface grow.

## Current technical follow-ups

- Upgrade local Node.js from 22.10 to at least 22.13 to match the ESLint engine requirement.
- Decide the production domain and set `NEXT_PUBLIC_SITE_URL`.
- Add an Open Graph image.
- Move remaining public data reads behind a server repository layer.
- Split the comparison picker into smaller components.
- Replace dynamic remote logo URLs with owned or approved assets where licensing permits.
- Add real legal routes before launch.
- Re-enable indexing for `/transparency` and `/coupons` only after real verification is active.

