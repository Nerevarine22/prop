'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { Coupon } from '@/types/firm';
import styles from '@/app/product-lab/page.module.css';

export function PromoOffer({ coupon }: { coupon: Coupon }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={styles.compactPromo} title={coupon.description}>
      <span>{coupon.discount}</span>
      <button type="button" onClick={copyCode} aria-label={`Copy promo code ${coupon.code}`}>
        <strong>{coupon.code}</strong>{copied ? <Check /> : <Copy />}
      </button>
    </div>
  );
}
