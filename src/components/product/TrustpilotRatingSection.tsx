import type { CSSProperties } from 'react';
import { ArrowUpRight, Star } from 'lucide-react';
import type { FirmExternalRating } from '@/types/database';
import { shortDate } from '@/lib/data/publicFirmProfiles';
import styles from './TrustpilotRatingSection.module.css';

function sampleLabel(rating: FirmExternalRating): string {
  if (rating.reviewCount <= 5) return 'Very small sample';
  if (rating.reviewCount < 50) return 'Small sample';
  if (rating.reviewCount < 200) return 'Developing sample';
  return 'Broader sample';
}

function reviewCountText(rating: FirmExternalRating): string {
  return `${rating.reviewCountApproximate ? '≈' : ''}${rating.reviewCountLabel} reviews`;
}

export function TrustpilotRatingSection({ rating, firmName }: { rating: FirmExternalRating; firmName: string }) {
  const distribution = rating.distribution ?? [];

  return (
    <section className={styles.section} id="reviews" aria-labelledby="trustpilot-rating-title">
      <div className={styles.heading}>
        <span>Trader reviews · external source</span>
        <h2 id="trustpilot-rating-title">Reputation, with the sample size visible.</h2>
        <p>Trustpilot reflects reviewer sentiment. It does not verify trading rules, reserves, execution quality or payout eligibility.</p>
      </div>

      <div className={styles.ratingPanel}>
        <div className={styles.scoreCard}>
          <div className={styles.scoreLine}>
            <strong>{rating.score.toFixed(1)}</strong>
            <span>/ {rating.scale}</span>
          </div>
          <p>{rating.label}</p>
          <div className={styles.stars} aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => {
              const fill = Math.max(0, Math.min(1, rating.score - index)) * 100;
              return <span style={{ '--star-fill': `${fill}%` } as CSSProperties} key={index}><Star /></span>;
            })}
          </div>
          <div className={styles.sample}>
            <strong>{reviewCountText(rating)}</strong>
            <span>{sampleLabel(rating)}</span>
          </div>
        </div>

        <div className={styles.distribution} aria-label={`Trustpilot star distribution for ${firmName}`}>
          {distribution.map((bucket) => (
            <div className={styles.barRow} key={bucket.stars}>
              <span>{bucket.stars}-star</span>
              <div className={styles.track}>
                <i
                  data-stars={bucket.stars}
                  style={{ '--rating-share': `${Math.max(0, Math.min(100, bucket.sharePercent))}%` } as CSSProperties}
                />
              </div>
            </div>
          ))}
          <div className={styles.sourceRow}>
            <div>
              <span>Snapshot checked</span>
              <strong>{shortDate(rating.checkedAt)}</strong>
            </div>
            <a href={rating.url} target="_blank" rel="noreferrer">View on Trustpilot <ArrowUpRight /></a>
          </div>
        </div>
      </div>

      {rating.distributionBasis === 'visual-estimate' && (
        <p className={styles.methodNote}>Score and review count are transcribed from the supplied Trustpilot snapshot. Bar proportions are an approximate visual reading and are intentionally shown without percentage labels.</p>
      )}
    </section>
  );
}
