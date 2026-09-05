'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ProfileRouteScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith('/prop-firms/') || window.location.hash) return;

    const reset = () => window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    reset();
    const frame = window.requestAnimationFrame(reset);
    const afterRouteRestore = window.setTimeout(reset, 250);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(afterRouteRestore);
    };
  }, [pathname]);

  return null;
}
