import React, { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Radio, PanelLeftClose, PanelLeftOpen, MoreHorizontal } from 'lucide-react';
import { MAIN_NAV_ITEMS, ASSET_NAV_ITEMS, BOTTOM_NAV_ITEMS, getPageContext, isItemActive, type NavItemDef } from './navigation';
import { ThemeSwitcher } from '../shell/ThemeSwitcher';
import { Modal } from '../ui/Modal';
import { useOperatorStore } from '../../store/operator';

const allItems = [...MAIN_NAV_ITEMS, ...ASSET_NAV_ITEMS, ...BOTTOM_NAV_ITEMS];
const mobileItems = [MAIN_NAV_ITEMS[0], MAIN_NAV_ITEMS[2], MAIN_NAV_ITEMS[5]];

function initialExpanded() {
  try { return window.localStorage.getItem('doin-studio.rail-expanded') !== '0'; }
  catch { return true; }
}

export function StudioShell({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const context = getPageContext(location.pathname);
  const operator = useOperatorStore(state => state.currentUser);
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const toggleRail = () => {
    setExpanded(value => {
      try { window.localStorage.setItem('doin-studio.rail-expanded', value ? '0' : '1'); } catch { /* 本次仍生效 */ }
      return !value;
    });
  };
  const navLink = (item: NavItemDef, compact = false) => {
    const active = isItemActive(location.pathname, item);
    const Icon = item.icon;
    return <NavLink key={item.to} to={item.to} end={item.to === '/'} title={item.label}
      aria-current={active ? 'page' : undefined}
      className={`relative flex min-h-11 items-center rounded-xl border transition-colors ${compact ? 'justify-center px-2' : 'gap-3 px-3'} ${active ? 'border-studio-border-strong bg-studio-surface text-studio-ink' : 'border-transparent text-studio-ink-secondary hover:bg-studio-surface hover:text-studio-ink'}`}>
      {active && <span className="absolute bottom-3 left-0 top-3 w-0.5 rounded-full bg-studio-accent" />}
      <Icon size={18} className={active ? 'shrink-0 text-studio-accent' : 'shrink-0'} aria-hidden="true" />
      <span className={compact ? 'sr-only' : 'truncate text-sm'}>{item.label}</span>
    </NavLink>;
  };
  const group = (items: NavItemDef[], label: string) => <div className="space-y-1">
    {expanded && <p className="px-3 pb-1 text-xs text-studio-ink-secondary">{label}</p>}
    {items.map(item => navLink(item, !expanded))}
  </div>;

  return <div className="studio-shell min-h-screen bg-studio-canvas text-studio-ink" style={{ '--studio-rail': expanded ? '220px' : '64px' } as CSSProperties}>
    <a href="#studio-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-panel focus:p-3">跳到内容</a>
    <aside aria-label="主导航" className="studio-rail fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-studio-border bg-studio-panel md:flex">
      <Link to="/" className={`flex h-16 shrink-0 items-center border-b border-studio-border ${expanded ? 'gap-3 px-4' : 'justify-center'}`} aria-label="Doin Studio 首页">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-studio-border-strong bg-studio-surface"><Radio size={18} className="text-studio-accent" /></span>
        {expanded && <div><p className="text-sm font-semibold tracking-tight">Doin Studio</p><p className="mt-0.5 text-xs text-studio-ink-secondary">本地创作工作台</p></div>}
      </Link>
      <nav className="flex-1 space-y-5 overflow-y-auto px-2 py-5">{group(MAIN_NAV_ITEMS, '创作')}{group(ASSET_NAV_ITEMS, '资源')}</nav>
      <div className="space-y-1 border-t border-studio-border p-2">
        {BOTTOM_NAV_ITEMS.map(item => navLink(item, !expanded))}
        <button type="button" onClick={toggleRail} aria-label={expanded ? '收起侧栏' : '展开侧栏'} aria-expanded={expanded}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-studio-ink-secondary hover:bg-studio-surface">
          {expanded ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}{expanded && <span className="text-xs">收起侧栏</span>}
        </button>
      </div>
    </aside>
    <header className="studio-header fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-studio-border bg-studio-panel/95 px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Radio className="shrink-0 text-studio-accent md:hidden" size={18} />
        <span className="hidden text-xs text-studio-ink-secondary xl:inline">{context.category}</span>
        <p className="truncate text-sm font-semibold">{context.title}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3"><ThemeSwitcher /><span className="hidden text-xs text-studio-ink-secondary lg:inline">{operator?.displayName || '本机用户'}</span></div>
    </header>
    <main id="studio-content" className="studio-content min-w-0 pb-24 pt-16 md:pb-6">{children}</main>
    <nav aria-label="手机主导航" className="safe-bottom fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-studio-border bg-studio-panel md:hidden">
      {mobileItems.map(item => <NavLink key={item.to} to={item.to} end={item.to === '/'} className={`flex min-h-16 flex-col items-center justify-center gap-1 text-xs ${isItemActive(location.pathname, item) ? 'text-studio-accent' : 'text-studio-ink-secondary'}`}><item.icon size={19} /><span>{item.label}</span></NavLink>)}
      <button type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)} className="flex min-h-16 flex-col items-center justify-center gap-1 text-xs text-studio-ink-secondary"><MoreHorizontal size={19} /><span>更多</span></button>
    </nav>
    <Modal open={menuOpen} onClose={() => setMenuOpen(false)} title="工作台导航" size="md"><nav aria-label="全部页面" className="grid grid-cols-1 gap-1 sm:grid-cols-2">{allItems.map(item => navLink(item))}</nav></Modal>
  </div>;
}
