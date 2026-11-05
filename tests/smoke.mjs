// Local presentation + test-only API examples. No live host, credentials or browser downloads.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium,expect} from '@playwright/test';
import {FixtureApi,A,B,tokens} from './fixtures/api.mjs';
import {galleryScenarios} from './gallery.mjs';
import {storefrontScenarios} from './storefront.mjs';
import {experienceScenarios} from './experience.mjs';
import {customerRequestScenarios} from './customer-requests.mjs';

const port = await new Promise(resolve => { const probe = createServer(); probe.listen(0,'127.0.0.1',() => { const port = probe.address().port; probe.close(() => resolve(port)); }); });
const base = `http://127.0.0.1:${port}`;
const server = spawn('php',['-S',`127.0.0.1:${port}`,'-t','.'],{stdio:['ignore','pipe','pipe']});
let serverLog = ''; for (const stream of [server.stdout,server.stderr]) stream.on('data',chunk => serverLog += chunk);
mkdirSync('.test-artifacts',{recursive:true});
let browser; const results = [];
const publicName = 'TEST Bosch Pompa';
const status = (page,text) => expect(page.getByText(text,{exact:false})).toBeVisible();
const dealerTab = (page,name) => page.getByRole('navigation',{name:'Bayi işlemleri'}).getByRole('button',{name});
async function fits(page,width) { assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true,`overflow at ${width}: ${page.url()}`); }
async function login(page,token = tokens.a, expectCatalog = true) {
  await page.goto(base + '/bayi/');
  if(await page.getByRole('button',{name:'Oturumu kapat',exact:true}).count())await page.getByRole('button',{name:'Oturumu kapat',exact:true}).click();
  const form=page.locator('form.account-form').filter({has:page.getByRole('heading',{name:'Giriş yap',exact:true})});
  await expect(form).toBeVisible();await form.locator('[name=email]').fill(token===tokens.b?'b@example.test':'a@example.test');await form.locator('[name=password]').fill('Fixture-account-Password123');await form.getByRole('button',{name:'Giriş yap',exact:true}).click();
  await expect(page.getByRole('heading',{name:token === tokens.b ? 'TEST BAYİ B' : 'TEST BAYİ A',exact:true})).toBeVisible();
  if(expectCatalog)await expect(page.getByRole('button',{name:publicName + ' sepete ekle',exact:true})).toBeVisible();
}
async function retailCart(page,{note = 'PRIVATE_RETAIL_NOTE',shipping = false} = {}) {
  await page.goto(base + '/katalog/'); await page.getByRole('button',{name:publicName + ' sepete ekle',exact:true}).click(); await page.getByRole('link',{name:'Perakende sepeti',exact:true}).click();
  await page.getByLabel('Ad soyad',{exact:true}).fill('TEST PRIVATE CUSTOMER'); await page.getByLabel('Telefon',{exact:true}).fill('0555 000 00 00');
  await page.getByLabel('Sipariş notu (isteğe bağlı)',{exact:true}).fill(note);
  if (shipping) { await page.getByLabel('Teslimat tercihi',{exact:true}).selectOption('shipping'); await address(page); }
}
async function address(page) {
  for (const [caption,value] of [['Teslim alacak kişi','TEST PRIVATE RECIPIENT'],['Açık adres','TEST PRIVATE ADDRESS 10'],['İlçe','TEST Merkez'],['İl','İstanbul']]) await page.getByLabel(caption,{exact:true}).fill(value);
}
async function noPersonalStorage(page) {
  const stored = await page.evaluate(() => JSON.stringify({...localStorage,...sessionStorage}));
  for (const sentinel of ['TEST PRIVATE CUSTOMER','TEST PRIVATE RECIPIENT','TEST PRIVATE ADDRESS','PRIVATE_RETAIL_NOTE','PRIVATE_DEALER_NOTE',tokens.a,'"price"','"currency"','TEST BAYİ A','TEST-POM-101']) assert.equal(stored.includes(sentinel),false,sentinel + ' persisted');
}
async function scenario(name,width,run,options = {}) {
  if (process.env.TEST_FILTER && !name.includes(process.env.TEST_FILTER)) return;
  const context = await browser.newContext({viewport:{width,height:900},locale:'tr-TR',...options}); const backend = new FixtureApi(); await backend.install(context,base);
  const errors = []; context.on('page',page => page.on('pageerror',error => errors.push(error.message)));
  const page = await context.newPage(); page.setDefaultTimeout(7000); expect.setDefaultTimeout?.(7000);
  try {
    await run({page,context,backend,width}); assert.deepEqual(errors,[],'browser exceptions'); results.push({name,width,status:'passed'}); console.log('PASS',width,name);
  } catch (error) { results.push({name,width,status:'failed',error:error.message}); if (errors.length) console.error('Browser errors:',errors); await page.screenshot({path:'.test-artifacts/failure.png',fullPage:true}).catch(() => {}); throw error; }
  finally { await context.close(); writeFileSync('.test-artifacts/browser.json',JSON.stringify(results,null,2) + '\n'); }
}
try {
  for (let i = 0; i < 100; i++) { try { if ((await fetch(base)).ok) break; } catch {} await new Promise(resolve => setTimeout(resolve,40)); }
  browser = await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || '/usr/bin/brave',args:['--no-sandbox','--disable-gpu']});
  await customerRequestScenarios({scenario,base,fits,noPersonalStorage});
  await experienceScenarios({scenario,base,login,fits,noPersonalStorage});
  await storefrontScenarios({scenario,base,login,fits});
  await galleryScenarios({scenario,base,login,dealerTab,fits,noPersonalStorage});
  for (const campaignWidth of [390,1440]) await scenario('kampanya alanı: yayın yokken gizli, yayınlandığında gerçek içerik',campaignWidth,async ({page,backend}) => {
    await page.goto(base + '/');
    await expect(page.locator('.campaign-section')).toBeHidden();
    await expect(page.locator('[data-campaign-grid] .campaign-card')).toHaveCount(0);
    backend.campaigns = [{id:'demo_campaign',channel:'website',placement:'homepage_feature',published:true,title:'TEST Gerçek Teknikel Kampanyası',text:'Yalnız yerel test yayını',images:[]}];
    await page.reload();
    await expect(page.locator('[data-campaign-grid] .campaign-card')).toHaveCount(1);
    await expect(page.locator('[data-campaign-grid]')).toContainText('TEST Gerçek Teknikel Kampanyası');
    await expect(page.locator('.campaign-section')).toBeVisible();
    await page.locator('.campaign-section').screenshot({path:'.test-artifacts/campaign-' + campaignWidth + '.png'});
    backend.campaigns = [];
    await page.reload();
    await expect(page.locator('[data-campaign-grid] .campaign-card')).toHaveCount(0);
    await expect(page.locator('.campaign-section')).toBeHidden();
    await fits(page,campaignWidth);
  });
  for (const width of [320,390,768,1440]) {
    await scenario('perakende: katalog, stok kodu/kategori araması, detay, çoklu sepet ve teslimatlı sipariş',width,async ({page,backend}) => {
      await page.goto(base + '/'); await expect(page.locator('[data-hero-title]')).toContainText('Karşılaştırarak seçin.'); await expect(page.locator('[data-featured-grid] .product-card')).toHaveCount(2); await fits(page,width);
      await page.getByRole('searchbox',{name:'Ürün veya stok kodu ara',exact:true}).fill('TEST-KRT-202'); await page.getByRole('button',{name:'Ara',exact:true}).click();
      await expect(page.getByRole('heading',{name:'TEST Kontrol Kartı',exact:true})).toBeVisible(); await expect(page.locator('[data-product-grid] .product-card')).toHaveCount(1); await expect(page.getByLabel('Marka',{exact:true})).toBeHidden();
      await page.getByLabel('Ürün arama',{exact:true}).fill('Bosch'); await page.getByLabel('Kategori',{exact:true}).selectOption('c1'); await page.getByRole('link',{name:publicName + ' ürününü incele',exact:true}).click();
      await expect(page.getByRole('heading',{name:publicName,exact:true})).toBeVisible(); await expect(page.locator('.gallery-hero img')).toHaveCSS('object-fit','contain'); await expect(page.locator('.gallery-thumb')).toHaveCount(3); await fits(page,width);
      await page.getByLabel('Miktar',{exact:true}).fill('2'); await page.getByRole('button',{name:'Sepete ekle',exact:true}).click();
      await page.goto(base + '/katalog/'); await page.getByRole('button',{name:'TEST Kontrol Kartı sepete ekle',exact:true}).click(); await page.getByRole('link',{name:'Perakende sepeti',exact:true}).click();
      await page.getByLabel(publicName + ' miktarı',{exact:true}).fill('3'); await page.getByLabel('Ad soyad',{exact:true}).click(); await expect(page.locator('.cart-total')).toContainText('525,10');
      await page.getByLabel('Ad soyad',{exact:true}).fill('TEST PRIVATE CUSTOMER'); await page.getByLabel('Telefon',{exact:true}).fill('0555 000 00 00'); await page.getByLabel('E-posta (isteğe bağlı)',{exact:true}).fill('test@example.com');
      await page.getByLabel('Teslimat tercihi',{exact:true}).selectOption('shipping'); await address(page); await page.getByLabel('Sipariş notu (isteğe bağlı)',{exact:true}).fill('PRIVATE_RETAIL_NOTE');
      await fits(page,width); await page.screenshot({path:`.test-artifacts/retail-${width}.png`,fullPage:true}); await page.getByRole('button',{name:'Sipariş talebini gönder',exact:true}).click();
      await expect(page.getByRole('heading',{name:'Sipariş talebiniz alındı',exact:true})).toBeVisible(); assert.equal(backend.created.length,1); assert.equal(backend.created[0].owner,'public'); assert.equal(backend.created[0].payload.delivery.method,'shipping');
      assert.equal(backend.created[0].payload.buyer.phone,'05550000000'); assert.equal(backend.created[0].payload.items.length,2); await status(page,'Ödeme alınmadı. Talebiniz işletmenin onayını bekliyor.'); await noPersonalStorage(page); await fits(page,width);
    });
    await scenario('bayi: ortak hesap, özel katalog/marka, favori, sepet, sipariş/durum/tekrar ve çıkış',width,async ({page,backend}) => {
      await login(page); assert.equal(new URL(page.url()).hash,''); await fits(page,width);
      await page.getByLabel('Marka',{exact:true}).selectOption('TEST Marka'); await page.getByLabel('Ürün, marka veya stok kodu',{exact:true}).fill('TEST-POM-101');
      await expect(page.locator('[data-dealer-content] .product-card')).toHaveCount(1); await page.getByRole('button',{name:publicName + ' ürününü incele',exact:true}).click();
      await expect(page.locator('.product-detail .price')).toContainText('80,00'); await page.getByRole('button',{name:'Favorilerime ekle',exact:true}).click(); await expect(page.getByRole('button',{name:'Favorilerimden çıkar'})).toBeVisible();
      await page.getByLabel('Miktar',{exact:true}).fill('3'); await page.getByRole('button',{name:'Sepete ekle',exact:true}).click(); await dealerTab(page,/^Sepet/).click(); await expect(page.locator('.cart-total')).toContainText('240,00');
      await expect(page.locator('[data-dealer-content]').getByLabel('Ad soyad',{exact:true})).toHaveCount(0); await page.getByLabel('Sipariş notu (isteğe bağlı)',{exact:true}).fill('PRIVATE_DEALER_NOTE'); await fits(page,width);
      await page.getByRole('button',{name:'Sipariş talebini gönder',exact:true}).click(); await expect(page.getByRole('heading',{name:'Sipariş talebiniz alındı',exact:true})).toBeVisible();
      assert.equal(backend.created.length,1); assert.equal(backend.created[0].owner,A); assert.equal('buyer' in backend.created[0].payload,false); await noPersonalStorage(page);
      await page.getByRole('button',{name:'Siparişlerimi göster',exact:true}).click();
      for (const name of ['Onaylandı','Sipariş alındı','Tamamlandı','İptal edildi','Talep alındı · Masaüstüne aktarım bekleniyor']) await expect(page.getByRole('heading',{name,exact:true})).toBeVisible();
      await fits(page,width); await page.screenshot({path:`.test-artifacts/dealer-orders-${width}.png`,fullPage:true});
      await page.getByRole('button',{name:'web_dealer_order_history_a ürünlerini yeniden sepete ekle',exact:true}).click(); await expect(page.locator('.cart-total')).toContainText('160,00');
      await dealerTab(page,'Hesabım').click(); await page.getByRole('link',{name:'Hesap ayarları',exact:true}).click(); await page.getByRole('button',{name:'Oturumu kapat',exact:true}).click(); await expect(page.locator('[data-dealer-workspace]')).toBeHidden(); await expect(page.locator('[data-dealer-content]')).toBeEmpty();
      await page.goto(base + '/katalog/'); await expect(page.getByRole('heading',{name:'TEST Yalnız Bayi Ürünü',exact:true})).toHaveCount(0); await expect(page.locator('.product-card').filter({has:page.getByRole('heading',{name:publicName,exact:true})}).locator('.price')).toContainText('100,00'); await fits(page,width);
    });
  }
  await scenario('kapalı public yayın: ana sayfa, detay ve checkout yeni satışa kapanır',390,async ({page,backend}) => {
    await retailCart(page); backend.enabled = false; await page.reload(); await expect(page.locator('[data-catalog-state]')).toContainText('yayında değil'); await expect(page.getByRole('button',{name:'Sipariş talebini gönder',exact:true})).toBeDisabled(); await expect(page.locator('.cart-total')).not.toContainText('100,00');
    await page.goto(base + '/urun/?id=p1'); await expect(page.locator('[data-product-detail]')).toBeEmpty(); await page.goto(base + '/'); await expect(page.locator('[data-featured-grid]')).toBeEmpty(); assert.equal(backend.created.length,0);
  });
  await scenario('business API yokken katalog fail-closed; yenilemeyle düzelir',390,async ({page,backend}) => {
    backend.businessFailure = true; await page.goto(base + '/katalog/'); await expect(page.locator('[data-catalog-state]')).toContainText('bağlantısı'); await expect(page.locator('[data-product-grid]')).toBeEmpty();
    backend.businessFailure = false; await page.getByRole('button',{name:'Yenile ↻',exact:true}).click(); await expect(page.getByRole('heading',{name:publicName,exact:true})).toBeVisible();
  });
  await scenario('teslimat yöntemi yayınlanmamış katalog görüntülenir; sipariş kapalıdır',390,async ({page,backend}) => {
    backend.deliveryMethods = []; await page.goto(base + '/katalog/'); await expect(page.getByRole('heading',{name:publicName,exact:true})).toBeVisible(); await expect(page.getByRole('button',{name:publicName + ' sepete ekle',exact:true})).toBeDisabled();
    await login(page); await expect(page.getByRole('button',{name:publicName + ' sepete ekle',exact:true})).toBeDisabled(); assert.equal(backend.created.length,0);
  });
  await scenario('boş katalog örnek ürün/fiyat üretmez',390,async ({page,backend}) => {
    backend.public = []; await page.goto(base + '/katalog/'); await expect(page.locator('[data-catalog-state]')).toContainText('Henüz yayınlanmış'); await expect(page.locator('[data-product-grid]')).toBeEmpty();
  });
  await scenario('perakende kabul yanıtı kaybolursa aynı gövde/kimlikle tek sipariş',390,async ({page,backend}) => {
    await retailCart(page); backend.lossNext = 'order'; await page.getByRole('button',{name:'Sipariş talebini gönder',exact:true}).click(); await expect(page.getByRole('button',{name:'Aynı siparişi tekrar dene',exact:true})).toBeEnabled();
    await expect(page.getByLabel(publicName + ' miktarı',{exact:true})).toBeDisabled(); await noPersonalStorage(page); assert.equal(backend.created.length,1);
    await page.getByRole('button',{name:'Aynı siparişi tekrar dene',exact:true}).click(); await expect(page.getByRole('heading',{name:'Sipariş talebiniz alındı',exact:true})).toBeVisible();
    const calls = backend.requests.filter(call => call.path === 'order'); assert.equal(calls.length,2); assert.deepEqual(calls[0].payload,calls[1].payload); assert.equal(backend.created.length,1);
  });
  await scenario('perakende belirsiz gönderim reload sonrası aynı bilgilerle kurtarılır',390,async ({page,backend}) => {
    await retailCart(page); backend.lossNext = 'order'; await page.getByRole('button',{name:'Sipariş talebini gönder',exact:true}).click(); await expect(page.getByRole('button',{name:'Aynı siparişi tekrar dene',exact:true})).toBeEnabled(); await page.reload();
    await expect(page.getByLabel('Ad soyad',{exact:true})).toHaveValue(''); await page.getByLabel('Ad soyad',{exact:true}).fill('TEST PRIVATE CUSTOMER'); await page.getByLabel('Telefon',{exact:true}).fill('0555 000 00 00'); await page.getByLabel('Sipariş notu (isteğe bağlı)',{exact:true}).fill('CHANGED');
    await page.getByRole('button',{name:'Aynı siparişi tekrar dene',exact:true}).click(); await expect(page.locator('.checkout-feedback')).toContainText('aynı iletişim'); assert.equal(backend.requests.filter(call => call.path === 'order').length,1);
    await page.getByLabel('Sipariş notu (isteğe bağlı)',{exact:true}).fill('PRIVATE_RETAIL_NOTE'); await page.getByRole('button',{name:'Aynı siparişi tekrar dene',exact:true}).click(); await expect(page.getByRole('heading',{name:'Sipariş talebiniz alındı',exact:true})).toBeVisible(); assert.equal(backend.created.length,1);
  });
  await scenario('bozuk 201 yanıtı sepeti silmez; tekrar aynı siparişi bulur',390,async ({page,backend}) => {
    await retailCart(page); backend.malformedNext = 'order'; await page.getByRole('button',{name:'Sipariş talebini gönder',exact:true}).click(); await expect(page.getByRole('button',{name:'Aynı siparişi tekrar dene',exact:true})).toBeEnabled(); await page.getByRole('button',{name:'Aynı siparişi tekrar dene',exact:true}).click(); await expect(page.getByRole('heading',{name:'Sipariş talebiniz alındı',exact:true})).toBeVisible(); assert.equal(backend.created.length,1);
  });
  await scenario('503 sonucu belirsiz tutar; sonraki deneme aynı kimlikle çalışır',390,async ({page,backend}) => {
    await retailCart(page); backend.failNext = 'order'; await page.getByRole('button',{name:'Sipariş talebini gönder',exact:true}).click(); await expect(page.getByRole('button',{name:'Aynı siparişi tekrar dene',exact:true})).toBeEnabled(); assert.equal(backend.created.length,0);
    await page.getByRole('button',{name:'Aynı siparişi tekrar dene',exact:true}).click(); await expect(page.getByRole('heading',{name:'Sipariş talebiniz alındı',exact:true})).toBeVisible(); const calls = backend.requests.filter(call => call.path === 'order'); assert.equal(calls[0].payload.idempotencyKey,calls[1].payload.idempotencyKey); assert.equal(backend.created.length,1);
  });
  await scenario('kesin 422 reddi sepeti korur ve düzeltmeye açar',390,async ({page,backend}) => {
    await retailCart(page); backend.rejectNext = 'order'; await page.getByRole('button',{name:'Sipariş talebini gönder',exact:true}).click(); await expect(page.getByRole('button',{name:'Sipariş talebini gönder',exact:true})).toBeEnabled(); await expect(page.getByLabel(publicName + ' miktarı',{exact:true})).toBeEnabled();
    await page.getByLabel('Sipariş notu (isteğe bağlı)',{exact:true}).fill('CORRECTED'); await page.getByRole('button',{name:'Sipariş talebini gönder',exact:true}).click(); await expect(page.getByRole('heading',{name:'Sipariş talebiniz alındı',exact:true})).toBeVisible(); assert.equal(backend.created.length,1);
  });
  await scenario('public yayın kapanmış olsa da önceki kabul aynı kimlikle kurtarılır',390,async ({page,backend}) => {
    await retailCart(page); backend.lossNext = 'order'; await page.getByRole('button',{name:'Sipariş talebini gönder',exact:true}).click(); await expect(page.getByRole('button',{name:'Aynı siparişi tekrar dene',exact:true})).toBeEnabled(); backend.enabled = false;
    await page.getByRole('button',{name:'Aynı siparişi tekrar dene',exact:true}).click(); await expect(page.getByRole('heading',{name:'Sipariş talebiniz alındı',exact:true})).toBeVisible(); assert.equal(backend.created.length,1);
  });
  await scenario('bayi A/B ve perakende sepet/fiyat/favori izolasyonu',390,async ({page,backend}) => {
    await retailCart(page); await login(page); await page.getByRole('button',{name:publicName + ' ürününü incele',exact:true}).click(); await page.getByRole('button',{name:'Favorilerime ekle',exact:true}).click(); await page.getByRole('button',{name:'Sepete ekle',exact:true}).click();
    await dealerTab(page,'Katalog').click(); await page.getByRole('checkbox',{name:'Yalnız favorilerim',exact:true}).check(); await expect(page.locator('[data-dealer-content] .product-card')).toHaveCount(1);
    await dealerTab(page,'Hesabım').click(); await page.getByRole('link',{name:'Hesap ayarları',exact:true}).click(); await page.getByRole('button',{name:'Oturumu kapat',exact:true}).click(); await login(page,tokens.b); await expect(page.getByRole('checkbox',{name:'Yalnız favorilerim',exact:true})).not.toBeChecked(); await dealerTab(page,/^Sepet/).click(); await expect(page.getByRole('heading',{name:'Sepetiniz boş',exact:true})).toBeVisible();
    await dealerTab(page,'Katalog').click(); await page.getByRole('button',{name:publicName + ' ürününü incele',exact:true}).click(); await expect(page.locator('.product-detail .price')).toContainText('60,00'); await expect(page.getByRole('button',{name:'Favorilerime ekle',exact:true})).toBeVisible();
    await dealerTab(page,'Siparişler').click(); await expect(page.getByText('web_dealer_order_history_a',{exact:true})).toHaveCount(0); await expect(page.getByText('web_dealer_order_history_b',{exact:true})).toBeVisible();
    await page.goto(base + '/sepet/'); await expect(page.locator('.cart-total')).toContainText('100,00'); await expect(page.locator('[data-retail-count]')).toHaveText('1'); assert.equal(backend.created.length,0);
  });
  await scenario('401/erişim iptali özel ürün ve fiyat DOMunu hemen temizler',390,async ({page,backend}) => {
    await login(page); backend.rotateA(); await page.getByRole('button',{name:'Yenile ↻',exact:true}).click(); await expect(page.locator('[data-dealer-workspace]')).toBeHidden(); await expect(page.locator('[data-dealer-content]')).toBeEmpty(); await expect(page.locator('[data-login-state]')).toContainText('yeniden giriş');
  });
  await scenario('bayi kayıp kabul yeni oturumda makbuzla kurtarılır; ikinci order POST yok',390,async ({page,backend}) => {
    await login(page); await page.getByRole('button',{name:publicName + ' sepete ekle',exact:true}).click(); await dealerTab(page,/^Sepet/).click(); await page.getByLabel('Sipariş notu (isteğe bağlı)',{exact:true}).fill('PRIVATE_DEALER_NOTE'); backend.lossNext = 'dealer/order';
    await page.getByRole('button',{name:'Sipariş talebini gönder',exact:true}).click(); await expect(page.getByRole('button',{name:'Aynı siparişi tekrar dene',exact:true})).toBeEnabled(); backend.rotateA(); await page.getByRole('button',{name:'Yenile ↻',exact:true}).click(); await expect(page.locator('[data-dealer-workspace]')).toBeHidden();
    await login(page,tokens.renewed); await dealerTab(page,/^Sepet/).click(); await expect(page.getByLabel('Sipariş notu (isteğe bağlı)',{exact:true})).toHaveValue(''); await page.getByRole('button',{name:'Aynı siparişi tekrar dene',exact:true}).click();
    await expect(page.getByRole('heading',{name:'Sipariş talebiniz alındı',exact:true})).toBeVisible(); assert.equal(backend.created.length,1); assert.equal(backend.requests.filter(call => call.path === 'dealer/order').length,1); await noPersonalStorage(page);
  });
  await scenario('bayi API hatası perakende fiyatına sessiz dönüş yapmaz',390,async ({page,backend}) => {
    backend.dealerCatalogFailure = true; await login(page, tokens.a, false); await expect(page.getByRole('heading',{name:'TEST BAYİ A',exact:true})).toBeVisible(); await expect(page.locator('[data-dealer-content]')).toContainText('henüz hazır değil'); await expect(page.locator('[data-dealer-content] .price')).toHaveCount(0);
    await dealerTab(page,'Siparişler').click(); await expect(page.getByRole('heading',{name:'Onaylandı',exact:true})).toBeVisible();
  });
  await scenario('sipariş geçmişi hatası boş/sahte geçmişe dönüşmez',390,async ({page,backend}) => {
    backend.ordersFailure = true; await login(page); await dealerTab(page,'Siparişler').click(); await expect(page.locator('[data-dealer-content]')).toContainText('geçmişi alınamadı'); await expect(page.locator('.order-card')).toHaveCount(0);
    backend.ordersFailure = false; await page.getByRole('button',{name:'Siparişleri yenile',exact:true}).click(); await expect(page.getByRole('heading',{name:'Onaylandı',exact:true})).toBeVisible(); backend.historyStatus = 'cancelled'; await page.getByRole('button',{name:'Siparişleri yenile',exact:true}).click(); await expect(page.getByRole('heading',{name:'İptal edildi',exact:true})).toHaveCount(2);
  });
  await scenario('başarısız çıkış özel görünümü kapatır; reload sonrası çıkış yeniden denenebilir',390,async ({page,backend}) => {
    await login(page); backend.logoutFailure = true; await dealerTab(page,'Hesabım').click(); await page.getByRole('link',{name:'Hesap ayarları',exact:true}).click(); await page.getByRole('button',{name:'Oturumu kapat',exact:true}).click(); await expect(page.locator('[data-login-state]')).toContainText('doğrulanamadı'); await expect(page.locator('[data-dealer-content]')).toBeEmpty();
    await page.reload(); await expect(page.locator('[data-dealer-workspace]')).toBeHidden(); backend.logoutFailure = false; await page.getByRole('button',{name:'Yerel oturumu temizle',exact:true}).click(); await expect(page.locator('[data-dealer-workspace]')).toBeHidden();
  });
  await scenario('başka sekmedeki çıkış ve geciken katalog yanıtı özel fiyatları geri getiremez',390,async ({page,context,backend}) => {
    await login(page); const second = await context.newPage(); await second.goto(base + '/bayi/'); await expect(second.getByRole('heading',{name:'TEST BAYİ A',exact:true})).toBeVisible(); await expect(second.getByRole('button',{name:publicName + ' sepete ekle',exact:true})).toBeEnabled();
    let release,started; const ready = new Promise(resolve => started = resolve); const promise = new Promise(resolve => release = resolve); backend.deferred = {promise,started};
    await page.getByRole('button',{name:'Yenile ↻',exact:true}).click(); await ready; await dealerTab(second,'Hesabım').click(); await second.getByRole('link',{name:'Hesap ayarları',exact:true}).click(); await second.getByRole('button',{name:'Oturumu kapat',exact:true}).click();
    await expect(page.locator('[data-dealer-workspace]')).toBeHidden(); release(); await page.waitForTimeout(100); await expect(page.locator('[data-dealer-content]')).toBeEmpty(); await expect(page.locator('[data-dealer-workspace]')).toBeHidden();
  });
  await scenario('başka sekmede farklı müşteri hesabı eski hesabın fiyat ve geçmişini temizler',390,async ({page,context}) => {
    await login(page); await dealerTab(page,'Siparişler').click(); await expect(page.getByText('web_dealer_order_history_a',{exact:true})).toBeVisible();
    const second = await context.newPage(); await second.goto(base + '/bayi/'); await expect(second.getByRole('heading',{name:'TEST BAYİ A',exact:true})).toBeVisible();
    await dealerTab(second,'Hesabım').click(); await second.getByRole('link',{name:'Hesap ayarları',exact:true}).click(); await second.getByRole('button',{name:'Oturumu kapat',exact:true}).click(); await expect(second.locator('[data-login-state]')).toContainText('kapatıldı');
    await login(second,tokens.b); await expect(page.getByRole('heading',{name:'TEST BAYİ B',exact:true})).toBeVisible(); await expect(page.getByText('web_dealer_order_history_a',{exact:true})).toHaveCount(0);
    await page.reload(); await expect(page.getByRole('heading',{name:'TEST BAYİ B',exact:true})).toBeVisible();
    await dealerTab(page,'Siparişler').click(); await expect(page.getByText('web_dealer_order_history_a',{exact:true})).toHaveCount(0); await expect(page.getByText('web_dealer_order_history_b',{exact:true})).toBeVisible();
  });
  await scenario('Online Satış kapalıyken ortak hesap ve bayi yüzeyi kapanır',390,async ({page,backend}) => {
    backend.enabled=false;await page.goto(base+'/hesabim/');await expect(page.locator('[data-login-state]')).toContainText('Online Satış kapalı');await expect(page.locator('[data-dealer-workspace]')).toBeHidden();await expect(page.locator('[data-account-root]')).toBeEmpty();
  });
  await scenario('hatalı hesap girişi özel verileri açmaz',390,async ({page}) => {
    await page.goto(base+'/hesabim/');const form=page.locator('form.account-form').filter({has:page.getByRole('heading',{name:'Giriş yap',exact:true})});await form.locator('[name=email]').fill('unknown@example.test');await form.locator('[name=password]').fill('invalid-password-123');await form.getByRole('button',{name:'Giriş yap',exact:true}).click();await expect(page.locator('[data-login-state]')).toContainText('E-posta veya şifre hatalı');await expect(page.locator('[data-dealer-workspace]')).toBeHidden();await noPersonalStorage(page);
  });
  await scenario('geçersiz iletişim telefonu sipariş POST etmez',390,async ({page,backend}) => {
    await retailCart(page); await page.getByLabel('Telefon',{exact:true}).fill('not-a-phone'); await page.getByRole('button',{name:'Sipariş talebini gönder',exact:true}).click(); await expect(page.locator('.checkout-feedback')).toContainText('iletişim telefonu'); assert.equal(backend.requests.filter(call => call.path === 'order').length,0);
  });
  console.log(`${results.length} local browser scenarios passed; widths: ${[...new Set(results.map(result => result.width))].join('/')}; fixture APIs only. No live HTTPS operations.`);
} finally {
  await browser?.close(); server.kill(); await new Promise(resolve => server.once('exit',resolve)); writeFileSync('.test-artifacts/php.log',serverLog);
}
