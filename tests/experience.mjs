import assert from 'node:assert/strict';
import {expect} from '@playwright/test';
import {campaignPublication} from './fixtures/api.mjs';

const name = 'TEST Bosch Pompa', other = 'TEST Kontrol Kartı';
const inspector = page => page.getByRole('dialog',{name:'Ürün ve görsel karşılaştırma',exact:true});
async function ready(page) { const modal = inspector(page); await expect(modal).toBeVisible(); await expect(modal.locator('.compare-info table')).toBeVisible(); await expect(modal.getByRole('button',{name:'Yayını yenile',exact:true})).toBeEnabled(); return modal; }
async function range(locator,value) { await locator.fill(String(value)); await locator.dispatchEvent('input'); }
async function imageStyle(locator,property) { return locator.evaluate((img,key) => img.style[key],property); }
async function personalPhoto(page) {
  const encoded = await page.evaluate(() => { const canvas = document.createElement('canvas'); canvas.width = 480; canvas.height = 320; const ctx = canvas.getContext('2d'); ctx.fillStyle = '#abc'; ctx.fillRect(0,0,480,320); ctx.fillStyle = '#345'; ctx.fillRect(60,60,100,100); return canvas.toDataURL('image/png').split(',')[1]; });
  return {name:'PRIVATE-device-part.png',mimeType:'image/png',buffer:Buffer.from(encoded,'base64')};
}
export async function experienceScenarios({scenario,base,login,fits,noPersonalStorage}) {
  for (const width of [320,390,768,1440]) await scenario('comparison: public products, multi-photo, tools, local privacy and filter continuity',width,async ({page,backend,context}) => {
    backend.public[1].image_urls = [backend.public[1].image_url,'https://images.example.com/board-back.jpg'];
    backend.public[0].manufacturer_part_code = 'TEST-MFG-101'; backend.public[0].model = 'TEST Model';
    await page.goto(base+'/magaza/?q=TEST-POM&category=c1');
    await page.getByRole('button',{name:name+' karşılaştır',exact:true}).click();
    const modal = await ready(page), left = modal.locator('[data-compare-side="0"]'), right = modal.locator('[data-compare-side="1"]');
    await expect(left.locator('.compare-thumb')).toHaveCount(3);
    await left.locator('.compare-thumb').nth(1).click(); await expect(left.locator('.compare-viewport>img')).toHaveAttribute('src',/pump-back/);
    await modal.getByLabel('İkinci ürünü katalogda ara',{exact:true}).fill('TEST-KRT'); await modal.getByRole('button',{name:other,exact:true}).click();
    await expect(right.locator('.compare-thumb')).toHaveCount(2); await right.locator('.compare-thumb').nth(1).click();
    await expect(right.locator('.compare-viewport>img')).toHaveAttribute('src',/board-back/);
    await expect(modal.locator('tr[data-field="manufacturer_part_code"]')).toContainText('TEST-MFG-101');
    await expect(modal.locator('tr[data-field="manufacturer_part_code"]')).toContainText('Yayınlanmamış');
    await expect(modal.locator('tr[data-field="price"]')).toHaveClass('is-different');
    await expect(modal.locator('tr[data-field="price"]')).toContainText('100,00');
    await modal.getByRole('button',{name:'Sol görseli yakınlaştır',exact:true}).click();
    assert.match(await imageStyle(left.locator('.compare-viewport>img'),'transform'),/scale\(1.25, 1.25\)/);
    assert.match(await imageStyle(right.locator('.compare-viewport>img'),'transform'),/scale\(1.25, 1.25\)/);
    await modal.getByLabel('Eş zamanlı zoom',{exact:false}).uncheck();
    await modal.getByRole('button',{name:'Sol görseli yakınlaştır',exact:true}).click();
    assert.match(await imageStyle(right.locator('.compare-viewport>img'),'transform'),/scale\(1.25, 1.25\)/);
    await modal.getByLabel('Eş zamanlı zoom',{exact:false}).check();
    assert.match(await imageStyle(right.locator('.compare-viewport>img'),'transform'),/scale\(1.5625, 1.5625\)/);
    await left.getByRole('button',{name:'Döndür',exact:true}).click(); await left.getByRole('button',{name:'Yatay çevir',exact:true}).click(); await left.getByRole('button',{name:'Dikey çevir',exact:true}).click();
    assert.match(await imageStyle(left.locator('.compare-viewport>img'),'transform'),/rotate\(90deg\).*scale\(-1.5625, -1.5625\)/);
    await left.getByLabel('Sol görsel filtresi',{exact:true}).selectOption('negative'); await range(left.getByLabel('Sol görsel kontrastı',{exact:true}),170);
    assert.equal(await imageStyle(left.locator('.compare-viewport>img'),'filter'),'invert(1) contrast(170%)');
    await right.getByLabel('Sağ görsel filtresi',{exact:true}).selectOption('gray');
    await modal.getByRole('button',{name:'Üst üste',exact:true}).click(); await range(modal.getByLabel('Şeffaflık',{exact:true}),35);
    assert.equal(await imageStyle(right.locator('.compare-viewport>img'),'opacity'),'0.35');
    await expect(modal.locator('.compare-workspace')).toHaveClass(/is-overlay/);
    await modal.getByLabel('Düzenlenen katman',{exact:true}).selectOption('1');
    const viewport = right.locator('.compare-viewport'); await viewport.scrollIntoViewIfNeeded(); const bounds = await viewport.boundingBox();
    await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2); await page.mouse.down(); await page.mouse.move(bounds.x+bounds.width/2+24,bounds.y+bounds.height/2+16,{steps:4}); await page.mouse.up();
    assert.match(await imageStyle(right.locator('.compare-viewport>img'),'transform'),/translate\(24px, 16px\)/);
    await right.getByRole('button',{name:'Hizala',exact:true}).click(); assert.match(await imageStyle(right.locator('.compare-viewport>img'),'transform'),/translate\(0px, 0px\)/);
    await modal.getByRole('button',{name:'Orijinale dön',exact:true}).click();
    for (const pane of [left,right]) { assert.match(await imageStyle(pane.locator('.compare-viewport>img'),'transform'),/rotate\(0deg\) scale\(1, 1\)/); assert.equal(await imageStyle(pane.locator('.compare-viewport>img'),'filter'),'none'); }
    // Personal file, filters and pan must produce no POST, upload, file-path URL or storage.
    const start = backend.requests.length, network = []; context.on('request',request => network.push({url:request.url(),method:request.method()}));
    await modal.getByLabel('Cihazımdan fotoğraf seç',{exact:true}).setInputFiles(await personalPhoto(page));
    await expect(modal.locator('.compare-status')).toContainText('Sunucuya yüklenmedi');
    const localUrl = await right.locator('.compare-viewport>img').getAttribute('src'); assert.ok(localUrl.startsWith('blob:'));
    await expect(right.locator('.compare-viewport>img')).toBeVisible();
    assert.equal(backend.requests.slice(start).some(request => request.method !== 'GET'),false);
    assert.equal(network.some(request => request.method !== 'GET' || request.url.includes('PRIVATE-device-part')),false);
    const stored = await page.evaluate(() => JSON.stringify({...localStorage,...sessionStorage})); assert.equal(/blob:|PRIVATE-device|image\/png/.test(stored),false); await noPersonalStorage(page);
    await fits(page,width); await modal.screenshot({path:'.test-artifacts/compare-'+width+'.png'});
    await modal.getByRole('button',{name:'Kapat',exact:true}).click(); await expect(modal).not.toBeVisible();
    await expect.poll(() => page.evaluate(async url => { try { await fetch(url); return false; } catch { return true; } },localUrl),{message:'blob released on close'}).toBe(true);
    await expect(page.getByLabel('Ürün arama',{exact:true})).toHaveValue('TEST-POM'); await expect(page.getByLabel('Kategori',{exact:true})).toHaveValue('c1');
    assert.equal(new URL(page.url()).searchParams.get('q'),'TEST-POM'); await fits(page,width);
    // The other card can fill the second slot without navigating or losing selection.
    await page.getByLabel('Ürün arama',{exact:true}).fill(''); await page.getByLabel('Kategori',{exact:true}).selectOption('');
    await page.getByRole('button',{name:other+' karşılaştır',exact:true}).click(); await ready(page); await expect(right.locator('h3')).toHaveText(other);
  },{hasTouch:width <= 768});
  await scenario('comparison: touch pinch/pan, keyboard and focus on mobile',390,async ({page,context}) => {
    await page.goto(base+'/urun/?id=p1'); await page.getByRole('button',{name:'Görsel ve ürün karşılaştır',exact:true}).click(); const modal = await ready(page);
    const viewport = modal.locator('[data-compare-side="0"] .compare-viewport'), img = viewport.locator('img'); await viewport.scrollIntoViewIfNeeded();
    const bounds = await viewport.boundingBox(), x = bounds.x+bounds.width/2, y = bounds.y+bounds.height/2, session = await context.newCDPSession(page);
    await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-20,y,id:0},{x:x+20,y,id:1}]});
    await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-55,y,id:0},{x:x+55,y,id:1}]});
    await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await expect.poll(() => imageStyle(img,'transform')).not.toMatch(/scale\(1, 1\)/);
    const zoomBeforePan = (await imageStyle(img,'transform')).match(/scale\([^)]+\)/)[0];
    await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:0}]}); await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+30,y:y+20,id:0}]}); await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await expect.poll(() => imageStyle(img,'transform')).toMatch(/translate\(30px, 20px\)/);
    assert.ok((await imageStyle(img,'transform')).includes(zoomBeforePan),'pan after pinch retains zoom');
    await viewport.focus(); await viewport.press('ArrowRight'); assert.match(await imageStyle(img,'transform'),/translate\(40px, 20px\)/);
    await viewport.press('0'); assert.match(await imageStyle(img,'transform'),/scale\(1, 1\)/);
    await expect(viewport).toHaveCSS('touch-action','none');
    await modal.getByRole('button',{name:'Kapat',exact:true}).focus(); await page.keyboard.press('Shift+Tab'); await expect(modal.getByRole('button',{name:'Kapat',exact:true})).not.toBeFocused();
    await page.keyboard.press('Escape'); await expect(modal).not.toBeVisible(); await expect(page.getByRole('button',{name:'Görsel ve ürün karşılaştır',exact:true})).toBeFocused(); await fits(page,390);
  },{hasTouch:true,isMobile:true});
  await scenario('comparison: revoked publication cannot be re-added, price and images refresh, failures clear',390,async ({page,backend}) => {
    await page.goto(base+'/magaza/'); await page.getByRole('button',{name:name+' karşılaştır',exact:true}).click(); const modal = await ready(page);
    await modal.getByRole('button',{name:other,exact:true}).click(); backend.public = backend.public.filter(product => product.product_id !== 'p2'); backend.public[0].price = 131;
    await modal.getByRole('button',{name:'Yayını yenile',exact:true}).click(); await ready(page);
    await expect(modal.locator('tr[data-field="price"]')).toContainText('131,00'); await expect(modal.locator('tr[data-field="price"]')).not.toContainText('225,10');
    await expect(modal.locator('.compare-search-results')).not.toContainText(other); await expect(modal.locator('[data-compare-side="1"] .compare-viewport>img')).toBeHidden();
    backend.enabled = false; await modal.getByRole('button',{name:'Yayını yenile',exact:true}).click(); await ready(page);
    await expect(modal.locator('.compare-search-results')).not.toContainText(name); await expect(modal.locator('tr[data-field="price"]')).not.toContainText('131,00');
    backend.enabled = true; backend.catalogFailure = true; await modal.getByRole('button',{name:'Yayını yenile',exact:true}).click(); await ready(page); await expect(modal.locator('.compare-status')).toContainText('doğrulanamadı');
  });
  for (const exit of ['logout','revoked','pagehide']) await scenario('comparison: dealer pricing and private DOM cleanup on '+exit,390,async ({page,backend,context}) => {
    await login(page); await page.getByRole('button',{name:'TEST Yalnız Bayi Ürünü karşılaştır',exact:true}).click(); const modal = await ready(page);
    await modal.getByRole('button',{name:name,exact:true}).click(); await expect(modal.locator('tr[data-field="price"]')).toContainText('39,95'); await expect(modal.locator('tr[data-field="price"]')).toContainText('80,00');
    await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange'))); await ready(page);
    await expect(modal.locator('tr[data-field="price"]')).toContainText('39,95'); await expect(modal.locator('tr[data-field="price"]')).toContainText('80,00');
    if (exit === 'logout') { const second = await context.newPage(); await second.goto(base+'/hesabim/'); await second.getByRole('button',{name:'Oturumu kapat',exact:true}).click(); }
    else if (exit === 'revoked') { backend.rotateA(); await modal.getByRole('button',{name:'Yayını yenile',exact:true}).click(); }
    else await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));
    await expect(modal).not.toBeVisible(); await expect(page.locator('.compare-info')).toBeEmpty(); await expect(page.locator('.compare-viewport>img[src]')).toHaveCount(0); await expect(page.locator('body')).not.toContainText('39,95'); await noPersonalStorage(page);
    await page.goto(base+'/magaza/'); await expect(page.getByRole('button',{name:'TEST Yalnız Bayi Ürünü karşılaştır',exact:true})).toHaveCount(0);
    await page.getByRole('button',{name:name+' karşılaştır',exact:true}).click(); await ready(page); await expect(inspector(page).locator('tr[data-field="price"]')).toContainText('100,00');
  });
  await scenario('comparison: missing, corrupt and rejected personal photos remain usable',390,async ({page,backend,context}) => {
    backend.public[0].image_url = null; backend.public[0].image_urls = [];
    backend.public[1].image_url = 'https://images.example.com/compare-broken.jpg';
    await context.route('https://images.example.com/compare-broken.jpg',route => route.fulfill({status:404,body:''}));
    await page.goto(base+'/magaza/'); await page.getByRole('button',{name:name+' karşılaştır',exact:true}).click(); const modal = await ready(page);
    await expect(modal.locator('[data-compare-side="0"] .compare-image-empty')).toContainText('Yayınlanmış görsel yok');
    await modal.getByLabel('Cihazımdan fotoğraf seç',{exact:true}).setInputFiles({name:'bad.svg',mimeType:'image/svg+xml',buffer:Buffer.from('<svg/>')}); await expect(modal.locator('.compare-status')).toContainText('Geçerli bir');
    await modal.getByLabel('Cihazımdan fotoğraf seç',{exact:true}).setInputFiles({name:'corrupt.png',mimeType:'image/png',buffer:Buffer.from('invalid')}); await expect(modal.locator('.compare-status')).toContainText('Fotoğraf açılamadı');
    await modal.getByRole('button',{name:other,exact:true}).click(); await expect(modal.locator('[data-compare-side="1"] .compare-image-empty')).toContainText('yüklenemedi');
    await expect(modal.locator('tr[data-field="name"]')).toContainText(other); await fits(page,390);
  });
  await scenario('publication experience: dealer form preserves canonical fields and retry identity',390,async ({page,backend,context}) => {
    backend.business = {display_name:'TEST Business',requests_enabled:true,request_types:['dealer_application','pension_reservation','restaurant_reservation'],dealer_application_enabled:true};
    const sends = [];
    await context.route('**/yardimci-asistan/api/request.php',async route => {
      const req = route.request(), body = req.postDataBuffer().toString('utf8');
      assert.equal(req.method(),'POST'); assert.match(req.headers()['content-type'],/^multipart\/form-data; boundary=/);
      for (const [key,value] of [['request_type','dealer_application'],['company_name','TEST Dealer Shop'],['authorized_person','TEST Contact'],['customer_name','TEST Contact'],['customer_phone','05550000000'],['email','fixture@example.test']]) assert.ok(body.includes('name="'+key+'"\r\n\r\n'+value+'\r\n'),key);
      const key = /name="idempotency_key"\r\n\r\n([^\r]+)/.exec(body)?.[1]; assert.ok(key); sends.push(key);
      return route.fulfill({status:sends.length === 1 ? 503 : 201,json:sends.length === 1 ? {ok:false,message:'TEST Retry safely'} : {ok:true,request_id:'fixture_dealer_application'}});
    });
    await page.goto(base+'/'); await page.locator('#yardimci-asistan-widget [data-ya-open]').click();
    const widget = page.locator('#yardimci-asistan-widget'); await widget.locator('[data-support-flow="dealer"]').click();
    const form = widget.locator('[data-dealer-application]');
    for (const [field,value] of [['company_name','TEST Dealer Shop'],['authorized_person','TEST Contact'],['customer_phone','05550000000'],['email','fixture@example.test']]) await form.locator('[name="'+field+'"]').fill(value);
    await form.getByRole('button',{name:'Başvuruyu Gönder',exact:true}).click(); await expect(form.locator('[data-application-status]')).toHaveText('TEST Retry safely');
    await form.getByRole('button',{name:'Başvuruyu Gönder',exact:true}).click(); await expect(form.locator('[data-application-status]')).toContainText('Başvurunuz alındı');
    assert.equal(sends.length,2); assert.equal(sends[0],sends[1]); await expect(form.locator('[name=company_name]')).toHaveValue('');
  });
  for (const width of [390,1440]) await scenario('publication experience: homepage modules, unique nav, widget tabs and original avatar',width,async ({page,backend}) => {
    backend.publicSurfaces = ['store','rooms','restaurant','qr_menu']; backend.roomsEnabled = backend.tablesEnabled = backend.menuEnabled = true;
    backend.public[0].brand = 'TEST Published Brand';
    backend.business = {display_name:'TEST Published Teknikel',description:'TEST Published description',phone:'+905550000000',email:'test@example.com',address:'TEST Published Address',ai_enabled:true,requests_enabled:true,request_types:['dealer_application','pension_reservation','restaurant_reservation'],dealer_application_enabled:true,google_reviews_enabled:true,
      gallery:[{url:'/yardimci-asistan/media/fixture-gallery.jpg',title:'TEST gallery'}]}; backend.campaigns = [campaignPublication];
    await page.goto(base+'/');
    for (const key of ['rooms','restaurant','qr_menu','campaigns','reviews','gallery','contact','dealer']) await expect(page.locator('section[data-section="'+key+'"]')).toBeVisible();
    await expect(page.locator('[data-home-list="reviews"]')).toContainText('TEST Yayınlanmış yorum');
    await expect(page.locator('.hero [data-business-description]')).toHaveText('TEST Published description');
    await expect(page.locator('.hero img').first()).toHaveAttribute('src',/pump/);
    await expect(page.locator('.hero img')).toHaveCount(2);
    await expect(page.locator('header .nav-inner>[data-category-nav]')).toHaveCount(0);
    await page.locator('[data-category-menu] summary').click(); await expect(page.locator('[data-category-nav] a')).toHaveCount(2); await expect(page.locator('[data-category-nav] a').first()).toBeVisible();
    await page.locator('[data-category-menu] summary').click();
    await page.locator('#yardimci-asistan-widget [data-ya-open]').click(); const widget = page.locator('#yardimci-asistan-widget');
    await expect(widget.locator('.publication-widget-tabs')).toBeVisible(); await expect(widget.locator('.ya-widget-nexa[data-nexa-role="welcome"]')).toHaveCount(1);
    await expect(widget.locator('[data-support-flow="reservation"]')).toBeVisible(); await expect(widget.locator('[data-support-flow="parts"]')).toBeHidden();
    await widget.getByRole('tab',{name:'Sohbet',exact:true}).click(); await expect(widget.locator('[data-support-flow="chat"]')).toBeVisible();
    await expect(widget.locator('[data-support-flow="parts"]')).toBeVisible(); await expect(widget.locator('[data-support-flow="dealer"]')).toBeHidden();
    await widget.getByRole('tab',{name:'İşlemler',exact:true}).click(); await widget.locator('[data-support-flow="dealer"]').click();
    await expect(widget.locator('fieldset.dealer-application-group')).toHaveCount(2); await expect(widget.locator('[name=company_name]')).toBeVisible(); await expect(widget.locator('[data-document-picker]')).toHaveCount(1);
    await expect(widget.locator('[data-dealer-application] [name=customer_phone]')).toHaveAttribute('type','tel');
    await fits(page,width); await page.screenshot({path:'.test-artifacts/publication-widget-'+width+'.png',fullPage:true});
    await widget.locator('[data-ya-close]').click(); await expect(widget.locator('.ya-widget-panel')).toHaveCount(0);
    await page.screenshot({path:'.test-artifacts/homepage-'+width+'.png',fullPage:true});
    assert.equal(backend.requests.filter(request => request.path === 'business').length,1,'chrome and widget share the same publication');
    await page.goto(base+'/markalar/'); await expect(page.locator('[data-public-content] a')).toHaveAttribute('href','/magaza/?brand=TEST%20Published%20Brand');
    await page.locator('[data-public-content] a').click(); await expect(page.getByLabel('Marka',{exact:true})).toHaveValue('TEST Published Brand'); await expect(page.locator('[data-product-grid] .product-card')).toHaveCount(1);
    backend.business.publication_visibility = {rooms:false,restaurant:false,qr_menu:false,campaigns:false,gallery:false,reviews:false,dealer:false,contact:false,assistant:false};
    await page.goto(base+'/'); for (const key of ['rooms','restaurant','qr_menu','campaigns','reviews','gallery','contact','dealer']) await expect(page.locator('section[data-section="'+key+'"]')).toBeHidden();
    for (const route of ['/odalar/','/restoran/','/qr-menu/','/galeri/','/yorumlar/','/iletisim/','/duyurular/']) { await page.goto(base+route); await expect(page.locator('[data-public-content],[data-table-grid],[data-menu-list]')).toBeHidden().catch(async () => { await expect(page.locator('[data-table-grid] article,[data-menu-list] article')).toHaveCount(0); }); }
  });
}
