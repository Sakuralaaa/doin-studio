import React, { useState } from 'react';
import { Film, Video, RotateCcw, Download } from 'lucide-react';

export function StudioMonitor({ rawUrl, finalUrl, downloadUrl }: { rawUrl: string | null; finalUrl: string | null; downloadUrl: string | null }) {
  const [choice, setChoice] = useState<'raw' | 'final' | null>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const side = choice ?? (finalUrl ? 'final' : 'raw');
  const url = side === 'final' ? finalUrl : rawUrl;
  return <section aria-label="视频监视器" className="overflow-hidden rounded-2xl border border-studio-border bg-studio-panel">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-studio-border p-3">
      <p className="flex items-center gap-2 text-sm font-medium"><Film size={16} className="text-studio-accent" />视听监视器</p>
      <div className="flex gap-1 rounded-xl bg-studio-well p-1" aria-label="监视器视频来源">
        {(['raw', 'final'] as const).map(value => <button key={value} type="button" aria-pressed={side === value} onClick={() => setChoice(value)} className={`min-h-11 rounded-lg px-3 text-xs ${side === value ? 'bg-studio-surface text-studio-ink' : 'text-studio-ink-secondary'}`}>{value === 'raw' ? '原始视频' : '渲染成片'}</button>)}
      </div>
    </div>
    <div className="flex h-[440px] items-center justify-center bg-black sm:h-[520px]">
      {url && failedUrl !== url ? <video key={`${url}-${attempt}`} src={url} controls playsInline preload="metadata" className="h-full w-full object-contain" onError={() => setFailedUrl(url)} />
        : <div className="space-y-3 p-6 text-center text-on-media"><Video size={32} className="mx-auto opacity-60" /><p className="text-sm">{url ? '视频加载失败' : side === 'raw' ? '原视频尚未下载' : '成片尚未生成'}</p><p className="text-xs opacity-70">{url ? '检查文件和服务后重试。' : side === 'raw' ? '执行视频转录后即可预览。' : '完成分镜后执行生成视频。'}</p>{url && <button type="button" onClick={() => { setFailedUrl(null); setAttempt(value => value + 1); }} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/40 px-4 text-sm"><RotateCcw size={15} />重新加载</button>}</div>}
    </div>
    <footer className="flex items-center justify-between gap-3 border-t border-studio-border p-3 text-xs text-studio-ink-secondary"><span>完整画面预览</span>{side === 'final' && downloadUrl && <a href={downloadUrl} download className="inline-flex min-h-11 items-center gap-2 text-studio-accent"><Download size={14} />下载成片</a>}</footer>
  </section>;
}
