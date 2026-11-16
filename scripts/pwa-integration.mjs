import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import apps from '../src/data/pwa-apps.json' with { type: 'json' };

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const templatePath = join(root, 'src/pwa/sw-template.js');

/** Collect same-origin assets from the app HTML, then follow /_astro/ imports in JS chunks. */
export async function collectAssets(html, distDir) {
  const found = new Set();
  const queue = [];

  const add = (path) => {
    const clean = path.split('?')[0];
    if (!clean.startsWith('/') || found.has(clean)) return;
    found.add(clean);
    if (clean.startsWith('/_astro/') && clean.endsWith('.js')) queue.push(clean);
  };

  const scopes = apps.map((app) => app.scope.replace(/^\/|\/$/g, ''));
  const htmlRe = new RegExp(
    `(?:src|href)="(/((?:_astro|favicon|${scopes.join('|')})[^"]*))"`,
    'g',
  );
  let m;
  while ((m = htmlRe.exec(html))) add(m[1]);

  const importRe = /from\s*["'](\.[^"']+|\/_astro\/[^"']+)["']/g;
  while (queue.length) {
    const rel = queue.shift();
    try {
      const src = await readFile(join(distDir, rel.replace(/^\//, '')), 'utf8');
      importRe.lastIndex = 0;
      let im;
      while ((im = importRe.exec(src))) {
        const spec = im[1];
        add(spec.startsWith('/') ? spec : `/_astro/${spec.replace(/^\.\//, '')}`);
      }
    } catch {
      /* missing chunk; cache-on-fetch still covers it at runtime */
    }
  }
  return [...found];
}

export function renderServiceWorker(app, extraPrecache = []) {
  return async function fill(template) {
    const precache = [...new Set([...(app.precache || []), ...extraPrecache])];
    const config = {
      cacheName: app.cacheName,
      scope: app.scope,
      precache,
      networkFirstHosts: app.networkFirstHosts || [],
      cacheOnFetchPrefixes: app.cacheOnFetchPrefixes || ['/_astro/'],
    };
    if (!template.includes('__PWA_CONFIG__')) {
      throw new Error('src/pwa/sw-template.js must contain the __PWA_CONFIG__ placeholder');
    }
    return template.replace('__PWA_CONFIG__', JSON.stringify(config));
  };
}

export async function writeAppServiceWorker(distDir, app, logger) {
  const template = await readFile(templatePath, 'utf8');
  const htmlRel = `${app.htmlPath.replace(/^\//, '')}index.html`;
  const htmlPath = join(distDir, htmlRel);
  let extra = [];
  try {
    extra = await collectAssets(await readFile(htmlPath, 'utf8'), distDir);
  } catch {
    logger?.warn?.(`[pwa] ${app.name}: could not read ${htmlRel} to collect hashed assets`);
  }
  const body = await (await renderServiceWorker(app, extra))(template);
  const outRel = app.swPath.replace(/^\//, '');
  const outPath = join(distDir, outRel);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, body);
  logger?.info?.(`[pwa] wrote ${app.swPath} with ${extra.length} page assets in precache`);
  return { outPath, extra };
}

export default function pwaIntegration() {
  return {
    name: 'rgh-pwa',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const distDir = fileURLToPath(dir);
        for (const app of apps) {
          await writeAppServiceWorker(distDir, app, logger);
        }
      },
    },
  };
}
