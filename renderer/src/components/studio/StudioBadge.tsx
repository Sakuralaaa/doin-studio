import React from 'react';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent';

export interface StudioBadgeProps {
  tone?: BadgeTone;
  children: React.ReactNode;
  pulsing?: boolean;
  className?: string;
}

const TONE_MAP: Record<BadgeTone, string> = {
  neutral: 'bg-studio-surface text-studio-ink-secondary border-studio-border',
  success: 'bg-studio-success-subtle text-studio-success border-studio-success-border',
  warning: 'bg-studio-warning-subtle text-studio-warning border-studio-warning-border',
  danger: 'bg-studio-danger-subtle text-studio-danger border-studio-danger-border',
  info: 'bg-studio-info-subtle text-studio-info border-studio-info-border',
  accent: 'bg-studio-accent-subtle text-studio-accent border-studio-accent-border',
};

const DOT_MAP: Record<BadgeTone, string> = {
  neutral: 'bg-studio-ink-muted',
  success: 'bg-studio-success',
  warning: 'bg-studio-warning',
  danger: 'bg-studio-danger',
  info: 'bg-studio-info',
  accent: 'bg-studio-accent',
};

export function StudioBadge({ tone = 'neutral', children, pulsing = false, className = '' }: StudioBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono tabular-nums rounded-md border',
        TONE_MAP[tone],
        className,
      ].join(' ')}
    >
      <span className="relative flex h-1.5 w-1.5">
        {pulsing && (
          <span className={['absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', DOT_MAP[tone]].join(' ')} />
        )}
        <span className={['relative inline-flex h-1.5 w-1.5 rounded-full', DOT_MAP[tone]].join(' ')} />
      </span>
      <span>{children}</span>
    </span>
  );
}
