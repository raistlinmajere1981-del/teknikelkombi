import assert from 'node:assert/strict';
import {expect} from '@playwright/test';

export async function customerRequestScenarios({scenario,base,fits,noPersonalStorage}) {
  const configure = backend => {
    backend.business = {display_name:'TEST Request Business',ai_enabled:false,requests_enabled:true,
      request_types:['general_info','price_question','dealer_application'],dealer_application_enabled:true,
      whatsapp_enabled:true,whatsapp:'905550000000',address:'TEST İstanbul'};
    backend.publicSurfaces = ['store','directions'];
  };
  const widget = page => page.locator('#yardimci-asistan-widget');
  const form = page => widget(page).locator('[data-customer-request-form]');
  const open = async page => { await page.locator('#yardimci-asistan-widget [data-ya-open]').click(); };
  const fill = async (page,product = false) => {
    const target = form(page);
    if (product) await target.getByLabel('İlgili ürün',{exact:true}).selectOption('p2');
    await target.getByLabel('Ad soyad',{exact:true}).fill('TEST PRIVATE CUSTOMER');
    await target.getByLabel('Telefon',{exact:true}).fill('0555 000 00 00');
    await target.getByLabel('Sorunuz',{exact:true}).fill('TEST PRIVATE QUESTION stok var mı?');
  };
  for (const width of [390,1440]) await scenario('no-AI requests: real general/product forms, validation, idempotent retry and accessible navigation',width,async ({page,context,backend}) => {
    configure(backend); const sends = []; let release;
    const gate = new Promise(resolve => release = resolve);
    await context.route('**/yardimci-asistan/api/request.php',async route => {
      const request = route.request(); sends.push({url:request.url(),method:request.method(),headers:request.headers(),body:request.postDataJSON()});
      if (sends.length === 1) { await gate; return route.fulfill({status:503,json:{ok:false}}); }
      if (sends.length === 2) return route.abort('failed'); // ambiguous response loss
      return route.fulfill({status:201,json:{ok:true,request_id:'fixture_request_'+sends.length}});
    });
    await page.goto(base+'/magaza/'); await open(page);
    const panel = widget(page);
    await expect(panel.getByRole('tab',{name:'İşlemler',exact:true})).toHaveAttribute('aria-selected','true');
    await expect(panel.getByRole('tab',{name:'Sohbet',exact:true})).toHaveCount(0);
    for (const id of ['general','product','dealer','whatsapp','directions']) await expect(panel.locator(`[data-support-flow="${id}"]`)).toBeVisible();
    await panel.getByRole('tab',{name:'İletişim',exact:true}).click();
    await expect(panel.locator('[data-support-flow="general"]')).toBeHidden();
    await expect(panel.locator('[data-support-flow="product"]')).toBeHidden();
    await expect(panel.locator('[data-support-flow="whatsapp"]')).toBeVisible();
    await panel.getByRole('tab',{name:'İşlemler',exact:true}).click();
    await panel.locator('[data-support-flow="general"]').click();
    await expect(panel.getByRole('heading',{name:'Bilgi talebi oluştur',exact:true})).toBeFocused();
    await expect(form(page).locator('[type=date],[name=start_date],[name=end_date],[name=date_text],[name=time],[name=guest_count],[data-ya-form]')).toHaveCount(0);
    const submit = form(page).getByRole('button',{name:'Talebi Gönder',exact:true});
    await submit.click(); assert.equal(sends.length,0);
    await fill(page); await form(page).getByLabel('Telefon',{exact:true}).fill('invalid');
    await submit.click(); await expect(form(page).locator('[role=status]')).toContainText('Geçerli bir telefon'); assert.equal(sends.length,0);
    await form(page).getByLabel('Telefon',{exact:true}).fill('05550000000');
    await form(page).getByLabel('Sorunuz',{exact:true}).fill('   ');
    await submit.click(); await expect(form(page).locator('[role=status]')).toContainText('Lütfen sorunuzu yazın'); assert.equal(sends.length,0);
    await form(page).getByLabel('Sorunuz',{exact:true}).fill('TEST PRIVATE QUESTION stok var mı?');
    await submit.click(); await expect(submit).toBeDisabled();
    await form(page).evaluate(node => node.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
    await expect.poll(() => sends.length).toBe(1); release();
    await expect(form(page).locator('[role=status]')).toContainText('Gönderim doğrulanamadı');
    await submit.click(); await expect(form(page).locator('[role=status]')).toContainText('Gönderim doğrulanamadı');
    await expect(submit).toBeEnabled(); await submit.click();
    await expect(panel.getByText('Talebiniz işletmeye iletildi.',{exact:true})).toBeVisible();
    assert.equal(sends.length,3);
    assert.deepEqual(sends[0].body,sends[1].body); assert.deepEqual(sends[1].body,sends[2].body);
    const general = sends[0].body;
    assert.deepEqual(general,{request_type:'general_info',customer_name:'TEST PRIVATE CUSTOMER',customer_phone:'+905550000000',message:'TEST PRIVATE QUESTION stok var mı?',source:'web_form',guest_count:1,whatsapp_message:'',context:{resourceType:'',resourceId:'',resourceName:'',sourcePath:'/magaza/'},idempotency_key:general.idempotency_key});
    assert.match(general.idempotency_key,/^[a-f0-9]{32}$/);
    await panel.getByRole('button',{name:'Tamam',exact:true}).click();
    await expect(panel.locator('[data-support-flow="general"]')).toBeFocused();
    await panel.locator('[data-support-flow="product"]').click(); await fill(page);
    await form(page).getByRole('button',{name:'Talebi Gönder',exact:true}).click(); assert.equal(sends.length,3,'product selection required');
    await form(page).getByLabel('İlgili ürün',{exact:true}).selectOption('p2');
    await fits(page,width);
    assert.equal(await form(page).evaluate(node => node.scrollWidth <= node.clientWidth),true,'form fits widget');
    await page.screenshot({path:`.test-artifacts/customer-request-${width}.png`,fullPage:true});
    await form(page).getByRole('button',{name:'Talebi Gönder',exact:true}).click();
    await expect(panel.getByText('Talebiniz işletmeye iletildi.',{exact:true})).toBeVisible();
    const product = sends[3].body;
    assert.equal(product.request_type,'price_question');
    assert.equal(product.message,'İlgili ürün: TEST Kontrol Kartı (TEST-KRT-202)\nTEST PRIVATE QUESTION stok var mı?');
    assert.deepEqual(product.context,{resourceType:'product',resourceId:'p2',resourceName:'TEST Kontrol Kartı',sourcePath:'/magaza/'});
    assert.notEqual(product.idempotency_key,general.idempotency_key);
    for (const send of sends) {
      assert.equal(send.url,base+'/yardimci-asistan/api/request.php'); assert.equal(send.method,'POST'); assert.match(send.headers['content-type'],/^application\/json/);
      for (const key of ['start_date','end_date','date_text','time']) assert.equal(key in send.body,false);
    }
    await noPersonalStorage(page);
    assert.equal((await page.evaluate(() => JSON.stringify({...localStorage,...sessionStorage}))).includes('TEST PRIVATE QUESTION'),false);
    await panel.getByRole('button',{name:'Geri',exact:true}).click();
    await expect(panel.locator('[data-support-flow="product"]')).toBeFocused();
    await panel.locator('[data-support-flow="general"]').click();
    await panel.locator('[data-ya-close]').click(); await expect(panel.locator('.ya-widget-panel')).toHaveCount(0);
    await open(page); await expect(panel.locator('[data-support-flow="general"]')).toBeVisible();
    await panel.locator('[data-support-flow="general"]').click(); await page.keyboard.press('Escape'); await expect(panel.locator('.ya-widget-panel')).toHaveCount(0);
    assert.equal(backend.requests.some(call => call.method === 'POST'),false,'no AI or native reservation submits');
  });
  await scenario('no-AI requests: general_info product fallback sends context, price-only publication hides general',390,async ({page,context,backend}) => {
    configure(backend); backend.business.request_types = ['general_info']; const sends = [];
    await context.route('**/yardimci-asistan/api/request.php',async route => { sends.push(route.request().postDataJSON()); return route.fulfill({status:201,json:{ok:true,request_id:'fixture_fallback'}}); });
    await page.goto(base+'/magaza/'); await open(page);
    await widget(page).locator('[data-support-flow="product"]').click(); await fill(page,true);
    await form(page).getByRole('button',{name:'Talebi Gönder',exact:true}).click();
    await expect(widget(page).getByText('Talebiniz işletmeye iletildi.',{exact:true})).toBeVisible();
    assert.equal(sends[0].request_type,'general_info'); assert.equal(sends[0].context.resourceId,'p2');
    backend.business.request_types = ['price_question']; await page.reload(); await open(page);
    await expect(widget(page).locator('[data-support-flow="general"]')).toHaveCount(0);
    await expect(widget(page).locator('[data-support-flow="product"]')).toBeVisible();
  });
  await scenario('no-AI requests: reload revokes open form immediately, absent business and removed store fail closed',390,async ({page,context,backend}) => {
    configure(backend); await page.goto(base+'/magaza/'); await open(page);
    const panel = widget(page), refresh = () => page.locator('[data-reload]').evaluate(button => button.click());
    await panel.locator('[data-support-flow="product"]').click(); await fill(page,true);
    let release; const gate = new Promise(resolve => release = resolve);
    await context.route('**/yardimci-asistan/api/business.php',async route => { await gate; return route.fallback(); },{times:1});
    backend.business.request_types = []; await refresh();
    await expect(form(page)).toHaveCount(0); await expect(panel.locator('[data-support-flow="general"],[data-support-flow="product"],[data-support-flow="dealer"]')).toHaveCount(0);
    release(); await expect(panel.locator('[data-support-flow="whatsapp"]')).toBeVisible();
    backend.business.request_types = ['general_info']; await refresh();
    await expect(panel.locator('[data-support-flow="product"]')).toBeVisible();
    backend.public = []; await refresh(); await expect(panel.locator('[data-support-flow="product"]')).toHaveCount(0);
    await expect(panel.locator('[data-support-flow="general"]')).toBeVisible();
    backend.businessFailure = true; await refresh(); await expect(panel).toBeHidden(); await expect(panel.locator('[data-support-flow]')).toHaveCount(0);
    assert.equal(backend.requests.some(call => call.path === 'request'),false);
  });
  await scenario('no-AI requests: AI toggles independently; unpublished types never create native cards',390,async ({page,backend}) => {
    configure(backend); backend.business.ai_enabled = true;
    backend.business.request_types = ['general_info'];
    await page.goto(base+'/magaza/'); await open(page); const panel = widget(page);
    await expect(panel.locator('[data-support-flow="product"]')).toBeVisible();
    await panel.getByRole('tab',{name:'Sohbet',exact:true}).click();
    await expect(panel.locator('[data-support-flow="parts"]')).toBeVisible(); await expect(panel.locator('[data-support-flow="product"]')).toBeHidden();
    backend.business.requests_enabled = false; await page.locator('[data-reload]').evaluate(button => button.click());
    await expect(panel.locator('[data-support-flow="general"],[data-support-flow="product"]')).toHaveCount(0);
    await expect(panel.locator('[data-support-flow="chat"]')).toBeVisible();
    await expect(panel.locator('[data-ya-request-type]')).toHaveCount(0);
  });
  await scenario('no-AI requests: server permission revocation blocks retries and never reports success',390,async ({page,context,backend}) => {
    configure(backend); let sends = 0;
    await context.route('**/yardimci-asistan/api/request.php',async route => { sends++; return route.fulfill({status:403,json:{ok:false,code:'request_type_disabled'}}); });
    await page.goto(base+'/magaza/'); await open(page); await widget(page).locator('[data-support-flow="general"]').click(); await fill(page);
    const submit = form(page).getByRole('button',{name:'Talebi Gönder',exact:true}); await submit.click();
    await expect(form(page).locator('[role=status]')).toContainText('artık yayında değil'); await expect(submit).toBeDisabled();
    await form(page).evaluate(node => node.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
    assert.equal(sends,1); await expect(widget(page).locator('.publication-request-success')).toHaveCount(0);
  });
}
