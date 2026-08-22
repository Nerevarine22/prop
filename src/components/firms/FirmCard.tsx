'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ExternalLink,
  GitCompareArrows,
  GitCommit,
  Monitor,
  Shield,
  Star,
} from 'lucide-react';
import type { PropFirm } from '@/types/firm';
import { DataStatusBadge } from '@/components/data/DataStatusBadge';
import { FirmLogo } from '@/components/firms/FirmLogo';
import styles from './FirmCard.module.css';

interface FirmCardProps {
  firm: PropFirm;
  onCompareToggle?: (firm: PropFirm) => void;
  isCompared?: boolean;
}

export function FirmCard({ firm, onCompareToggle, isCompared = false }: FirmCardProps) {
  const minPrice = firm.accountTiers[0]?.price ? `$${firm.accountTiers[0].price}` : '—';
  const profitSplit = firm.profitSplit.replace(/^Up to\s*/i, '');
  const maxFunding = `$${Math.round(firm.maxCapital / 1000)}K`;
  const externalUrl = firm.website ?? `https://${firm.slug}.com`;

  return (
    <article className={`${styles.card} ${isCompared ? styles.selected : ''}`}>
      <div className={styles.cardHeader}>
        <Link href={`/prop-firms/${firm.slug}`} className={styles.identity}>
          <span className={styles.logoFrame}>
            <FirmLogo src={firm.logo} name={firm.name} fallbackClassName={styles.logoFallback} />
          </span>
          <span className={styles.identityCopy}>
            <small>{firm.dataStatus === 'mock' ? 'Firm profile' : 'Research profile'}</small>
            <strong>{firm.name}</strong>
            <span className={styles.rating}><Star aria-hidden="true" /> {firm.rating.toFixed(1)} <i>·</i> {firm.reviewCount} reviews</span>
          </span>
        </Link>

        {onCompareToggle && (
          <button
            type="button"
            className={styles.compareButton}
            aria-label={isCompared ? `Remove ${firm.name} from comparison` : `Add ${firm.name} to comparison`}
            aria-pressed={isCompared}
            onClick={() => onCompareToggle(firm)}
          >
            <GitCompareArrows aria-hidden="true" />
            <span>{isCompared ? 'Added' : 'Compare'}</span>
          </button>
        )}
      </div>

      <div className={styles.tags}>
        {firm.dataStatus !== 'mock' && (
          <DataStatusBadge status={firm.dataStatus} className={styles.dataStatusTag} />
        )}
        {firm.rewardTags?.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className={`${styles.rewardTag} ${
              tag === 'Points'
                ? styles.pointsTag
                : tag === 'Airdrop'
                  ? styles.airdropTag
                  : tag === 'Token'
                    ? styles.tokenTag
                    : ''
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      <p className={styles.summary}>{firm.tagline}</p>

      <Link href={`/prop-firms/${firm.slug}`} className={styles.metrics}>
        <span><small>Challenge</small><strong>{minPrice}</strong><i>From</i></span>
        <span><small>Profit split</small><strong>{profitSplit}</strong><i>Up to</i></span>
        <span><small>Max funding</small><strong>{maxFunding}</strong><i>Available</i></span>
      </Link>

      <div className={styles.rules}>
        <span><Shield aria-hidden="true" /> {firm.maxDrawdown}</span>
        <span><GitCommit aria-hidden="true" /> {firm.evaluationSteps.join(' / ')}</span>
        <span><Monitor aria-hidden="true" /> {firm.platforms.slice(0, 2).join(', ')}</span>
      </div>

      <div className={styles.promo}>
        {firm.verifiedCoupon ? (
          <span><strong>{firm.dataStatus === 'mock' ? 'Promo' : firm.verifiedCoupon.discount}</strong><i>·</i> Code {firm.verifiedCoupon.code}</span>
        ) : (
          <span>No promotion recorded</span>
        )}
      </div>

      <footer className={styles.cardFooter}>
        <a href={externalUrl} target="_blank" rel="noopener noreferrer">
          Official site <ExternalLink aria-hidden="true" />
        </a>
        <Link href={`/prop-firms/${firm.slug}`}>
          View research <ArrowRight aria-hidden="true" />
        </Link>
      </footer>
    </article>
  );
}
