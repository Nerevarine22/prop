---
name: web-animations
description: Micro-interactions, custom cubic-bezier easings, sliding tab indicators, odometer number reels, and fluid UI transitions inspired by transitions.dev.
---
# Web Animations & Motion Design Tokens Skill

Standardized motion tokens, easing functions, and micro-interaction patterns for high-performance web applications based on `transitions.dev`.

## Motion Tokens & Durations

```css
:root {
  /* Easings */
  --ease-smooth-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.36, 0.64, 1);
  --ease-bounce-strong: cubic-bezier(0.34, 3.85, 0.64, 1);

  /* Durations */
  --duration-micro: 80ms;
  --duration-quick: 150ms;
  --duration-fast: 250ms;
  --duration-medium: 350ms;
  --duration-slow: 400ms;
  --duration-very-slow: 500ms;
}
```

## Key Micro-Interactions

1. **P16 Sliding Active Tab Indicator**:
   - Smoothly translate the active pill background under tabs using CSS `transition: transform 250ms cubic-bezier(0.22, 1, 0.36, 1)`.

2. **P26 Number Pop-in / Animated Odometer**:
   - Increment numeric values smoothly over duration with a deceleration easing.

3. **P10 Success Check & Path Draw**:
   - Composite SVG `stroke-dasharray` drawing with keyframe scale pop.

4. **P11 Avatar & Button Hover Spring**:
   - Apply `--ease-bounce-strong` on hover release for physical spring feedback.
