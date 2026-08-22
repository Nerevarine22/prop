'use client';

import { useEffect, useState } from 'react';

interface FirmLogoProps {
  src?: string;
  name: string;
  imageClassName?: string;
  fallbackClassName?: string;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Only reveals a logo after it has loaded successfully in the browser.
 * This prevents a broken-image icon when a remote research asset is rate-limited.
 */
export function FirmLogo({ src, name, imageClassName, fallbackClassName }: FirmLogoProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!src) return () => { active = false; };

    const image = new window.Image();
    image.onload = () => {
      if (active) setLoadedSrc(src);
    };
    image.onerror = () => {
      if (active) setLoadedSrc(null);
    };
    image.src = src;

    return () => {
      active = false;
    };
  }, [src]);

  if (!src || loadedSrc !== src) {
    return (
      <span className={fallbackClassName} aria-hidden="true">
        {initials(name)}
      </span>
    );
  }

  return (
    // Remote research assets can change independently of the application.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={loadedSrc}
      alt={`${name} logo`}
      className={imageClassName}
      onError={() => setLoadedSrc(null)}
    />
  );
}
