import React, { useState } from 'react';
import { Play, Trash2, ArrowRight, Video } from 'lucide-react';
import type { JobOverview } from '../../types';
import { PipelineRail } from '../../components/studio/PipelineRail';
import { StudioBadge } from '../../components/studio/StudioBadge';

export interface MediaCardProps {
  job: JobOverview;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  deleting?: boolean;
}

export function MediaCard({ job, onOpen, onDelete, deleting = false }: MediaCardProps) {
  const isDone = job.status === 'done';
  const isRunning = job.status === 'processing';
  const isFailed = job.status === 'failed';
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={`打开作品：${job.preview.displayTitle}`}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen(job.id); }
      }}
      onClick={() => onOpen(job.id)}
      className="group relative flex flex-col rounded-2xl bg-studio-panel border border-studio-border hover:border-studio-border-strong studio-card-hover overflow-hidden cursor-pointer select-none"
    >
      {/* 封面区 (16:9 或 9:16 视窗预览) */}
      <div className="relative aspect-[16/10] w-full bg-studio-well overflow-hidden">
        {job.preview?.coverUrl && !imageFailed ? (
          <img
            src={job.preview.coverUrl}
            alt={job.preview.displayTitle}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-studio-surface to-studio-well text-studio-ink-muted">
            <Video size={28} strokeWidth={1.5} />
          </div>
        )}

        {/* 顶部微标栏 */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <StudioBadge
            tone={isDone ? 'success' : isRunning ? 'info' : isFailed ? 'danger' : 'neutral'}
            pulsing={isRunning}
          >
            {isDone ? '已就绪' : isRunning ? '运行中' : isFailed ? '异常' : '待处理'}
          </StudioBadge>
          <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white/90 border border-white/10">
            {job.preview?.sourcePlatform || 'DOUYIN'}
          </span>
        </div>

        {/* 悬停微光播放图层 */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-studio-accent/90 text-white shadow-lg shadow-studio-accent/30 scale-90 group-hover:scale-100 transition-transform">
            <Play size={18} fill="currentColor" className="ml-0.5" />
          </div>
        </div>
      </div>

      {/* 内容卡片下半部 */}
      <div className="flex flex-1 flex-col p-4 justify-between gap-3">
        <div className="space-y-1.5 min-w-0">
          <h3 className="font-semibold text-sm text-studio-ink tracking-tight line-clamp-1 group-hover:text-studio-accent transition-colors">
            {job.preview?.displayTitle || job.topic || '未命名作品'}
          </h3>
          <p className="text-xs text-studio-ink-secondary line-clamp-1">{job.preview.subtitle}</p>
          {job.preview?.summary && (
            <p className="text-xs text-studio-ink-secondary line-clamp-2 leading-relaxed">
              {job.preview.summary}
            </p>
          )}
        </div>

        {/* 流程进度轨 */}
        <div className="pt-2 border-t border-studio-border-subtle">
          <PipelineRail steps={job.steps} showLabels />
        </div>

        {/* 底部动作条 */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-studio-ink-secondary flex items-center gap-1 font-medium group-hover:text-studio-ink transition-colors">
            {job.preview?.nextActionLabel || '查看详情'}
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </span>

          {!job.deletedAt && <button
            type="button"
            disabled={deleting}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(job.id);
            }}
            title="删除归档"
            aria-label="删除作品"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-studio-ink-muted hover:text-studio-danger hover:bg-studio-danger-subtle transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
          </button>}
        </div>
      </div>
    </div>
  );
}
