import {
  Film,
  FileText,
  Flame,
  Layers,
  Send,
  Image as ImageIcon,
  FolderKanban,
  Cpu,
  Trash2,
  Settings as SettingsIcon,
  LucideIcon,
} from 'lucide-react';

export interface NavItemDef {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  matchPrefixes?: string[];
}

export const MAIN_NAV_ITEMS: NavItemDef[] = [
  { to: '/', label: '作品工作台', icon: Film, matchPrefixes: ['/jobs/'] },
  { to: '/articles', label: '深度文章', icon: FileText, matchPrefixes: ['/articles/'] },
  { to: '/hotspots', label: '全网热点', icon: Flame },
  { to: '/galleries', label: '字幕图集', icon: Layers, matchPrefixes: ['/galleries/'] },
  { to: '/publishing', label: '发布中心', icon: Send },
  { to: '/assets', label: '媒体素材', icon: ImageIcon },
];

export const ASSET_NAV_ITEMS: NavItemDef[] = [
  { to: '/collections', label: '创作者合集', icon: FolderKanban, matchPrefixes: ['/collections/'] },
  { to: '/skills', label: 'AI Skills', icon: Cpu },
];

export const BOTTOM_NAV_ITEMS: NavItemDef[] = [
  { to: '/trash', label: '回收站', icon: Trash2 },
  { to: '/settings', label: '设置与环境', icon: SettingsIcon },
];

export function isItemActive(pathname: string, item: NavItemDef): boolean {
  if (pathname === item.to) return true;
  if (item.matchPrefixes && item.matchPrefixes.some((p) => pathname.startsWith(p))) {
    return true;
  }
  return false;
}

export function getPageContext(pathname: string): { title: string; subtitle: string; category?: string } {
  if (pathname.startsWith('/jobs/')) return { category: '作品流水线', title: '视频创作工坊', subtitle: '原片转录 · AI 洗稿 · 分镜设计 · 本地渲染' };
  if (pathname.startsWith('/articles/benchmarks')) return { category: '深度文章', title: '爆款公众号对标库', subtitle: '行业对标与写作参考' };
  if (pathname.startsWith('/articles/')) return { category: '深度文章', title: '文章编辑创作', subtitle: '深度长文 · 头条与公众号多端排版' };
  if (pathname === '/articles') return { category: '深度文章', title: '文章创作工作台', subtitle: '选题资料 · AI 扩写 · 排版发布' };
  if (pathname === '/hotspots') return { category: '选题策划', title: '全网热点风向标', subtitle: '抖音 · 头条 · 百度 · 知乎 · B站实时热榜' };
  if (pathname.startsWith('/galleries/')) return { category: '字幕图集', title: '图集工作台', subtitle: '原片高光帧抓取与字幕重构' };
  if (pathname === '/galleries') return { category: '字幕图集', title: '图集创作中心', subtitle: '9:16 视频原生字幕拼接成 3:4 抖音图文' };
  if (pathname === '/publishing') return { category: '交付中心', title: '多平台发布工作台', subtitle: '抖音 · 小红书 · 今日头条 · 微信公众号统一调度' };
  if (pathname === '/assets') return { category: '资产管理', title: '素材媒体箱', subtitle: '本地视听库与在线热榜公开音源' };
  if (pathname.startsWith('/collections/')) return { category: '创作者资产', title: '创作者主页合集', subtitle: '历史作品采集与归档' };
  if (pathname === '/collections') return { category: '创作者资产', title: '合集内容库', subtitle: '创作者主页与历史合集' };
  if (pathname === '/skills') return { category: '知识资产', title: 'AI 技能资产库', subtitle: '提示词蒸馏与专属定制技能' };
  if (pathname === '/trash') return { category: '系统', title: '作品回收站', subtitle: '30 天内可恢复的归档项目' };
  if (pathname === '/settings') return { category: '配置与诊断', title: '系统设置与环境就绪度', subtitle: 'AI 密钥 · Playwright · FFmpeg · Whisper · Sau 引擎' };
  return { category: '创作中心', title: 'Doin Studio · 创作工作台', subtitle: '从短视频提炼灵感、整理文案、生成分镜与多端交付' };
}
