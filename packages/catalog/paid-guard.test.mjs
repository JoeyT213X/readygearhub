/**
 * Paid-search guard: Choice Home Warranty, REDI, and Waterdrop must never
 * be allowed on paid landers or ad sessions. The shared catalog is the
 * source of truth for this rule.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';

const root = dirname(fileURLToPath(import.meta.url));
const required = ['choice-home-warranty', 'redi', 'waterdrop'];
const outfile = join(root, 'dist', 'test-entry.mjs');
mkdirSync(join(root, 'dist'), { recursive: true });

const bundled = spawnSync(
  'npx',
  ['--yes', 'esbuild', join(root, 'index.ts'), '--bundle', '--format=esm', '--platform=neutral', `--outfile=${outfile}`],
  { encoding: 'utf8', cwd: join(root, '../..') },
);
if (bundled.status !== 0) {
  console.error(bundled.stdout, bundled.stderr);
  process.exit(1);
}

const catalog = await import(outfile + '?t=' + Date.now());
const {
  NO_PPC_PROGRAM_IDS,
  isPpcAllowed,
  isNoPpcProgram,
  noPpcProgramIds,
  programs,
  isProgramLive,
} = catalog;

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error('FAIL', msg);
  } else {
    console.log('OK  ', msg);
  }
}

for (const id of required) {
  const p = programs.find((x) => x.id === id);
  assert(!!p, `${id} exists in the shared program list`);
  assert(p && p.ppcAllowed === false, `${id} has ppcAllowed: false in the shared source`);
  assert(isPpcAllowed(id) === false, `isPpcAllowed('${id}') is false`);
  assert(isNoPpcProgram(id) === true, `isNoPpcProgram('${id}') is true`);
  assert(NO_PPC_PROGRAM_IDS.includes(id), `${id} is in NO_PPC_PROGRAM_IDS`);
  assert(noPpcProgramIds().includes(id), `${id} is in noPpcProgramIds()`);
  if (p && (p.status === 'approved' || p.status === 'live')) {
    assert(isProgramLive(id) === true && isPpcAllowed(id) === false, `${id} can be live and still blocked on paid sessions`);
  }
}

const hidden = new Set(noPpcProgramIds());
for (const p of programs) {
  if (p.ppcAllowed === false) {
    assert(hidden.has(p.id), `noPpcProgramIds includes ${p.id} because ppcAllowed is false`);
  }
}

assert(!isNoPpcProgram('ecoflow') || !isPpcAllowed('ecoflow') === false, 'unrelated programs are not auto-blocked by an empty id');
assert(isPpcAllowed('') === true, 'empty program id does not get hidden (government/plain links stay visible)');
assert(isPpcAllowed(null) === true, 'null program id is allowed (plain official links)');

if (failed) {
  console.error(`\n${failed} paid-guard assertion(s) failed`);
  process.exit(1);
}
console.log('\nPaid-guard tests passed from the shared catalog.');
