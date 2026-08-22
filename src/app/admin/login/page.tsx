'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';
import { auth, isFirebaseConfigured } from '@/lib/firebase/config';
import { ADMIN_EMAIL, isAuthorizedAdmin } from '@/lib/firebase/adminAccess';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, type User } from 'firebase/auth';

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.98-.9 6.63-2.36l-3.24-2.54c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.39 13.93A6 6 0 0 1 6.08 12c0-.67.11-1.32.31-1.93V7.45H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.55l3.35-2.62Z" />
      <path fill="#EA4335" d="M12 5.94c1.47 0 2.79.5 3.82 1.5l2.88-2.87A9.65 9.65 0 0 0 12 2a10 10 0 0 0-8.96 5.45l3.35 2.62C7.18 7.7 9.39 5.94 12 5.94Z" />
    </svg>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const finishLogin = async (user: User) => {
    if (!isAuthorizedAdmin(user)) {
      await signOut(auth);
      throw new Error(`Access is restricted to ${ADMIN_EMAIL}.`);
    }
    router.replace('/admin');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isFirebaseConfigured) {
        throw new Error('Admin access is disabled until Firebase authentication is configured.');
      }

      const result = await signInWithEmailAndPassword(auth, email, password);
      await finishLogin(result.user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      if (!isFirebaseConfigured) {
        throw new Error('Admin access is disabled until Firebase authentication is configured.');
      }

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ login_hint: ADMIN_EMAIL, prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      await finishLogin(result.user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 font-satoshi py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-white mb-2 shadow-sm">
            <Lock className="h-5 w-5 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">PropHub Admin Console</h1>
          <p className="text-xs text-zinc-400 font-medium">Firebase-authenticated access to firm records and promo data</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl bg-[#141416] border border-zinc-800/80 p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
          
          {/* Top subtle glow */}
          <div className="absolute -top-12 -left-12 w-36 h-36 bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />

          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!isFirebaseConfigured && !error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Admin access is disabled. Configure Firebase environment variables before using this area.</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@prophub.xyz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isFirebaseConfigured}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
            <span className="h-px flex-1 bg-zinc-800" />
            <span>or</span>
            <span className="h-px flex-1 bg-zinc-800" />
          </div>

          <div className="space-y-2">
            <button
              type="button"
              disabled={loading || !isFirebaseConfigured}
              onClick={() => void handleGoogleLogin()}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-zinc-700 bg-white px-4 py-3 text-xs font-bold text-zinc-950 transition-colors hover:bg-zinc-100 disabled:opacity-50"
            >
              <GoogleMark />
              <span>Continue with Google</span>
            </button>
            <p className="text-center text-[10px] text-zinc-500">Authorized account: {ADMIN_EMAIL}</p>
          </div>

        </div>

      </div>
    </div>
  );
}
