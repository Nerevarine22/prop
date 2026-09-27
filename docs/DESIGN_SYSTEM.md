# PropHub design system

Last reconciled: 26 September 2026.

## 1. Scope and authority

This document describes the current public product and records approved design rules. It is not a proposal for a new visual direction.

- `SITE_BLUEPRINT.md` owns product positioning, information architecture and research policy.
- This document owns visual language, theme roles, component patterns and interaction constraints.
- Preserve the established appearance when changing functionality. Reuse the component and CSS for the surrounding surface before adding new styles.
- A rule marked **Approved** is the implementation target. **Observed** describes existing code without asserting that it has passed accessibility or visual QA. **Pending** is unfinished work, not permission to redesign the site.
- User-approved changes take precedence over older prototypes and this document. Update the document when those changes affect shared patterns.

### Baseline and branch differences

The inspected public baseline is the `renew` checkout at `f5d5f50`. It contains three themes: Light, Green and Gray. The Compare worktree, originally based on `8751ce2`, has newer comparison functionality but an older two-theme shell. Its missing Gray theme must not redefine the product standard.

The Compare layout rules below also record the user's approved follow-up: firm comparison first, challenge comparison below it, no view-switching tabs and no internally scrolling vertical table.

## 2. Visual direction

The current product uses large editorial headings, quiet research tables, thin dividers, recognizable firm logos and restrained blue actions. It supports a warm light theme, a green-tinted dark theme and a neutral gray dark theme.

The old “Deep Indigo Research” designation and the violet Candidate A prototype are historical. Do not use them as instructions to recolor the public site.

**Approved principles**

- Make the first reading simple; keep detailed rules and evidence accessible nearby.
- Use typography, alignment and spacing before adding another filled card.
- Keep body text neutral. Use accents for actions and short, meaningful data highlights.
- Preserve the same hierarchy and interaction behavior in all three themes.
- Explain uncertainty through language and sources; polished design must not imply verification.
- Points and promotions support the user's decision; they do not dominate the research.
- Do not add generic crypto illustrations, decorative trading charts, neon borders or motion that distracts from rules.

## 3. Implementation map

Paths below are relative to the repository root.

| Surface | Current reference |
| --- | --- |
| Public shell, theme persistence, navigation | `src/components/product/PublicShell.tsx` |
| Public theme variables, home, directory and original Compare styles | `src/app/product-lab/page.module.css` |
| Font setup, global focus and legacy global tokens | `src/app/globals.css`, `src/app/layout.tsx` |
| Firm identity, rating/actions sidebar and decision strip | `src/components/product/ProprEditorialHero.tsx` and `.module.css` |
| Editorial content and payout snapshot | `src/components/product/ProprEditorialContent.tsx` and `.module.css` |
| Shared modular content | `src/components/product/FirmEditorialContent.tsx` and `.module.css` |
| Directory | `src/components/product/FirmDirectory.tsx` |
| Profile comparison actions | `src/components/product/ProfileCompareControl.tsx` |
| External ratings | `src/components/product/TrustpilotRatingSection.tsx`, `src/components/product/SorsaScoreBadge.tsx` |
| Informational page layouts | `src/components/layout/PublicPage.module.css` |
| Comparison work in progress | `src/components/product/CompareExperience.tsx` and, in the Compare worktree, `CompareExperience.module.css` |

Despite its folder name, `product-lab/page.module.css` currently supplies production public styling. Do not treat it as an optional prototype. `PublicPage.module.css` is used by informational surfaces such as methodology, rewards, transparency and coupons; it is not the sole layout system for the entire product.

Existing `src/components/ui` primitives are useful only where their appearance matches the public surface. The component inventory is not evidence of universal adoption.

## 4. Themes and tokens

### Theme contract

| UI label | Stored value | CSS scope | Role |
| --- | --- | --- | --- |
| Light | `light` | `.lab` | Warm paper, dark green text |
| Green | `dark` | `.lab.dark` | Green-tinted dark surfaces |
| Gray | `gray` | `.lab.gray` | Neutral charcoal surfaces |

`PublicShell` stores the selection under `prophub-theme`, sets its wrapper `data-theme`, and mirrors it to `document.documentElement.dataset.siteTheme`. In the current main checkout, an absent saved preference resolves from `prefers-color-scheme` to Green or Light. Gray is an explicit user choice. The server/initial React state starts at `dark`; hydration behavior is not a guarantee of a flash-free theme transition.

### Current public palette — observed values

| Role / token | Light | Green | Gray |
| --- | --- | --- | --- |
| Page background (currently literal CSS) | `#F3F1EB` | `#0C0F0D` | `#1D1D1D` |
| `--ink` | `#172019` | `#F0F4EE` | `#F0F0F0` |
| `--muted` | `#667067` | `#A3ADA5` | `#A0A0A0` |
| `--line` | `#D9DCD3` | `#303A34` | `#333333` |
| `--soft-line` | `#E7E8E1` | `#252E29` | `#2B2B2B` |
| `--paper` | `#FBFAF6` | `#111814` | `#222222` |
| `--paper-strong` | `#FFFFFF` | `#151D18` | `#252525` |
| `--wash` | `#EDF0E8` | `#1B251F` | `#2B2B2B` |
| `--blue` | `#2657EE` | `#7DA2FF` | `#7DA2FF` |
| `--blue-dark` (hover role) | `#193FC5` | `#9AB6FF` | `#9AB6FF` |
| `--ink-panel` | `#172019` | `#090F0C` | `#151515` |

The name `--blue-dark` is historical: its dark-theme value is lighter, so use it by its existing hover role rather than assuming a darker color.

### Editorial data accents

| Token | Light | Green / Gray | Role |
| --- | --- | --- | --- |
| `--accent-research` | `#2657EE` | `#7DA2FF` | Research context and navigation |
| `--accent-value` | `#748D00` | `#D8F36A` | Selected numerical facts such as profit split |
| `--accent-condition` | `#A65F00` | `#F2C96D` | Prices and conditions |
| `--accent-settlement` | `#117A57` | `#74E6B2` | Payout and execution facts |
| `--accent-reward` | `#6555C7` | `#B7A7FF` | Points and incentives |

Use these accents for thin rules, small labels and selected values, not full-color panels. Green and lime data accents do not mean “verified”, “safe” or “best”. Status needs explicit wording.

### Legacy global tokens and migration

`globals.css` still contains the older `--color-canvas`, `--color-surface`, `--color-accent` and related family. Some shared layouts and controls still use them. They do not describe the complete three-theme palette.

**Approved:** new public styling should use the applicable public theme roles above and inherit them from the shell. Do not introduce a third token family or hardcoded dark fallback that breaks Light or Gray. Do not remove global variables until their consumers have been audited.

The actual global error token is `--color-negative`; the old document's `--color-danger` was not its implemented name. Consolidating both token families and theme-aware focus/CTA colors is **pending**. Existing hardcoded values are migration debt, not preferred examples.

## 5. Typography

Space Grotesk, loaded through `next/font`, is the current display, body and interface family. The monospace role uses the existing `--font-geist-mono` system stack, not a separately loaded Geist Mono font.

**Observed scale and approved usage**

- Homepage display uses `clamp(4rem, 7vw, 7rem)` at desktop sizes. Large, tightly tracked text is part of the current identity.
- Firm names use a large display treatment with a smaller explicit long-name variant. Do not apply the largest setting to every section title.
- Compare has its own existing editorial intro scale; reuse it rather than importing a generic dashboard heading.
- Regular section titles are substantially smaller: the shared `profileSectionTitle` is currently 25 px.
- Body paragraphs are generally 14–17 px depending on the surface. Dense table values and controls can be smaller.
- Short eyebrows, review dates, model labels and table labels intentionally use compact uppercase monospace. Long explanations, paragraphs and buttons do not.
- Prices and comparable metrics should use tabular numerals where alignment matters.

Some existing labels are 9–11 px and tightly spaced. This records the implementation, not a readability recommendation for essential conditions. Essential instructions, restrictions and interactive text must remain readable at mobile sizes and increased text size. Do not shrink copy to preserve an inflexible layout.

Preserve the headline's character while testing long names and mobile wrapping. Its extreme desktop line-height is not a reusable body-text token.

## 6. Layout, borders and hierarchy

- Current public content commonly uses a 1240 px maximum width with 24 px desktop side gutters; the header can extend to 1380 px. These differ from the legacy global `80rem` token.
- Mobile gutters are normally around 16–20 px; use the existing surface's breakpoint rules.
- Use a roughly 4 px spacing rhythm, but preserve established component proportions rather than forcing every historical value onto new spacing tokens.
- Controls normally have 8–9 px radii; grouped tables approximately 14 px; the profile hero approximately 18 px. Firm logo containers have their own larger radii.
- Use 1 px borders and quiet row separators. Avoid cards inside cards when a divider is enough.
- Keep heights content-driven. Detailed research tables must not acquire fixed-height vertical scroll panels.
- Menus and overlays may have constrained scroll regions when necessary; that exception does not apply to the Compare tables.
- A restrained translucent header or hero ambient field already exists. It is not permission to spread glass or glow across ordinary content.

## 7. Components and page patterns

### Buttons and navigation

- Blue is the primary action/selection accent; secondary actions use a quiet surface and border; tertiary actions can be text links.
- Use the existing action treatment of the relevant surface. Homepage, profile CTA and compact table controls need not have identical dimensions.
- Buttons use clear verbs: `Compare`, `View brief`, `Visit …`, `See sources`.
- Profile actions form a coherent sidebar group with ratings; do not attach a second mini-widget to the logo to introduce another score.
- Provide disabled, hover and visible keyboard-focus states. A comparison limit must explain what to do, not silently discard a selected firm.
- Primary CTA foreground colors currently vary by component. Contrast across all themes remains a QA requirement; do not copy an unverified color pairing mechanically.

### Homepage

Keep the large editorial statement, supporting explanation, one primary and one secondary action, and a limited research preview. Avoid presenting the entire directory or unsupported aggregate statistics in the hero.

### Directory and firm selection

Preserve the established rows/cards, logo scale, aligned decision metrics, filtering and comparison selection. Reuse the original picker cards with logos and model labels; do not replace them with unrelated chip grids during functional work.

Firm logos retain their own branding inside a neutral container. Do not recolor the whole row from a sampled logo color. Keep hover changes restrained and selected states clear. Supply a fallback for unavailable images.

### Firm profile

The shared editorial hero combines identity and explanation, a ratings/actions sidebar and a compact decision strip. Its body uses section navigation and readable blocks rather than an uninterrupted review essay.

- Build navigation from the actual profile sections, not one universal list for every business model.
- Preserve narrative, facts, program records, tables, notices and source disclosures as distinct reading patterns.
- Keep important restrictions near the decision they affect.
- Avoid repeated ND cards in the primary narrative; describe meaningful gaps where they matter.
- Trustpilot, Sorsa and payout evidence have separate meanings and remain distinct. Show provider, scale/context and review date when available. Do not combine them into our own quality score.

### Payouts and reserves

The current Hypernova pattern in `ProprEditorialContent` is the reference for this block:

- Compact section heading, update date and a quiet dashboard link.
- One grouped surface with an emphasized lifetime payout value and smaller supporting metrics, separated by borders.
- Restrained type scale relative to the profile hero. Do not turn each statistic into another oversized headline.
- Source attribution below the grid and a disclosure for methodology.
- Explain company-reported figures, reserve coverage and time periods. A dated snapshot must not be styled or labelled as a real-time feed.
- A reserve amount is not an independent audit; transaction settlement time is not automatically payout-request processing time.

### Compare — approved layout

1. Editorial introduction and access to firm selection.
2. General firm comparison.
3. **Below it**, `Compare challenges`, with program/size selectors and presets.
4. Challenge-specific comparison and relevant sources/notes.
5. Firm picker using the established card styling.

There are **no separate overview/accounts tabs**. Both comparison sections stay on the same page. Tables show their full content height; users scroll the page vertically. On narrow screens, horizontal overflow is allowed to preserve readable columns. Never add `max-height` or an independent vertical scrollbar to a comparison table.

Preserve the original Compare language: restrained panel border, firm logos and names, compact uppercase row labels, thin separators and selective numerical emphasis. A functionality change is not a reason to create a different visual system.

Retain the user's firm/program choices. Do not fill empty columns with arbitrary competitors or replace the oldest firm when the limit is reached. General firm ranges must remain visibly different from the conditions of one selected challenge. Never infer a winner from incomplete information.

The duplicate-firm program scenario, semantic differences-only view and fully structured program-specific payout rules are **pending** in the Compare worktree. These are functionality gaps, not alternative layout standards.

## 8. Research language and progressive disclosure

- Distinguish reported claims, independently verified observations, review dates and source conflicts.
- Missing data must not become zero, “no limit” or “not applicable”. A known absence of a rule is different from an undocumented rule.
- Do not show ND as a public badge. Use a short readable explanation appropriate to the context.
- In Compare, a meaningful unknown remains visible so it is not mistaken for equality or an advantage.
- Keep offer-specific dates separate from a newer general profile date.
- Separate active points programs, announced tokens and confirmed/unconfirmed airdrops.
- Use direct English for the current public interface. No unsupported superlatives, fake urgency or promises of profits.
- Inline explanations and disclosures should preserve the user's reading/comparison context. Essential risk must not exist only in a tooltip.

## 9. Responsive behavior, accessibility and motion

**Approved requirements, not a claim that every current component already passes:**

- Verify Light, Green and Gray at desktop and approximately 390 px mobile width.
- Test long firm names, missing values, large prices, selected states and keyboard interaction.
- Keep semantic tables, row/column headings, labelled form controls and accessible names on icon buttons.
- Ensure readable contrast and visible focus in every theme; aim for WCAG 2.2 AA.
- Prefer touch targets around 44 px where practical. Compact existing close buttons are not an exemption from usability review.
- Do not disable pinch zoom. Text enlargement must not hide conditions or actions.
- Sticky navigation must not cover content. Preserve useful context without creating nested vertical scrolling.
- Status and differences must not rely only on color.
- Motion should explain interaction: roughly 150 ms feedback, 250 ms normal transitions, up to 400 ms for deliberate disclosure where needed.
- Existing global easing is `cubic-bezier(0.16, 1, 0.3, 1)` for smooth exits. A global bounce token is not a recommendation to animate financial values with spring effects.
- Respect `prefers-reduced-motion`; avoid scroll hijacking, decorative endless motion and delayed access to data.

## 10. Design-system lab and remaining consolidation

`/design-system` already exists and has `noindex` metadata. Its Candidate A palette, other direction demos and experimental routes are historical explorations, not the approved public theme catalog. `noindex` is not authentication or private access control.

**Pending consolidation**

- Replace or clearly label historical examples; add a current component catalog showing all three public themes.
- Map the legacy global token family to public theme roles without breaking informational or admin pages.
- Audit hardcoded colors, small text, CTA/focus contrast and compact touch targets. Do not “standardize” an accessibility problem merely because it exists in code.
- Ensure Gray support reaches older worktrees before those changes are merged or presented as matching the current site.
- Gradually consolidate repeated controls where both purpose and appearance match; avoid a site-wide redesign disguised as cleanup.

## 11. Change checklist

Before changing a public component:

1. Identify the current shared component/CSS and the theme variables it inherits.
2. Preserve its established visual hierarchy unless the user requested a redesign.
3. Implement the behavior with missing-data, empty and disabled states.
4. Check the affected layout in all three themes, desktop/mobile and keyboard use.
5. Run checks appropriate to the code change; documentation-only updates do not require rebuilding the app.
6. Record an intentional new pattern here and update a current catalog example when one exists.

Do not overwrite newer components with prototype styles. Do not use this document to force all pages into identical cards, heading sizes or layouts. Consistency means shared visual roles and predictable behavior while preserving each surface's purpose.
