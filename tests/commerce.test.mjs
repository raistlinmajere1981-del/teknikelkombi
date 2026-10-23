import test from 'node:test';
import assert from 'node:assert/strict';
import {ApiError,CartDraft,cartSummary,catalogFrom,filterProducts,checkReceipt,isDefinitiveRejection,orderStatus,request,photoUrl,productImageUrls} from '../assets/commerce.js';
const products = [{product_id:'p1',name:'TEST Pompa',price:80,currency:'TRY',sku:'TEST-1',brand:'TEST Marka',category_id:'c1'},{product_id:'p2',name:'TEST Kart',price:12.35,currency:'TRY',sku:'TEST-2',brand:'Diğer',category_id:'c2'}];
const catalog = {ok:true,enabled:true,products,delivery_methods:['pickup','shipping'],categories:[]};
class MemoryStorage {
  values = new Map();
  getItem(key) { return this.values.get(key) || null; }
  setItem(key,value) { this.values.set(key,value); }
}
const body = (key,attempt) => ({idempotencyKey:key,items:Object.entries(attempt?.items || {p1:2}).sort().map(([productId,quantity]) => ({productId,quantity})),delivery:{method:attempt?.method || 'pickup',address:null},note:'PRIVATE_NOTE',buyer:{name:'PRIVATE_NAME',phone:'05550000000'}});
const receipt = {ok:true,order_id:'web_order_unit_test',accepted_at:'2026-10-19T12:00:00Z'};
function draft() { const storage = new MemoryStorage(); const cart = new CartDraft('retail',storage); cart.quantity('p1',2); return {cart,storage}; }

test('cart persists only ids/quantities; server prices remain outside storage',() => {
  const {cart,storage} = draft(); const restored = new CartDraft('retail',storage);
  assert.deepEqual(restored.items,{p1:2}); assert.equal(cartSummary(restored.items,products).total,160);
  assert.equal(storage.getItem('retail').includes('TEST Pompa'),false); assert.equal(storage.getItem('retail').includes('price'),false); assert.equal(cart.items.p1,2);
});
test('quantity boundaries are enforced without partially changing cart',() => {
  const {cart,storage} = draft(); const before = storage.getItem('retail');
  for (const value of [-1,1001,Infinity,NaN,0.00001]) assert.throws(() => cart.quantity('p1',value));
  assert.equal(storage.getItem('retail'),before); cart.quantity('p2',1.25); assert.equal(cartSummary(cart.items,products).total,175.44); cart.quantity('p2',0); assert.deepEqual(cart.items,{p1:2});
});
test('50 products and 10000 total units are enforced',() => {
  const cart = new CartDraft('limit',new MemoryStorage()); for (let i = 0; i < 50; i++) cart.quantity('id-' + i,1);
  assert.throws(() => cart.quantity('extra',1));
  for (let i = 0; i < 9; i++) cart.quantity('id-' + i,1000);
  assert.throws(() => cart.quantity('id-9',1000));
});
test('public projection does not invent a missing brand',() => {
  const raw = {...catalog,products:[{product_id:'p',name:'TEST',price:3,currency:'TRY'}]}; const result = catalogFrom(raw);
  assert.equal('brand' in result.products[0],false); assert.throws(() => catalogFrom({...raw,products:[{...raw.products[0],price:-1}]}));
});
test('dealer catalog retains its actual category and brand metadata',() => {
  const result = catalogFrom({ok:true,catalog:{...catalog,access_id:'dealer-a',catalog_revision:'a'.repeat(64),products:[{...products[0],category_name:'TEST Kategori'}]}},true);
  assert.deepEqual(result.categories,[{id:'c1',name:'TEST Kategori'}]); assert.equal(result.products[0].price,80);
});
test('product photos reject unsafe protocols, credentials and remote HTTP; HTTP is limited to same-origin loopback development',() => {
  const origin = 'https://store.example';
  for (const url of [null,42,{},'', '   ','https://[invalid','javascript:alert(1)','data:image/png;base64,AAAA','file:///private','blob:https://store.example/id','ftp://store.example/a',
    'https://user:secret@images.example.com/a.jpg','https://user@images.example.com/a.jpg','http://images.example.com/a.jpg','http://10.0.0.1/a.jpg','http://192.168.1.1/a.jpg','http://127.0.0.1/a.jpg']) assert.equal(photoUrl(url,origin),'',String(url));
  assert.equal(photoUrl('/photo.jpg',origin),origin + '/photo.jpg');
  assert.equal(photoUrl('https://images.example.com/a.jpg',origin),'https://images.example.com/a.jpg');
  for (const dev of ['http://127.0.0.1:8093','http://localhost:8093','http://[::1]:8093']) {
    assert.equal(photoUrl('/photo.jpg',dev),dev + '/photo.jpg');
    assert.equal(photoUrl('http://10.0.0.1/photo.jpg',dev),'');
    assert.equal(photoUrl('http://127.0.0.1:8094/photo.jpg',dev),'');
  }
  for (const nonDev of ['http://store.example','http://192.168.1.10:8093']) assert.equal(photoUrl('/photo.jpg',nonDev),'');
});
test('product image list keeps the normalized cover first, deduplicates and caps safe entries at twelve without mutating the catalog',() => {
  const origin = 'https://store.example';
  const list = Array.from({length:15},(_,i) => '/photo-' + i + '.jpg');
  const product = {image_url:'/cover.jpg',image_urls:['javascript:alert(1)',null,origin + '/cover.jpg',' /cover.jpg ',list[0],list[0],...list]};
  const before = structuredClone(product);
  assert.deepEqual(productImageUrls(product,origin),[origin + '/cover.jpg',...list.slice(0,11).map(url => origin + url)]);
  assert.deepEqual(product,before);
  for (const image_urls of [undefined,null,{},'/extra.jpg',[]]) assert.deepEqual(productImageUrls({image_url:'/cover.jpg',image_urls},origin),[origin + '/cover.jpg']);
  assert.deepEqual(productImageUrls({},origin),[]);
  assert.deepEqual(productImageUrls({image_url:'data:image/png;base64,AAAA',image_urls:['http://10.0.0.1/a.jpg','/valid.jpg']},origin),[origin + '/valid.jpg']);
  assert.deepEqual(productImageUrls({image_url:'javascript:alert(1)',image_urls:['data:image/png;base64,AAAA']},origin),[]);
});
test('Turkish search, category, brand and favorites filter published products',() => {
  assert.equal(filterProducts(products,{q:'test-1'})[0].product_id,'p1'); assert.equal(filterProducts(products,{q:'MARKA',brand:'TEST Marka'}).length,1);
  assert.equal(filterProducts(products,{category:'c2',favorites:['p1']}).length,0);
  assert.equal(filterProducts([{...products[0],name:'İŞLEM KARTI'}],{q:'işlem'}).length,1);
});
test('display subtotal uses the supplied private prices and rejects mixed currencies',() => {
  assert.equal(cartSummary({p1:3},products).total,240); assert.throws(() => cartSummary({p1:1,p2:1},[products[0],{...products[1],currency:'USD'}]));
  assert.throws(() => cartSummary({removed:1},products));
});
test('retail and each dealer have separate carts and favorite sets',() => {
  const storage = new MemoryStorage(); const a = new CartDraft('dealer:a',storage),b = new CartDraft('dealer:b',storage),retail = new CartDraft('retail',storage);
  a.quantity('p1',3); a.favorite('p1'); b.quantity('p2',1); retail.quantity('p1',9);
  assert.deepEqual(a.read().items,{p1:3}); assert.deepEqual(b.read().items,{p2:1}); assert.deepEqual(b.favorites,[]); assert.deepEqual(retail.read().items,{p1:9});
});
test('uncertain submission freezes cart and retries its exact body',async () => {
  const {cart,storage} = draft(); const first = await cart.prepare(body); assert.ok(JSON.parse(storage.getItem('retail')).pending);
  assert.throws(() => cart.quantity('p1',4)); const second = await cart.prepare(() => { throw new Error('must not rebuild'); }); assert.deepEqual(second,first);
  const raw = storage.getItem('retail'); for (const text of ['PRIVATE_NOTE','PRIVATE_NAME','05550000000','buyer','address','price']) assert.equal(raw.includes(text),false,text);
});
test('after reload matching personal details reuse original key and body',async () => {
  const {cart,storage} = draft(); const first = await cart.prepare(body); const restored = new CartDraft('retail',storage); assert.equal(restored.payload,null);
  const second = await restored.prepare(body); assert.deepEqual(second,first);
});
test('after reload changed personal details cannot start a different uncertain order',async () => {
  const {cart,storage} = draft(); const first = await cart.prepare(body); const restored = new CartDraft('retail',storage);
  await assert.rejects(() => restored.prepare((key,attempt) => ({...body(key,attempt),note:'CHANGED'})),/aynı iletişim/); assert.equal(restored.pending.key,first.idempotencyKey);
});
test('disk failure blocks preparing a send and leaves the previous stored draft intact',async () => {
  const {cart,storage} = draft(); const before = storage.getItem('retail'); storage.setItem = () => { throw new Error('quota'); };
  await assert.rejects(() => cart.prepare(body),/kaydedilemiyor/); assert.equal(storage.getItem('retail'),before); assert.equal(cart.payload,null);
});
test('acceptance clears only the matching pending order; a late ack cannot clear new cart',async () => {
  const {cart,storage} = draft(); const first = await cart.prepare(body); cart.accepted(receipt,first.idempotencyKey); assert.deepEqual(cart.items,{});
  cart.quantity('p2',1); cart.accepted(receipt,first.idempotencyKey); assert.deepEqual(new CartDraft('retail',storage).items,{p2:1});
});
test('malformed success never clears the pending order',async () => {
  const {cart} = draft(); const payload = await cart.prepare(body);
  assert.throws(() => cart.accepted({ok:true},payload.idempotencyKey)); assert.equal(cart.pending.key,payload.idempotencyKey); assert.deepEqual(cart.items,{p1:2});
  for (const invalid of [{...receipt,ok:false},{...receipt,accepted_at:'not-date'},{...receipt,quoted_total:-1,currency:'TRY'}]) assert.throws(() => checkReceipt(invalid));
});
test('a second intentional order receives a different key after a valid ack',async () => {
  const {cart} = draft(); const first = await cart.prepare(body); cart.accepted(receipt,first.idempotencyKey); cart.quantity('p1',2); const second = await cart.prepare(body); assert.notEqual(second.idempotencyKey,first.idempotencyKey);
});
test('another tab changing the cart during preparation prevents a stale send',async () => {
  const {cart,storage} = draft(); const flight = cart.prepare(body); new CartDraft('retail',storage).quantity('p1',3);
  await assert.rejects(flight,/başka bir sekmede/); assert.equal(new CartDraft('retail',storage).pending,null);
});
test('two tabs cannot claim different pending keys for one cart',async () => {
  const {cart,storage} = draft(); const other = new CartDraft('retail',storage);
  const results = await Promise.allSettled([cart.prepare(body),other.prepare(body)]); const accepted = results.filter(result => result.status === 'fulfilled'); assert.ok(accepted.length >= 1); assert.equal(new Set(accepted.map(result => result.value.idempotencyKey)).size,1);
  assert.ok(new CartDraft('retail',storage).pending);
});
test('reorder uses current catalog and skips removed products atomically',() => {
  const {cart,storage} = draft(); assert.equal(cart.reorder([{product_id:'p1',quantity:1},{product_id:'removed',quantity:2}],products),1); assert.equal(cartSummary(cart.items,products).total,240);
  const before = storage.getItem('retail'); assert.throws(() => cart.reorder([{product_id:'p1',quantity:1},{product_id:'p2',quantity:1001}],products)); assert.equal(storage.getItem('retail'),before);
});
test('only authoritative validation/rejection responses unlock an uncertain draft',() => {
  assert.equal(isDefinitiveRejection(new ApiError('invalid',422,'invalid_order')),true);
  assert.equal(isDefinitiveRejection(new ApiError('off',403,'online_sales_disabled')),true);
  for (const status of [0,401,409,429,502,503]) assert.equal(isDefinitiveRejection(new ApiError('unknown',status)),false);
});
test('canonical and transport statuses stay distinct',() => {
  assert.match(orderStatus('awaiting_desktop'),/aktarımı?m? bekleniyor|aktar[ıi]m bekleniyor/i);
  assert.equal(orderStatus('confirmed'),'Onaylandı'); assert.equal(orderStatus('fulfilled'),'Tamamlandı'); assert.equal(orderStatus('cancelled'),'İptal edildi'); assert.match(orderStatus('unknown'),/doğrulanamadı/);
});
test('requests use same-origin cookies and existing custom dealer header, never publication credentials',async () => {
  const original = globalThis.fetch; const calls = [];
  globalThis.fetch = async (url,options) => { calls.push({url,options}); return new Response(JSON.stringify({ok:true}),{status:200,headers:{'Content-Type':'application/json'}}); };
  try {
    await request('dealer/order',{idempotencyKey:'fixed-key-1234567'}); await request('order',{items:[]});
    assert.equal(calls[0].url,'/yardimci-asistan/api/dealer/order.php'); assert.equal(calls[0].options.headers['X-YA-Dealer'],'1'); assert.equal(calls[0].options.credentials,'same-origin'); assert.equal(calls[0].options.redirect,'error');
    assert.equal('Authorization' in calls[0].options.headers,false); assert.equal('X-YA-Dealer' in calls[1].options.headers,false);
  } finally { globalThis.fetch = original; }
});
test('invalid JSON and redirect/network failure remain uncertain',async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response('<html>proxy</html>',{status:201}); await assert.rejects(() => request('order',{}),error => error instanceof ApiError && error.status === 502);
    globalThis.fetch = async () => { throw new TypeError('redirect'); }; await assert.rejects(() => request('order',{}),error => error instanceof ApiError && error.status === 0);
  } finally { globalThis.fetch = original; }
});

test('even a null or malformed 401 body keeps the status needed to clear private UI',async () => {
  const original = globalThis.fetch;
  try {
    for (const body of ['null','<html>unauthorized</html>']) {
      globalThis.fetch = async () => new Response(body,{status:401});
      await assert.rejects(() => request('dealer/catalog'),error => error instanceof ApiError && error.status === 401);
    }
  } finally { globalThis.fetch = original; }
});
