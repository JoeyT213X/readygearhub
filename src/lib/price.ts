// One place that words every price the site shows (BOTS.md: prices may show only when honest).
// Honest = a real number from the data, a real date it was checked, and a plain "may change".
// Anything without both falls back to where the price lives. Never invent a price or a date.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** 'YYYY-MM-DD' -> 'Nov 24, 2026'; undefined when it is not a real calendar date. */
export function fmtDate(iso: string | undefined): string | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '');
  if (!m) return undefined;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d ? `${MONTHS[mo - 1]} ${d}, ${y}` : undefined;
}

/** "$220" + "2025-11-25" -> "About $220 · checked Nov 25, 2026 · may change". "From $9" and worded labels keep their own wording. */
export function honestPrice(text: string, iso: string | undefined): string | undefined {
  const date = fmtDate(iso);
  if (!date || !/\$\s?\d/.test(text)) return undefined;
  return `${text.startsWith('$') ? 'About ' : ''}${text} · checked ${date} · may change`;
}

/** Existing card labels look like "$367.00 as of Nov 23, 2026" (or "(as of …)"). Re-word them; undefined when undated or not a price. */
export function honestPriceFromLabel(label: string): string | undefined {
  const m = /\s*\(?\bas of (\w{3}) (\d{1,2}), (\d{4})\)?/.exec(label);
  const mo = m ? MONTHS.indexOf(m[1]) + 1 : 0;
  if (!m || !mo) return undefined;
  return honestPrice(label.replace(m[0], '').trim(), `${m[3]}-${String(mo).padStart(2, '0')}-${m[2].padStart(2, '0')}`);
}
