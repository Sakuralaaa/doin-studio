import React from 'react';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import type { PipelineStepStatus } from '../../types';

export interface StepRailItem {
  key: string;
  label: string;
  status: PipelineStepStatus;
}

export interface PipelineRailProps {
  steps?: {
    transcribe?: { status?: string };
    clean?: { status?: string };
    generate_video_prompts?: { status?: string };
    generate_video?: { status?: string };
  };
  className?: string;
  showLabels?: boolean;
}

const STEP_DEFS: { key: string; label: string }[] = [
  { key: 'transcribe', label: '转录' },
  { key: 'clean', label: '文稿' },
  { key: 'generate_video_prompts', label: '分镜' },
  { key: 'generate_video', label: '成片' },
];

export function PipelineRail({ steps, className = '', showLabels = false }: PipelineRailProps) {
  return (
    <div className={['flex items-center gap-1.5 w-full', className].join(' ')}>
      {STEP_DEFS.map((def, idx) => {
        const stepStatus = (steps as any)?.[def.key]?.status || 'pending';
        const isDone = stepStatus === 'succeeded';
        const isRunning = stepStatus === 'running';
        const isFailed = stepStatus === 'failed';

        return (
          <div key={def.key} className="flex-1 flex flex-col gap-1">
            <div className="relative h-1.5 w-full rounded-full bg-studio-well overflow-hidden border border-studio-border-subtle">
              <div
                className={[
                  'h-full w-full transition-all duration-300 rounded-full',
                  isDone
                    ? 'bg-studio-success shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                    : isRunning
                    ? 'bg-studio-info animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                    : isFailed
                    ? 'bg-studio-danger shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                    : 'bg-transparent',
                ].join(' ')}
              />
            </div>
            {showLabels && (
              <div className="flex items-center justify-between text-xs">
                <span
                  className={
                    isDone
                      ? 'text-studio-success'
                      : isRunning
                      ? 'text-studio-info font-medium'
                      : isFailed
                      ? 'text-studio-danger'
                      : 'text-studio-ink-muted'
                  }
                >
                  {def.label}
                </span>
                {isDone && <Check size={11} className="text-studio-success" />}
                {isRunning && <Loader2 size={11} className="text-studio-info animate-spin" />}
                {isFailed && <AlertCircle size={11} className="text-studio-danger" />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
