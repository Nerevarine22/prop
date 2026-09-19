'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Attaches Lenis smooth-scroll to the window once, on the client.
 * - lerp 0.1  → comfortable inertia (lower = more glide, higher = snappier)
 * - Automatically destroyed on unmount / route changes.
 * - Respects `prefers-reduced-motion`: when the OS setting is on, Lenis
 *   is not initialised, so the user gets native instant scroll.
 */
export function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      lerp: 0.18,          // inertia — 0 = instant, 1 = never arrives
      smoothWheel: true,
      syncTouch: false,    // keep native momentum on touch / trackpad
    });

    // Tick loop — drive Lenis from rAF
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
