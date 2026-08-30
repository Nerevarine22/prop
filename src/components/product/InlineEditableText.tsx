'use client';

import { createElement, type KeyboardEvent } from 'react';

type InlineEditableTextProps = {
  as: 'span' | 'h2' | 'h3' | 'p' | 'strong' | 'small';
  value: string;
  enabled?: boolean;
  multiline?: boolean;
  className?: string;
  onCommit?: (value: string) => void;
};

export function InlineEditableText({ as, value, enabled = false, multiline = false, className, onCommit }: InlineEditableTextProps) {
  if (!enabled || !onCommit) return createElement(as, { className }, value);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.currentTarget.textContent = value;
      event.currentTarget.blur();
      return;
    }
    if (!multiline && event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
    }
  };

  return createElement(as, {
    className,
    contentEditable: true,
    suppressContentEditableWarning: true,
    spellCheck: true,
    'data-cms-inline': 'true',
    onBlur: (event: { currentTarget: HTMLElement }) => {
      const next = event.currentTarget.innerText.trim();
      if (!next) {
        event.currentTarget.textContent = value;
        return;
      }
      if (next !== value) onCommit(next);
    },
    onKeyDown: handleKeyDown,
  }, value);
}
