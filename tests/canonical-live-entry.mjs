// Host-only narrow browser proof, isolated synthetic API; uses REAL repo root.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import net from 'node:net';
import {readFile} from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
import {fixtureServer,proxyServer,freshState} from './fixtures/canonical-api.mjs';
const state=freshState(), api=await fixtureServer(state);
const port=await new Promise(resolve=>{const s=net.createServer();s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p));});});
const php=spawn('php',['-S',`127.0.0.1:${port}`,'-t','.'],{env:{...process.env,YA_SITE_API_ORIGIN:api.origin},stdio:'ignore'});
let proxy,browser;
try {
  let ready=false;
  for(let i=0;i<80;i++){try{await fetch(`http://127.0.0.1:${port}/`);ready=true;break;}catch{await new Promise(resolve=>setTimeout(resolve,50));}}
  assert.ok(ready,'PHP root server unavailable');
  proxy=await proxyServer(`http://127.0.0.1:${port}`,api.origin);const base=proxy.origin;
  browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || '/usr/bin/brave',args:['--no-sandbox','--disable-gpu']});
  for(const width of [390,1440]) {
    Object.assign(state,freshState());
    const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
    const logo=await readFile(new URL('../assets/site/brand/logo.webp',import.meta.url));
    const calls=[],errors=[],submissions=[];
    await context.route('**/*',async route=>{
      const req=route.request(),url=new URL(req.url());calls.push(url.pathname);
      if(url.pathname==='/yardimci-asistan/api/request.php') {assert.equal(req.method(),'POST');submissions.push(req.postDataJSON());return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,request_id:'TEST-request'})});}
      if(url.origin===base)return route.continue();
      if(url.hostname==='images.example.com')return route.fulfill({contentType:'image/webp',body:logo});
      return route.abort();
    });
    const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
    await context.addCookies([{name:'ya_site_language',value:'ar',url:base}]);
    const source=await (await context.request.get(base+'/?resource=translation-source')).json();assert.equal(source.id,'teknikel-site');assert.equal(source.source_language,'tr');
    const before=state.calls.length;await context.request.get(base+'/?resource=translation-source');assert.equal(state.calls.length,before,'Source endpoint must not fetch business or AI');
    const post=await context.request.post(base+'/?resource=translation-source');assert.equal(post.status(),405);
    await page.goto(base+'/?lang=en');await expect(page.locator('html')).toHaveAttribute('lang','tr');
    await expect(page.locator('.language-picker')).toHaveCount(0);await expect(page.locator('.brand-logo').first()).toBeVisible();
    for(const [path,target] of [
      ['/magaza/','catalog'],['/katalog/','catalog'],['/urun/?id=p1','catalog'],['/sepet/','catalog'],['/markalar/','catalog'],['/hesabim/','account'],['/bayi/','account'],
      ['/galeri/','gallery'],['/odalar/','rooms'],['/odalar/oda/?id=r1','rooms'],['/restoran/','restaurant'],['/qr-menu/','menu'],['/iletisim/','contact'],['/yorumlar/','reviews'],['/duyurular/','announcements'],['/hakkimizda/','about']
    ]) {const reply=await context.request.get(base+path,{maxRedirects:0});assert.equal(reply.status(),302,path);const to=new URL(reply.headers().location,base);assert.equal(to.pathname,'/');assert.equal(to.searchParams.get('page'),target,path);}
    const filtered=await context.request.get(base+'/katalog/?q=TEST&category=c1&sku=TEST-POM-101&brand=TEST%20Bosch&page=account',{maxRedirects:0});const params=new URL(filtered.headers().location,base).searchParams;
    for(const [key,value] of Object.entries({page:'catalog',q:'TEST',category:'c1',sku:'TEST-POM-101',brand:'TEST Bosch'})) assert.equal(params.get(key),value);
    const cart=await context.request.get(base+'/sepet/',{maxRedirects:0});assert.ok(cart.headers().location.endsWith('#cart'));
    const account=await context.request.get(base+'/hesabim/?action=verify&order=TEST-order',{maxRedirects:0});assert.equal(new URL(account.headers().location,base).searchParams.get('order'),'TEST-order');assert.ok(!account.headers().location.includes('#'),'Fragment token inherited by browser');
    const token='TEST_'+ 'a'.repeat(32);const login=await context.request.get(base+'/bayi/?action=verify&token='+token,{maxRedirects:0});const tokenUrl=new URL(login.headers().location,base);assert.equal(tokenUrl.hash,'#token='+token);assert.equal(tokenUrl.searchParams.has('token'),false);
    for(const query of ['q[]=bad','q=%0Ainjection','redirect=https://example.test']) assert.equal((await context.request.get(base+'/katalog/?'+query)).status(),400);
    state.surfaces=[];assert.equal((await page.goto(base+'/magaza/')).status(),404);assert.equal((await page.goto(base+'/sepet/')).status(),404);
    state.account=false;assert.equal((await page.goto(base+'/hesabim/')).status(),404);
    Object.assign(state,freshState());
    await page.goto(base+'/urun/?id=p1');await expect(page.locator('#product-detail-title')).toHaveText('TEST Bosch Pompa');
    await expect(page.locator('script[src="/assets/core/widget.js"]')).toHaveCount(1);
    await page.locator('[data-ya-action="request.general"][data-ya-resource-id="p1"]').click();
    const widget=page.locator('#yardimci-asistan-widget');await expect(widget).toHaveCount(1);
    await expect(widget.locator('input[name="context_resource_id"]')).toHaveValue('p1');
    await expect(widget.locator('input[type=date],[data-ya-open-date-picker]')).toHaveCount(0);
    await widget.locator('[name=customer_name]').fill('TEST Customer');await widget.locator('[name=customer_phone]').fill('+905550000000');await widget.locator('[name=message]').fill('TEST stock question');
    await widget.locator('button[type=submit]').click();await expect.poll(()=>submissions.length).toBe(1);
    assert.equal(submissions[0].request_type,'general_info');assert.equal(submissions[0].context.resourceId,'p1');assert.equal(submissions[0].context.resourceType,'product');assert.ok(submissions[0].idempotency_key);
    assert.ok(!calls.some(path=>/chat\.php|assets\/assistant|assets\/site\.js/.test(path)));
    state.requests=false;await page.goto(base+'/urun/?id=p1');await expect(page.locator('[data-ya-action="request.general"]')).toHaveCount(0);
    await page.goto(base+'/demo-icerik/');await expect(page.locator('a[download="teknikel-demo-verileri.zip"]')).toBeVisible();
    for(const path of ['/assets/core/site.mjs','/assets/site/theme.mjs','/assets/site/brand/logo.webp','/assets/vendor/effect-engine/provenance.json','/assets/vendor/effect-engine/src/runtime/object-scene.mjs']) assert.equal((await context.request.get(base+path)).status(),200,path);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);
    await context.close();console.log('PASS actual root + 16 aliases + OFF gates + AI OFF product request + demo/assets '+width);
  }
} finally {
  await browser?.close();proxy?.server.closeAllConnections();api.server.closeAllConnections();
  await new Promise(resolve=>proxy?proxy.server.close(resolve):resolve());await new Promise(resolve=>api.server.close(resolve));php.kill('SIGTERM');
}
