'use client';

import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import styles from './SorsaScoreBadge.module.css';

type ScoreState = { score: number; checkedAt: string } | 'loading' | 'unavailable';

type SorsaTier = {
  level: number;
  label: 'Unknown' | 'Noted' | 'Credible' | 'Significant' | 'Supreme';
};

function formatScore(score: number): string {
  return new Intl.NumberFormat('en-US', score >= 1000
    ? { notation: 'compact', maximumFractionDigits: 1 }
    : { maximumFractionDigits: 0 }).format(score);
}

function tierForScore(score: number): SorsaTier {
  // Mirrors the five score bands currently shown on Sorsa's public profiles.
  if (score >= 2000) return { level: 5, label: 'Supreme' };
  if (score >= 1000) return { level: 4, label: 'Significant' };
  if (score >= 500) return { level: 3, label: 'Credible' };
  if (score >= 100) return { level: 2, label: 'Noted' };
  return { level: 1, label: 'Unknown' };
}

function formatCheckedAt(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'recently';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(parsed);
}

export function SorsaScoreBadge({ username }: { username: string }) {
  const [score, setScore] = useState<ScoreState>('loading');
  const cleanUsername = username.replace(/^@/, '');

  useEffect(() => {
    const controller = new AbortController();

    async function loadScore() {
      try {
        const response = await fetch(`/api/sorsa/score?username=${encodeURIComponent(cleanUsername)}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          setScore('unavailable');
          return;
        }
        const data = await response.json() as { score?: unknown; checkedAt?: unknown };
        setScore(typeof data.score === 'number' && Number.isFinite(data.score)
          ? { score: data.score, checkedAt: typeof data.checkedAt === 'string' ? data.checkedAt : new Date().toISOString() }
          : 'unavailable');
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setScore('unavailable');
      }
    }

    void loadScore();
    return () => controller.abort();
  }, [cleanUsername]);

  if (score === 'unavailable') return null;

  const result = typeof score === 'object' ? score : undefined;
  const tier = result ? tierForScore(result.score) : undefined;
  const detail = result && tier
    ? `Tier ${tier.level} · ${tier.label}. Score fetched ${formatCheckedAt(result.checkedAt)}. Sorsa account data typically refreshes about once per day.`
    : 'Loading Sorsa score.';

  return (
    <div
      className={styles.row}
      data-loading={score === 'loading'}
    >
      <span className={styles.label}>
        <a href={`https://app.sorsa.io/profile/${encodeURIComponent(cleanUsername)}`} target="_blank" rel="noreferrer">Sorsa</a>
        <span>· X influence</span>
        <span className={styles.info} title={detail} aria-label={detail}><Info aria-hidden="true" /></span>
      </span>
      <strong>{result ? formatScore(result.score) : '…'}</strong>
    </div>
  );
}
