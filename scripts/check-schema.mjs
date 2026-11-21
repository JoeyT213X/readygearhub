// Parse all JSON-LD in dist/ and apply Google merchant-listing / product-snippet rules
// we can check locally (no invented reviews; Offers only on RGH shop products).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../dist/', import.meta.url);
const pages = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) pages.push(p);
  }
})(new URL(root).pathname);

const issues = [];
const products = [];
function walkTypes(node, acc = []) {
  if (!node || typeof node !== 'object') return acc;
  if (Array.isArray(node)) { node.forEach((n) => walkTypes(n, acc)); return acc; }
  if (node['@type']) acc.push(node);
  for (const v of Object.values(node)) if (v && typeof v === 'object') walkTypes(v, acc);
  return acc;
}
function types(n) {
  const t = n['@type'];
  return (Array.isArray(t) ? t : [t]).filter(Boolean);
}

for (const file of pages) {
  const rel = '/' + relative(new URL(root).pathname, file).replace(/index\.html$/, '').replace(/\\/g, '/');
  const html = readFileSync(file, 'utf8');
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
    try { return JSON.parse(m[1]); } catch (e) { issues.push({ rel, error: `unparsable JSON-LD: ${e.message}` }); return null; }
  }).filter(Boolean);

  const nodes = blocks.flatMap((b) => walkTypes(b));
  for (const n of nodes) {
    const t = types(n);
    if (t.includes('Product') || t.includes('Offer')) {
      products.push({ rel, types: t, node: n });
    }
    if (t.includes('Product')) {
      if (n.review || n.aggregateRating) {
        issues.push({ rel, error: 'Product has review or aggregateRating; shop pages must not invent ratings' });
      }
      const offer = n.offers;
      if (!offer) {
        if (!rel.startsWith('/shop/') || rel === '/shop/') {
          // Product without offers is ok only if we intended a non-merchant pattern; we don't emit these.
          issues.push({ rel, error: 'Product without offers (unexpected)' });
        }
        continue;
      }
      const offers = Array.isArray(offer) ? offer : [offer];
      if (!rel.startsWith('/shop/') || rel === '/shop/') {
        issues.push({ rel, error: 'Offer on a non-shop page; RGH is not the merchant for affiliate gear' });
      }
      for (const o of offers) {
        if (!o.price || !o.priceCurrency) issues.push({ rel, error: 'Offer missing price or priceCurrency' });
        const ship = o.shippingDetails;
        if (!ship) issues.push({ rel, error: 'Offer missing shippingDetails' });
        else {
          const rate = ship.shippingRate;
          if (!rate || String(rate.value) !== '0' || rate.currency !== 'USD') {
            issues.push({ rel, error: `shippingRate should be 0 USD for digital downloads, got ${JSON.stringify(rate)}` });
          }
          const dest = ship.shippingDestination;
          if (!dest || dest.addressCountry !== 'US') issues.push({ rel, error: 'shippingDestination.addressCountry should be US' });
          const dt = ship.deliveryTime;
          if (!dt?.handlingTime || !dt?.transitTime) issues.push({ rel, error: 'deliveryTime missing handlingTime or transitTime' });
          else if (dt.handlingTime.minValue !== 0 || dt.handlingTime.maxValue !== 0 || dt.transitTime.minValue !== 0 || dt.transitTime.maxValue !== 0) {
            issues.push({ rel, error: 'digital delivery times should be 0–0 days' });
          }
        }
        const ret = o.hasMerchantReturnPolicy;
        if (!ret) issues.push({ rel, error: 'Offer missing hasMerchantReturnPolicy' });
        else {
          if (ret.applicableCountry !== 'US') issues.push({ rel, error: 'return applicableCountry should be US' });
          if (ret.returnPolicyCategory !== 'https://schema.org/MerchantReturnUnlimitedWindow') {
            issues.push({ rel, error: `returnPolicyCategory should be MerchantReturnUnlimitedWindow (defective refunds, no stated window), got ${ret.returnPolicyCategory}` });
          }
          if (ret.merchantReturnDays != null) issues.push({ rel, error: 'merchantReturnDays must not be invented' });
          if (ret.merchantReturnLink !== 'https://readygearhub.com/refund-policy/') {
            issues.push({ rel, error: `merchantReturnLink should be the refund policy URL, got ${ret.merchantReturnLink}` });
          }
          const refunds = Array.isArray(ret.refundType) ? ret.refundType : [ret.refundType];
          if (!refunds.includes('https://schema.org/FullRefund')) issues.push({ rel, error: 'refundType should include FullRefund' });
          const cond = ret.itemCondition;
          const conds = Array.isArray(cond) ? cond : [cond];
          if (!conds.includes('https://schema.org/DamagedCondition')) {
            issues.push({ rel, error: 'itemCondition should include DamagedCondition (broken/unusable files only)' });
          }
          if (conds.includes('https://schema.org/NewCondition')) {
            issues.push({ rel, error: 'itemCondition should not include NewCondition; working downloads are final sale' });
          }
        }
      }
    }
  }
}

const shopProducts = products.filter((p) => p.rel.startsWith('/shop/') && p.rel !== '/shop/' && p.types.includes('Product'));
console.log(`pages ${pages.length}; Product/Offer nodes ${products.length}`);
console.log('Product pages:', shopProducts.map((p) => p.rel).join(', ') || '(none)');
if (products.some((p) => !p.rel.startsWith('/shop/'))) {
  console.log('NON-SHOP Product/Offer:', products.filter((p) => !p.rel.startsWith('/shop/')).map((p) => p.rel + ' ' + p.types.join(',')));
}
if (issues.length) {
  console.error('SCHEMA ISSUES:');
  for (const i of issues) console.error(' -', i.rel, i.error);
  process.exit(1);
}
if (shopProducts.length < 4) {
  console.error('Expected at least 4 shop Product pages');
  process.exit(1);
}
console.log('Schema checks passed: shop Products have 0-USD digital shippingDetails, defective-only return policy, no review/rating markup, no Offers on affiliate pages.');
