// Explicit, baseline-aware common release update. Never edits the source release.
import {cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {fileURLToPath} from 'node:url';
import {digest, inventory, safeFile} from '../canonical/tools/manifest.mjs';
import {tree, noLinks} from './lib/files.mjs';
const repo = fileURLToPath(new URL('../', import.meta.url));
export async function update(incoming, installed, apply = false) {
  incoming = resolve(incoming); installed = resolve(installed);
  noLinks(incoming); noLinks(installed);
  const owned = Object.fromEntries(['site','locales','public/assets/site'].map(path => [path, tree(join(installed,path))]));
  const next = JSON.parse(readFileSync(join(incoming, 'template-manifest.json')));
  const old = JSON.parse(readFileSync(join(installed, 'template-manifest.json')));
  if (next.format !== 1 || old.format !== 1) throw new Error('Unsupported baseline');
  if (JSON.stringify(inventory(incoming)) !== JSON.stringify(next.common)) throw new Error('Incoming hash mismatch');
  const actual = inventory(installed);
  for (const path of Object.keys(actual)) if (!(path in old.common) && !(path in next.common)) throw new Error('Unmanaged common file: ' + path);
  const baselineHash = digest(join(installed, 'template-manifest.json'));
  // Run the unmodified upstream planner in-process (sandbox forbids child Node).
  const savedArgs = process.argv, savedLog = console.log, savedExit = process.exitCode;
  let output = '';
  try {
    process.argv = [process.execPath, join(incoming, 'tools/update-plan.mjs'), incoming, installed];
    console.log = value => {output += value;};
    await import(pathToFileURL(join(incoming, 'tools/update-plan.mjs')).href + '?run=' + Date.now() + Math.random());
  } finally {process.argv = savedArgs; console.log = savedLog; process.exitCode = savedExit;}
  const plan = JSON.parse(output);
  if (plan.conflicts.length || plan.catalogKeysToMerge.length) throw new Error('Conflict or source catalog merge required');
  const source = JSON.parse(readFileSync(join(incoming, 'locales/tr.json')));
  const local = JSON.parse(readFileSync(join(installed, 'locales/tr.json')));
  for (const [key, value] of Object.entries(source)) if (key !== '_meta' && local[key] !== value) throw new Error('Changed shared catalog key: ' + key);
  if (!apply) return plan;
  const stage = mkdtempSync(join(resolve(installed, '..'), '.canonical-stage-'));
  let backup;
  try {
    // Copy the whole installation, retaining config, views, locales and brand assets.
    cpSync(installed, stage, {recursive:true, filter:path => {if (lstatSync(path).isSymbolicLink()) throw new Error('Symlink in installation'); return true;}});
    for (const change of plan.changes) {
      const target = safeFile(stage, change.path);
      if (change.action === 'remove') rmSync(target);
      else {mkdirSync(resolve(target, '..'), {recursive:true}); cpSync(safeFile(incoming, change.path), target);}
    }
    writeFileSync(join(stage, 'template-manifest.json'), readFileSync(join(incoming, 'template-manifest.json')));
    for (const [path, files] of Object.entries(owned)) if (JSON.stringify(tree(join(stage,path))) !== JSON.stringify(files) || JSON.stringify(tree(join(installed,path))) !== JSON.stringify(files)) throw new Error('Site-owned files changed during update');
    if (JSON.stringify(inventory(incoming)) !== JSON.stringify(next.common)) throw new Error('Incoming changed during update');
    if (JSON.stringify(inventory(stage)) !== JSON.stringify(next.common)) throw new Error('Staged hash mismatch');
    if (JSON.stringify(inventory(installed)) !== JSON.stringify(actual) || digest(join(installed,'template-manifest.json')) !== baselineHash) throw new Error('Installation changed during update');
    const backups = join(resolve(installed, '..'), '.test-artifacts/canonical-updates'); mkdirSync(backups, {recursive:true});
    backup = join(backups, 'before-' + Date.now());
    renameSync(installed, backup);
    try {renameSync(stage, installed);} catch (error) {renameSync(backup, installed); throw error;}
    return {...plan, writes:true, backup};
  } finally {if (existsSync(stage)) rmSync(stage, {recursive:true});}
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [mode, incoming] = process.argv.slice(2);
  if (!['--check','--apply'].includes(mode) || !incoming || process.argv.length !== 4) throw new Error('Usage: node scripts/update-canonical.mjs --check|--apply <incoming-template>');
  console.log(JSON.stringify(await update(incoming, join(repo,'canonical'), mode === '--apply'), null, 2));
}
