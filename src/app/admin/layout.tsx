'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Percent, Activity, LogOut, ShieldCheck, ExternalLink } from 'lucide-react';
import { auth, isFirebaseConfigured } from '@/lib/firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(() => {
    if (pathname === '/admin/login') return true;
    return isFirebaseConfigured ? null : false;
  });

  useEffect(() => {
    if (pathname === '/admin/login') return;

    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          router.replace('/admin/login');
        }
      });
      return () => unsubscribe();
    }

    router.replace('/admin/login?reason=not-configured');
  }, [pathname, router]);

  const handleLogout = async () => {
    if (isFirebaseConfigured) {
      await signOut(auth);
    }
    router.replace('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#090909] flex items-center justify-center text-xs text-zinc-500 font-satoshi">
        Checking Admin Permissions...
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#090909] font-satoshi flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#141416] border-r border-zinc-800/80 p-5 flex flex-col justify-between shrink-0 space-y-6">
        <div className="space-y-6">
          
          {/* Logo & Admin Status */}
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="font-extrabold text-base text-white tracking-tight">PropHub</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">ADMIN</span>
            </Link>

            <Link href="/" target="_blank" className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white" title="View Public Site">
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                pathname === '/admin' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <LayoutDashboard className="h-4 w-4 text-emerald-400" />
              <span>Prop Firm Cards</span>
            </Link>

            <Link
              href="/coupons"
              target="_blank"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
            >
              <Percent className="h-4 w-4 text-amber-400" />
              <span>Verified Deals</span>
            </Link>

            <Link
              href="/transparency"
              target="_blank"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
            >
              <Activity className="h-4 w-4 text-sky-400" />
              <span>Transparency Engine</span>
            </Link>
          </nav>

        </div>

        {/* Footer Admin Logout */}
        <div className="pt-4 border-t border-zinc-800/80 space-y-3">
          <div className="flex items-center gap-2 text-xs text-zinc-400 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="truncate">Session Active</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-xs font-bold transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>

    </div>
  );
}
