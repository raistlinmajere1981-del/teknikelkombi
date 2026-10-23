import assert from 'node:assert/strict';
import {expect} from '@playwright/test';

export async function storefrontScenarios({scenario,base,login,fits}) {
  const visit = async (page,path = '/') => { await page.goto(base + path); await page.waitForLoadState('networkidle'); };
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
      await expect(page.locator('footer [data-business-name]')).toHaveText('TEST Yayın Adı');
      await expect(page.locator('.top-contact [data-business-phone]')).toHaveAttribute('href','tel:+905550000000');
      await expect(contact(page).locator('[data-business-email]')).toHaveAttribute('href','mailto:test@example.com');
      await expect(contact(page).locator('[data-business-address]')).toHaveText('TEST Yayın Adresi');
      await expect(contact(page).locator('[data-business-website]')).toHaveAttribute('href','https://example.com/contact');
      await expect(contact(page).getByRole('link',{name:'instagram',exact:true})).toHaveAttribute('href','https://instagram.com/test-fixture');
      const requests = backend.requests.slice(start); assert.ok([1,2].includes(requests.filter(call => call.path === 'business').length),path + ' business shared store + widget'); assert.equal(requests.filter(call => call.path === 'catalog').length,1,path);
      await fits(page,390);
    }
    backend.business = {display_name:'TEST Güncel Ad',phone:'',email:'new@example.com',address:'TEST Yeni Adres',website:'',social_links:[]};
    await visit(page,'/bayi/'); await expect(page.locator('footer [data-business-name]')).toHaveText('TEST Güncel Ad');
    await expect(page.locator('[data-business-phone]:visible')).toHaveCount(0);
    await expect(contact(page).locator('[data-business-email]')).toHaveAttribute('href','mailto:new@example.com');
    await expect(contact(page).locator('[data-business-address]')).toHaveText('TEST Yeni Adres');
    await expect(contact(page).locator('[data-business-website]')).toBeHidden();
    backend.business = {website:'https://example.com/'}; await visit(page);
    await expect(contact(page)).toBeVisible(); await expect(page.locator('.top-contact [data-contact-link]')).toBeVisible();
    backend.business = {}; await page.reload(); await page.waitForLoadState('networkidle');
    await expect(contact(page)).toBeHidden(); await expect(page.locator('[data-contact-link]:visible')).toHaveCount(0);
    backend.businessFailure = true; await page.reload(); await page.waitForLoadState('networkidle');
    await expect(contact(page)).toBeHidden(); await expect(page.locator('footer [data-business-name]')).toBeHidden();
    await expect(page.locator('.header-search')).toBeHidden(); await expect(page.locator('[data-shop-message]')).toBeHidden();
    await expect(page.locator('body')).not.toContainText('0216 462 40 98');
    await expect(page.getByRole('link',{name:/Bayi Girişi/})).toBeVisible();
  });
  await scenario('kategori kimlikleri API yayınıyla değişir; kapalı, boş ve hatalı katalog temiz kalır',390,async ({page,backend}) => {
    await visit(page); await expect(page.locator('[data-category-grid] a')).toHaveCount(2);
    await expect(page.locator('[data-category-nav] a').first()).toHaveAttribute('href','/magaza/?category=c1');
    backend.categories = [{id:'new/category & id',name:'TEST Yeni Kategori'}];
    await page.reload(); await expect(page.locator('[data-category-grid] a')).toHaveCount(1);
    await expect(page.locator('[data-category-grid]')).toContainText('TEST Yeni Kategori');
    await expect(page.locator('[data-category-nav] a')).toHaveAttribute('href','/magaza/?category=new%2Fcategory%20%26%20id');
    await page.locator('[data-category-nav] a').click();
    assert.equal(new URL(page.url()).searchParams.get('category'),'new/category & id');
    backend.categories = []; await visit(page); await expect(page.locator('[data-category-section]')).toBeHidden(); await expect(page.locator('[data-category-nav] a')).toHaveCount(0);
    backend.catalogFailure = true; await page.reload(); await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-category-grid]')).toBeEmpty(); await expect(page.locator('.header-search')).toBeHidden();
    backend.catalogFailure = false; backend.enabled = false; backend.publicSurfaces = ['store'];
    await page.reload(); await page.waitForLoadState('networkidle');
    await expect(nav(page).getByRole('link',{name:'Mağaza',exact:true})).toBeHidden(); await expect(page.getByRole('link',{name:'Perakende sepeti',exact:true})).toBeHidden();
    backend.enabled = true; backend.publicSurfaces = ['food_service','menu']; const before = backend.requests.length;
    await page.reload(); await page.waitForLoadState('networkidle');
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
    backend.publicSurfaces = ['restaurant']; backend.tablesEnabled = true; await page.reload(); await page.waitForLoadState('networkidle');
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
    backend.enabled = false; await visit(page,'/bayi/'); await expect(page.getByLabel('Kategori',{exact:true})).toContainText('TEST ÖZEL BAYİ KATEGORİSİ');
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
      await visit(page,path); await expect(page.locator('footer [data-business-name]')).toHaveText(attack);
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
    for (const label of ['Mağaza','Odalar','Restoran','QR Menü','Hakkımızda','Galeri','Yorumlar','Duyurular','İletişim'])
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
    for (const label of ['Mağaza','Odalar','Restoran','QR Menü','Hakkımızda','Galeri','Yorumlar','Duyurular','İletişim'])
      await expect(nav(page).getByRole('link',{name:label,exact:true})).toBeHidden();
    for (const path of ['/odalar/','/odalar/oda/?id=room','/restoran/','/qr-menu/','/hakkimizda/','/galeri/','/yorumlar/','/iletisim/','/duyurular/']) {
      await visit(page,path);
      await expect(page.locator('[data-publication-state]')).toContainText(/yayında değil|yayınlanmış duyuru/);
      await expect(page.locator('[data-public-content] img, [data-public-content] article')).toHaveCount(0);
      await fits(page,390);
    }
    await visit(page,'/magaza/');
    await expect(page.locator('[data-product-grid]')).toBeEmpty();
    await expect(page.getByRole('link',{name:/Bayi Girişi/})).toBeVisible();
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
    await expect(nav(page).getByRole('link',{name:'Duyurular',exact:true})).toBeHidden();
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
    const metadata = translations => ({version:1,source_language:'tr',target_languages:['en'],translations});
    backend.business = {id:'',display_name:'TEST İşletme',about_text:'Türkçe işletme açıklaması',email:'test@example.com',address:'İstanbul Üsküdar',phone:''};
    backend.businessLocalization = metadata({business:{'published-business':{en:{about_text:'English business details'}}}});
    backend.catalogLocalization = metadata({catalog_category:{c1:{en:{name:'Pumps'}}},catalog_product:{p1:{en:{name:'Test translated pump'}}}});
    backend.menuLocalization = metadata({menu_category:{food:{en:{name:'Foods'}}},menu_product:{meal:{en:{name:'Soup'}}}});
    backend.publicSurfaces = ['store','qr_menu'];backend.menuEnabled = true;
    await visit(page,'/magaza/?lang=en&category=c1');
    assert.equal(await page.locator('html').getAttribute('lang'),'en');
    await expect(page.getByRole('heading',{level:1})).toHaveText('Store');
    await expect(page.locator('header .language-chooser [data-language="en"]')).toHaveAttribute('aria-current','true');
    await expect(page.getByRole('heading',{name:'Test translated pump',exact:true})).toBeVisible();
    await expect(page.locator('[data-category-nav]')).toContainText('Pumps');
    assert.equal(new URL(page.url()).searchParams.get('category'),'c1');
    await visit(page,'/bayi/');
    assert.equal(await page.locator('html').getAttribute('lang'),'en','cookie persistence');
    await expect(page.locator('header nav a[href="/magaza/"]')).toHaveText('Store');
    await visit(page,'/hakkimizda/');
    await expect(page.locator('[data-public-content]')).toContainText('English business details');
    await visit(page,'/qr-menu/');
    await expect(page.locator('[data-menu-list]')).toContainText('Soup');
    await expect(page.locator('header .language-chooser [data-language="tr"]')).toBeVisible();
    await page.locator('header .language-chooser [data-language="tr"]').click();
    assert.equal(await page.locator('html').getAttribute('lang'),'tr');
    await expect(page.locator('[data-menu-list]')).toContainText('TEST Çorba');
    await fits(page,390);
  });
  await scenario('eski katalog adresi Mağazaya yönlenir; filtre korunur; widget ve harita kullanılabilir',390,async ({page,backend}) => {
    backend.business = {display_name:'TEST Yayın',phone:'',email:'test@example.com',address:'Test İstanbul',
      latitude:41.091796,longitude:28.90748,whatsapp_enabled:true,whatsapp:'5556667788',
      social_links:[{platform:'facebook',url:'https://facebook.com/test'},{platform:'instagram',url:'https://instagram.com/test'}]};
    await visit(page,'/katalog/?q=POMPA&category=c1');
    assert.equal(new URL(page.url()).pathname,'/magaza/');
    assert.equal(new URL(page.url()).searchParams.get('q'),'POMPA');
    assert.equal(new URL(page.url()).searchParams.get('category'),'c1');
    await expect(page.locator('header nav a[href="/magaza/"]')).toHaveCount(1);
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
