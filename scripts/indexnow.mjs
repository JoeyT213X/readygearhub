// Submit sitemap URLs to IndexNow. Run manually after a production deploy: npm run indexnow
import { existsSync, readdirSync, readFileSync } from 'node:fs';

const HOST = 'readygearhub.com';
const publicDir = new URL('../public/', import.meta.url);
const keyFile = readdirSync(publicDir).find((f) => /^[0-9a-f]{32}\.txt$/i.test(f));
if (!keyFile) {
  console.error('No 32-char hex IndexNow key file in public/');
  process.exit(1);
}
const key = keyFile.slice(0, 32);
const keyLocation = `https://${HOST}/${key}.txt`;
const locs = (xml) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1].trim());

const dist = new URL('../dist/', import.meta.url);
const local = existsSync(dist) ? readdirSync(dist).filter((f) => /^sitemap.*\.xml$/i.test(f)) : [];
const xmls = [];
if (local.length) {
  for (const f of local) xmls.push(readFileSync(new URL(f, dist), 'utf8'));
} else {
  const indexUrl = `https://${HOST}/sitemap-index.xml`;
  const index = await (await fetch(indexUrl)).text();
  xmls.push(index);
  for (const u of locs(index)) xmls.push(await (await fetch(u)).text());
}
const urlList = [...new Set(xmls.flatMap(locs))].filter((u) => !/\/sitemap[^/]*\.xml$/i.test(u));
if (!urlList.length) {
  console.error('No sitemap URLs found');
  process.exit(1);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation, urlList }),
});
const body = await res.text();
console.log(`IndexNow ${res.status} ${urlList.length} URLs keyLocation=${keyLocation}`);
if (body) console.log(body);
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
