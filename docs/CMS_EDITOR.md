# Firm page CMS

The admin builder edits the same `FirmNormalizedProfileV2` content model that the public firm page renders.

## Editing model

- **Hero & quick facts** controls the operating model, account environment, offers, entry range, capital range, profit split, payout labels, and execution labels.
- **Sections** define the public navigation and the order of the long-form page.
- **Blocks** are reusable editorial units: narrative text, fact grids, record lists, tables, and notices.
- Clicking a section or block in the preview selects the corresponding inspector.
- Desktop/mobile and light/dark controls affect preview only.

## Publishing workflow

1. Changes remain local until **Save draft** is used.
2. Raw imported research remains in `normalizedProfileV2`.
3. A CMS draft is stored separately as `draftPageProfileV2` and does not replace either raw research or the public profile.
4. **Publish** copies the edited page to `pageProfileV2`, updates publication timestamps, and makes it available to the public renderer.

The public renderer and builder preview share the same hero and editorial content components. This keeps manual layouts aligned with the live page instead of maintaining a separate admin-only approximation.

## Content rules

- Keep comparison facts in structured hero fields so directory filters and future comparisons can consume them.
- Use narrative blocks for explanations and mechanics that do not fit a universal schema.
- Use fact grids for short scannable values, record lists for offers or source records, tables for matrices, and notices for caveats or unresolved differences.
- Do not add empty or placeholder facts simply to satisfy a fixed template.
