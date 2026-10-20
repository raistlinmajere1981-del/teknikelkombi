/* Test-only API examples derived from the read-only PHP contracts. Never imported by site assets. */
import assert from 'node:assert/strict';
export const A = '11111111-1111-4111-8111-111111111111';
export const B = '22222222-2222-4222-8222-222222222222';
export const tokens = {a:'a'.repeat(43),b:'b'.repeat(43),renewed:'c'.repeat(43)};
export const publicProducts = [
  {product_id:'p1',name:'TEST Bosch Pompa',sku:'TEST-POM-101',description:'Yalnız test verisi: pompa açıklaması.',category_id:'c1',price:100,currency:'TRY',unit:'piece',tax_rate:20,availability:'available',sort_order:0,image_url:'https://images.example.com/pump.jpg'},
  {product_id:'p2',name:'TEST Kontrol Kartı',sku:'TEST-KRT-202',description:'Yalnız test verisi: kart açıklaması.',category_id:'c2',price:225.1,currency:'TRY',unit:'piece',tax_rate:20,availability:'available',sort_order:1,image_url:'https://images.example.com/board.jpg'}
];
const clone = value => JSON.parse(JSON.stringify(value));
const api = (status,json) => ({status,json,headers:{'Cache-Control':'no-store'}});
export class FixtureApi {
  enabled = true; businessFailure = false; catalogFailure = false; dealerCatalogFailure = false; ordersFailure = false; logoutFailure = false;
  deliveryMethods = ['pickup','shipping'];
  public = clone(publicProducts); requests = []; created = []; receipts = new Map(); sessions = new Map(); consumed = new Set(); revisions = {[A]:1,[B]:1};
  failNext = ''; lossNext = ''; malformedNext = ''; rejectNext = ''; nextSession = 0; deferred = null;
  catalog(owner) {
    return {access_id:owner,access_revision:this.revisions[owner],catalog_revision:'a'.repeat(64),delivery_methods:this.deliveryMethods,products:[
      {...clone(publicProducts[0]),brand:'TEST Marka',category_name:'Pompalar',price:owner === A ? 80 : 60},
      {...clone(publicProducts[1]),brand:'Diğer Marka',category_name:'Elektronik Kartlar',price:owner === A ? 180 : 150},
      {...clone(publicProducts[0]),product_id:'p3',name:'TEST Yalnız Bayi Ürünü',sku:'TEST-BAY-303',brand:'TEST Marka',price:owner === A ? 39.95 : 29.95,category_name:'Pompalar'}]};
  }
  session(headers) {
    const token = /(?:^|;\s*)ya_dealer_session=([^;]+)/.exec(headers.cookie || '')?.[1]; const session = this.sessions.get(token);
    return session && !session.revoked && session.revision === this.revisions[session.owner] ? session : null;
  }
  rotateA() { this.revisions[A]++; }
  history(owner) {
    const prefix = owner === A ? 'a' : 'b';
    const orders = [{order_id:'web_dealer_order_history_' + prefix,status:this.historyStatus || 'confirmed',created_at:'2026-10-18T12:00:00Z',updated_at:'2026-10-18T13:00:00Z',total:210,currency:'TRY',items:[{product_id:'p1',name:'TEST Bosch Pompa',quantity:2}]}];
    if (owner === A) for (const status of ['placed','fulfilled','cancelled','rejected']) orders.push({order_id:'web_dealer_order_' + status,status,created_at:'2026-10-17T12:00:00Z',updated_at:'2026-10-17T12:00:00Z',total:status === 'rejected' ? null : 80,currency:status === 'rejected' ? '' : 'TRY',items:status === 'rejected' ? [] : [{product_id:'p1',name:'TEST Bosch Pompa',quantity:1}]});
    return [...this.created.filter(order => order.owner === owner).map(order => ({order_id:order.receipt.order_id,status:'awaiting_desktop',created_at:order.receipt.accepted_at,updated_at:order.receipt.accepted_at,total:null,currency:'',items:order.payload.items.map(item => ({product_id:item.productId,name:'',quantity:item.quantity}))})),...orders];
  }
  async install(context,base) {
    await context.route('**/*',async route => {
      const req = route.request(),url = new URL(req.url());
      if (url.origin !== base) {
        if (url.origin === 'https://images.example.com') return route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200"><rect width="800" height="200" fill="#edf1f5"/><circle cx="400" cy="100" r="70" fill="#12283d"/></svg>'});
        return route.fulfill({contentType:'text/css',body:''});
      }
      if (!url.pathname.startsWith('/yardimci-asistan/api/')) return route.continue();
      const path = url.pathname.slice('/yardimci-asistan/api/'.length).replace(/\.php$/,''); const headers = await req.allHeaders();
      let payload; if (req.method() === 'POST') { assert.match(headers['content-type'],/^application\/json/); payload = req.postDataJSON(); if (path.startsWith('dealer/')) assert.equal(headers['x-ya-dealer'],'1'); }
      this.requests.push({path,method:req.method(),payload:clone(payload ?? null),cookie:headers.cookie || ''});
      let result;
      if (path === 'business') result = this.businessFailure ? api(503,{ok:false,message:'TEST işletme yayınına ulaşılamadı.'}) : api(200,{ok:true,business:{display_name:'TEST Teknikel',public_surfaces:this.enabled ? ['store'] : []}});
      else if (path === 'catalog') result = this.catalogFailure ? api(503,{ok:false,message:'TEST katalog bağlantısı yok.'}) : api(200,{ok:true,version:1,enabled:this.enabled,delivery_methods:this.enabled ? this.deliveryMethods : [],products:this.enabled ? this.public : [],categories:this.enabled ? [{id:'c1',name:'Pompalar'},{id:'c2',name:'Elektronik Kartlar'}] : [],server_revision:1,source_revision:1});
      else if (path === 'dealer/claim') {
        const token = payload.invite_token; const owner = token === tokens.b ? B : [tokens.a,tokens.renewed].includes(token) ? A : null;
        if (!owner || this.consumed.has(token)) result = api(400,{ok:false,message:'Bağlantı geçersiz veya süresi dolmuş.'});
        else {
          this.consumed.add(token); const old = this.session(headers); if (old) old.revoked = true;
          const sessionToken = String(++this.nextSession).padStart(43,'s'); this.sessions.set(sessionToken,{owner,revision:this.revisions[owner],revoked:false});
          result = api(200,{ok:true}); result.headers['Set-Cookie'] = `ya_dealer_session=${sessionToken}; Path=/yardimci-asistan/api/dealer/; HttpOnly; SameSite=Strict`;
        }
      } else if (path === 'dealer/logout') {
        if (this.logoutFailure) result = api(503,{ok:false});
        else { const session = this.session(headers); if (session) session.revoked = true; result = api(200,{ok:true}); result.headers['Set-Cookie'] = 'ya_dealer_session=; Max-Age=0; Path=/yardimci-asistan/api/dealer/; HttpOnly; SameSite=Strict'; }
      } else {
        const session = this.session(headers);
        if (path.startsWith('dealer/') && !session) result = api(401,path === 'dealer/session' ? {authenticated:false} : {ok:false,message:'Bayi erişimi gerekli.'});
        else if (path === 'dealer/session') result = api(200,{authenticated:true,dealer:{access_id:session.owner,display_name:session.owner === A ? 'TEST BAYİ A' : 'TEST BAYİ B'}});
        else if (path === 'dealer/catalog') {
          const deferred = this.deferred; if (deferred) { this.deferred = null; deferred.started(); await deferred.promise; }
          result = this.dealerCatalogFailure ? api(503,{ok:false,message:'TEST bayi kataloğu henüz hazır değil.'}) : api(200,{ok:true,catalog:this.catalog(session.owner)});
        } else if (path === 'dealer/orders') result = this.ordersFailure ? api(503,{ok:false,message:'TEST sipariş geçmişi alınamadı.'}) : api(200,{ok:true,orders:this.history(session.owner),updated_at:'2026-10-19T12:00:00Z'});
        else if (path === 'dealer/receipt') result = api(200,{ok:true,receipt:this.receipts.get(session.owner + ':' + payload.idempotencyKey)?.receipt || null});
        else if (path === 'order' || path === 'dealer/order') {
          assert.equal('unitPrice' in payload,false); assert.equal('total' in payload,false); assert.equal('priceGroup' in payload,false); assert.equal('customerId' in payload,false); assert.equal('dealerAccessId' in payload,false);
          if (session && path.startsWith('dealer/')) assert.equal('buyer' in payload,false); else assert.ok(payload.buyer?.name && payload.buyer?.phone);
          assert.ok(payload.items.length > 0 && payload.items.length <= 50); assert.ok(payload.items.every(item => Object.keys(item).sort().join(',') === 'productId,quantity'));
          const owner = path === 'order' ? 'public' : session.owner; const key = owner + ':' + payload.idempotencyKey;
          const intent = JSON.stringify({owner,revision:owner === 'public' ? 0 : session.revision,items:payload.items,delivery:payload.delivery,note:payload.note,buyer:payload.buyer}); const previous = this.receipts.get(key);
          if (previous && previous.intent !== intent) result = api(409,{ok:false,code:'idempotency_conflict',message:'Tekrar deneme kimliği farklı bir sipariş için kullanılmış.'});
          else if (previous) result = api(201,previous.receipt);
          else if (this.rejectNext === path) { this.rejectNext = ''; result = api(422,{ok:false,code:'invalid_order',message:'Lütfen ürünleri ve teslimat bilgilerini kontrol edin.'}); }
          else if (this.failNext === path) { this.failNext = ''; result = api(503,{ok:false,code:'order_unavailable',message:'TEST sunucu şu anda kullanılamıyor.'}); }
          else if (path === 'order' && !this.enabled) result = api(403,{ok:false,code:'online_sales_disabled',message:'Web siparişleri şu anda kapalı.'});
          else {
            const source = owner === 'public' ? this.public : this.catalog(owner).products;
            const total = payload.items.reduce((sum,item) => sum + source.find(product => product.product_id === item.productId).price * item.quantity,0);
            const receipt = {ok:true,order_id:(owner === 'public' ? 'web_order_' : 'web_dealer_order_') + 'fixture_' + (this.created.length + 1),accepted_at:'2026-10-19T12:00:00Z',...(owner === 'public' ? {} : {quoted_total:total,currency:'TRY'}),message:'Sipariş talebiniz alındı.'};
            this.receipts.set(key,{intent,receipt}); this.created.push({owner,payload:clone(payload),receipt}); result = api(201,receipt);
          }
          if (this.lossNext === path) { this.lossNext = ''; return route.abort('failed'); }
          if (this.malformedNext === path) { this.malformedNext = ''; return route.fulfill({status:201,contentType:'text/html',body:'<html>TEST interrupted proxy response</html>'}); }
        } else result = api(404,{ok:false,message:'TEST uç noktası yok.'});
      }
      return route.fulfill(result);
    });
  }
}
