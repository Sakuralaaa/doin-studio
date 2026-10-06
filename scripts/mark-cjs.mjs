import { mkdir, writeFile } from 'node:fs/promises';
await mkdir(new URL('../dist-electron/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist-electron/package.json', import.meta.url), JSON.stringify({ type: 'commonjs' }) + '\n');
