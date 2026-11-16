// Checks every officialUrl / affiliateUrl in src/content/items. Run: npm run check-links
import { readdirSync, readFileSync } from 'node:fs';
const dir = new URL('../src/content/items/', import.meta.url);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
let bad = 0;
for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const txt = readFileSync(new URL(f, dir), 'utf8');
  for (const key of ['officialUrl', 'affiliateUrl']) {
    const m = txt.match(new RegExp(`^${key}:\\s*"([^"]+)"`, 'm'));
    if (!m) continue;
    try {
      const r = await fetch(m[1], { redirect: 'follow', headers: { 'user-agent': UA } });
      const ok = r.status < 400;
      if (!ok) bad++;
      console.log(`${ok ? 'OK ' : 'BAD'} ${r.status} ${f} ${key} ${m[1]}${r.url !== m[1] ? ' -> ' + r.url : ''}`);
    } catch (e) { bad++; console.log(`ERR ${f} ${key} ${m[1]} ${e.message}`); }
  }
}
console.log(bad ? `${bad} broken link(s)` : 'All links OK');
process.exit(bad ? 1 : 0);
