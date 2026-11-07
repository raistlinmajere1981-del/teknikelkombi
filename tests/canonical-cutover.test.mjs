// Narrow local acceptance: no server, network, backend mutation or broad runner.
import test from 'node:test';
import assert from 'node:assert/strict';
import {cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash,webcrypto} from 'node:crypto';
import vm from 'node:vm';
import {inventory} from '../canonical/tools/manifest.mjs';
import {hash, tree} from '../scripts/lib/files.mjs';
import {update} from '../scripts/update-canonical.mjs';
import {syncAssets} from '../scripts/sync-public-assets.mjs';
import {packageFiles, routes} from '../scripts/package-site.mjs';
const repo=new URL('../',import.meta.url).pathname;
const upstream=process.env.YA_TEMPLATE_SOURCE || join(repo,'../YardimciAsistan/web-site-template');
const json=path=>JSON.parse(readFileSync(path,'utf8'));
const manifest=json(join(repo,'canonical/template-manifest.json'));
test('all 77 installed common hashes equal incoming release and baseline',()=>{
  assert.equal(manifest.template_version,'0.7.6'); assert.equal(Object.keys(manifest.common).length,77);
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
  for(const path of ['canonical/core/bootstrap.php','canonical/site/config.php','canonical/site/views/pages/catalog.php','canonical/public/index.php','assets/core/widget.js','assets/core/commerce.js','canonical/public/assets/site/catalog.js','canonical/public/assets/site/catalog.css','canonical/public/assets/site/product-card.js','canonical/public/assets/site/home-catalog.js','assets/site/catalog.js','assets/site/catalog.css','assets/site/product-card.js','assets/site/home-catalog.js','assets/vendor/effect-engine/provenance.json','demo-icerik/index.php','assets/downloads/teknikel-demo-verileri.zip']) assert.ok(files.includes(path),path);
  for(const path of files) assert.ok(!/^(?:inc\/|yardimci-asistan\/|assets\/assistant\/|assets\/i18n\/)|^assets\/[^/]+\.js$/.test(path),path);
  const access=readFileSync(join(repo,'.htaccess'),'utf8');
  assert.match(access,/canonical\|inc/); assert.match(access,/assistant\|i18n/); assert.match(access,/!\^\/yardimci-asistan/);
});
test('commerce is headless and Teknikel owns its complete catalog presentation',()=>{
  const read=path=>readFileSync(join(repo,'canonical',path),'utf8');
  const controller=read('public/assets/core/commerce.js');
  assert.match(controller,/window\.YaCommerce = Object\.freeze/);
  assert.doesNotMatch(controller,/\bdocument\b|querySelector|createElement|innerHTML|classList|catalog-filter-rail|category-choice/);
  assert.match(controller,/account\/receipt\.php/);
  assert.match(controller,/dealer\/catalog\.php/);
  assert.match(controller,/fingerprint/);
  const page=read('site/views/pages/catalog.php'),renderer=read('public/assets/site/catalog.js');
  assert.match(page,/class="ya-storefront teknikel-catalog<\?=/);
  assert.match(page,/is-detail/);
  assert.match(page,/id="catalog-filter-rail"/);
  assert.doesNotMatch(page,/require.*core\/views\/pages\/catalog/);
  assert.match(renderer,/YaCommerce\.create/);
  assert.doesNotMatch(renderer,/\bfetch\s*\(|sessionStorage|localStorage|idempotencyKey|catalogRevision/);
  for(const path of ['core/views/pages/catalog.php','public/assets/core/storefront.js','public/assets/core/site.css']) {
    assert.doesNotMatch(read(path),/ya-storefront|catalog-filter-rail|category-choice|brand-choice|cart-line-thumb|comparison-viewport|minmax\(190px,232px\)/,path);
  }
});
function headless(fetcher) {
  const local=new Map(),session=new Map(),events=new Map();
  const storage=values=>({getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)});
  // No document/DOM exists in this fixture; the production controller must work without it.
  const context={URL,AbortSignal,structuredClone,TextEncoder,crypto:webcrypto,setTimeout,clearTimeout,fetch:fetcher,
    location:{href:'https://site.example/?page=catalog',origin:'https://site.example'},
    localStorage:storage(local),sessionStorage:storage(session),addEventListener:(name,listener)=>events.set(name,listener),removeEventListener:name=>events.delete(name)};
  context.window=context;vm.runInNewContext(readFileSync(join(repo,'canonical/public/assets/core/commerce.js'),'utf8'),context);
  const client=context.YaCommerce.create({account:null});
  return {client,context,local,session,events};
}
const reply=(status,value)=>({status,ok:status>=200&&status<300,json:async()=>value});
const product=(id,unit,price)=>({product_id:id,name:'TEST '+id,unit,price,currency:'TRY',availability:'available'});
async function startHeadless(client) {
  const ready=new Promise(resolve=>client.subscribe((state,reason)=>{if(reason==='catalog')resolve(state);}));client.start();return ready;
}
test('headless commands enforce units and totals while storage keeps only IDs/quantities',async()=>{
  const f=headless(async()=>reply(200,{ok:true,enabled:true,delivery_methods:['pickup','shipping'],products:[product('p1','piece',1.23),product('p2','kg',3.5)]}));
  try {
    await startHeadless(f.client);f.client.add('p1');f.client.add('p2');
    assert.equal(f.client.setQuantity('p1','0.5'),false);assert.equal(f.client.setQuantity('p1',1001),false);
    assert.equal(f.client.setQuantity('p2','0,125'),true);
    assert.equal(f.client.state.cart[0].q,10000);assert.equal(f.client.state.totals[0].amount,1.67);
    const snapshot=f.client.state;snapshot.products[0].price=99;snapshot.cart[0].q=999;
    assert.equal(f.client.state.products[0].price,1.23);assert.equal(f.client.state.cart[0].q,10000);
    assert.deepEqual(JSON.parse([...f.local.values()][0]),{version:2,items:[{productId:'p1',quantity:1},{productId:'p2',quantity:0.125}]});
    f.client.setDelivery('shipping');const invalid=await f.client.submit({name:'TEST buyer',phone:'+905551112233',address:{countryCode:'bad'}});
    assert.ok(invalid.errors['delivery-countryCode']);assert.ok(invalid.errors['delivery-addressLine1']);assert.equal(f.session.size,0);
    assert.throws(()=>f.context.YaCommerce.create({apiBase:'https://other.example/api/'}),/same_origin_api_required/);
    f.client.subscribe((state,reason)=>{if(reason==='fence')throw new Error('TEST observer failure');});
    let fenced=false;f.client.subscribe((state,reason)=>{if(reason==='fence')fenced=state.products.length===0&&state.cart.length===0;});
    f.client.destroy();assert.equal(fenced,true);assert.equal(f.events.size,0);
  } finally {f.client.destroy();}
});
test('headless uncertain submit locks edits and retries the exact body without storing personal fields',async()=>{
  const calls=[];let fail=true;
  const f=headless(async(url,options)=>{
    if(url.pathname.endsWith('/catalog.php'))return reply(200,{ok:true,enabled:true,delivery_methods:['pickup'],products:[product('p1','piece',12)]});
    calls.push(options.body);if(fail){fail=false;throw new Error('TEST lost response');}return reply(201,{ok:true,order_id:'TEST_order'});
  });
  try {
    await startHeadless(f.client);f.client.add('p1');await f.client.submit({name:'TEST buyer',phone:'+905551112233'});
    assert.equal(f.client.state.pending.hasPayload,true);assert.equal(f.client.state.canEdit,false);
    f.client.clearCart();f.client.add('p1');assert.equal(f.client.setQuantity('p1',2),false);assert.equal(f.client.state.cart[0].q,10000);
    assert.ok(![...f.session.values()][0].includes('TEST buyer'));assert.ok(![...f.session.values()][0].includes('90555'));
    await f.client.submit({name:'TEST changed',phone:'invalid'});assert.equal(calls.length,2);assert.equal(calls[0],calls[1]);
    assert.equal(f.client.state.receipt.order_id,'TEST_order');assert.equal(f.client.state.cart.length,0);assert.equal(f.session.size,0);
  } finally {f.client.destroy();}
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
