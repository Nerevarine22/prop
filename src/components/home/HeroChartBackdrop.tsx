import styles from './HeroChartBackdrop.module.css';

interface HeroChartBackdropProps {
  tone?: 'violet' | 'sage';
}

export function HeroChartBackdrop({ tone = 'violet' }: HeroChartBackdropProps) {
  const palette = tone === 'sage'
    ? { primary: '#4f8cff', middle: '#a9c7ff', secondary: '#58677d', nodeFill: '#12161d', nodeStroke: '#70a5ff' }
    : { primary: '#615fff', middle: '#a3b3ff', secondary: '#7279ba', nodeFill: '#161a29', nodeStroke: '#8f98ff' };
  const strokeId = `hero-chart-stroke-${tone}`;
  const fillId = `hero-chart-fill-${tone}`;

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <svg viewBox="0 0 1440 720" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={palette.primary} stopOpacity="0" />
            <stop offset="0.18" stopColor={palette.primary} stopOpacity="0.34" />
            <stop offset="0.52" stopColor={palette.middle} stopOpacity="0.52" />
            <stop offset="0.84" stopColor={palette.primary} stopOpacity="0.28" />
            <stop offset="1" stopColor={palette.primary} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={palette.primary} stopOpacity="0.08" />
            <stop offset="0.72" stopColor={palette.primary} stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          className={styles.chartArea}
          style={{ fill: `url(#${fillId})` }}
          d="M-30 586 L70 552 L148 574 L228 492 L306 524 L382 430 L456 466 L536 365 L612 396 L696 302 L774 334 L854 250 L936 286 L1018 200 L1094 226 L1180 146 L1260 170 L1342 92 L1470 42 L1470 720 L-30 720 Z"
        />
        <path
          className={styles.secondaryLine}
          style={{ stroke: palette.secondary }}
          d="M-30 628 C130 608 176 560 274 578 S444 492 542 514 S698 414 802 432 S962 334 1066 350 S1232 246 1470 188"
        />
        <path
          className={styles.primaryLine}
          style={{ stroke: `url(#${strokeId})` }}
          d="M-30 586 L70 552 L148 574 L228 492 L306 524 L382 430 L456 466 L536 365 L612 396 L696 302 L774 334 L854 250 L936 286 L1018 200 L1094 226 L1180 146 L1260 170 L1342 92 L1470 42"
        />

        <g className={styles.nodes}>
          <circle cx="228" cy="492" r="4" style={{ fill: palette.nodeFill, stroke: palette.nodeStroke }} />
          <circle cx="536" cy="365" r="4" style={{ fill: palette.nodeFill, stroke: palette.nodeStroke }} />
          <circle cx="854" cy="250" r="4" style={{ fill: palette.nodeFill, stroke: palette.nodeStroke }} />
          <circle cx="1180" cy="146" r="4" style={{ fill: palette.nodeFill, stroke: palette.nodeStroke }} />
        </g>
      </svg>
    </div>
  );
}
