// Only these root namespaces mirror canonical/public/assets. Legacy originals stay local.
import {cpSync, existsSync, mkdirSync, mkdtempSync, renameSync, rmSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tree, noLinks} from './lib/files.mjs';
export const namespaces = ['core','site','vendor/effect-engine'];
export function syncAssets(repo, apply=false) {
  const source = join(repo,'canonical/public/assets'), target = join(repo,'assets');
  noLinks(source); noLinks(target);
  const expected = Object.fromEntries(namespaces.map(name=>[name,tree(join(source,name))]));
  const different = namespaces.filter(name=>!existsSync(join(target,name)) || JSON.stringify(tree(join(target,name))) !== JSON.stringify(expected[name]));
  if (!apply) {if (different.length) throw new Error('Asset mirror differs: ' + different.join(', ')); return expected;}
  // Preflight every namespace before writing. Per-directory rename + rollback;
  // no crash-atomic exchange guarantee across the three directories.
  for (const name of namespaces) {noLinks(join(target,name)); if (existsSync(join(target,name))) tree(join(target,name));}
  const stage = mkdtempSync(join(repo,'.public-stage-')); const moved=[]; let preserveStage=false;
  try {
    for (const name of namespaces) {
      mkdirSync(resolve(stage,'next',name,'..'), {recursive:true});
      cpSync(join(source,name),join(stage,'next',name),{recursive:true});
      if (JSON.stringify(tree(join(stage,'next',name))) !== JSON.stringify(expected[name])) throw new Error('Staged asset mismatch');
    }
    for (const name of different) {
      const dest=join(target,name), old=join(stage,'old',name); mkdirSync(resolve(old,'..'),{recursive:true}); mkdirSync(resolve(dest,'..'),{recursive:true});
      const had=existsSync(dest); if (had) renameSync(dest,old);
      moved.push({name,had}); renameSync(join(stage,'next',name),dest);
    }
    for (const name of namespaces) if (JSON.stringify(tree(join(target,name))) !== JSON.stringify(expected[name])) throw new Error('Final asset mismatch');
  } catch(error) {
    const failures=[];
    for (const {name,had} of moved.reverse()) {
      try {rmSync(join(target,name),{recursive:true,force:true}); if(had) renameSync(join(stage,'old',name),join(target,name));}
      catch(rollback) {failures.push(rollback);}
    }
    if(failures.length) {preserveStage=true; throw new AggregateError([error,...failures], 'Rollback incomplete; previous assets retained at '+stage);}
    throw error;
  } finally {if(!preserveStage)rmSync(stage,{recursive:true,force:true});}
  return expected;
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  if(process.argv.length!==3 || !['--check','--apply'].includes(process.argv[2])) throw new Error('Usage: node scripts/sync-public-assets.mjs --check|--apply');
  const result=syncAssets(fileURLToPath(new URL('../',import.meta.url)),process.argv[2]==='--apply');
  console.log('public-assets-ok: '+Object.values(result).reduce((n,files)=>n+Object.keys(files).length,0)+' hashes');
}
