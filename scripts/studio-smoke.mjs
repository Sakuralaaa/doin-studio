import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import express from 'express';
import { chromium } from 'playwright';
import { createExpressApp } from '../dist/app.js';
import { HOTSPOT_SOURCES } from '../dist/lib/hotspot-sources.js';

const root = path.resolve('.');
const storage = await mkdtemp(path.join(tmpdir(), 'doin-studio-browser-'));
const evidence = path.join(root, 'artifacts', 'screenshots');
await mkdir(evidence, { recursive: true });
const now = new Date().toISOString();
await mkdir(path.join(storage, 'cache', 'hotspots'), { recursive: true });
for (const source of HOTSPOT_SOURCES) {
  const items = Array.from({ length: 15 }, (_, index) => ({ sourceId: source.id, itemId: String(index + 1), title: index === 0 ? `${source.name} · 长标题与跨行业灵感测试：把实际商品特点写成清楚、可信的内容` : `${source.name} 测试选题 ${index + 1}`, url: source.home, rank: index + 1, heat: '隔离测试数据' }));
  await writeFile(path.join(storage, 'cache', 'hotspots', `${source.id}.json`), JSON.stringify({ items, fetchedAt: now, checkedAt: now }));
}
const app = await createExpressApp({ rootDir: root, storagePath: storage });
// The desktop build uses relative assets for file://. When hosting that same
// build over HTTP, anchor assets at the web root so deep-link refreshes work.
const webHTML = (await readFile(path.join(root, 'dist-renderer', 'index.html'), 'utf8'))
  .replace('<head>', '<head><base href="/">');
app.use(express.static(path.join(root, 'dist-renderer'), { index: false }));
app.get('*', (_req, res) => res.type('html').send(webHTML));
const server = await new Promise(resolve => { const handle = app.listen(5173, () => resolve(handle)); });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const base = 'http://localhost:5173';
const checks = [];
const sizes = [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'tablet', width: 1024, height: 768 }, { name: 'mobile', width: 390, height: 844 }, { name: 'narrow', width: 360, height: 800 }];
async function snapshot(name, route, size) {
  await page.setViewportSize(size);
  await page.goto(base + route);
  await page.locator('h1').first().waitFor();
  await page.waitForTimeout(350);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  assert.equal(overflow, false, `${name} overflows at ${size.width}px`);
  await page.screenshot({ path: path.join(evidence, `${size.name}-${name}.png`), fullPage: true });
}
async function createFromUI(title, videoID) {
  await page.goto(base);
  await page.getByRole('button', { name: '创建作品', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByPlaceholder('https://www.douyin.com/video/...').fill(`https://www.douyin.com/video/${videoID}`);
  await dialog.locator('input[placeholder^="例如："]').fill(title);
  await dialog.getByRole('button', { name: '创建任务', exact: true }).click();
  await page.waitForURL(/\/jobs\//);
  const id = new URL(page.url()).pathname.split('/').at(-1);
  const response = await fetch(`${base}/api/jobs/${id}`);
  assert.equal(response.status, 200);
  const { job } = await response.json();
  assert.equal(job.topic, title);
  assert.equal(job.workflowMode, 'manual');
  assert.equal(job.steps.transcribe.status, 'pending');
  return id;
}
try {
  assert.equal((await fetch(`${base}/health`)).status, 200);
  for (const size of sizes) await snapshot('empty-projects', '/', size);
  await page.setViewportSize(sizes[0]);
  const first = await createFromUI('第一件商品的展示灵感', '7420000000000000001');
  const second = await createFromUI('第二件商品：保留所选作品，刷新后仍然正确', '7420000000000000002');
  assert.notEqual(first, second);
  await page.reload();
  await page.getByRole('heading', { name: '第二件商品：保留所选作品，刷新后仍然正确', exact: true }).waitFor();
  checks.push('UI creates two real persisted manual jobs without an AI key; second detail survives refresh');
  await page.goto(base);
  await page.getByRole('button', { name: '卡片视图', exact: true }).click();
  await page.getByRole('link', { name: '打开作品：第二件商品：保留所选作品，刷新后仍然正确' }).click();
  assert.equal(new URL(page.url()).pathname, `/jobs/${second}`);
  checks.push('New visual cards navigate to the selected job');

  const session = await (await fetch(`${base}/api/local-sessions/auto`, { method: 'POST' })).json();
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3i8AAAAASUVORK5CYII=', 'base64');
  const form = new FormData(); form.append('files', new Blob([png], { type: 'image/png' }), '真实上传测试.png');
  const uploaded = await fetch(`${base}/api/assets/images`, { method: 'POST', headers: { 'X-Local-Session': session.session.token }, body: form });
  assert.ok(uploaded.ok, `Actual upload rejected: ${uploaded.status}`);
  await page.goto(`${base}/assets`);
  await page.getByText('真实上传测试.png', { exact: true }).first().waitFor();
  await page.reload();
  await page.getByText('真实上传测试.png', { exact: true }).first().waitFor();
  checks.push('Real multipart image upload remains in the asset library after refresh');

  await page.goto(`${base}/hotspots`);
  const related = page.getByRole('link', { name: '在抖音查找相关视频 ↗' }).first();
  await related.waitFor();
  assert.match(await related.getAttribute('href'), /^https:\/\/www\.douyin\.com\/search\//);
  await page.getByRole('button', { name: /^收藏：/ }).first().click();
  await page.getByRole('button', { name: /^取消收藏：/ }).first().waitFor();
  await page.reload();
  await page.getByRole('button', { name: /^取消收藏：/ }).first().waitFor();
  checks.push('Cached external boards use real API favorites and retain them after refresh');

  const routes = [['projects', '/'], ['job-detail', `/jobs/${second}`], ['hotspots', '/hotspots'], ['assets', '/assets'], ['publishing', '/publishing'], ['settings', '/settings'], ['articles', '/articles'], ['galleries', '/galleries'], ['collections', '/collections'], ['skills', '/skills'], ['trash', '/trash']];
  for (const size of sizes) for (const [name, route] of routes) await snapshot(name, route, size);
  await page.setViewportSize(sizes[2]);
  await page.goto(base);
  await page.getByRole('button', { name: '更多', exact: true }).click();
  await page.getByRole('dialog').getByRole('link', { name: '设置与环境' }).click();
  await page.waitForURL(/\/settings/);
  assert.equal(await page.getByRole('dialog').count(), 0);
  await page.getByLabel('界面主题').selectOption('light');
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
  await page.screenshot({ path: path.join(evidence, 'mobile-light-settings.png'), fullPage: true });
  await page.reload();
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
  checks.push('Mobile navigation, modal dismissal and saved theme work');
  assert.deepEqual(errors, [], 'Unhandled browser errors');
  await writeFile(path.join(root, 'artifacts', 'browser-report.json'), JSON.stringify({ passed: true, checks, sizes, routes, externalAI: 'not called', platformPublishing: 'not called' }, null, 2));
  console.log(JSON.stringify({ passed: true, checks, screenshots: 'artifacts/screenshots' }));
} catch (error) {
  await page.screenshot({ path: path.join(evidence, 'failure.png'), fullPage: true }).catch(() => {});
  await writeFile(path.join(root, 'artifacts', 'failure.html'), await page.content()).catch(() => {});
  await writeFile(path.join(root, 'artifacts', 'browser-report.json'), JSON.stringify({ passed: false, checks, url: page.url(), errors, error: String(error) }, null, 2));
  throw error;
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
  await rm(storage, { recursive: true, force: true });
}
process.exit(0);
