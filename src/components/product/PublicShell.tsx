'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu, Moon, Search, Sun, X } from 'lucide-react';
import styles from '@/app/product-lab/page.module.css';

type SiteTheme = 'light' | 'dark';

const navigation = [
  { href: '/prop-firms', label: 'Firms' },
  { href: '/compare', label: 'Compare' },
  { href: '/rewards', label: 'Rewards' },
  { href: '/methodology', label: 'Methodology' },
];

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNav, setMobileNav] = useState(false);
  const [theme, setTheme] = useState<SiteTheme>('light');
  const themeReady = useRef(false);

  const isInternalRoute = pathname.startsWith('/admin') || pathname.startsWith('/design-system') || pathname.startsWith('/product-lab');

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedTheme = window.localStorage.getItem('prophub-theme');
      const resolvedTheme = savedTheme === 'light' || savedTheme === 'dark'
        ? savedTheme
        : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      themeReady.current = true;
      setTheme(resolvedTheme);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!themeReady.current) return;
    window.localStorage.setItem('prophub-theme', theme);
    document.documentElement.dataset.siteTheme = theme;
  }, [theme]);

  if (isInternalRoute) return <main id="main-content">{children}</main>;

  return (
    <div className={`${styles.lab} ${theme === 'dark' ? styles.dark : ''}`} data-theme={theme} suppressHydrationWarning>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} href="/" aria-label="PropHub home">
            <span className={styles.brandMark}>P</span>
            <span>PropHub</span>
            <i>Research</i>
          </Link>

          <nav className={`${styles.nav} ${mobileNav ? styles.navOpen : ''}`} aria-label="Primary navigation">
            {navigation.map((item) => {
              const active = item.href === '/prop-firms' ? pathname.startsWith('/prop-firms') : pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={active ? styles.navActive : ''} onClick={() => setMobileNav(false)}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className={styles.headerActions}>
            <button
              className={styles.themeToggle}
              type="button"
              onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              aria-pressed={theme === 'dark'}
            >
              {theme === 'light' ? <Moon /> : <Sun />}
              <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
            <Link className={styles.headerSearch} href="/prop-firms"><Search /> Search</Link>
            <button className={styles.mobileMenu} type="button" onClick={() => setMobileNav((open) => !open)} aria-label="Toggle menu" aria-expanded={mobileNav}>
              {mobileNav ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" className={styles.publicMain}>{children}</main>

      <footer className={styles.labFooter}>
        <div><span className={styles.brandMark}>P</span><strong>PropHub</strong></div>
        <p>Independent research for on-chain prop traders. Not financial advice.</p>
        <Link href="/methodology">Research standards <ArrowUpRight /></Link>
      </footer>
    </div>
  );
}
