'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Menu, X, Scale, Coins, BookOpen, Building2 } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#222a35] bg-[#0a0c10]/92 backdrop-blur-xl font-satoshi">
      <div className="mx-auto flex h-[58px] w-[min(1320px,calc(100%_-_32px))] items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-[#4f8cff]" />
            <span className="text-base font-extrabold tracking-tight text-white">
              Prop<span className="text-[#a9c7ff]">Hub</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
            <Link
              href="/prop-firms"
              className={`flex items-center gap-1.5 transition-colors hover:text-white ${
                pathname.startsWith('/prop-firms') ? 'text-white font-semibold' : ''
              }`}
            >
              <Building2 className="h-3.5 w-3.5 text-zinc-400" />
              <span>Prop Firms</span>
            </Link>

            <Link
              href="/compare"
              className={`flex items-center gap-1.5 transition-colors hover:text-white ${
                pathname === '/compare' ? 'text-white font-semibold' : ''
              }`}
            >
              <Scale className="h-3.5 w-3.5 text-zinc-400" />
              <span>Compare</span>
            </Link>

            <Link
              href="/rewards"
              className={`flex items-center gap-1.5 transition-colors hover:text-white ${
                pathname === '/rewards' ? 'text-white font-semibold' : ''
              }`}
            >
              <Coins className="h-3.5 w-3.5 text-zinc-400" />
              <span>Rewards</span>
            </Link>

            <Link
              href="/methodology"
              className={`flex items-center gap-1.5 transition-colors hover:text-white ${
                pathname === '/methodology' ? 'text-white font-semibold' : ''
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
              <span>Methodology</span>
            </Link>
          </nav>
        </div>

        {/* Compare Firms Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/prop-firms"
            className="flex items-center gap-1.5 rounded-lg border border-[#4f8cff] bg-[#4f8cff] px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-[#70a5ff] hover:bg-[#70a5ff]"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Browse Firms</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[#303038] p-2.5 text-zinc-300 transition-colors hover:bg-[#202025] hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="space-y-2.5 border-b border-[#252529] bg-[#09090b]/98 px-4 py-5 text-sm font-medium text-zinc-300 backdrop-blur-xl md:hidden">
          <Link
            href="/prop-firms"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-colors min-h-[44px] ${
              pathname.startsWith('/prop-firms')
                ? 'bg-zinc-800/90 border-zinc-700 text-white font-bold'
                : 'border-zinc-900 hover:bg-zinc-900 text-zinc-300'
            }`}
          >
            <Building2 className="h-4 w-4 text-[#7aa8ff]" />
            <span>Prop Firms</span>
          </Link>

          <Link
            href="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-colors min-h-[44px] ${
              pathname === '/compare'
                ? 'bg-zinc-800/90 border-zinc-700 text-white font-bold'
                : 'border-zinc-900 hover:bg-zinc-900 text-zinc-300'
            }`}
          >
            <Scale className="h-4 w-4 text-[#7aa8ff]" />
            <span>Compare</span>
          </Link>

          <Link
            href="/rewards"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-colors min-h-[44px] ${
              pathname === '/rewards'
                ? 'bg-zinc-800/90 border-zinc-700 text-white font-bold'
                : 'border-zinc-900 hover:bg-zinc-900 text-zinc-300'
            }`}
          >
            <Coins className="h-4 w-4 text-[#aaa8ff]" />
            <span>Rewards</span>
          </Link>

          <Link
            href="/methodology"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-colors min-h-[44px] ${
              pathname === '/methodology'
                ? 'bg-zinc-800/90 border-zinc-700 text-white font-bold'
                : 'border-zinc-900 hover:bg-zinc-900 text-zinc-300'
            }`}
          >
            <BookOpen className="h-4 w-4 text-[#7aa8ff]" />
            <span>Methodology</span>
          </Link>


        </div>
      )}
    </header>
  );
}
