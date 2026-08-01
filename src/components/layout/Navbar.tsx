'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Menu, X, Sparkles, Scale, Percent, Activity } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#121212]/90 backdrop-blur-md font-satoshi">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-zinc-100" />
            <span className="text-base font-extrabold tracking-tight text-white">
              Prop<span className="text-zinc-400">Hub</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
            <Link
              href="/compare"
              className={`flex items-center gap-1.5 transition-colors hover:text-white ${
                pathname === '/compare' || pathname === '/firms' ? 'text-white font-semibold' : ''
              }`}
            >
              <Scale className="h-3.5 w-3.5 text-zinc-400" />
              <span>Compare & Directory</span>
            </Link>

            <Link
              href="/coupons"
              className={`flex items-center gap-1.5 transition-colors hover:text-white ${
                pathname === '/coupons' ? 'text-white font-semibold' : ''
              }`}
            >
              <Percent className="h-3.5 w-3.5 text-zinc-400" />
              <span>Verified Deals</span>
            </Link>

            <Link
              href="/transparency"
              className={`flex items-center gap-1.5 transition-colors hover:text-white ${
                pathname === '/transparency' ? 'text-white font-semibold' : ''
              }`}
            >
              <Activity className="h-3.5 w-3.5 text-zinc-400" />
              <span>Transparency Engine</span>
            </Link>
          </nav>
        </div>

        {/* Compare Firms Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/compare"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-100 text-zinc-950 hover:bg-white transition-colors"
          >
            <Scale className="h-3.5 w-3.5 text-zinc-950" />
            <span>Compare Firms</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center border border-zinc-800/60"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-[#121212]/95 backdrop-blur-xl px-4 py-5 space-y-2.5 text-sm font-medium text-zinc-300 animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            href="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-colors min-h-[44px] ${
              pathname === '/compare' || pathname === '/firms'
                ? 'bg-zinc-800/90 border-zinc-700 text-white font-bold'
                : 'border-zinc-900 hover:bg-zinc-900 text-zinc-300'
            }`}
          >
            <Scale className="h-4 w-4 text-[#52b788]" />
            <span>Compare & Directory</span>
          </Link>

          <Link
            href="/coupons"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-colors min-h-[44px] ${
              pathname === '/coupons'
                ? 'bg-zinc-800/90 border-zinc-700 text-white font-bold'
                : 'border-zinc-900 hover:bg-zinc-900 text-zinc-300'
            }`}
          >
            <Percent className="h-4 w-4 text-emerald-400" />
            <span>Verified Deals</span>
          </Link>

          <Link
            href="/transparency"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-colors min-h-[44px] ${
              pathname === '/transparency'
                ? 'bg-zinc-800/90 border-zinc-700 text-white font-bold'
                : 'border-zinc-900 hover:bg-zinc-900 text-zinc-300'
            }`}
          >
            <Activity className="h-4 w-4 text-sky-400" />
            <span>Transparency Engine</span>
          </Link>

          <Link
            href="/coupons"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 mt-2 px-4 py-3 rounded-xl bg-zinc-100 text-zinc-950 font-bold min-h-[44px] hover:bg-white transition-colors"
          >
            <Percent className="h-4 w-4 text-zinc-950" />
            <span>Get Verified Deals</span>
          </Link>
        </div>
      )}
    </header>
  );
}
