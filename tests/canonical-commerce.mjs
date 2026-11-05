import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import net from 'node:net';
import {mkdir,readFile} from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
import {commerceState,commerceFixtureServer,proxyServer} from './fixtures/canonical-commerce-api.mjs';
const artifacts=new URL('../.test-artifacts/canonical-commerce/',import.meta.url).pathname;
await mkdir(artifacts,{recursive:true});
const logo=await readFile(new URL('../canonical/public/assets/site/brand/logo.webp',import.meta.url));
const state=commerceState(),api=await commerceFixtureServer(state);
const port=await new Promise(resolve=>{const server=net.createServer();server.listen(0,'127.0.0.1',()=>{const port=server.address().port;server.close(()=>resolve(port));});});
const php=spawn('php',['-S',`127.0.0.1:${port}`,'-t',process.env.CANONICAL_DOCUMENT_ROOT || 'canonical/public'],{env:{...process.env,YA_SITE_API_ORIGIN:api.origin},stdio:'ignore'});
let proxy,browser;const results=[];
const fits=async page=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow');
try{
  for(let i=0;i<80;i++){try{await fetch(`http://127.0.0.1:${port}/`);break;}catch{await new Promise(resolve=>setTimeout(resolve,50));}}
  proxy=await proxyServer(`http://127.0.0.1:${port}`,api.origin);const base=proxy.origin;
  browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/usr/bin/brave',args:['--no-sandbox','--disable-gpu']});
  const scenario=async(name,run,{identity,width=390}={})=>{
    if(process.env.TEST_FILTER&&!name.includes(process.env.TEST_FILTER))return;
    Object.assign(state,commerceState());const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
    if(identity)await context.addCookies([{name:'TEST_identity',value:identity,url:base,httpOnly:true}]);
    await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():new URL(route.request().url()).hostname==='images.example.com'?route.fulfill({contentType:'image/webp',body:logo}):route.abort());
    const page=await context.newPage(),runtimeErrors=[];page.on('pageerror',error=>runtimeErrors.push(error.message));
    try{await run(page,context);assert.deepEqual(runtimeErrors,[],'uncaught browser errors');assert.equal(state.fixtureError,undefined,state.fixtureError?.stack);results.push(name);console.log('PASS',name);}catch(error){if(runtimeErrors.length)console.error('Browser errors',name,runtimeErrors);throw error;}finally{await context.close();}
  };
  const catalog=async page=>{await page.goto(base+'/?page=catalog');await expect(page.locator('#product-grid article').first()).toBeVisible();};
  const add=async page=>page.locator('#product-grid article').first().getByRole('button',{name:'Sepete ekle',exact:true}).click();
  const checkout=async page=>{await add(page);await page.locator('#open-checkout').click();await page.locator('#buyer-phone').fill('+905550000000');};
  await scenario('catalog workbench excludes long card text and supports category search and image cart',async page=>{
    state.products[0].description = 'TEST_LONG_DESCRIPTION_ONLY_FOR_PRODUCT_DETAIL_12345';
    await page.setViewportSize({width:1440,height:1000});
    await catalog(page);
    await expect(page.locator('.store-header h1')).toHaveCount(1);
    await expect(page.locator('#products h2')).toHaveCount(0);
    await expect(page.locator('.product-card .description')).toHaveCount(0);
    await expect(page.locator('.product-card').first()).not.toContainText('TEST_LONG_DESCRIPTION_ONLY_FOR_PRODUCT_DETAIL_12345');
    await expect(page.locator('.catalog-filter-rail')).toBeVisible();
    await expect(page.locator('.cart-panel')).toBeVisible();
    const structure = await page.evaluate(()=>({cols:getComputedStyle(document.querySelector('.store-layout')).gridTemplateColumns.split(' ').length,filter:getComputedStyle(document.querySelector('.catalog-filter-rail')).position,cart:getComputedStyle(document.querySelector('.cart-panel')).position}));
    assert.equal(structure.cols,3);
    assert.equal(structure.filter,'sticky');
    assert.equal(structure.cart,'sticky');
    await page.locator('#category-query').fill('Pomp');
    await expect(page.locator('#category-options .category-option')).toHaveCount(1);
    await page.locator('#category-options .category-option').click();
    await expect(page.locator('#catalog-category')).toHaveValue('c1');
    await expect(page.locator('#product-grid article')).toHaveCount(1);
    await expect(page.locator('#category-selected')).toContainText('TEST Pompalar');
    await page.locator('#category-selected button').click();
    await expect(page.locator('#catalog-category')).toHaveValue('');
    await expect(page.locator('#product-grid article')).toHaveCount(state.products.length);
    await page.locator('[data-product-link]').first().click();
    await expect(page.locator('#product-detail')).toContainText('TEST_LONG_DESCRIPTION_ONLY_FOR_PRODUCT_DETAIL_12345');
    await page.locator('#product-detail a').first().click();
    await add(page);
    await expect(page.locator('#cart-lines .cart-line-thumb img')).toHaveCount(1);
    await expect(page.locator('#header-cart-count')).toHaveText('1');
    await page.locator('.header-cart-link').click();
    await expect(page).toHaveURL(/#cart/);
    await fits(page);
  },{width:1440});
  await scenario('guest tab switch retains published catalog cart and filters without refetch',async page=>{
    await catalog(page);
    await expect.poll(()=>page.evaluate(()=>window.YaAccount.state.status)).toBe('guest');
    await add(page);
    await page.locator('#catalog-search').fill('TEST');
    const before=state.requests.filter(request=>request.path==='catalog').length;
    await page.evaluate(()=>{
      window.__stablePublicProduct=document.querySelector('#product-grid article');
      Object.defineProperty(document,'hidden',{configurable:true,value:true});
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect(page.locator('#product-grid article')).toHaveCount(state.products.length);
    await expect(page.locator('#cart-count')).toHaveText('1');
    await expect(page.locator('#catalog-search')).toHaveValue('TEST');
    await page.evaluate(()=>{
      Object.defineProperty(document,'hidden',{configurable:true,value:false});
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect.poll(()=>page.evaluate(()=>window.YaAccount.state.status)).toBe('guest');
    await page.waitForTimeout(120);
    await expect(page.locator('#product-grid article')).toHaveCount(state.products.length);
    await expect(page.locator('#cart-count')).toHaveText('1');
    assert.equal(state.requests.filter(request=>request.path==='catalog').length,before,'public catalog must not refetch after tab switch');
    assert.equal(await page.evaluate(()=>document.querySelector('#product-grid article')===window.__stablePublicProduct),true,'visible product DOM should remain stable');
  });
  await scenario('dealer tab switch fences private prices and revalidates on return',async page=>{
    await catalog(page);
    await expect.poll(()=>page.evaluate(()=>window.YaAccount.state.status)).toBe('authenticated');
    await expect(page.locator('#product-grid article').first().locator('.price')).toContainText('80,00');
    await page.evaluate(()=>{
      Object.defineProperty(document,'hidden',{configurable:true,value:true});
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect(page.locator('#product-grid article')).toHaveCount(0);
    await expect.poll(()=>page.evaluate(()=>window.YaAccount.state.status)).toBe('unavailable');
    await page.evaluate(()=>{
      Object.defineProperty(document,'hidden',{configurable:true,value:false});
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect.poll(()=>page.evaluate(()=>window.YaAccount.state.status)).toBe('authenticated');
    await expect(page.locator('#product-grid article').first().locator('.price')).toContainText('80,00');
  },{identity:'a'});
  await scenario('unconfigured optional account allows guest retail checkout',async page=>{
    await page.route('**/api/account/refresh.php',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({ok:false,code:'account_unconfigured'})}));
    await page.goto(base+'/?page=catalog');
    await expect(page.locator('#product-grid article').first()).toBeVisible();
    await expect.poll(()=>page.evaluate(()=>window.YaAccount?.state.status)).toBe('guest');
    await expect(page.locator('#product-grid article')).toHaveCount(state.products.length);
    await expect(page.locator('#product-grid article').first().locator('.price')).toContainText('100,00');
    await expect(page.locator('#catalog-state')).toBeHidden();
    await checkout(page);
    await expect(page.locator('#cart-count')).toHaveText('1');
    await page.locator('#buyer-name').fill('TEST Misafir');
    await page.locator('#submit-order').click();
    await expect(page.locator('#success')).toBeVisible();
    assert.equal(state.requests.filter(call=>call.path==='order').length,1);
    assert.equal(state.requests.filter(call=>call.path==='dealer/order').length,0);
  });
  await scenario('ambiguous account outage keeps checkout closed without verified guest',async page=>{
    await page.route('**/api/account/refresh.php',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({ok:false,code:'temporary_unavailable'})}));
    await page.goto(base+'/?page=catalog');
    await expect(page.locator('#product-grid article').first()).toBeVisible();
    await expect.poll(()=>page.evaluate(()=>window.YaAccount?.state.status)).toBe('unavailable');
    await expect(page.locator('#product-grid article')).toHaveCount(state.products.length);
    await expect(page.locator('#catalog-state')).toContainText('Hesap şu anda doğrulanamıyor');
    await expect(page.locator('#product-grid article').first().getByRole('button',{name:'Sepete ekle'})).toBeDisabled();
    await expect(page.locator('#open-checkout')).toBeDisabled();
  });
  await scenario('expired dealer session falls back to retail without private prices',async page=>{
    await catalog(page);
    await expect(page.locator('#product-grid article').first().locator('.price')).toContainText('80,00');
    await add(page);
    await page.route('**/api/account/session.php',route=>route.fulfill({status:401,contentType:'application/json',body:JSON.stringify({ok:false,code:'login_required'})}));
    await page.route('**/api/account/refresh.php',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({ok:false,code:'account_unconfigured'})}));
    await page.evaluate(()=>window.YaAccount.refresh());
    await expect.poll(()=>page.evaluate(()=>window.YaAccount?.state.status)).toBe('guest');
    await expect(page.locator('#product-grid article').first().locator('.price')).toContainText('100,00');
    await expect(page.locator('#product-grid')).not.toContainText('80,00');
    await expect(page.locator('#cart-count')).toHaveText('0');
    await expect(page.locator('#product-grid article').first().getByRole('button',{name:'Sepete ekle'})).toBeEnabled();
    assert.ok(state.requests.filter(call=>call.path==='dealer/catalog').length>0);
  },{identity:'a'});
  await scenario('failed private account refresh never leaves private prices visible',async page=>{
    await catalog(page);
    await expect(page.locator('#product-grid article').first().locator('.price')).toContainText('80,00');
    await page.route('**/api/account/session.php',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({ok:false,code:'account_unconfigured'})}));
    await page.evaluate(()=>window.YaAccount.refresh());
    await expect.poll(()=>page.evaluate(()=>window.YaAccount?.state.status)).toBe('unavailable');
    await expect(page.locator('#product-grid article').first().locator('.price')).toContainText('100,00');
    await expect(page.locator('#product-grid')).not.toContainText('80,00');
    await expect(page.locator('#open-checkout')).toBeDisabled();
  },{identity:'a'});
  for(const identity of [undefined,'retail','a','b'])await scenario('one canonical catalog '+(identity||'guest'),async page=>{
    await catalog(page);await expect(page.locator('.ya-storefront')).toHaveCount(1);await expect(page.locator('#cart')).toHaveCount(1);await expect(page.locator('#checkout-form')).toHaveCount(1);
    await expect(page.locator('#dealer-store')).toHaveCount(0);
    const privatePrice=identity==='a'?'80,00':identity==='b'?'60,00':'100,00';
    await expect(page.locator('#product-grid article').first().locator('.price')).toContainText(privatePrice);
    await add(page);await expect(page.locator('#cart-count')).toHaveText('1');await expect(page.locator('#cart-lines .cart-line')).toHaveCount(1);
    if(identity==='a'||identity==='b')assert.ok(state.requests.some(call=>call.path==='dealer/catalog'));
    else assert.equal(state.requests.some(call=>call.path==='dealer/catalog'),false);
    await fits(page);
  },{identity});
  for(const identity of [undefined,'a'])await scenario('cart survives detail account and reload navigation '+(identity||'guest'),async page=>{
    await catalog(page);await add(page);await page.locator('#product-grid [data-product-link]').first().click();await expect(page.locator('#product-detail')).toBeVisible();await expect(page.locator('#cart-count')).toHaveText('1');await page.goto(base+'/?page=account');await page.goto(base+'/?page=catalog');await expect(page.locator('#cart-count')).toHaveText('1');await page.reload();await expect(page.locator('#cart-count')).toHaveText('1');await expect(page.locator('#cart-lines .cart-line')).toHaveCount(1);
  },{identity});
  await scenario('logout from account page clears prior cart before same account login',async page=>{
    await catalog(page);await add(page);await page.goto(base+'/?page=account');await expect(page.locator('#account-profile')).toBeVisible();await page.locator('#logout').click();await expect(page.locator('#account-login')).toBeVisible();await page.locator('#account-login input[name=email]').fill('a@example.test');await page.locator('#account-login input[name=password]').fill('Fixture-account-Password123');await page.locator('#account-login button').click();await expect(page.locator('#account-profile')).toBeVisible();await page.goto(base+'/?page=catalog');await expect(page.locator('#product-grid article').first()).toBeVisible();await expect(page.locator('#cart-count')).toHaveText('0');
  },{identity:'a'});
  await scenario('pagehide clears private DOM while retaining only cart IDs and quantities',async page=>{
    await catalog(page);await add(page);await page.locator('.compare-select').nth(0).check();await page.locator('.compare-select').nth(1).check();await page.locator('#compare-open').click();await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));await expect(page.locator('#product-grid article')).toHaveCount(0);await expect(page.locator('#cart-lines')).not.toContainText('TEST Bosch Pompa');await expect(page.locator('#comparison-panel')).not.toContainText('TEST Bosch Pompa');
    const stored=await page.evaluate(()=>Object.entries(localStorage).filter(([key])=>key.includes(':cart:v2')).map(([,value])=>JSON.parse(value)));assert.equal(stored.length,1);assert.deepEqual(stored[0],{version:2,items:[{productId:'p1',quantity:1}]});await page.reload();await expect(page.locator('#cart-count')).toHaveText('1');
  },{identity:'a'});
  await scenario('real metadata filters, detail and comparison',async page=>{
    await catalog(page);
    const search=page.locator('#catalog-search');await search.fill('TEST-POM-101');await expect(page.locator('#product-grid article')).toHaveCount(1);await expect(page.locator('#product-grid')).toContainText('TEST Bosch Pompa');
    await search.fill('Kontrol');await expect(page.locator('#product-grid article')).toHaveCount(1);await expect(page.locator('#product-grid')).toContainText('TEST Kontrol Kartı');await search.fill('');await page.locator('#catalog-sku').fill('TEST-KRT-202');await expect(page.locator('#product-grid article')).toHaveCount(1);await page.locator('#catalog-sku').fill('');
    await page.locator('#catalog-category').selectOption('c1');await expect(page.locator('#product-grid article')).toHaveCount(1);await page.locator('#catalog-category').selectOption('');
    await page.locator('#catalog-brand').selectOption('TEST Siemens');await expect(page.locator('#product-grid article')).toHaveCount(1);await page.locator('#catalog-brand').selectOption('');
    await page.goto(base+'/?page=catalog&id=p1');await expect(page.locator('#product-detail')).toBeVisible();await expect(page.locator('#product-detail')).toContainText('TEST-POM-101');
    await catalog(page);await page.locator('#product-grid article').nth(0).locator('.compare-select').check();await page.locator('#product-grid article').nth(1).locator('.compare-select').check();
    await page.locator('#compare-open').click();await expect(page.locator('#comparison-panel')).toBeVisible();await expect(page.locator('#comparison-panel')).toContainText('TEST Bosch Pompa');await expect(page.locator('#comparison-panel')).toContainText('TEST Kontrol Kartı');
    await expect(page.locator('.ya-storefront')).toHaveCount(1);await fits(page);
  });
  for(const identity of ['retail','a','b'])await scenario('shared account profile and order detail '+identity,async page=>{
    await page.goto(base+'/?page=account');await expect(page.locator('#account-profile')).toBeVisible();await expect(page.locator('#dealer-store')).toHaveCount(0);await expect(page.locator('#account-orders')).toContainText('web_dealer_order_history_');
    await page.locator('#account-order-list a').first().click();await expect(page.locator('#account-order-detail')).toBeVisible();await expect(page.locator('#account-order-detail')).toContainText('TEST Bosch Pompa');
    await expect(page.locator('script[src*="portal.js"]')).toHaveCount(1);await expect(page.locator('script[src*="storefront.js"]')).toHaveCount(0);await fits(page);
  },{identity});
  await scenario('manual account history refresh uses shared backend owner',async page=>{
    await page.goto(base+'/?page=account');await expect(page.locator('#account-order-list')).toContainText('Onaylandı');state.historyStatus='fulfilled';await page.locator('#account-refresh-orders').click();await expect(page.locator('#account-order-list')).toContainText('Tamamlandı');assert.equal(state.requests.filter(call=>call.path==='account/orders').length,2);
  },{identity:'a'});
  await scenario('same account refresh preserves profile draft and private orders clear on logout',async page=>{
    await page.goto(base+'/?page=account');await expect(page.locator('#account-profile')).toBeVisible();await page.locator('#account-profile input[name=fullName]').fill('TEST unsaved profile draft');await page.evaluate(()=>window.YaAccount.refresh());await expect(page.locator('#account-profile input[name=fullName]')).toHaveValue('TEST unsaved profile draft');await page.locator('#logout').click();await expect(page.locator('#account-profile')).toBeHidden();await expect(page.locator('#account-order-list')).toBeEmpty();await expect(page.locator('#account-email')).toBeEmpty();
  },{identity:'a'});
  await scenario('late account orders cannot repaint after logout',async page=>{
    let release,started;const waiting=new Promise(resolve=>started=resolve);state.delayOrders={promise:new Promise(resolve=>release=resolve),started};await page.goto(base+'/?page=account');await waiting;await page.evaluate(()=>window.YaAccount.logout());const response=page.waitForResponse(reply=>reply.url().includes('/account/orders.php'));release();await response;await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await expect(page.locator('#account-profile')).toBeHidden();await expect(page.locator('#account-order-list')).toBeEmpty();
  },{identity:'a'});
  for(const identity of [undefined,'retail'])await scenario('shared public checkout '+(identity||'guest'),async page=>{
    await catalog(page);await checkout(page);if(!identity)await page.locator('#buyer-name').fill('TEST Alıcı');await page.locator('#buyer-phone').fill('+905550000000');await page.locator('#submit-order').click();await expect(page.locator('#success')).toBeVisible();assert.equal(state.requests.filter(call=>call.path==='order').length,1);assert.equal(state.requests.filter(call=>call.path==='dealer/order').length,0);assert.equal(state.created.length,1);
  },{identity});
  await scenario('uncertain dealer retry preserves exact payload and backend idempotency',async page=>{
    await catalog(page);await checkout(page);state.malformedNext='dealer/order';await page.locator('#submit-order').click();await expect(page.locator('#submission-message')).toContainText('doğrulanamadı');
    const first=state.requests.filter(call=>call.path==='dealer/order');assert.equal(first.length,1);await page.locator('#submit-order').click();await expect(page.locator('#success')).toBeVisible();
    const calls=state.requests.filter(call=>call.path==='dealer/order');assert.equal(calls.length,2);assert.equal(calls[0].raw,calls[1].raw);assert.equal(state.created.length,1);
  },{identity:'a'});
  for(const identity of ['a','retail'])await scenario('authenticated reload recovers lost acceptance receipt '+identity,async page=>{
    await catalog(page);await checkout(page);state.malformedNext=identity==='a'?'dealer/order':'order';await page.locator('#submit-order').click();await expect(page.locator('#submission-message')).toContainText('doğrulanamadı');
    page.on('dialog',dialog=>dialog.accept());await page.reload();await expect(page.locator('#success')).toBeVisible();assert.equal(state.created.length,1);assert.equal(state.requests.filter(call=>call.path===(identity==='a'?'dealer/order':'order')).length,1);assert.ok(state.requests.some(call=>call.path==='account/receipt'));
  },{identity});
  await scenario('guest uncertain retry replays exact body once',async page=>{
    await catalog(page);await checkout(page);await page.locator('#buyer-name').fill('TEST Alıcı');state.malformedNext='order';await page.locator('#submit-order').click();await expect(page.locator('#submission-message')).toContainText('doğrulanamadı');await page.locator('#submit-order').click();await expect(page.locator('#success')).toBeVisible();const calls=state.requests.filter(call=>call.path==='order');assert.equal(calls.length,2);assert.equal(calls[0].raw,calls[1].raw);assert.equal(state.created.length,1);
  });
  await scenario('guest reload requires matching buyer fingerprint and retains original key',async page=>{
    await catalog(page);await checkout(page);await page.locator('#buyer-name').fill('TEST Alıcı');state.malformedNext='order';await page.locator('#submit-order').click();await expect(page.locator('#submission-message')).toContainText('doğrulanamadı');const first=state.requests.find(call=>call.path==='order');page.on('dialog',dialog=>dialog.accept());await page.reload();await expect(page.locator('#checkout')).toBeVisible();await page.locator('#buyer-name').fill('TEST Changed buyer');await page.locator('#buyer-phone').fill('+905550000000');await page.locator('#submit-order').click();await expect(page.locator('#submission-message')).toContainText('eşleşmiyor');assert.equal(state.requests.filter(call=>call.path==='order').length,1);const marker=await page.evaluate(()=>Object.entries(sessionStorage).find(([key])=>key.includes(':attempt:v2'))?.[1]);assert.equal(JSON.parse(marker).key,first.payload.idempotencyKey);assert.ok(!marker.includes('TEST Alıcı')&&!marker.includes('90555'));await page.locator('#buyer-name').fill('TEST Alıcı');await page.locator('#submit-order').click();await expect(page.locator('#success')).toBeVisible();const calls=state.requests.filter(call=>call.path==='order');assert.equal(calls.length,2);assert.equal(calls[0].raw,calls[1].raw);assert.equal(state.created.length,1);
  });
  for(const code of [401,403])await scenario('private catalog '+code+' clears cart and prices',async page=>{
    await catalog(page);await add(page);await page.locator('button[data-favorite-toggle][data-product-id="p3"]').click();state.catalogStatus=code;await page.locator('#refresh').click();await expect(page.locator('#cart-count')).toHaveText('0');await expect(page.locator('#product-grid')).not.toContainText('TEST Yalnız Bayi Ürünü');await expect(page.locator('button[data-favorite-toggle][data-product-id="p3"]')).toHaveCount(0);await expect(page.locator('#cart-lines')).not.toContainText('TEST Bosch Pompa');state.catalogStatus=0;await expect(page.locator('#refresh')).toBeEnabled();await page.locator('#refresh').click();await expect(page.locator('#product-grid article').first()).toBeVisible();await expect(page.locator('#cart-count')).toHaveText('0');await expect(page.locator('button[data-favorite-toggle][data-product-id="p3"]')).toHaveAttribute('aria-pressed','true');
  },{identity:'a'});
  await scenario('offline revalidation removes private DOM and cart',async(page,context)=>{
    await catalog(page);await add(page);await context.setOffline(true);await page.locator('#refresh').click();await expect(page.locator('#product-grid article')).toHaveCount(0);await expect(page.locator('#cart-count')).toHaveText('0');await context.setOffline(false);
  },{identity:'a'});
  await scenario('logout and cross-account isolate private catalog and cart',async(page,context)=>{
    await catalog(page);await add(page);await page.locator('.compare-select').nth(0).check();await page.locator('.compare-select').nth(1).check();await page.locator('#compare-open').click();await page.evaluate(()=>window.YaAccount.logout());await expect(page.locator('#comparison-panel')).not.toContainText('TEST Bosch Pompa');await expect(page.locator('#cart-count')).toHaveText('0');await expect(page.locator('#product-grid')).not.toContainText('TEST Yalnız Bayi Ürünü');
    await page.evaluate(async()=>{await window.YaAccount.request('login',{email:'b@example.test',password:'Fixture-account-Password123'});window.YaAccount.unlock();await window.YaAccount.refresh();});await expect(page.locator('#product-grid article').first().locator('.price')).toContainText('60,00');await expect(page.locator('#cart-count')).toHaveText('0');
  },{identity:'a'});
  await scenario('account replacement clears cart before second authorized prices',async(page,context)=>{
    await catalog(page);await add(page);await context.addCookies([{name:'TEST_identity',value:'b',url:base,httpOnly:true}]);await page.evaluate(()=>window.YaAccount.refresh());await expect(page.locator('#cart-count')).toHaveText('0');await expect(page.locator('#product-grid article').first().locator('.price')).toContainText('60,00');await expect(page.locator('#cart-lines')).not.toContainText('TEST Bosch Pompa');
  },{identity:'a'});
  await scenario('late private catalog cannot repaint after logout',async(page)=>{
    await catalog(page);await add(page);let release,started;const waiting=new Promise(resolve=>started=resolve);state.delayCatalog={promise:new Promise(resolve=>release=resolve),started};await page.locator('#refresh').click();await waiting;await page.evaluate(()=>window.YaAccount.logout());const response=page.waitForResponse(reply=>reply.url().includes('/dealer/catalog.php'));release();await response;await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await expect(page.locator('#cart-count')).toHaveText('0');await expect(page.locator('#product-grid')).not.toContainText('TEST Yalnız Bayi Ürünü');
  },{identity:'a'});
  for(const identity of [undefined,'retail','a','b'])await scenario('one catalog favorites UI and ID-only scope '+(identity||'guest'),async page=>{
    await catalog(page);await expect(page.locator('button[data-favorite-toggle][data-product-id]').first()).toBeVisible();await expect(page.locator('#favorites-only')).toBeVisible();
    const favorite=page.locator('button[data-favorite-toggle][data-product-id]').first();const id=await favorite.getAttribute('data-product-id');await favorite.click();await expect(favorite).toHaveAttribute('aria-pressed','true');
    let stored=await page.evaluate(()=>Object.entries(localStorage).filter(([key])=>key.endsWith(':favorites:v1')));assert.equal(stored.length,1);let value=JSON.parse(stored[0][1]);assert.deepEqual(Object.keys(value).sort(),['productIds','version']);assert.deepEqual(value.productIds,[id]);await favorite.click();await expect(favorite).toHaveAttribute('aria-pressed','false');stored=await page.evaluate(()=>Object.entries(localStorage).filter(([key])=>key.endsWith(':favorites:v1')));assert.equal(stored.length,1);value=JSON.parse(stored[0][1]);assert.deepEqual(value.productIds,[]);await favorite.click();await expect(favorite).toHaveAttribute('aria-pressed','true');
    await page.locator('#favorites-only').check();await expect(page.locator('#product-grid article')).toHaveCount(1);await expect(page.locator('#product-grid article').first()).toHaveAttribute('data-product-id',id);await fits(page);
  },{identity});
  await scenario('favorites stay account scoped across logout account switch and offline closure',async page=>{
    await catalog(page);await page.locator('button[data-favorite-toggle][data-product-id="p1"]').click();await page.evaluate(()=>window.YaAccount.logout());await expect(page.locator('#product-grid')).not.toContainText('TEST Yalnız Bayi Ürünü');await expect(page.locator('#favorites-only')).not.toBeChecked();
    await page.locator('button[data-favorite-toggle][data-product-id="p2"]').click();await page.evaluate(async()=>{await window.YaAccount.request('login',{email:'b@example.test',password:'Fixture-account-Password123'});window.YaAccount.unlock();await window.YaAccount.refresh();});await expect(page.locator('#product-grid article').first().locator('.price')).toContainText('60,00');await expect(page.locator('button[data-favorite-toggle][data-product-id="p1"]')).toHaveAttribute('aria-pressed','false');await expect(page.locator('button[data-favorite-toggle][data-product-id="p2"]')).toHaveAttribute('aria-pressed','false');
    await page.locator('button[data-favorite-toggle][data-product-id="p3"]').click();await page.context().setOffline(true);await page.locator('#refresh').click();await expect(page.locator('#product-grid article')).toHaveCount(0);await expect(page.locator('#cart-lines')).not.toContainText('TEST Yalnız Bayi Ürünü');await page.context().setOffline(false);
  },{identity:'a'});
  for(const identity of [undefined,'a'])await scenario('catalog local pagination and filter before page '+(identity||'guest'),async page=>{
    const many=Array.from({length:38},(_,index)=>({...state.products[index%state.products.length],product_id:`page-${index+1}`,name:`TEST Sayfalı Ürün ${String(index+1).padStart(2,'0')}`,sku:`TEST-PAGE-${String(index+1).padStart(2,'0')}`,sort_order:index}));
    state.products=many;if(identity==='a')state.catalog=owner=>({access_id:owner,access_revision:1,catalog_revision:'a'.repeat(64),delivery_methods:['pickup'],products:many.map(product=>({...product,price:80}))});
    await catalog(page);await expect(page.locator('#product-grid article')).toHaveCount(18);await expect(page.locator('#catalog-page-status')).toHaveText('Sayfa 1 / 3');await add(page);await page.locator('#catalog-next').click();await expect(page.locator('#catalog-page-status')).toHaveText('Sayfa 2 / 3');await expect(page.locator('#product-grid article')).toHaveCount(18);await expect(page.locator('#cart-count')).toHaveText('1');await page.locator('#catalog-next').click();await expect(page.locator('#catalog-page-status')).toHaveText('Sayfa 3 / 3');await expect(page.locator('#product-grid article')).toHaveCount(2);await expect(page.locator('#product-grid')).toContainText('TEST Sayfalı Ürün 38');await expect(page.locator('#catalog-next')).toBeDisabled();
    await page.locator('#catalog-sku').fill('TEST-PAGE-38');await expect(page.locator('#catalog-page-status')).toHaveText('Sayfa 1 / 1');await expect(page.locator('#product-grid article')).toHaveCount(1);await expect(page.locator('#product-grid')).toContainText('TEST Sayfalı Ürün 38');await page.locator('#catalog-sku').fill('');await page.locator('#catalog-category').selectOption('c2');await page.locator('#catalog-brand').selectOption('TEST Siemens');await expect(page.locator('#catalog-page-status')).toHaveText('Sayfa 1 / 2');await expect(page.locator('#product-grid article')).toHaveCount(18);await page.locator('#catalog-next').click();await expect(page.locator('#product-grid article')).toHaveCount(1);await expect(page.locator('#product-grid')).toContainText('TEST Sayfalı Ürün 38');await page.locator('button[data-favorite-toggle][data-product-id="page-38"]').click();await page.locator('#favorites-only').check();await expect(page.locator('#catalog-page-status')).toHaveText('Sayfa 1 / 1');await expect(page.locator('#product-grid article')).toHaveCount(1);await expect(page.locator('#product-grid')).toContainText('TEST Sayfalı Ürün 38');await fits(page);
  },{identity});
  await scenario('reorder intent merges current authorized catalog skips removed and uses current prices',async page=>{
    state.historyItems=[{product_id:'p1',name:'TEST Old catalog name',quantity:2},{product_id:'p2',name:'TEST Old board name',quantity:1},{product_id:'removed-1',name:'TEST Removed item',quantity:4}];
    await catalog(page);await add(page);await page.goto(base+'/?page=account');await expect(page.locator('#account-profile')).toBeVisible();const intent=page.locator('[data-reorder-order="web_dealer_order_history_a"]');await expect(intent).toBeVisible();await expect(intent).toHaveAttribute('href',/page=catalog.*reorder=web_dealer_order_history_a.*#cart/);const before=state.requests.filter(call=>call.path==='dealer/order').length;
    await intent.click();await expect(page).toHaveURL(/page=catalog(?!.*reorder=)/);await expect(page.locator('#cart-count')).toHaveText('2');await expect(page.locator('#cart-lines .cart-line')).toHaveCount(2);await expect(page.locator('#cart-message')).toContainText('1 ürün');await expect(page.locator('#cart-lines')).toContainText('TEST Bosch Pompa');await expect(page.locator('#cart-lines')).toContainText('TEST Kontrol Kartı');await expect(page.locator('#subtotal')).toContainText('420,00');assert.equal(state.requests.filter(call=>call.path==='dealer/order').length,before);assert.equal(state.created.length,0);
    const draft=await page.evaluate(()=>Object.entries(localStorage).filter(([key])=>key.endsWith(':cart:v2')).map(([,raw])=>JSON.parse(raw)));assert.equal(draft.length,1);assert.deepEqual(draft[0],{version:2,items:[{productId:'p1',quantity:3},{productId:'p2',quantity:1}]});await fits(page);
  },{identity:'a'});
  await scenario('unresolved order attempt blocks reorder intent',async page=>{
    await catalog(page);await checkout(page);state.malformedNext='dealer/order';await page.locator('#submit-order').click();await expect(page.locator('#submission-message')).toContainText('doğrulanamadı');state.receiptStatus=503;await page.goto(base+'/?page=account');await expect(page.locator('#account-profile')).toBeVisible();const intent=page.locator('[data-reorder-order="web_dealer_order_history_a"]');await expect(intent).toHaveAttribute('aria-disabled','true');const before=state.requests.filter(call=>call.path==='account/orders').length;await intent.evaluate(node=>node.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})));await expect(page).toHaveURL(/page=account/);await expect(page.locator('#portal-message')).toContainText(/belirsiz|tekrar|bekleyen/i);assert.equal(state.requests.filter(call=>call.path==='account/orders').length,before);await page.goto(base+'/?page=catalog&reorder=web_dealer_order_history_a');await expect(page).toHaveURL(/page=catalog/);await expect(page.locator('#cart-lines .cart-line')).toHaveCount(1);await expect(page.locator('#cart-lines')).not.toContainText('TEST Kontrol Kartı');const draft=await page.evaluate(()=>Object.entries(localStorage).filter(([key])=>key.endsWith(':cart:v2')).map(([,value])=>JSON.parse(value)));assert.deepEqual(draft[0].items,[{productId:'p1',quantity:1}]);assert.equal(state.requests.filter(call=>call.path==='dealer/order').length,1);
  },{identity:'a'});
  await scenario('retail reorder keeps same public cart and current price',async page=>{
    state.historyItems=[{product_id:'p1',name:'TEST Historical pump price',quantity:2}];await page.goto(base+'/?page=account');await expect(page.locator('#account-profile')).toBeVisible();const intent=page.locator('[data-reorder-order="web_dealer_order_history_b"]');await expect(intent).toBeVisible();await intent.click();await expect(page).toHaveURL(/page=catalog(?!.*reorder=)/);await expect(page.locator('#cart-lines .cart-line')).toHaveCount(1);await expect(page.locator('#subtotal')).toContainText('200,00');assert.equal(state.requests.filter(call=>call.path==='dealer/catalog').length,0);assert.equal(state.created.length,0);
  },{identity:'retail'});
  await scenario('invalid reorder quantity merge leaves cart unchanged',async page=>{
    state.historyItems=[{product_id:'p1',name:'TEST Historical pump',quantity:1000}];await catalog(page);await add(page);const before=await page.evaluate(()=>Object.entries(localStorage).filter(([key])=>key.endsWith(':cart:v2')).map(([,value])=>value));await page.goto(base+'/?page=account');await expect(page.locator('#account-profile')).toBeVisible();await page.locator('[data-reorder-order="web_dealer_order_history_a"]').click();await expect(page.locator('#cart-message')).toContainText(/miktar|ürün/i);const after=await page.evaluate(()=>Object.entries(localStorage).filter(([key])=>key.endsWith(':cart:v2')).map(([,value])=>value));assert.deepEqual(after,before);await expect(page.locator('#cart-lines .cart-line')).toHaveCount(1);assert.equal(state.created.length,0);
  },{identity:'a'});
  await scenario('all removed reorder leaves current cart unchanged and reports count',async page=>{
    state.historyItems=[{product_id:'removed-1',name:'TEST Removed historical item',quantity:2},{product_id:'removed-2',name:'TEST Another removed item',quantity:1}];await catalog(page);await add(page);const before=await page.evaluate(()=>Object.entries(localStorage).filter(([key])=>key.endsWith(':cart:v2')).map(([,value])=>value));await page.goto(base+'/?page=account');await expect(page.locator('#account-profile')).toBeVisible();await page.locator('[data-reorder-order="web_dealer_order_history_a"]').click();await expect(page).toHaveURL(/page=catalog(?!.*reorder=)/);await expect(page.locator('#cart-lines .cart-line')).toHaveCount(1);await expect(page.locator('#cart-message')).toContainText('ürünleri artık katalogda yok');await expect(page.locator('#cart-message')).toContainText('Sepetiniz değiştirilmedi');const after=await page.evaluate(()=>Object.entries(localStorage).filter(([key])=>key.endsWith(':cart:v2')).map(([,value])=>value));assert.deepEqual(after,before);assert.equal(state.created.length,0);
  },{identity:'a'});
  for(const width of [390,1440])await scenario('language picker preserves only allowed commercial query state '+width,async page=>{
    const source=await (await fetch(base+'/?resource=translation-source')).json();state.localization={version:1,source_language:'tr',target_languages:['en'],languages:[{code:'en',locale:'en-GB',direction:'ltr',nativeName:'English'}],site_catalog:{id:source.id,entries:source.entries},translations:{site_text:{}}};
    assert.equal((await fetch(base+'/?page=catalog&id=p1&q=TEST-POM-101&sku=TEST-SKU&category=c1&brand=TEST%20Bosch&session=TEST-session&idempotencyKey=TEST-key')).status,400);await page.goto(base+'/?page=catalog&id=p1&q=TEST-POM-101&sku=TEST-SKU&category=c1&brand=TEST%20Bosch');await expect(page.locator('#product-detail')).toBeVisible();const form=page.locator('.language-picker');await expect(form.locator('input[type=hidden][name="id"]')).toHaveValue('p1');for(const [name,value]of [['page','catalog'],['q','TEST-POM-101'],['sku','TEST-SKU'],['category','c1'],['brand','TEST Bosch']])await expect(form.locator(`input[type=hidden][name="${name}"]`)).toHaveValue(value);for(const name of ['action','token','session','idempotencyKey'])await expect(form.locator(`input[name="${name}"]`)).toHaveCount(0);const languageCommit=page.waitForURL(url=>url.searchParams.get('lang')==='en');await form.locator('button[name=lang][value=en]').click();await languageCommit;const query=new URL(page.url()).searchParams;for(const [name,value]of [['page','catalog'],['id','p1'],['q','TEST-POM-101'],['sku','TEST-SKU'],['category','c1'],['brand','TEST Bosch'],['lang','en']])assert.equal(query.get(name),value);for(const name of ['action','token','session','idempotencyKey'])assert.equal(query.has(name),false);
    await page.goto(base+'/?page=catalog&q=TEST-POM-101&sku=TEST-POM-101&category=c1&brand=TEST%20Bosch');const productLink=page.locator('#product-grid [data-product-link]').first();await expect(productLink).toBeVisible();const productUrl=new URL(await productLink.getAttribute('href'),base);for(const [name,value]of [['page','catalog'],['id','p1'],['q','TEST-POM-101'],['sku','TEST-POM-101'],['category','c1'],['brand','TEST Bosch']])assert.equal(productUrl.searchParams.get(name),value);for(const name of ['action','token','session','idempotencyKey'])assert.equal(productUrl.searchParams.has(name),false);await page.locator('#catalog-search').fill('TEST');await expect(form.locator('input[type=hidden][name="q"]')).toHaveValue('TEST');
  },{width});
  for(const width of [390,1440])await scenario('language picker preserves order context without credentials '+width,async page=>{
    const source=await (await fetch(base+'/?resource=translation-source')).json();state.localization={version:1,source_language:'tr',target_languages:['en'],languages:[{code:'en',locale:'en-GB',direction:'ltr',nativeName:'English'}],site_catalog:{id:source.id,entries:source.entries},translations:{site_text:{}}};
    assert.equal((await fetch(base+'/?page=account&action=verify&session=TEST-session&idempotencyKey=TEST-key')).status,400);await page.goto(base+'/?page=account&action=verify');await expect(page.locator('#account-profile')).toBeVisible();const orderLink=page.locator('#account-order-list a').first();const orderUrl=new URL(await orderLink.getAttribute('href'),base);assert.equal(orderUrl.searchParams.get('page'),'account');assert.ok(orderUrl.searchParams.has('order'));for(const name of ['token','session','idempotencyKey'])assert.equal(orderUrl.searchParams.has(name),false);await page.goto(base+'/?page=account&order=web_dealer_order_history_a&action=verify');await expect(page.locator('#account-profile')).toBeVisible();await expect(page.locator('#account-order-detail')).toBeVisible();const detailBack=new URL(await page.locator('#account-order-detail a').first().getAttribute('href'),base);assert.equal(detailBack.searchParams.get('page'),'account');assert.equal(detailBack.searchParams.has('order'),false);for(const name of ['token','session','idempotencyKey'])assert.equal(detailBack.searchParams.has(name),false);const form=page.locator('.language-picker');await expect(form.locator('input[type=hidden][name="order"]')).toHaveValue('web_dealer_order_history_a');for(const name of ['token','session','idempotencyKey'])await expect(form.locator(`input[name="${name}"]`)).toHaveCount(0);const languageCommit=page.waitForURL(url=>url.searchParams.get('lang')==='en');await form.locator('button[name=lang][value=en]').click();await languageCommit;const query=new URL(page.url()).searchParams;assert.equal(query.get('page'),'account');assert.equal(query.get('order'),'web_dealer_order_history_a');assert.equal(query.get('action'),'verify');for(const name of ['token','session','idempotencyKey'])assert.equal(query.has(name),false);
  },{identity:'a',width});
  await scenario('legacy aliases preserve semantic parameters and fixed target',async page=>{
    for(const [path,target]of [['/urun/?id=p1&page=account','catalog'],['/sepet/?page=account','catalog'],['/katalog/?q=TEST-POM-101&category=c1&brand=TEST%20Bosch&page=account','catalog'],['/hesabim/?action=verify&page=catalog#token=TEST-token','account']]){
      await page.goto(base+path);const url=new URL(page.url());assert.equal(url.searchParams.get('page'),target,path);if(path.startsWith('/urun/'))assert.equal(url.searchParams.get('id'),'p1');if(path.startsWith('/katalog/')){assert.equal(url.searchParams.get('q'),'TEST-POM-101');assert.equal(url.searchParams.get('category'),'c1');assert.equal(url.searchParams.get('brand'),'TEST Bosch');}if(path.startsWith('/hesabim/')){assert.equal(url.searchParams.get('action'),'verify');await expect(page.locator('#account-token')).toBeVisible();}
    }
  });
  for(const width of [390,1440])await scenario('catalog account order-detail screenshots '+width,async page=>{
    await catalog(page);await fits(page);await page.screenshot({path:artifacts+'catalog-'+width+'.png',fullPage:true});await add(page);await expect(page.locator('#cart-lines .cart-line')).toHaveCount(1);await fits(page);await page.screenshot({path:artifacts+'cart-'+width+'.png',fullPage:true});await page.goto(base+'/?page=account');await expect(page.locator('#account-profile')).toBeVisible();await expect(page.locator('#account-order-list')).toContainText('web_dealer_order_history_');await fits(page);await page.screenshot({path:artifacts+'account-'+width+'.png',fullPage:true});await page.locator('#account-order-list a').first().click();await expect(page.locator('#account-order-detail')).toBeVisible();await fits(page);await page.screenshot({path:artifacts+'order-detail-'+width+'.png',fullPage:true});
  },{identity:'a',width});
  console.log(JSON.stringify({passed:results.length,results,artifacts},null,2));
}finally{await browser?.close();proxy?.server.closeAllConnections();api.server.closeAllConnections();await new Promise(resolve=>proxy?proxy.server.close(resolve):resolve());await new Promise(resolve=>api.server.close(resolve));php.kill('SIGTERM');}
