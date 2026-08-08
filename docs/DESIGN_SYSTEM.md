# PropHub design system

## 1. Authority and scope

This document is the single source of truth for PropHub's visual language, interface behavior and component rules.

- `SITE_BLUEPRINT.md` owns product positioning, information architecture, data trust, content policy, SEO and GEO.
- `DESIGN_SYSTEM.md` owns visual foundations, interaction patterns, components, responsive behavior and accessibility.
- Production components and tokens must follow this document. One-off page styles are not a second design system.
- The logo is intentionally out of scope for the current phase. Use a simple `PropHub` wordmark until a real identity project begins.

This is the implementation target, not a claim that every current component already complies. Existing hardcoded styles should be migrated incrementally through shared tokens and primitives.

## 2. Design direction

The design direction is **Accessible Crypto Research**.

PropHub should feel clear and engaging on first contact, then rigorous when a trader asks for more detail. It is neither a promotional crypto landing page nor a dense institutional terminal.

### Product character

- Crypto-native, without crypto theatre
- Credible, without feeling corporate or intimidating
- Data-aware, without making every page a dashboard
- Friendly to newer traders, without hiding important risk
- Useful to experienced traders, without forcing expert detail into the first screen

### Design controls

- Approachability: 7/10
- Analytical depth: 8/10
- Visual crypto intensity: 4/10
- Financial seriousness: 6/10
- Density: 5/10 on discovery pages, up to 8/10 in comparison and evidence views
- Motion intensity: 3/10
- Design variance: 5/10

## 3. Core UX principle: progressive disclosure

Every important research surface should provide two layers.

### Layer 1: quick decision

Show the information needed for orientation:

- who the firm may suit;
- challenge price;
- profit split;
- drawdown;
- evaluation type;
- platform support;
- reward potential;
- primary advantages;
- material risks;
- data status and last review date.

This layer must be understandable without knowing every prop-trading term.

### Layer 2: research depth

Make detailed information easy to reach, but do not place all of it above the fold:

- full rule set and exceptions;
- payout conditions;
- restricted strategies;
- source-level status;
- source links and access dates;
- change history;
- on-chain evidence;
- methodology notes.

Use clear actions such as `View full rules`, `See evidence` and `How this works`. Do not hide material risk behind vague labels or decorative interactions.

## 4. Visual principles

1. **Clarity before density.** Start with a readable summary, then offer detail.
2. **Evidence before decoration.** Visual emphasis should explain status, difference or risk.
3. **Warm precision.** Use a calm dark foundation, generous spacing and direct language.
4. **One dominant accent.** Supporting colors communicate semantics, not brand competition.
5. **Hierarchy without card inflation.** Use spacing, type and dividers before adding another container.
6. **Crypto cues in moderation.** Network, reward and on-chain concepts can have character without glow-heavy aesthetics.
7. **Trust is explicit.** Show status, source and review date rather than implying certainty through polished visuals.

## 5. Color system

All interface colors must come from semantic tokens. Components must not introduce arbitrary hex values.

### Neutral foundation

| Token | Initial value | Use |
| --- | --- | --- |
| `--color-canvas` | `#0B0C0D` | Page background |
| `--color-surface` | `#121416` | Standard grouped surface |
| `--color-surface-raised` | `#181B1D` | Menus, prominent panels, elevated controls |
| `--color-surface-soft` | `#202427` | Hover and selected neutral states |
| `--color-border` | `#2A2D30` | Standard borders and dividers |
| `--color-border-strong` | `#3A3F42` | Focused grouping and high-emphasis dividers |
| `--color-text` | `#F2F4F3` | Primary text |
| `--color-text-secondary` | `#C5CBC8` | Secondary copy and labels |
| `--color-text-muted` | `#9CA3A1` | Metadata and supporting text |
| `--color-text-disabled` | `#666D6A` | Disabled text only |

The foundation should feel graphite rather than pure black. Large areas of `#000000` and `#FFFFFF` should be avoided.

### Brand and interaction

| Token | Initial value | Use |
| --- | --- | --- |
| `--color-accent` | `#67B892` | Primary action, active state, selected data |
| `--color-accent-hover` | `#78C8A2` | Primary hover |
| `--color-accent-soft` | `rgba(103, 184, 146, 0.12)` | Subtle selected background |
| `--color-accent-contrast` | `#08110D` | Text on solid accent |

The accent is a restrained mint-green, not neon green. Glow is not a default interaction style.

### Semantic colors

| Token | Initial value | Meaning |
| --- | --- | --- |
| `--color-info` | `#74A8D4` | Reported information and neutral guidance |
| `--color-positive` | `#67B892` | Verified state or successful action |
| `--color-warning` | `#D9A95B` | Demo data, caution and pending review |
| `--color-danger` | `#D87575` | Material risk, failure and destructive action |

Color must never be the only status signal. Pair it with a label and, when useful, an icon or explanation.

### Contrast

- Body text and interactive controls must meet WCAG AA contrast.
- Muted text cannot carry essential instructions or risk information.
- Every token change requires contrast checks on canvas, surface and raised surface.

## 6. Typography

### Typeface roles

- Use Space Grotesk through `next/font` for display, body and interface text in the current phase.
- Use a system monospace stack only for wallet addresses, transaction hashes, code, compact identifiers and aligned technical values.
- Do not use monospace as a general crypto styling device.
- Do not add another typeface without documenting its role and loading cost.

### Type scale

| Role | Desktop guidance | Mobile guidance |
| --- | --- | --- |
| Display | 56–72 px, 0.95–1.02 line height | 38–46 px, 1.02–1.08 line height |
| H1 | 44–56 px | 34–40 px |
| H2 | 32–40 px | 28–34 px |
| H3 | 24–28 px | 22–26 px |
| Lead | 18–20 px | 17–19 px |
| Body | 15–17 px | 15–17 px |
| UI label | 13–14 px | 13–14 px |
| Metadata | 12–13 px | 12–13 px |

Rules:

- Use sentence case for headings and controls.
- Reserve uppercase for short status labels and table column labels.
- Keep long text between 55 and 75 characters per line.
- Use `font-variant-numeric: tabular-nums` for prices, percentages, dates and comparable metrics.
- Avoid very light font weights on dark backgrounds.

## 7. Spacing and layout

Use a 4 px base scale:

- `--space-1`: 4 px
- `--space-2`: 8 px
- `--space-3`: 12 px
- `--space-4`: 16 px
- `--space-5`: 20 px
- `--space-6`: 24 px
- `--space-8`: 32 px
- `--space-10`: 40 px
- `--space-12`: 48 px
- `--space-16`: 64 px
- `--space-20`: 80 px
- `--space-24`: 96 px

### Page layout

- Maximum wide content: `80rem`.
- Reading content should normally stay between `42rem` and `52rem`.
- Desktop gutters: 24–40 px depending on viewport.
- Mobile gutters: 16 px, increasing to 20 px when space permits.
- Default section spacing: 72–96 px desktop and 48–64 px mobile.
- Dense data sections can use smaller vertical rhythm but must retain clear group boundaries.

### Density by surface

- Homepage: low to medium density, strong narrative and a limited research preview.
- Directory: medium density with readable filters and scannable cards.
- Firm profile: medium density first, high density in expanded rules and evidence.
- Comparison: high density with sticky context and horizontal overflow support.
- Admin: high efficiency, but never at the cost of validation and error clarity.

## 8. Shape, borders and elevation

### Radius

- Controls: `--radius-control: 8px`.
- Panels: `--radius-panel: 14px`.
- Large narrative surfaces: up to 20 px when the composition needs a softer entry point.
- Pills are reserved for compact statuses, tags and segmented controls.

### Borders

- Use 1 px semantic borders for structure.
- Increase border contrast for selected or focused states.
- Avoid stacking multiple borders inside nested cards.

### Elevation

- Most hierarchy should come from surface tone, border and spacing.
- Shadows should be soft, neutral and rare.
- Menus, dialogs and sticky overlays may use elevation.
- Colored glow, glassmorphism and blurred neon panels are not default PropHub patterns.

## 9. Iconography and imagery

- Use Lucide icons for the interface.
- Default icon size is 16–20 px; prominent feature icons may use 24 px.
- Icons support labels and should not replace unfamiliar text.
- Keep stroke weight visually consistent.
- Firm and network logos are data assets, not interface icons.
- Use owned or licensed logo assets where possible.
- Decorative imagery should explain a concept or create pacing. Do not add generic coins, rockets, holographic charts or anonymous trader renders.

## 10. Motion

Motion exists to explain state change and hierarchy.

### Tokens

- Quick feedback: 150 ms.
- Standard transition: 250 ms.
- Deliberate reveal: 400 ms maximum.
- Default easing: `cubic-bezier(0.22, 1, 0.36, 1)`.

### Allowed uses

- Hover and press feedback.
- Menu, tooltip and disclosure entry/exit.
- Filter result transitions.
- Loading progress and skeleton replacement.
- Small number transitions when the change matters.

### Avoid

- Infinite decorative shimmer on primary copy.
- Large parallax backgrounds.
- Scroll hijacking.
- Bouncy financial metrics.
- Motion that delays access to rules or evidence.

All motion must respect `prefers-reduced-motion`.

## 11. Data and trust semantics

### Research status

| Status | Label | Semantic color | Required explanation |
| --- | --- | --- | --- |
| `mock` | Demo data | Warning | Sample content, not independently verified |
| `reported` | Reported | Info | Published by the firm or another named source |
| `verified` | Verified | Positive | Verification method and date are available |
| `stale` | Review due | Neutral or warning | Last review date and reason for expiry |

### Risk language

- Use `Important rule` for a condition likely to affect challenge success.
- Use `Material risk` when the user may lose access, money or eligibility.
- Use `Unknown` when evidence is missing. Do not silently convert missing data to zero, no or unsupported.
- Use `Not applicable` only when the field genuinely does not apply.

### Reward language

Points, token and airdrop states must be separate:

- Points active
- Token announced
- Token live
- Airdrop reported
- Airdrop confirmed
- Eligibility unknown

Do not use `Confirmed` without a primary source and review date.

## 12. Core components

### Foundation primitives

- `Button`: primary, secondary, quiet and destructive variants; small, medium and large sizes.
- `IconButton`: always requires an accessible name and tooltip when meaning is not universal.
- `TextLink`: visually identifiable in and out of context.
- `Input`, `Select`, `Checkbox`: label, help, error and disabled states.
- `Badge`: status or taxonomy only, not a substitute for every label.
- `Tooltip`: short supporting explanation, never essential hidden content.
- `Alert`: info, success, warning and danger with an actionable message.
- `Surface`: standard, raised and interactive variants.
- `Divider`: separates related groups without creating another card.
- `Skeleton`: mirrors the final content shape.
- `EmptyState`: explains why the state is empty and what the user can do.

### PropHub data components

- `DataStatusBadge`
- `LastReviewed`
- `Metric`
- `RuleRow`
- `EvidenceRow`
- `SourceLink`
- `RiskNotice`
- `RewardStatus`
- `FirmCard`
- `ComparisonCell`
- `FilterBar`

Every component must document:

- purpose;
- variants;
- content limits;
- interaction states;
- keyboard behavior;
- responsive behavior;
- loading, empty and error states when applicable.

## 13. Pattern rules

### Homepage

- Lead with the user decision, not the database.
- Keep the hero readable on a small laptop without scrolling.
- Show a small research preview rather than the entire directory.
- Use one primary and one secondary call to action.
- Avoid unsupported aggregate numbers.

### Directory

- Make search the primary control.
- Keep common filters visible and advanced filters collapsible.
- Show active filters and provide a clear reset.
- Firm cards should prioritize decision-relevant differences, not equal-weight metadata.

### Firm profile

- Begin with an `At a glance` decision summary.
- Surface material restrictions near the top.
- Separate firm claims, PropHub analysis and independently checked evidence.
- Place full rules, sources and history in deeper sections.

### Comparison

- Preserve row labels while scrolling.
- Highlight differences, not every value.
- Explain practical trade-offs in plain language.
- Never create a winner from incomplete or mock data.

## 14. Responsive behavior

- Design mobile layouts explicitly at 390 px width.
- Do not treat desktop cards as automatically stackable mobile components.
- Tables may scroll horizontally when preserving comparison is more useful than collapsing it.
- Sticky controls must not cover content or browser UI.
- Touch targets should be at least 44 by 44 px where practical.
- Do not disable pinch zoom.
- Test long firm names, large numbers and translated copy.

## 15. Accessibility

- Meet WCAG 2.2 AA as the product baseline.
- All interactive elements need visible focus states.
- Keyboard order must match the visual and reading order.
- Icon-only controls need accessible names.
- Form errors must identify the field and explain the correction.
- Status cannot rely on color alone.
- Respect reduced motion and increased text size.
- Use semantic HTML before ARIA.
- Use headings in a logical hierarchy with one descriptive H1 per page.

## 16. Content inside components

- Use direct, plain English for the public interface.
- Prefer `Understand the rules before you buy` to abstract institutional language.
- Keep trading terms when they are useful, then explain them through inline definitions or tooltips.
- Buttons describe actions: `Compare firms`, `View full rules`, `See sources`.
- Avoid `Learn more` when a specific label is available.
- Do not use hype, fake urgency or unsupported superlatives.

## 17. Internal design-system page

Create a private, `noindex` route at `/design-system` when implementation begins. It should render:

- color tokens and contrast pairs;
- typography scale;
- spacing and radius scales;
- buttons and form controls;
- data and reward statuses;
- metrics and evidence rows;
- firm cards;
- comparison cells;
- loading, empty and error states;
- desktop and mobile examples.

This page is a living component catalog. Storybook can be introduced later if isolated testing, visual regression or component ownership requires it.

## 18. Anti-patterns

Do not introduce:

- neon gradients as a default brand language;
- glowing borders around ordinary cards;
- glass panels nested inside glass panels;
- terminal styling across the entire product;
- unexplained scores;
- tiny muted copy for important conditions;
- badges for every data point;
- excessive card nesting;
- multiple competing accent colors;
- animation that competes with research content;
- hardcoded colors and radii inside product components.

## 19. Governance

### Adding a token

A new token is justified only when an existing semantic role cannot represent the need. Name it by purpose, document it here and test it across relevant surfaces.

### Adding a component

Create a shared component when the same semantic pattern appears at least twice or when consistency is important for trust, accessibility or data interpretation.

### Changing the system

1. Update this document.
2. Update tokens or shared primitives.
3. Update the `/design-system` example.
4. Migrate affected product surfaces.
5. Test desktop, 390 px mobile, keyboard and reduced motion.

Page-level exceptions must be documented. Repeated exceptions indicate that the system needs a new rule.

## 20. Component definition of done

A component is ready when:

- it uses semantic tokens;
- its purpose and variants are clear;
- all interaction states are implemented;
- keyboard and screen-reader behavior are correct;
- responsive behavior is intentional;
- long and missing data are handled;
- mock, reported and verified states remain honest;
- it passes lint, browser testing and visual review;
- it is represented on `/design-system` when that route exists.
