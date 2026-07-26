'use client';

import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number; // Raw numeric target
  prefix?: string; // e.g. "$"
  suffix?: string; // e.g. "%" or " mins"
  decimals?: number;
  duration?: number; // ms
  className?: string;
}

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1200,
  className = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Deceleration easing cubic-bezier(0.22, 1, 0.36, 1) approximation
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = easeProgress * value;

      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(displayValue);

  return (
    <span className={`inline-block transition-transform duration-300 ${className}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
