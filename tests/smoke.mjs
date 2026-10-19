// Run with: node tests/smoke.mjs (uses existing local Playwright and Brave, no browser download)
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire('/home/raistlin/YardimciAsistan/package.json');
const {chromium}=require('playwright');
const base='https://yardimciasistantoptanci.alwaysdata.net';
const mockBusiness={ok:true,business:{display_name:'Teknikel',public_surfaces:['store']}};
const mockCatalog={ok:true,enabled:true,categories:[{id:'c1',name:'Pompalar'},{id:'c2',name:'Elektronik Kartlar'}],products:[
 {product_id:'p1',name:'Wilo Pompa Modeli',sku:'POM-101',description:'Pompa açıklaması',category_id:'c1',price:199.99,currency:'TRY',image_url:''},
 {product_id:'p2',name:'Kontrol Kartı',sku:'KRT-202',description:'Kart açıklaması',category_id:'c2',price:389.10,currency:'TRY',image_url:''}]};
const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/brave',args:['--no-sandbox','--disable-gpu']});
let tested=0;
try{
 for(const width of [320,390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:860}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/yardimci-asistan/api/business.php',route=>route.fulfill({json:mockBusiness}));
  await page.route('**/yardimci-asistan/api/catalog.php',route=>route.fulfill({json:mockCatalog}));
  await page.goto(base+'/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('[data-featured-grid]')?.children.length===2);
  const actual=await page.evaluate(()=>document.documentElement.scrollWidth);
  assert.ok(actual<=width,'overflow '+width+': '+actual);
  assert.equal(await page.locator('[data-featured-grid] .product-card').count(),2);
  assert.equal(errors.length,0,'page errors: '+errors.join(','));
  await page.goto(base+'/katalog/?q=Pompa');
  await page.waitForFunction(()=>document.querySelector('[data-product-grid]')?.children.length===1);
  assert.match(await page.locator('[data-product-grid]').innerText(),/Wilo Pompa/);
  await page.locator('#catalog-query').fill('Kart');
  await page.waitForFunction(()=>document.querySelector('[data-product-grid]')?.innerText.includes('Kontrol Kartı'));
  assert.equal(await page.locator('[data-product-grid] .product-card').count(),1);
  await page.goto(base+'/urun/?id=p2');
  await page.waitForFunction(()=>document.querySelector('[data-product-detail] h1')?.innerText==='Kontrol Kartı');
  assert.match(await page.locator('[data-product-detail] .price').innerText(),/389/);
  assert.equal(errors.length,0,'page errors after navigation: '+errors.join(','));
  await page.close();console.log('PASS',width+'px','home/catalog/search/detail');
  tested++;
 }
 const page=await browser.newPage();
 await page.route('**/yardimci-asistan/api/business.php',route=>route.fulfill({json:{ok:true,business:{public_surfaces:[]}}}));
 await page.route('**/yardimci-asistan/api/catalog.php',route=>route.fulfill({json:mockCatalog}));
 await page.goto(base+'/katalog/');
 await page.waitForFunction(()=>document.querySelector('[data-catalog-state]')?.innerText.includes('yayında değil'));
 assert.equal(await page.locator('[data-product-grid] .product-card').count(),0);
 console.log('PASS unpublished store remains hidden');tested++;
 await page.close();
}finally{await browser.close();}
console.log(tested+' browser scenarios completed.');
