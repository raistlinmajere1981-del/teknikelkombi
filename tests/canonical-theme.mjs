import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import net from 'node:net';
import {mkdir,readFile} from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
import {fixtureServer,proxyServer,freshState} from './fixtures/canonical-api.mjs';
const artifacts=new URL('../.test-artifacts/canonical/',import.meta.url).pathname;
await mkdir(artifacts,{recursive:true});
const logo=await readFile(new URL('../canonical/public/assets/site/brand/logo.webp',import.meta.url));
const state=freshState(),api=await fixtureServer(state);
const port=await new Promise(resolve=>{const s=net.createServer();s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p));});});
const php=spawn('php',['-S',`127.0.0.1:${port}`,'-t','.'],{env:{...process.env,YA_SITE_API_ORIGIN:api.origin,YA_SITE_PUBLIC_ORIGIN:'https://teknikel.test'},stdio:'ignore'});
let proxy,browser;const results=[];
const reset=()=>Object.assign(state,freshState());
const fits=async page=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow');
try {
  for(let i=0;i<80;i++){try{await fetch(`http://127.0.0.1:${port}/`);break;}catch{await new Promise(r=>setTimeout(r,50));}}
  proxy=await proxyServer(`http://127.0.0.1:${port}`,api.origin);const base=proxy.origin;
  browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || '/usr/bin/brave',args:['--no-sandbox','--disable-gpu']});
  const scenario=async(name,run,options={})=>{reset();const context=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce',...options});
    await context.route('**/*',route=>/^https:\/\/images\.example\.com\/TEST-.*\.webp$/.test(route.request().url())?route.fulfill({contentType:'image/webp',body:logo}):new URL(route.request().url()).origin===base?route.continue():route.abort());
    const page=await context.newPage();try{await run(page);results.push(name);console.log('PASS',name);}finally{await context.close();}};
  await scenario('SSR publication gates',async page=>{
    for(const mode of ['surface-off','enabled-off','zero','catalog-error','business-error']){
      reset();if(mode==='surface-off')state.surfaces=[];if(mode==='enabled-off')state.enabled=false;if(mode==='zero')state.products=[];if(mode==='catalog-error')state.catalogError=true;if(mode==='business-error')state.businessError=true;
      const response=await page.goto(base+'/?page=catalog');assert.equal(response.status(),404,mode);
      await expect(page.locator('a[href*="page=catalog"]')).toHaveCount(0);
      await page.goto(base+'/');await expect(page.locator('#catalog-preview')).toHaveCount(0);
    }
    reset();await page.goto(base+'/');await expect(page.locator('#catalog-preview')).toBeVisible();
  });
  await scenario('AI off general request uses canonical form',async page=>{
    await page.goto(base+'/');await page.locator('[data-ya-open]').click();
    await expect(page.locator('[data-ya-view="info"], [data-ya-view="voice"]')).toHaveCount(0);
    await page.locator('[data-ya-request-type="general_info"]').click();
    await expect(page.locator('#yardimci-asistan-widget input[name="customer_name"]')).toBeVisible();
    await expect(page.locator('#yardimci-asistan-widget [data-ya-open-date-picker],#yardimci-asistan-widget input[type="date"]')).toHaveCount(0);
    await expect(page.locator('#yardimci-asistan-widget')).toHaveCount(1);
  });
  await scenario('all actions off hides launcher',async page=>{state.requests=false;await page.goto(base+'/');await expect(page.locator('[data-ya-open]')).toBeHidden();});
  await scenario('account remains available with orders off',async page=>{state.delivery=[];const response=await page.goto(base+'/?page=account');assert.equal(response.status(),200);await expect(page.locator('script[src*="portal.js"]')).toHaveCount(1);await expect(page.locator('script[src*="storefront.js"]')).toHaveCount(0);});
  await scenario('catalog cart uses single canonical owner',async page=>{await page.goto(base+'/?page=catalog');await expect(page.locator('#product-grid article')).toHaveCount(2);await page.locator('#product-grid article').first().getByRole('button',{name:'Sepete ekle',exact:true}).click();await expect(page.locator('#cart-count')).toHaveText('1');await expect(page.locator('#cart-lines li')).toHaveCount(1);await expect(page.locator('script[src*="storefront.js"]')).toHaveCount(1);await expect(page.locator('#cart')).toHaveCount(1);});
  for(const width of [320,390,768,1440])await scenario(`responsive ${width}`,async page=>{
    await page.setViewportSize({width,height:1000});await page.goto(base+'/');await expect(page.locator('h1')).toHaveText('Parçayı bulun. Detayını inceleyin.');await expect(page.locator('.teknikel-hero')).toBeVisible();await fits(page);
    if(width<768){const toggle=page.locator('[data-menu-toggle]');await toggle.focus();await page.keyboard.press('Enter');await expect(toggle).toHaveAttribute('aria-expanded','true');await page.keyboard.press('Escape');await expect(toggle).toHaveAttribute('aria-expanded','false');}
    await page.screenshot({path:`${artifacts}home-${width}.png`,fullPage:true});await page.goto(base+'/?page=catalog');await expect(page.locator('#product-grid article')).toHaveCount(2);await fits(page);await page.screenshot({path:`${artifacts}catalog-${width}.png`,fullPage:true});
  });
  await scenario('no JavaScript preserves SSR and navigation',async page=>{await page.goto(base+'/');await expect(page.locator('.teknikel-hero')).toBeVisible();await expect(page.locator('#main-navigation')).toBeVisible();await expect(page.locator('#catalog-preview')).toContainText('TEST Bosch Pompa');await fits(page);},{javaScriptEnabled:false});
  await scenario('published RTL language and stale hash Turkish fallback',async page=>{
    const source=await (await fetch(base+'/?resource=translation-source')).json();
    const key=Object.keys(source.entries).find(key=>source.entries[key].text==='Parçayı bulun. Detayını inceleyin.');assert.ok(key);
    state.localization={version:1,source_language:'tr',target_languages:['ar'],languages:[{code:'ar',locale:'ar',direction:'rtl',nativeName:'العربية'}],site_catalog:{id:source.id,entries:source.entries},translations:{site_text:{[source.id+':'+key]:{ar:{text:'TEST قطعة منشورة'}}}}};
    await page.goto(base+'/?lang=ar');await expect(page.locator('html')).toHaveAttribute('dir','rtl');await expect(page.locator('html')).toHaveAttribute('lang','ar');await expect(page.locator('h1')).toHaveText('TEST قطعة منشورة');await fits(page);
    await page.screenshot({path:`${artifacts}home-rtl-390.png`,fullPage:true});
    state.localization.site_catalog.entries[key].hash='0'.repeat(64);await page.reload();await expect(page.locator('h1')).toHaveText('Parçayı bulun. Detayını inceleyin.');
  });
  const fullPublication=()=>{
    state.surfaces=['store','directions'];state.business={about_text:'TEST Yayınlanmış işletme açıklaması',phone:'+90 555 000 00 00',email:'test@example.test',address:'TEST Yayın Adresi',whatsapp_enabled:true,whatsapp:'+90 555 000 00 00',google_reviews_enabled:true,dealer_application_enabled:true,requests_enabled:true,request_types:['general_info','dealer_application'],gallery:[{id:'TEST-media-1',kind:'photo',url:'https://images.example.com/TEST-media-1.webp',title:'TEST Logo medya 1'},{id:'TEST-media-2',kind:'photo',url:'https://images.example.com/TEST-media-2.webp',title:'TEST Logo medya 2'}]};
    state.announcements=[{id:'TEST-announcement',published:true,channel:'website',title:'TEST Yayınlanmış Duyuru',text:'TEST yayın metni'}];state.reviews=[{author:'TEST Yorumcu',text:'TEST Yayınlanmış yorum',published:true}];
  };
  for(const width of [390,1440])await scenario(`conditional home blocks and gallery media ${width}`,async page=>{
    fullPublication();await page.setViewportSize({width,height:1000});await page.goto(base+'/');
    for(const selector of ['.announcement-strip','.about-preview','.dealer-callout','.review-card','.contact-preview','[aria-labelledby="discover-title"]'])await expect(page.locator(selector)).toBeVisible();
    await expect(page.locator('.about-preview')).toContainText('TEST Yayınlanmış işletme açıklaması');await expect(page.locator('.announcement-strip')).toContainText('TEST Yayınlanmış Duyuru');await expect(page.locator('.review-card')).toContainText('TEST Yayınlanmış yorum');
    await expect(page.locator('[data-brand-section],[data-category-section],[data-category-grid]')).toHaveCount(0);await fits(page);await page.screenshot({path:`${artifacts}home-full-${width}.png`,fullPage:true});
    await page.goto(base+'/?page=gallery');const images=page.locator('main img');await expect(images).toHaveCount(2);await expect.poll(()=>images.evaluateAll(nodes=>nodes.every(image=>image.complete&&image.naturalWidth>0))).toBe(true);
    assert.deepEqual(await images.evaluateAll(nodes=>nodes.map(image=>new URL(image.src).pathname)),['/TEST-media-1.webp','/TEST-media-2.webp']);await fits(page);
    reset();await page.goto(base+'/');await expect(page.locator('.announcement-strip,.about-preview,.dealer-callout,.review-card,.contact-preview,[aria-labelledby="discover-title"]')).toHaveCount(0);
  });
  await scenario('support actions retain existing DOM in intended order',async page=>{
    fullPublication();state.business.ai_enabled=true;await page.goto(base+'/');await page.locator('[data-ya-open]').click();
    const buttons=page.locator('.ya-widget-actions button');await expect(buttons).toHaveCount(6);
    await expect.poll(()=>buttons.evaluateAll(nodes=>nodes.map(node=>node.dataset.yaRequestType||node.dataset.yaView))).toEqual(['general_info','dealer_application','whatsapp','directions','info','info']);
    await expect(page.locator('.ya-widget-view-title')).toHaveText('Merhaba, ben Nexa.');
    await page.evaluate(()=>{window.testActionNodes=[...document.querySelectorAll('.ya-widget-actions button')];const root=document.querySelector('#yardimci-asistan-widget');root.append(document.createComment('TEST observer mutation'));});
    await page.waitForFunction(()=>window.testActionNodes.every((node,index)=>node===document.querySelectorAll('.ya-widget-actions button')[index]));
    await page.locator('[data-ya-request-type="general_info"]').click();await expect(page.locator('input[name="customer_name"]')).toBeVisible();await expect(page.locator('[data-ya-open-date-picker]')).toHaveCount(0);await page.screenshot({path:`${artifacts}widget-general-390.png`,fullPage:true});
  });
  await scenario('invalid media and API HTML remain inert',async page=>{
    const attack='<img src=x onerror="window.TESTInjection=true">';fullPublication();state.business.about_text=attack;state.business.gallery=[{id:'TEST-invalid',kind:'photo',url:'javascript:alert(1)',title:attack}];state.announcements[0].title=attack;state.reviews[0].text=attack;
    await page.goto(base+'/');await expect(page.locator('.about-preview')).toContainText(attack);await expect(page.locator('.announcement-strip')).toContainText(attack);await expect(page.locator('.review-card')).toContainText(attack);await expect(page.locator('main a[href*="page=gallery"]')).toHaveCount(0);await expect(page.locator('img[src="x"],a[href^="javascript:"]')).toHaveCount(0);assert.equal(await page.evaluate(()=>window.TESTInjection),undefined);assert.equal((await page.goto(base+'/?page=gallery')).status(),404);
  });
  await scenario('site favicon origin SEO projection and media withdrawal',async page=>{
    const provenance=await readFile(new URL('../canonical/public/assets/site/SOURCES.md',import.meta.url),'utf8');assert.match(provenance,/brand\/favicon\.svg/);assert.match(provenance,/assets\/favicon\.svg/);
    fullPublication();state.businessPublication={enabled:true,fields:['business_name','gallery']};await page.goto(base+'/');const icon=page.locator('link[rel~="icon"]');await expect(icon).toHaveCount(1);assert.match(await icon.getAttribute('href'),/\/assets\/site\/brand\/favicon\.svg$/);const iconResponse=await page.request.get(base+await icon.getAttribute('href'));assert.equal(iconResponse.status(),200);assert.match(await iconResponse.text(),/<svg\b/);
    const canonical=page.locator('link[rel=canonical]');await expect(canonical).toHaveAttribute('href','https://teknikel.test/?page=home&lang=tr');const graph=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());assert.ok(JSON.stringify(graph).includes('https://teknikel.test/'));assert.ok(JSON.stringify(graph).includes('/TEST-media-1.webp'));
    const hostile=await page.request.get(base+'/',{headers:{host:'attacker.example','x-forwarded-host':'attacker.example'}});assert.match(await hostile.text(),/href="https:\/\/teknikel\.test\//);assert.doesNotMatch(await hostile.text(),/attacker\.example/);const sitemap=await page.request.get(base+'/sitemap.xml');assert.equal(sitemap.status(),200);assert.match(await sitemap.text(),/https:\/\/teknikel\.test\//);assert.doesNotMatch(await sitemap.text(),/127\.0\.0\.1|attacker\.example/);
    state.business.gallery=[];const galleryResponse=await page.goto(base+'/?page=gallery');assert.equal(galleryResponse.status(),404);await page.goto(base+'/');await expect(page.locator('a[href*="page=gallery"]')).toHaveCount(0);const withdrawn=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());assert.ok(!JSON.stringify(withdrawn).includes('TEST-media-1.webp'));
  });
  console.log(JSON.stringify({passed:results.length,results,artifacts},null,2));
} finally {await browser?.close();await new Promise(r=>proxy?proxy.server.close(r):r());await new Promise(r=>api.server.close(r));php.kill('SIGTERM');}
