import assert from 'node:assert/strict';
import { _electron as electron } from 'playwright';
import { access, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';

const executable = path.resolve('release/win-unpacked/Doin Studio.exe');
await access(executable);
const output = path.resolve('artifacts/windows');
await mkdir(output, { recursive: true });
const storage = await mkdtemp(path.join(tmpdir(), 'doin-studio-electron-'));
let app;
const errors = [];
try {
  app = await electron.launch({ executablePath: executable, env: { ...process.env, DOIN_USER_DATA_DIR: storage }, timeout: 90_000 });
  app.process().stderr.on('data', buffer => console.error(buffer.toString()));
  const page = await app.firstWindow();
  page.on('pageerror', error => errors.push(error.message));
  await page.getByRole('heading', { name: '最近作品', exact: true }).waitFor({ timeout: 90_000 });
  assert.match(page.url(), /^file:.*index\.html/);
  const port = await page.evaluate(() => window.electron.getServerPort());
  assert.equal((await fetch(`http://localhost:${port}/health`)).status, 200);
  const report = await page.evaluate(() => ({ protocol: location.protocol, theme: document.documentElement.dataset.theme, hasIPC: !!window.electron.getConfig }));
  assert.equal(report.hasIPC, true);
  await page.screenshot({ path: path.join(output, 'packaged-desktop.png') });
  await page.getByRole('button', { name: '创建作品', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByPlaceholder('https://www.douyin.com/video/...').fill('https://www.douyin.com/video/7420000000000000003');
  await dialog.locator('input[placeholder^="例如："]').fill('Windows 安装包真实任务');
  await dialog.getByRole('button', { name: '创建任务', exact: true }).click();
  await page.waitForURL(/#\/jobs\//);
  await page.getByRole('heading', { name: 'Windows 安装包真实任务', exact: true }).waitFor();
  await page.reload();
  await page.getByRole('heading', { name: 'Windows 安装包真实任务', exact: true }).waitFor();
  await page.screenshot({ path: path.join(output, 'packaged-job.png') });
  await page.getByRole('link', { name: '设置与环境' }).click();
  await page.waitForURL(/#\/settings/);
  await page.locator('h1').first().waitFor();
  await page.screenshot({ path: path.join(output, 'packaged-settings.png') });
  assert.deepEqual(errors, []);
  await writeFile(path.join(output, 'report.json'), JSON.stringify({ passed: true, executable: path.basename(executable), ...report, checks: ['asar backend load', 'native IPC', 'real API health', 'real task creation', 'hash route refresh', 'settings navigation'], externalModels: 'not called', realPlatformLogin: 'not tested' }, null, 2));
} finally {
  if (app) await app.close();
  await rm(storage, { recursive: true, force: true });
}
