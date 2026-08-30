'use client';

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import styles from './ProprEditorialContent.module.css';

const proprItems = [
  { id: 'decision', label: 'At a glance' },
  { id: 'programs', label: 'Programs' },
  { id: 'payouts', label: 'Payouts' },
  { id: 'trading', label: 'Trading' },
  { id: 'consider', label: 'Before you choose' },
  { id: 'sources', label: 'Sources' },
];

export interface EditorialNavItem {
  id: string;
  label: string;
}

export function ProprSectionNav({
  items = proprItems,
  firmName = 'Propr',
  promoCode = 'PROP20',
}: {
  items?: EditorialNavItem[];
  firmName?: string;
  promoCode?: string;
}) {
  const [activeId, setActiveId] = useState(items[0].id);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let frame = 0;

    function updateActiveSection() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const marker = 170;
        const reached = items
          .map((item) => document.getElementById(item.id))
          .filter((section): section is HTMLElement => Boolean(section))
          .filter((section) => section.getBoundingClientRect().top <= marker);

        setActiveId(reached.at(-1)?.id ?? items[0].id);
      });
    }

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [items]);

  async function copyPromoCode() {
    await navigator.clipboard.writeText(promoCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <nav className={styles.localNav} aria-label={`${firmName} profile sections`}>
      {items.map((item) => (
        <a
          className={activeId === item.id ? styles.localNavActive : undefined}
          href={`#${item.id}`}
          key={item.id}
          aria-current={activeId === item.id ? 'location' : undefined}
        >
          {item.label}
        </a>
      ))}
      {promoCode && <button className={styles.navPromo} type="button" onClick={() => void copyPromoCode()} aria-label={`Copy promo code ${promoCode}`}>
        <span>Promo</span>
        <strong>{copied ? 'Copied' : promoCode}</strong>
        {copied ? <Check /> : <Copy />}
      </button>}
    </nav>
  );
}
