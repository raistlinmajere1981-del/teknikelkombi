// Narrow local acceptance: no server, network, backend mutation or broad runner.
import test from 'node:test';
import assert from 'node:assert/strict';
import {cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {inventory} from '../canonical/tools/manifest.mjs';
import {hash, tree} from '../scripts/lib/files.mjs';
import {update} from '../scripts/update-canonical.mjs';
import {syncAssets} from '../scripts/sync-public-assets.mjs';
import {packageFiles, routes} from '../scripts/package-site.mjs';
const repo=new URL('../',import.meta.url).pathname;
const upstream=process.env.YA_TEMPLATE_SOURCE || join(repo,'../YardimciAsistan/web-site-template');
const json=path=>JSON.parse(readFileSync(path,'utf8'));
const manifest=json(join(repo,'canonical/template-manifest.json'));
test('all 76 installed common hashes equal incoming release and baseline',()=>{
  assert.equal(manifest.template_version,'0.7.1'); assert.equal(Object.keys(manifest.common).length,76);
  assert.deepEqual(inventory(join(repo,'canonical')),manifest.common);
  assert.deepEqual(manifest.common,json(join(upstream,'template-manifest.json')).common);
  assert.deepEqual(inventory(upstream),manifest.common);
});
test('19 engine modules match provenance, upstream engine and Admin fingerprint',()=>{
  const vendor=join(repo,'canonical/public/assets/vendor/effect-engine');
  const provenance=json(join(vendor,'provenance.json'));
  assert.equal(Object.keys(provenance.files).length,19);
  const fingerprint=createHash('sha256').update(Object.entries(provenance.files).map(([path,sha])=>`${path}:${sha}\n`).join('')).digest('hex');
  assert.equal(provenance.fingerprint,fingerprint);
  assert.equal(fingerprint,'078c2ac168547a04e1ec5716239100e7fcd910dc67a1eb703878c80577a0f39f');
  for (const [path,sha] of Object.entries(provenance.files)) {
    assert.equal(hash(join(vendor,path)),sha,path);
    assert.equal(hash(join(upstream,'public/assets/vendor/effect-engine',path)),sha,path);
    assert.equal(hash(join(repo,'../EfektAtolyesi',path)),sha,'engine source '+path);
    assert.equal(hash(join(repo,'../YardimciAsistan/apps/admin-control-center/public/effect-studio',path)),sha,'Admin actual module '+path);
  }
  const admin=json(join(repo,'../YardimciAsistan/apps/admin-control-center/effect-engine-provenance.json'));
  assert.deepEqual(admin,provenance);
});
test('public mirror hashes, root adapter and all wrappers use common owner',()=>{
  syncAssets(repo);
  const entry=readFileSync(join(repo,'index.php'),'utf8');
  assert.match(entry,/teknikel-site/); assert.match(entry,/\$templateRoot = __DIR__ \. '\/canonical'/);
  assert.match(entry,/require \$templateRoot \. '\/public\/index.php'/);
  assert.doesNotMatch(entry,/inc\/layout|site_source_catalog/);
  for(const name of routes.filter(name=>name!=='demo-icerik')) {
    const route=readFileSync(join(repo,name,'index.php'),'utf8');
    assert.match(route,/require __DIR__ \. '\/(?:\.\.\/)+index.php'/,name);
    assert.doesNotMatch(route,/te_header|te_footer|Location:/,name);
  }
});
test('deploy package includes canonical and mirrored assets, excludes old runtime and API',()=>{
  const files=packageFiles(repo);
  for(const path of ['canonical/core/bootstrap.php','canonical/site/config.php','canonical/site/views/pages/catalog.php','canonical/public/index.php','assets/core/widget.js','assets/vendor/effect-engine/provenance.json','demo-icerik/index.php','assets/downloads/teknikel-demo-verileri.zip']) assert.ok(files.includes(path),path);
  for(const path of files) assert.ok(!/^(?:inc\/|yardimci-asistan\/|assets\/assistant\/|assets\/i18n\/)|^assets\/[^/]+\.js$/.test(path),path);
  const access=readFileSync(join(repo,'.htaccess'),'utf8');
  assert.match(access,/canonical\|inc/); assert.match(access,/assistant\|i18n/); assert.match(access,/!\^\/yardimci-asistan/);
});
const scratch=()=>mkdtempSync(join(tmpdir(),'teknikel-update-test-'));
function releases(dir) {
  const incoming=join(dir,'incoming'), installed=join(dir,'installed');
  cpSync(join(repo,'canonical'),incoming,{recursive:true}); cpSync(incoming,installed,{recursive:true});
  return {incoming,installed};
}
test('three-way check is read only; conflict and unknown common files fail before mutation',async()=>{
  const dir=scratch(); try {
    const {incoming,installed}=releases(dir), before=tree(installed);
    const plan=await update(incoming,installed); assert.equal(plan.writes,false); assert.deepEqual(tree(installed),before);
    writeFileSync(join(installed,'core/api.php'),'<?php // local fork');
    const conflict=tree(installed); await assert.rejects(update(incoming,installed,true),/Conflict/); assert.deepEqual(tree(installed),conflict);
    cpSync(join(incoming,'core/api.php'),join(installed,'core/api.php')); writeFileSync(join(installed,'core/unknown.php'),'<?php');
    await assert.rejects(update(incoming,installed,true),/Unmanaged common file/);
  } finally {rmSync(dir,{recursive:true,force:true});}
});
test('staged update applies add/replace/remove and preserves all site-owned bytes',async()=>{
  const dir=scratch(); let backup; try {
    const {incoming,installed}=releases(dir);
    const owned=Object.fromEntries(['site','locales','public/assets/site'].map(p=>[p,tree(join(installed,p))]));
    writeFileSync(join(incoming,'core/addition.php'),'<?php // incoming addition');
    writeFileSync(join(incoming,'core/api.php'),readFileSync(join(incoming,'core/api.php'),'utf8')+'\n// incoming replacement\n');
    rmSync(join(incoming,'core/.htaccess'));
    const next=json(join(incoming,'template-manifest.json')); next.common=inventory(incoming); writeFileSync(join(incoming,'template-manifest.json'),JSON.stringify(next));
    const result=await update(incoming,installed,true); backup=result.backup;
    assert.equal(result.writes,true); assert.deepEqual(inventory(installed),next.common);
    for(const [path,files] of Object.entries(owned)) assert.deepEqual(tree(join(installed,path)),files,path);
    assert.ok(!existsSync(join(installed,'core/.htaccess')));
  } finally {rmSync(dir,{recursive:true,force:true}); if(backup)rmSync(backup,{recursive:true,force:true});}
});
test('asset --check never repairs drift and apply refuses symlinks',()=>{
  const dir=scratch(); try {
    mkdirSync(join(dir,'canonical/public'),{recursive:true});
    cpSync(join(repo,'canonical/public/assets'),join(dir,'canonical/public/assets'),{recursive:true});
    syncAssets(dir,true); writeFileSync(join(dir,'assets/core/site.mjs'),'drift'); const before=tree(join(dir,'assets'));
    assert.throws(()=>syncAssets(dir),/differs/); assert.deepEqual(tree(join(dir,'assets')),before);
    rmSync(join(dir,'assets/site'),{recursive:true}); symlinkSync(join(dir,'canonical/public/assets/site'),join(dir,'assets/site'));
    assert.throws(()=>syncAssets(dir,true),/Symlink/);
  } finally {rmSync(dir,{recursive:true,force:true});}
});

test('invalid incoming bytes, changed shared catalog and symlink roots preserve installed release',async()=>{
  const dir=scratch(); try {
    const {incoming,installed}=releases(dir),before=tree(installed);
    writeFileSync(join(incoming,'core/api.php'),'tampered');
    await assert.rejects(update(incoming,installed,true),/Incoming hash mismatch/); assert.deepEqual(tree(installed),before);
    cpSync(join(installed,'core/api.php'),join(incoming,'core/api.php'));
    const catalog=json(join(incoming,'locales/tr.json')); catalog['page.home']='CHANGED'; writeFileSync(join(incoming,'locales/tr.json'),JSON.stringify(catalog));
    await assert.rejects(update(incoming,installed,true),/Changed shared catalog key/); assert.deepEqual(tree(installed),before);
    const alias=join(dir,'alias');symlinkSync(installed,alias);await assert.rejects(update(incoming,alias,true),/Symlink/);
  } finally {rmSync(dir,{recursive:true,force:true});}
});
