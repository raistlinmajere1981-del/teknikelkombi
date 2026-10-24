import assert from 'node:assert/strict';
import {expect} from '@playwright/test';
import {publicProducts} from './fixtures/api.mjs';

const name = publicProducts[0].name;
const cover = publicProducts[0].image_url;
const images = publicProducts[0].image_urls;

export async function galleryScenarios({scenario,base,login,dealerTab,fits,noPersonalStorage}) {
  function patchProduct(backend,mode,id,patch) {
    if (mode === 'public') Object.assign(backend.public.find(product => product.product_id === id),patch);
    else {
      const catalog = backend.catalog.bind(backend);
      backend.catalog = owner => { const result = catalog(owner); Object.assign(result.products.find(product => product.product_id === id),patch); return result; };
    }
  }
  async function openProduct(page,mode,productName = name,id = 'p1') {
    if (mode === 'public') await page.goto(base + '/urun/?id=' + id);
    else { await dealerTab(page,'Katalog').click(); await page.getByRole('button',{name:productName + ' ürününü incele',exact:true}).click(); }
    await expect(page.locator('.product-detail h1')).toHaveText(productName);
  }
  async function selected(page,index,url,total = 3,productName = name) {
    const hero = page.locator('.gallery-hero img');
    await expect(hero).toHaveAttribute('src',url);
    await expect(hero).toHaveAttribute('alt',productName + ' — görsel ' + (index + 1) + '/' + total + (index === 0 ? ' (kapak)' : ''));
    await expect.poll(() => hero.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    const thumbs = page.locator('.gallery-thumb');
    await expect(thumbs.nth(index)).toHaveAttribute('aria-pressed','true');
    await expect(page.locator('.gallery-thumb[aria-pressed=true]')).toHaveCount(1);
    await expect(page.locator('.gallery-thumb[tabindex="0"]')).toHaveCount(1);
  }
  async function cleared(page) {
    await expect(page.locator('[data-dealer-content]')).toBeEmpty();
    await expect(page.locator('.gallery-dialog')).toHaveCount(0);
    assert.equal(await page.evaluate(() => document.querySelector(':modal') === null),true);
    await expect(page.locator('[data-dealer-workspace]')).toBeHidden();
  }

  for (const width of [320,390,768,1440]) for (const mode of ['public','dealer']) {
    await scenario('gallery: ' + mode + ' cover, thumbnails, keyboard, inspection and fallbacks',width,async ({page,backend}) => {
      if (mode === 'dealer') await login(page);
      else await page.goto(base + '/');
      let card = page.locator('.product-card').filter({has:page.getByRole('heading',{name,exact:true})});
      await expect(card.locator('img')).toHaveCount(1); await expect(card.locator('img')).toHaveAttribute('src',cover);
      await expect(card.locator('.gallery-thumb')).toHaveCount(0);
      if (mode === 'public') {
        await page.goto(base + '/katalog/'); card = page.locator('.product-card').filter({has:page.getByRole('heading',{name,exact:true})});
        await expect(card.locator('img')).toHaveCount(1); await expect(card.locator('img')).toHaveAttribute('src',cover);
      }
      await openProduct(page,mode); await expect(page.locator('.gallery-thumb')).toHaveCount(3); await selected(page,0,cover);
      await expect(page.locator('.product-detail .price')).toContainText(mode === 'dealer' ? '80,00' : '100,00');
      await expect(page.locator('.gallery-hero img')).toHaveCSS('object-fit','contain'); await expect(page.locator('.gallery-hero img')).toHaveCSS('filter','none');
      await page.getByLabel('Miktar',{exact:true}).fill('2.5');
      await page.locator('.product-gallery').scrollIntoViewIfNeeded();
      const before = await page.locator('.gallery-hero').boundingBox(); const scroll = await page.evaluate(() => scrollY);
      const thumbs = page.locator('.gallery-thumb');
      for (const button of await page.locator('.gallery-thumb,.gallery-tools button').all()) {
        const size = await button.boundingBox(); assert.ok(size.width >= 44 && size.height >= 44,'44px gallery touch target');
      }
      await thumbs.nth(1).click(); await selected(page,1,images[1]); await expect(thumbs.nth(1)).toBeFocused();
      await thumbs.nth(1).press('End'); await selected(page,2,images[2]); await expect(thumbs.nth(2)).toBeFocused();
      await thumbs.nth(2).press('ArrowRight'); await selected(page,0,cover);
      await thumbs.nth(0).press('ArrowLeft'); await selected(page,2,images[2]);
      await thumbs.nth(2).press('Home'); await selected(page,0,cover);
      await thumbs.nth(0).press('ArrowRight'); await thumbs.nth(1).press(' '); await selected(page,1,images[1]);
      await thumbs.nth(1).press('Enter'); await selected(page,1,images[1]);
      await thumbs.nth(2).click(); await selected(page,2,images[2]);
      const after = await page.locator('.gallery-hero').boundingBox(); assert.deepEqual(after,before,'stable hero frame across image shapes');
      assert.ok(Math.abs(await page.evaluate(() => scrollY) - scroll) <= 1,'thumbnail changes preserve page scroll');
      await thumbs.nth(2).press('Tab');
      const enlarge = page.getByRole('button',{name:'Büyük görüntüle',exact:true}); await expect(enlarge).toBeFocused(); await enlarge.press('Enter');
      const dialog = page.getByRole('dialog',{name:name + ' büyük görsel',exact:true}); await expect(dialog).toBeVisible();
      await expect(dialog.locator('img')).toHaveAttribute('src',images[2]); await expect(dialog.getByRole('heading')).toContainText('3/3');
      const close = dialog.getByRole('button',{name:'Kapat',exact:true}); await expect(close).toBeFocused();
      const zoom = dialog.getByRole('button',{name:/^(Yakınlaştır|Görseli sığdır)$/}); await expect(zoom).toBeEnabled();
      await close.press('Shift+Tab'); await expect(zoom).toBeFocused(); await zoom.press('Tab'); await expect(close).toBeFocused();
      await zoom.click(); await expect(dialog.getByRole('button',{name:'Görseli sığdır',exact:true})).toHaveAttribute('aria-pressed','true');
      const viewer = dialog.getByRole('region');
      assert.equal(await viewer.locator('img').evaluate(img => {
        const style = getComputedStyle(img); return Math.abs(img.getBoundingClientRect().width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - img.naturalWidth) <= 1;
      }),true,'zoom displays original pixels');
      assert.equal(await viewer.evaluate(node => node.scrollWidth > node.clientWidth),true,'inspection scroll stays inside viewer');
      await viewer.focus(); await viewer.press('ArrowRight'); await expect.poll(() => viewer.evaluate(node => node.scrollLeft)).toBeGreaterThan(0);
      await fits(page,width); await page.screenshot({path:`.test-artifacts/gallery-${mode}-${width}.png`,fullPage:true});
      await viewer.press('Escape'); await expect(dialog).not.toBeVisible(); await expect(enlarge).toBeFocused();
      assert.ok(Math.abs(await page.evaluate(() => scrollY) - scroll) <= 1,'inspection close preserves page scroll');
      await enlarge.click(); await expect(dialog.getByRole('button',{name:'Yakınlaştır',exact:true})).toHaveAttribute('aria-pressed','false');
      await close.click(); await expect(dialog).not.toBeVisible();
      await expect(page.getByLabel('Miktar',{exact:true})).toHaveValue('2.5');
      await page.getByRole('button',{name:'Sepete ekle',exact:true}).click();
      const stored = await page.evaluate(() => JSON.stringify({...localStorage,...sessionStorage}));
      assert.equal(stored.includes('images.example.com'),false,'image URLs never persisted'); await noPersonalStorage(page);
      assert.ok(Object.values(await page.evaluate(() => Object.fromEntries(Object.entries(localStorage).map(([key,value]) => [key,JSON.parse(value)])))).some(cart => cart.items?.p1 === 2.5));

      // Optional list absent/malformed uses the original cover, with no thumbnail strip.
      patchProduct(backend,mode,'p2',{image_urls:{unexpected:true}});
      if (mode === 'dealer') { await page.getByRole('button',{name:'Yenile ↻',exact:true}).click(); await expect(page.locator('.gallery-thumb')).toHaveCount(3); }
      await openProduct(page,mode,publicProducts[1].name,'p2');
      await expect(page.locator('.gallery-hero img')).toHaveAttribute('src',publicProducts[1].image_url);
      await expect(page.locator('.gallery-thumbnails')).toBeHidden(); await expect(page.getByRole('button',{name:'Büyük görüntüle',exact:true})).toBeEnabled();
      // No photo reserves the same frame and keeps shopping usable.
      patchProduct(backend,mode,'p2',{image_url:null,image_urls:[]});
      if (mode === 'dealer') await page.getByRole('button',{name:'Yenile ↻',exact:true}).click();
      else await page.reload();
      await expect(page.locator('.gallery-hero .missing-photo')).toBeVisible(); await expect(page.locator('.product-gallery img')).toHaveCount(0);
      await expect(page.locator('.gallery-thumb')).toHaveCount(0); await expect(page.getByRole('button',{name:'Büyük görüntüle',exact:true})).toHaveCount(0);
      await expect(page.getByRole('button',{name:'Sepete ekle',exact:true})).toBeEnabled(); await fits(page,width);
    });
  }

  for (const mode of ['public','dealer']) {
    await scenario('gallery: ' + mode + ' validates, normalizes, deduplicates and limits URLs',320,async ({page,backend,context}) => {
      const unsafe = ['javascript:alert(1)','data:image/svg+xml,<svg/>','file:///etc/passwd','blob:https://images.example.com/id','ftp://images.example.com/a',
        'http://10.0.0.1/private.jpg','http://192.168.1.1/private.jpg','http://127.0.0.1:1/private.jpg','//10.0.0.1/private.jpg','https://user:secret@images.example.com/secret.jpg','https://[invalid',null,42,{},'   '];
      const more = Array.from({length:15},(_,i) => 'https://images.example.com/extra-' + i + '.jpg');
      patchProduct(backend,mode,'p1',{image_url:'/assets/part-pump.jpg',image_urls:[...unsafe,base + '/assets/part-pump.jpg',' /assets/part-pump.jpg ',more[0],more[0],...more]});
      const imageRequests = []; context.on('request',request => { if (request.resourceType() === 'image') imageRequests.push(request.url()); });
      if (mode === 'dealer') await login(page);
      await openProduct(page,mode); await selected(page,0,base + '/assets/part-pump.jpg',12);
      await expect(page.locator('.gallery-thumb')).toHaveCount(12);
      assert.deepEqual(await page.locator('.gallery-thumb img').evaluateAll(nodes => nodes.map(node => node.src)),[base + '/assets/part-pump.jpg',...more.slice(0,11)]);
      await page.locator('.gallery-thumb').first().press('End'); await selected(page,11,more[10],12); await fits(page,320);
      assert.equal(imageRequests.some(url => /private|secret|extra-1[1-4]\.jpg/.test(url)),false,'rejected and excess URLs are never requested');
      // A bad cover can use a valid list entry without changing the card cover policy.
      patchProduct(backend,mode,'p1',{image_url:'javascript:alert(1)',image_urls:[...unsafe,cover]});
      if (mode === 'dealer') await page.getByRole('button',{name:'Yenile ↻',exact:true}).click(); else await page.reload();
      await expect(page.locator('.gallery-hero img')).toHaveAttribute('src',cover); await expect(page.locator('.gallery-thumbnails')).toBeHidden();
      patchProduct(backend,mode,'p1',{image_urls:unsafe});
      if (mode === 'dealer') await page.getByRole('button',{name:'Yenile ↻',exact:true}).click(); else await page.reload();
      await expect(page.locator('.gallery-hero .missing-photo')).toBeVisible(); await expect(page.locator('.product-gallery img')).toHaveCount(0);
    });

    await scenario('gallery: ' + mode + ' failed images preserve quantity, recovery and shopping',390,async ({page,backend,context}) => {
      const broken = 'https://images.example.com/broken.jpg',corrupt = 'https://images.example.com/corrupt.jpg';
      await context.route(broken,route => route.fulfill({status:404,body:''}));
      await context.route(corrupt,route => route.fulfill({contentType:'image/jpeg',body:'not an image'}));
      patchProduct(backend,mode,'p1',{image_url:broken,image_urls:[broken,corrupt,cover]});
      if (mode === 'dealer') await login(page);
      await openProduct(page,mode); await expect(page.locator('.gallery-hero .missing-photo')).toBeVisible();
      await expect(page.locator('.gallery-status')).toContainText('yüklenemedi'); await expect(page.getByRole('button',{name:'Büyük görüntüle',exact:true})).toBeDisabled();
      await page.getByLabel('Miktar',{exact:true}).fill('4'); const before = await page.locator('.gallery-hero').boundingBox();
      await page.locator('.gallery-thumb').nth(1).click(); await expect(page.locator('.gallery-status')).toContainText('2 / 3 yüklenemedi');
      await expect(page.locator('.gallery-hero img')).toHaveCount(0); await expect(page.locator('.gallery-hero .missing-photo')).toBeVisible();
      await page.getByRole('button',{name:'Sepete ekle',exact:true}).click();
      await page.locator('.gallery-thumb').nth(2).click(); await selected(page,2,cover);
      await expect(page.getByRole('button',{name:'Büyük görüntüle',exact:true})).toBeEnabled(); await expect(page.getByLabel('Miktar',{exact:true})).toHaveValue('4');
      const after = await page.locator('.gallery-hero').boundingBox(); assert.equal(after.width,before.width); assert.equal(after.height,before.height);
      await fits(page,390); assert.equal(backend.created.length,0);
      // Force a real failed request in the inspector. Reopening the same URL can
      // reuse a decoded gallery image without consulting the network route.
      await page.getByRole('button',{name:'Büyük görüntüle',exact:true}).click();
      const dialog = page.getByRole('dialog'); await expect(dialog.getByRole('button',{name:'Yakınlaştır',exact:true})).toBeEnabled();
      await dialog.locator('img').evaluate((img,url) => { img.src = url; },broken);
      await expect(dialog.locator('.missing-photo')).toBeVisible();
      await expect(dialog.locator('img')).toHaveCount(0); await expect(dialog.getByRole('button',{name:'Yakınlaştır',exact:true})).toBeDisabled();
      const close = dialog.getByRole('button',{name:'Kapat',exact:true}); await close.focus(); await close.press('Shift+Tab');
      await expect(dialog.getByRole('region')).toBeFocused(); await dialog.getByRole('region').press('Tab'); await expect(close).toBeFocused();
      await dialog.getByRole('button',{name:'Kapat',exact:true}).click(); await expect(page.getByRole('button',{name:'Sepete ekle',exact:true})).toBeEnabled();
    });
  }

  for (const exit of ['logout','revoked','pagehide']) await scenario('gallery: dealer private inspection clears on ' + exit,390,async ({page,backend,context}) => {
    const privateName = 'TEST Yalnız Bayi Ürünü'; const privateRequests = [];
    context.on('request',request => { if (request.url().includes('dealer-only')) privateRequests.push(request.url()); });
    await page.goto(base + '/urun/?id=p3'); await expect(page.locator('[data-product-detail]')).toBeEmpty(); assert.deepEqual(privateRequests,[]);
    await login(page); await openProduct(page,'dealer',privateName,'p3');
    await page.locator('.gallery-thumb').nth(1).click(); await selected(page,1,'https://images.example.com/dealer-only-detail.jpg',2,privateName);
    await expect(page.locator('.product-detail .price')).toContainText('39,95');
    await page.getByRole('button',{name:'Büyük görüntüle',exact:true}).click(); await expect(page.getByRole('dialog')).toBeVisible();
    if (exit === 'logout') {
      const second = await context.newPage(); await second.goto(base + '/bayi/'); await dealerTab(second,'Hesabım').click();await second.getByRole('link',{name:'Hesap ayarları',exact:true}).click();
      await second.getByRole('button',{name:'Oturumu kapat',exact:true}).click();
    } else if (exit === 'revoked') {
      backend.rotateA(); await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    } else await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));
    await cleared(page); await expect(page.locator('body')).not.toContainText('39,95');
    assert.equal(await page.locator('body').innerHTML().then(html => html.includes('dealer-only')),false);
    await noPersonalStorage(page);
    await page.goto(base + '/katalog/'); await expect(page.locator('.product-card')).toHaveCount(2);
    await expect(page.locator('body')).not.toContainText(privateName); await expect(page.locator('body')).not.toContainText('39,95');
    assert.equal(await page.locator('body').innerHTML().then(html => html.includes('dealer-only')),false);
  });
}
