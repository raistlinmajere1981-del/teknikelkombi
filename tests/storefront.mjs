import assert from 'node:assert/strict';
import {expect} from '@playwright/test';
import {localizationMetadata,sourceKey} from './fixtures/localization.mjs';

export async function storefrontScenarios({scenario,base,login,fits}) {
  const visit = async (page,path = '/') => { await page.goto(base + path); await page.waitForLoadState('domcontentloaded'); };
  const surfaces = ['store','restaurant','qr_menu'];
  const nav = page => page.getByRole('navigation',{name:'Ana menü',exact:true});
  const contact = page => page.locator('footer [data-business-contact]');
  for (const width of [320,390,768,1440]) await scenario('yayın vitrinleri: restoran, QR menü, filtreler ve mobil düzen',width,async ({page,backend}) => {
    backend.publicSurfaces = surfaces; backend.menuEnabled = true; backend.tablesEnabled = true;
    await visit(page);
    await expect(nav(page).getByRole('link',{name:'Restoran',exact:true})).toBeVisible();
    await nav(page).getByRole('link',{name:'Restoran',exact:true}).click();
    await expect(page.locator('[data-table-grid] article')).toHaveCount(1);
    await expect(page.locator('[data-table-grid]')).toContainText('TEST Bahçe Masası');
    await expect(page.locator('[data-table-grid]')).toContainText('4 kişi');
    await expect(page.locator('[data-table-grid]')).toContainText('TEST masa açıklaması');
    await expect(page.locator('[data-table-grid] img')).toHaveAttribute('src',base + '/yardimci-asistan/media/fixture-table.jpg');
    await expect(nav(page).getByRole('link',{name:'Restoran',exact:true})).toHaveAttribute('aria-current','page'); await fits(page,width);
    await nav(page).getByRole('link',{name:'QR Menü',exact:true}).click();
    await expect(page.locator('[data-menu-list] article')).toHaveCount(3);
    await expect(page.locator('[data-menu-list]')).toContainText('85,50');
    await expect(page.locator('[data-menu-list]')).toContainText('12,25');
    await expect(page.locator('.menu-item').filter({hasText:'TEST Fiyatı yayınlanmamış'}).locator('.price')).toHaveCount(0);
    await expect(page.locator('[data-menu-list] img')).toHaveAttribute('src',base + '/yardimci-asistan/media/fixture-meal.jpg');
    const drinks = page.getByRole('button',{name:'TEST İçecekler',exact:true});
    await drinks.focus(); await page.keyboard.press('Enter');
    await expect(drinks).toBeFocused(); await expect(drinks).toHaveAttribute('aria-pressed','true');
    await expect(page.locator('[data-menu-list] article')).toHaveCount(2);
    await expect(page.getByRole('heading',{name:'TEST Çorba',exact:true})).toHaveCount(0);
    await fits(page,width);
    for (const box of await page.locator('.menu-chip').all()) {
      const size = await box.boundingBox(); assert.ok(size.height >= 44 && size.width >= 44);
    }
    backend.menu.categories = [{id:'new',name:'TEST Yeni Menü Kategorisi'}];
    backend.menu.items = [{id:'new-item',category_id:'new',name:'TEST Yeni Menü Ürünü',price:1.75,currency:'TRY'}];
    await page.reload(); await expect(page.getByRole('heading',{name:'TEST Yeni Menü Ürünü',exact:true})).toBeVisible();
    await expect(page.getByRole('button',{name:'TEST Yeni Menü Kategorisi',exact:true})).toBeVisible();
    await expect(page.locator('[data-menu-list]')).not.toContainText('TEST Çay'); await fits(page,width);
    backend.tables = [{id:'new-table',name:'TEST Yeni Masa',capacity:6}];
    await visit(page,'/restoran/'); await expect(page.locator('[data-table-grid]')).toContainText('TEST Yeni Masa');
    await expect(page.locator('[data-table-grid]')).toContainText('6 kişi');
  });
  await scenario('ortak iletişim her sayfada tek işletme isteğiyle güncellenir',390,async ({page,backend}) => {
    backend.business = {display_name:'TEST Yayın Adı',phone:'+90 (555) 000 00 00',email:'test@example.com',address:'TEST Yayın Adresi',website:'https://example.com/contact',social_links:[{platform:'instagram',url:'https://instagram.com/test-fixture'}]};
    for (const path of ['/','/bayi/','/katalog/','/urun/?id=p1','/sepet/','/restoran/','/qr-menu/']) {
      const start = backend.requests.length; await visit(page,path);
      await expect(page.locator('footer .footer-bottom [data-business-name]')).toHaveText('TEST Yayın Adı');
      await expect(contact(page).locator('[data-business-phone]')).toHaveAttribute('href','tel:+905550000000');
      await expect(contact(page).locator('[data-business-email]')).toHaveAttribute('href','mailto:test@example.com');
      await expect(contact(page).locator('[data-business-address]')).toHaveText('TEST Yayın Adresi');
      await expect(contact(page).locator('[data-business-website]')).toHaveCount(0);
      await expect(page.locator('footer .footer-contact .social-icon-link')).toHaveCount(1);
      await expect(contact(page).getByRole('link',{name:'instagram',exact:true})).toHaveAttribute('href','https://instagram.com/test-fixture');
      const requests = backend.requests.slice(start); assert.ok([1,2].includes(requests.filter(call => call.path === 'business').length),path + ' business shared store + widget'); assert.equal(requests.filter(call => call.path === 'catalog').length,1,path);
      await fits(page,390);
    }
    backend.business = {display_name:'TEST Güncel Ad',phone:'',email:'new@example.com',address:'TEST Yeni Adres',website:'',social_links:[]};
    await visit(page,'/bayi/'); await expect(page.locator('footer .footer-bottom [data-business-name]')).toHaveText('TEST Güncel Ad');
    await expect(page.locator('[data-business-phone]:visible')).toHaveCount(0);
    await expect(contact(page).locator('[data-business-email]')).toHaveAttribute('href','mailto:new@example.com');
    await expect(contact(page).locator('[data-business-address]')).toHaveText('TEST Yeni Adres');
    await expect(contact(page).locator('[data-business-website]')).toHaveCount(0);
    // Platform root links are valid demo publications; do not suppress them.
    backend.business = {display_name:'TEST Sosyal',website:base, social_links:[
      {platform:'facebook',url:'https://www.facebook.com/'},
      {platform:'instagram',url:'https://www.instagram.com/'}
    ]}; await visit(page,'/iletisim/');
    await expect(page.locator('footer [data-business-socials] a')).toHaveCount(2);
    await expect(page.locator('.contact-details [data-business-socials] a')).toHaveCount(2);
    await expect(page.locator('[data-business-website]:visible')).toHaveCount(0);
    backend.business = {website:'https://example.com/'}; await visit(page);
    await expect(contact(page)).toBeVisible(); await expect(nav(page).getByRole('link',{name:'İletişim',exact:true})).toBeVisible();
    backend.business = {}; await page.reload(); await page.waitForLoadState('domcontentloaded');
    await expect(contact(page)).toBeHidden(); await expect(page.locator('[data-contact-link]:visible')).toHaveCount(0);
    backend.businessFailure = true; await page.reload(); await page.waitForLoadState('domcontentloaded');
    await expect(contact(page)).toBeHidden(); await expect(page.locator('footer .footer-bottom [data-business-name]')).toBeHidden();
    await expect(page.locator('.header-search')).toBeHidden(); await expect(page.locator('[data-shop-message]')).toBeHidden();
    await expect(page.locator('body')).not.toContainText('0216 462 40 98');
    await expect(page.locator('header').getByRole('link',{name:/Hesabım/})).toBeVisible();
  });
  await scenario('kategori kimlikleri API yayınıyla değişir; kapalı, boş ve hatalı katalog temiz kalır',390,async ({page,backend}) => {
    await visit(page); await expect(page.locator('[data-category-grid] a')).toHaveCount(2);
    await expect(page.locator('[data-category-nav] a').first()).toHaveAttribute('href','/magaza/?category=c1');
    backend.categories = [{id:'new/category & id',name:'TEST Yeni Kategori'}];
    await page.reload(); await expect(page.locator('[data-category-grid] a')).toHaveCount(1);
    await expect(page.locator('[data-category-grid]')).toContainText('TEST Yeni Kategori');
    await expect(page.locator('[data-category-nav] a')).toHaveAttribute('href','/magaza/?category=new%2Fcategory%20%26%20id');
    await page.locator('[data-category-menu] summary').click();
    await page.locator('[data-category-nav] a').click();
    assert.equal(new URL(page.url()).searchParams.get('category'),'new/category & id');
    backend.categories = []; await visit(page); await expect(page.locator('[data-category-section]')).toBeHidden(); await expect(page.locator('[data-category-nav] a')).toHaveCount(0);
    backend.catalogFailure = true; await page.reload(); await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('[data-category-grid]')).toBeEmpty(); await expect(page.locator('.header-search')).toBeHidden();
    backend.catalogFailure = false; backend.enabled = false; backend.publicSurfaces = ['store'];
    await page.reload(); await page.waitForLoadState('domcontentloaded');
    await expect(nav(page).getByRole('link',{name:'Mağaza',exact:true})).toBeHidden(); await expect(page.getByRole('link',{name:'Perakende sepeti',exact:true})).toBeHidden();
    backend.enabled = true; backend.publicSurfaces = ['food_service','menu']; const before = backend.requests.length;
    await page.reload(); await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('[data-category-grid]')).toBeEmpty(); assert.equal(backend.requests.slice(before).some(call => call.path === 'catalog'),false);
    await visit(page,'/katalog/'); backend.publicSurfaces = ['store'];
    await page.getByRole('button',{name:'Yenile ↻',exact:true}).click();
    await expect(page.locator('[data-product-grid] article')).toHaveCount(2); await expect(page.locator('.header-search')).toBeVisible();
    backend.enabled = false; await page.getByRole('button',{name:'Yenile ↻',exact:true}).click();
    await expect(page.locator('[data-product-grid]')).toBeEmpty(); await expect(page.locator('.header-search')).toBeHidden();
  });
  await scenario('tam yayın izinleri profil ve eski menu/food_service değerlerinden bağımsızdır',390,async ({page,backend}) => {
    backend.enabled = false; backend.business.profile = 'pension_restaurant'; backend.publicSurfaces = ['accommodation','food_service','menu','directions','rooms'];
    for (const path of ['/','/restoran/','/qr-menu/']) {
      await visit(page,path); await expect(page.locator('[data-surface]:visible')).toHaveCount(0);
      if (path !== '/') await expect(page.locator('[data-publication-state]')).toContainText('şu anda yayında değil');
    }
    assert.equal(backend.requests.some(call => ['menu','tables','catalog'].includes(call.path)),false);
    backend.business.profile = 'wholesale'; backend.publicSurfaces = ['qr_menu']; backend.menuEnabled = true;
    await visit(page); await expect(nav(page).getByRole('link',{name:'QR Menü',exact:true})).toBeVisible();
    await expect(nav(page).getByRole('link',{name:'Restoran',exact:true})).toBeHidden();
    backend.publicSurfaces = ['restaurant']; backend.tablesEnabled = true; await page.reload(); await page.waitForLoadState('domcontentloaded');
    await expect(nav(page).getByRole('link',{name:'Restoran',exact:true})).toBeVisible(); await expect(nav(page).getByRole('link',{name:'QR Menü',exact:true})).toBeHidden();
  });
  await scenario('doğrudan yayın sayfaları kapalı, 404, boş ve çevrimdışı durumları ayırır',390,async ({page,backend}) => {
    backend.publicSurfaces = surfaces;
    await visit(page,'/qr-menu/'); await expect(page.locator('[data-publication-state]')).toContainText('şu anda yayında değil');
    await expect(page.locator('[data-surface="qr_menu"]:visible')).toHaveCount(0); await expect(page.locator('[data-menu-list]')).toBeEmpty();
    await visit(page,'/restoran/'); await expect(page.locator('[data-publication-state]')).toContainText('şu anda yayında değil');
    await expect(page.locator('[data-surface="restaurant"]:visible')).toHaveCount(0); await expect(page.locator('[data-table-grid]')).toBeEmpty();
    backend.menuEnabled = true; backend.tablesEnabled = true; backend.menu = {categories:[],items:[]}; backend.tables = [];
    await visit(page,'/qr-menu/'); await expect(page.locator('[data-publication-state]')).toContainText('Henüz yayınlanmış menü ürünü');
    await visit(page,'/restoran/'); await expect(page.locator('[data-publication-state]')).toContainText('Henüz yayınlanmış masa');
    backend.menuStatus = 503; backend.tablesStatus = 503;
    await visit(page,'/qr-menu/'); await expect(page.locator('[data-publication-state]')).toContainText('bilgilerine ulaşılamadı'); await expect(page.locator('[data-menu-filters]')).toBeHidden();
    await visit(page,'/restoran/'); await expect(page.locator('[data-publication-state]')).toContainText('bilgilerine ulaşılamadı');
    backend.businessFailure = true; const start = backend.requests.length; await visit(page,'/qr-menu/');
    await expect(page.locator('[data-publication-state]')).toContainText('bilgilerine ulaşılamadı'); assert.equal(backend.requests.slice(start).some(call => call.path === 'menu'),false);
  });
  await scenario('bayi filtresi ortak navigasyona özel kategorileri sızdırmaz',390,async ({page,backend}) => {
    const original = backend.catalog.bind(backend);
    backend.catalog = owner => { const catalog = original(owner); catalog.products.forEach(product => product.category_name = 'TEST ÖZEL BAYİ KATEGORİSİ'); return catalog; };
    await login(page); await expect(page.getByLabel('Kategori',{exact:true})).toContainText('TEST ÖZEL BAYİ KATEGORİSİ');
    await expect(nav(page)).not.toContainText('TEST ÖZEL BAYİ KATEGORİSİ'); await expect(nav(page)).toContainText('Pompalar');
    backend.enabled = false; await visit(page,'/hesabim/'); await expect(page.locator('[data-dealer-workspace]')).toBeHidden(); await expect(page.getByLabel('Kategori',{exact:true})).toHaveCount(0);
    await expect(page.locator('[data-category-nav] a')).toHaveCount(0); await expect(page.locator('.header-search')).toBeHidden();
    await visit(page); await expect(page.locator('body')).not.toContainText('TEST ÖZEL BAYİ KATEGORİSİ');
  });
  await scenario('API metinleri HTML olarak çalışmaz ve güvensiz bağlantılar oluşturmaz',320,async ({page,backend}) => {
    const attack = '<img src=x onerror="window.apiInjection=true">';
    backend.business = {display_name:attack,phone:'javascript:alert(1)',email:'test@example.com?bcc=x@example.com',address:attack,website:'javascript:alert(1)',social_links:[{platform:attack,url:'https://example.com/social'},{platform:'unsafe',url:'data:text/html,test'}]};
    backend.categories = [{id:'"><script>window.apiInjection=true</script>',name:attack}];
    backend.publicSurfaces = surfaces; backend.menuEnabled = true; backend.tablesEnabled = true;
    backend.tables = [{id:'test',name:attack,description:attack,capacity:null,image_url:'javascript:alert(1)'}];
    backend.menu = {categories:[{id:'test',name:attack}],items:[{id:'test',category_id:'test',name:attack,description:attack,price:null,currency:'TRY',image_url:'data:image/svg+xml,test'}]};
    for (const path of ['/','/restoran/','/qr-menu/']) {
      await visit(page,path); await expect(page.locator('footer .footer-bottom [data-business-name]')).toHaveText(attack);
      await expect(page.locator('[data-business-phone]:visible,[data-business-email]:visible,[data-business-website]:visible')).toHaveCount(0);
      await expect(page.locator('img[src="x"],script:not([src]):not([type="application/json"]),a[href^="javascript:"],img[src^="data:"]')).toHaveCount(0);
      assert.equal(await page.evaluate(() => window.apiInjection),undefined); await fits(page,320);
    }
    await expect(page.locator('[data-menu-list] .price')).toHaveCount(0);
  });

  for (const width of [320,390,768,1440]) await scenario('tüm yayınlanmış sayfalar: oda, mağaza, iletişim, yorum, duyuru, galeri ve hakkımızda',width,async ({page,backend}) => {
    backend.publicSurfaces = ['store','rooms','restaurant','qr_menu'];
    backend.roomsEnabled = true; backend.menuEnabled = true; backend.tablesEnabled = true;
    backend.business = {
      display_name:'TEST Teknikel Yayın',phone:'+90 (555) 000 00 00',email:'test@example.com',
      whatsapp_enabled:true,whatsapp:'+90 (555) 000 00 00',address:'TEST Yayın Adresi',
      latitude:41,longitude:29,website:'https://example.com/',
      about_text:'TEST Yayınlanmış hakkımızda',description:'TEST İşletme açıklaması',
      directions_note:'TEST Yol tarifi açıklaması',google_reviews_enabled:true,
      gallery:[{id:'gallery1',kind:'photo',url:'/yardimci-asistan/media/fixture-gallery.jpg',title:'TEST Galeri Fotoğrafı'}],
      social_links:[{platform:'instagram',url:'https://instagram.com/test-business'}]
    };
    backend.campaigns = [{id:'test_campaign',channel:'website',placement:'homepage_feature',published:true,title:'TEST Yayınlanmış Duyuru',text:'TEST Kampanya metni',images:[]}];
    await visit(page);
    for (const label of ['Odalar','Restoran','QR Menü','Hakkımızda','Galeri','Yorumlar','Kampanyalar','İletişim'])
      await expect(nav(page).getByRole('link',{name:label,exact:true})).toBeVisible();
    await expect(page.locator('.campaign-section')).toBeVisible();
    await expect(page.locator('[data-category-nav] a')).toHaveCount(2);
    await fits(page,width);
    await visit(page,'/odalar/');
    await expect(page.locator('[data-public-content]')).toContainText('TEST Bahçe Odası');
    await expect(page.locator('[data-public-content]')).not.toContainText('TEST Gizli Oda');
    await page.getByRole('link',{name:'Odayı incele →',exact:true}).first().click();
    await expect(page.locator('[data-public-content]')).toContainText('TEST oda açıklaması');
    await expect(page.getByRole('heading',{level:1})).toHaveText('TEST Bahçe Odası'); await fits(page,width);
    await visit(page,'/magaza/');
    await expect(page.locator('[data-product-grid] .product-card')).toHaveCount(2);
    await fits(page,width);
    await visit(page,'/iletisim/');
    await expect(page.locator('main [data-business-email]')).toHaveAttribute('href','mailto:test@example.com');
    await expect(page.locator('main [data-business-whatsapp]')).toHaveAttribute('href','https://wa.me/905550000000');
    await expect(page.locator('main [data-business-directions]')).toHaveAttribute('href',/google.com\/maps\/dir/);
    await fits(page,width);
    await visit(page,'/hakkimizda/');
    await expect(page.locator('[data-public-content]')).toContainText('TEST Yayınlanmış hakkımızda'); await fits(page,width);
    await visit(page,'/galeri/');
    await expect(page.locator('[data-public-content] img')).toHaveCount(1);
    await expect(page.locator('[data-public-content]')).toContainText('TEST Galeri Fotoğrafı'); await fits(page,width);
    await visit(page,'/yorumlar/');
    await expect(page.locator('[data-public-content]')).toContainText('TEST Yayınlanmış yorum'); await fits(page,width);
    await visit(page,'/duyurular/');
    await expect(page.locator('[data-public-content]')).toContainText('TEST Yayınlanmış Duyuru'); await fits(page,width);
  });
  await scenario('tüm yayınlar kapalı veya başarısız: doğrudan sayfa erişimi sahte veri üretmez',390,async ({page,backend}) => {
    backend.enabled = false; backend.publicSurfaces = []; backend.business = {display_name:'TEST Boş İşletme',phone:'',email:'',website:'',social_links:[]};
    backend.campaigns = []; backend.roomsEnabled = false; backend.menuEnabled = false; backend.tablesEnabled = false;
    await visit(page);
    await expect(page.locator('.campaign-section')).toBeHidden();
    await expect(page.locator('[data-brand-section]')).toBeHidden();
    await expect(page.locator('[data-category-nav] a')).toHaveCount(0);
    await expect(page.locator('header [data-business-phone]:visible')).toHaveCount(0);
    for (const label of ['Odalar','Restoran','QR Menü','Hakkımızda','Galeri','Yorumlar','Kampanyalar','İletişim'])
      await expect(nav(page).getByRole('link',{name:label,exact:true})).toBeHidden();
    for (const path of ['/odalar/','/odalar/oda/?id=room','/restoran/','/qr-menu/','/hakkimizda/','/galeri/','/yorumlar/','/iletisim/','/duyurular/']) {
      await visit(page,path);
      await expect(page.locator('[data-publication-state]')).toContainText(/yayında değil|yayınlanmış duyuru/);
      await expect(page.locator('[data-public-content] img, [data-public-content] article')).toHaveCount(0);
      await fits(page,390);
    }
    await visit(page,'/magaza/');
    await expect(page.locator('[data-product-grid]')).toBeEmpty();
    await expect(page.locator('header').getByRole('link',{name:/Hesabım/})).toHaveCount(0);
  });
  await scenario('yorum ve galeri servis hataları ile kötü URL girişleri özel içerik açmaz',320,async ({page,backend}) => {
    backend.publicSurfaces = ['rooms']; backend.roomsEnabled = false; backend.enabled = false;
    backend.business = {display_name:'TEST Güvenlik',google_reviews_enabled:true,
      about_text:'<img src=x onerror="window.injection=true">',
      gallery:[{id:'bad',kind:'photo',url:'javascript:alert(1)',title:'TEST Kötü Fotoğraf'}],
      social_links:[{platform:'evil',url:'javascript:alert(1)'}]};
    backend.reviewsStatus = 502; backend.marketingStatus = 503;
    await visit(page);
    await expect(nav(page).getByRole('link',{name:'Yorumlar',exact:true})).toBeHidden();
    await expect(nav(page).getByRole('link',{name:'Galeri',exact:true})).toBeHidden();
    await expect(nav(page).getByRole('link',{name:'Kampanyalar',exact:true})).toBeHidden();
    await visit(page,'/hakkimizda/');
    await expect(page.locator('[data-public-content]')).toContainText('<img src=x onerror');
    assert.equal(await page.evaluate(() => window.injection),undefined);
    await visit(page,'/galeri/');
    await expect(page.locator('[data-public-content] img')).toHaveCount(0);
    await visit(page,'/yorumlar/');
    await expect(page.locator('[data-public-content]')).toBeHidden();
    await fits(page,320);
  });


  await scenario('TR EN dil seçimi kalıcıdır; yayın metinleri İngilizceyse kullanılır',390,async ({page,backend}) => {
    const metadata = translations => localizationMetadata(translations,{'Mağaza':'Store','Tüm kategoriler':'All categories','Ürün adı, stok kodu veya model ara...':'Search published products'});
    backend.business = {id:'',display_name:'TEST İşletme',about_text:'Türkçe işletme açıklaması',email:'test@example.com',address:'İstanbul Üsküdar',phone:''};
    backend.businessLocalization = metadata({business:{'published-business':{en:{about_text:'English business details'}}}});
    backend.catalogLocalization = metadata({catalog_category:{c1:{en:{name:'Pumps'}}},catalog_product:{p1:{en:{name:'Test translated pump'}}}});
    backend.menuLocalization = metadata({menu_category:{food:{en:{name:'Foods'}}},menu_product:{meal:{en:{name:'Soup'}}}});
    backend.publicSurfaces = ['store','qr_menu'];backend.menuEnabled = true;
    await visit(page,'/magaza/?lang=en&category=c1');
    await expect(page.locator('html')).toHaveAttribute('lang','en');
    await expect(page.locator('html')).toHaveAttribute('dir','ltr');
    assert.deepEqual(await page.evaluate(async () => { const {language,locale} = await import('/assets/language.js'); return {language,locale}; }),{language:'en',locale:'en-GB'});
    await expect(page.getByRole('heading',{level:1})).toHaveText('Store');
    await expect(page.locator('#global-search')).toHaveAttribute('placeholder','Search published products');
    await expect(page.locator('[data-product-grid]')).toContainText('100.00');
    await expect(page.locator('header .language-chooser [data-language="en"]')).toHaveAttribute('aria-current','true');
    await expect(page.getByRole('heading',{name:'Test translated pump',exact:true})).toBeVisible();
    await expect(page.locator('[data-category-nav]')).toContainText('Pumps');
    assert.equal(new URL(page.url()).searchParams.get('category'),'c1');
    await visit(page,'/bayi/');
    await expect(page.locator('html')).toHaveAttribute('lang','en');
    await expect(page.locator('[data-category-menu] summary')).toContainText('All categories');
    await visit(page,'/hakkimizda/');
    await expect(page.locator('[data-public-content]')).toContainText('English business details');
    await visit(page,'/qr-menu/');
    await expect(page.locator('[data-menu-list]')).toContainText('Soup');
    await expect(page.locator('header .language-chooser [data-language="tr"]')).toBeVisible();
    await page.locator('header .language-chooser [data-language="tr"]').click();
    await expect(page.locator('html')).toHaveAttribute('lang','tr');
    await expect(page.locator('[data-menu-list]')).toContainText('TEST Çorba');
    await fits(page,390);
  });
  await scenario('dil yayını kapalı: eski URL ve çerezler Türkçe HTML veya seçiciyi değiştiremez',390,async ({page,context,backend}) => {
    await context.addCookies([
      {name:'teknikel_language',value:'en',url:base,httpOnly:true},
      {name:'teknikel_site_language',value:'en',url:base}
    ]);
    backend.businessLocalization = {...localizationMetadata({}, {'Mağaza':'Unauthorized Store'}),target_languages:[],languages:[{code:'tr',locale:'tr-TR'}]};
    await visit(page,'/magaza/?q=Bosch&lang=en#filter');
    await expect(page.locator('[data-product-grid] .product-card')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang','tr');
    await expect(page.locator('.language-chooser')).toBeHidden();
    await expect(page.locator('.language-chooser')).toHaveAttribute('inert','');
    await expect(page.locator('[data-language]')).toHaveCount(0);
    await expect(page.getByRole('heading',{level:1})).toHaveText('Mağaza');
    assert.equal((await context.cookies()).some(cookie => cookie.name === 'teknikel_language'),false,'HttpOnly cookie retired by PHP');
    assert.deepEqual(await page.evaluate(async () => { const {language,locale} = await import('/assets/language.js'); return {language,locale}; }),{language:'tr',locale:'tr-TR'});
    assert.equal(new URL(page.url()).hash,'#filter');
    backend.businessFailure = true;
    await page.reload();
    await expect(page.locator('.language-chooser')).toBeHidden();
    await expect(page.locator('html')).toHaveAttribute('lang','tr');
  });
  await scenario('dil yayını açılana kadar SSR Türkçe; kaynak hash ve yalnız site metni doğrulanır',390,async ({page,context,backend}) => {
    backend.business = {display_name:'Mağaza',description:'Tüm kategoriler'};
    backend.public[0].name = 'Mağaza';
    backend.businessLocalization = localizationMetadata({}, {'Mağaza':'App Store','Tüm kategoriler':'App categories','Demo Veri Paketi':'Published demo package'});
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    await context.route('**/yardimci-asistan/api/business.php',async route => { await gate; return route.fallback(); });
    await page.goto(base+'/magaza/?category=c1&lang=en#filter',{waitUntil:'domcontentloaded'});
    await expect(page.locator('html')).toHaveAttribute('lang','tr');
    await expect(page.locator('.language-chooser')).toBeHidden();
    await expect(page.getByRole('heading',{level:1})).toHaveText('Mağaza');
    release();
    await expect(page.getByRole('heading',{level:1})).toHaveText('App Store');
    await expect(page.locator('[data-business-name]').first()).toHaveText('Mağaza');
    await expect(page.locator('[data-business-description]').first()).toHaveText('Tüm kategoriler');
    await expect(page.locator('[data-product-grid] .product-card h3').first()).toHaveText('Mağaza');
    await expect(page.locator('footer a[href="/demo-icerik/"]')).toHaveText('Published demo package ↓');
    await page.evaluate(() => { history.replaceState(null,'','?category=c1&q=Mağaza&lang=en#latest'); });
    await page.locator('.language-chooser [data-language="tr"]').click();
    await expect(page.locator('html')).toHaveAttribute('lang','tr');
    assert.equal(new URL(page.url()).searchParams.get('q'),'Mağaza');
    assert.equal(new URL(page.url()).searchParams.get('category'),'c1');
    assert.equal(new URL(page.url()).hash,'#latest');
    backend.businessLocalization.site_catalog.entries[sourceKey('Mağaza')].hash = '0'.repeat(64);
    await visit(page,'/magaza/?lang=en');
    await expect(page.locator('html')).toHaveAttribute('lang','en');
    await expect(page.getByRole('heading',{level:1})).toHaveText('Mağaza');
    await expect(page.locator('[data-category-menu] summary')).toContainText('App categories');
    backend.businessLocalization.target_languages = [];
    await page.locator('[data-reload]').click();
    await expect(page.locator('html')).toHaveAttribute('lang','tr');
    await expect(page.locator('.language-chooser')).toBeHidden();
    await expect(page.locator('[data-category-menu] summary')).toContainText('Tüm kategoriler');
  });
  await scenario('widget yayın değişimlerini izler: bayi WhatsApp ve AI bağımsız kapanır, API hatası boş kalır',390,async ({page,backend}) => {
    backend.business = {display_name:'TEST Widget',ai_enabled:false,requests_enabled:true,request_types:['dealer_application'],dealer_application_enabled:true,
      dealer_portal_enabled:true,whatsapp_enabled:true,whatsapp:'905550000000'};
    backend.publicSurfaces = ['store','directions'];
    await visit(page,'/magaza/');
    await page.waitForFunction(() => typeof window.YardimciAsistanWidget?.open === 'function');
    await page.evaluate(() => window.YardimciAsistanWidget.open());
    const cards = page.locator('#yardimci-asistan-widget .ya-widget-actions [data-support-flow]');
    await expect(cards).toHaveCount(2);
    await expect(cards.nth(0)).toHaveAttribute('data-support-flow','dealer');
    await expect(cards.nth(1)).toHaveAttribute('data-support-flow','whatsapp');
    const refresh = async () => { await page.locator('[data-reload]').evaluate(button => button.click()); };
    backend.business.dealer_application_enabled = false; await refresh();
    await expect(cards).toHaveCount(1); await expect(cards).toHaveAttribute('data-support-flow','whatsapp');
    backend.business.whatsapp_enabled = false; await refresh();
    await expect(cards).toHaveCount(0);
    await expect(page.locator('#yardimci-asistan-widget')).toBeHidden();
    backend.business.ai_enabled = true; await refresh();
    await expect(cards).toHaveCount(2);
    await expect(page.locator('#yardimci-asistan-widget')).toBeVisible();
    backend.business.ai_enabled = false; await refresh();
    await expect(cards).toHaveCount(0);
    backend.businessFailure = true; await refresh();
    await expect(cards).toHaveCount(0);
    await expect(page.locator('#yardimci-asistan-widget')).toBeHidden();
  });
  await scenario('eski katalog adresi Mağazaya yönlenir; filtre korunur; widget ve harita kullanılabilir',390,async ({page,backend}) => {
    backend.business = {display_name:'TEST Yayın',phone:'',email:'test@example.com',address:'Test İstanbul',
      latitude:41.091796,longitude:28.90748,whatsapp_enabled:true,whatsapp:'5556667788',
      social_links:[{platform:'facebook',url:'https://facebook.com/test'},{platform:'instagram',url:'https://instagram.com/test'}]};
    await visit(page,'/katalog/?q=POMPA&category=c1');
    assert.equal(new URL(page.url()).pathname,'/magaza/');
    assert.equal(new URL(page.url()).searchParams.get('q'),'POMPA');
    assert.equal(new URL(page.url()).searchParams.get('category'),'c1');
    await expect(page.locator('.nav-inner>a[href="/magaza/"]')).toHaveCount(0);
    await expect(page.locator('[data-category-menu] summary')).toBeVisible();
    await expect(page.locator('header nav.nav')).not.toContainText('Tüm Ürünler');
    await visit(page,'/iletisim/');
    await expect(page.locator('main [data-business-socials] a[aria-label="instagram"] svg')).toBeVisible();
    await expect(page.locator('main [data-business-socials] a[aria-label="facebook"] svg')).toBeVisible();
    await expect(page.locator('main [data-business-map] iframe')).toHaveAttribute('src',/openstreetmap.org\/export\/embed.html/);
    await page.waitForFunction(() => typeof window.YardimciAsistanWidget?.open === 'function');
    assert.equal(await page.locator('script[src="/assets/assistant/widget.js"]').count(),1);
    await fits(page,390);
    backend.business.latitude = null;backend.business.longitude = null;
    await page.reload();await expect(page.locator('main [data-business-map]')).toBeHidden();
  });

}
