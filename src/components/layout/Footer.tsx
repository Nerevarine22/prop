import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#121212] pt-12 pb-8 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-zinc-100" />
              <span className="text-lg font-extrabold text-white">
                Prop<span className="text-zinc-400">Hub</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The modern directory and evaluation platform for crypto proprietary trading firms. Discover, compare, and get funded with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/firms" className="hover:text-white transition-colors">Firm Directory</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">Side-by-Side Comparison</Link></li>
              <li><Link href="/coupons" className="hover:text-white transition-colors">Verified Promo Codes</Link></li>
              <li><Link href="/transparency" className="hover:text-white transition-colors">Transparency Dashboard</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 mb-4">Categories</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/firms?step=1-Step" className="hover:text-white transition-colors">1-Step Evaluation</Link></li>
              <li><Link href="/firms?step=Instant+Funding" className="hover:text-white transition-colors">Instant Funded Accounts</Link></li>
              <li><Link href="/firms?platform=cTrader" className="hover:text-white transition-colors">cTrader Prop Firms</Link></li>
              <li><Link href="/firms?platform=Bybit" className="hover:text-white transition-colors">Bybit Backed Firms</Link></li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 mb-4">Transparency & Trust</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Data is updated daily from verified firm rulebooks and community feedback.
            </p>
            <Link href="/transparency" className="flex items-center gap-1 text-xs text-white font-medium hover:underline">
              <span>View Live Transparency Feed</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="border-t border-zinc-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} PropHub. All rights reserved. Not financial advice.</p>
          <div className="flex gap-6">
            <span className="hover:text-zinc-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-zinc-300 cursor-pointer">Risk Disclosure</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
