import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { StudioShell } from './StudioShell';
import { MediaCard } from '../../features/jobs/MediaCard';
import type { JobOverview } from '../../types';

test('studio shell exposes every preserved workflow and mobile navigation', () => {
  const html = renderToStaticMarkup(<MemoryRouter><StudioShell><h1>页面内容</h1></StudioShell></MemoryRouter>);
  assert.match(html, /Doin Studio/);
  assert.match(html, /手机主导航/);
  assert.match(html, /跳到内容/);
  for (const route of ['/hotspots', '/galleries', '/articles', '/publishing', '/assets', '/collections', '/skills', '/settings', '/trash']) assert.ok(html.includes(`href="${route}"`), route);
  assert.doesNotMatch(html, /已就绪|管理员切换|STUDIO PRO/);
});

test('new visual card remains keyboard accessible and distinguishes failure', () => {
  const job = { id: 'test-second-job', status: 'failed', steps: {}, preview: { displayTitle: '第二件商品', subtitle: '实际来源', sourcePlatform: '抖音', nextActionLabel: '重试转录' } } as JobOverview;
  const html = renderToStaticMarkup(<MediaCard job={job} onOpen={() => {}} onDelete={() => {}} />);
  assert.match(html, /role="link"/);
  assert.match(html, /tabindex="0"/);
  assert.match(html, /打开作品：第二件商品/);
  assert.match(html, /实际来源/);
  assert.match(html, /重试转录/);
  assert.match(html, /异常/);
  assert.match(html, /aria-label="删除作品"/);
});
