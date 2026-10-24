import test from 'node:test';
import assert from 'node:assert/strict';
import {createStorefront,hasSurface,storeEnabled,phoneUrl,emailUrl,websiteUrl,publicCategories} from '../assets/storefront.js';
import {menuFrom,menuPrice,tableCapacity} from '../assets/publications.js';

test('public surfaces require exact publication names and an enabled public catalog',() => {
  const business = {business:{profile:'pension_restaurant',public_surfaces:['food_service','menu','qr_menu']}};
  assert.equal(hasSurface(business,'restaurant'),false); assert.equal(hasSurface(business,'qr_menu'),true);
  assert.equal(storeEnabled(business,{enabled:true}),false);
  business.business.public_surfaces.push('store');
  assert.equal(storeEnabled(business,{enabled:true}),true);
  for (const catalog of [null,{}, {enabled:1},{enabled:false}]) assert.equal(storeEnabled(business,catalog),false);
  assert.equal(hasSurface({business:{public_surfaces:'restaurant'}},'restaurant'),false);
});
test('contact URLs reject injected schemes, controls, credentials and mail parameters',() => {
  assert.equal(phoneUrl('+90 (555) 000 00 00'),'tel:+905550000000');
  assert.equal(emailUrl('test@example.com'),'mailto:test@example.com');
  assert.equal(websiteUrl('https://example.com/contact?q=1'),'https://example.com/contact?q=1');
  for (const value of ['',null,{},'javascript:alert(1)','+123','5550000000;123','5550000000\n123','<img src=x>']) assert.equal(phoneUrl(value),'');
  for (const value of ['',null,'x@example.com?bcc=private@example.com','x@example.com\r\nBcc:y@example.com','<x>@example.com']) assert.equal(emailUrl(value),'');
  for (const value of ['',null,'javascript:alert(1)','data:text/html,test','//example.com','https://user:secret@example.com','https://exam\nple.com','https://example.com\\@other.com','/local']) assert.equal(websiteUrl(value),'');
});
test('public categories use valid API identities and never derive private names from products',() => {
  assert.deepEqual(publicCategories({products:[{category_id:'private',category_name:'PRIVATE'}],categories:[null,{id:'c',name:'TEST'},{id:'c',name:'duplicate'},{name:'missing ID'},{id:'empty',name:' '}]}),[{id:'c',name:'TEST'}]);
});
test('menu joins only active published categories and items, with no synthetic category',() => {
  const result = menuFrom({categories:[{id:'c',name:'TEST'},{id:'inactive',name:'HIDDEN',is_active:false}],items:[{id:'a',name:'TEST',category_id:'c'},{id:'b',name:'HIDDEN',category_id:'c',is_active:false},{id:'c',name:'HIDDEN',category_id:'inactive'},{id:'d',name:'HIDDEN',category_id:'missing'}]});
  assert.deepEqual(result.items.map(item => item.id),['a']); assert.equal(result.categories.length,1);
  assert.throws(() => menuFrom({categories:[],items:null}));
});
test('menu prices preserve decimals and valid zero; missing price, currency or capacity is never invented',() => {
  assert.match(menuPrice({price:12.25,currency:'TRY'}),/12,25/);
  assert.match(menuPrice({unit_price:5.5,currency:'TRY'}),/5,50/);
  assert.match(menuPrice({price:0,currency:'TRY'}),/0,00/);
  for (const item of [{currency:'TRY'},{price:null,currency:'TRY'},{price:-1,currency:'TRY'},{price:'12',currency:'TRY'},{price:12},{price:12,currency:'invalid'}]) assert.equal(menuPrice(item),'');
  assert.equal(tableCapacity({capacity:4}),'4 kişi');
  for (const capacity of [undefined,null,0,-1,2.5,'4']) assert.equal(tableCapacity({capacity}),'');
});
test('shared publication loads once, refreshes explicitly and never requests an unpublished public catalog',async () => {
  const requests = [], root = {querySelectorAll:() => []};
  let surfaces = ['store'];
  const storefront = createStorefront(root,async endpoint => {
    requests.push(endpoint);
    return endpoint === 'business' ? {ok:true,business:{public_surfaces:surfaces}} : {ok:true,enabled:true,categories:[],products:[],delivery_methods:[]};
  });
  const [chrome,commerce] = await Promise.all([storefront.load(),storefront.load()]);
  assert.equal(chrome,commerce); assert.deepEqual(requests,['business','marketing','catalog']);
  await storefront.load(); assert.equal(requests.length,3);
  surfaces = ['food_service','menu']; const updated = await storefront.load(true);
  assert.deepEqual(requests,['business','marketing','catalog','business','marketing']); assert.equal(updated.catalog,null);
});
test('a failed business publication stays empty and an explicit refresh recovers without stale data',async () => {
  let failed = true;
  const storefront = createStorefront({querySelectorAll:() => []},async endpoint => {
    if (endpoint === 'marketing') return {ok:true,publications:[]};
    assert.equal(endpoint,'business'); if (failed) throw new Error('offline');
    return {ok:true,business:{display_name:'TEST recovered',public_surfaces:[]}};
  });
  const failedSnapshot = await storefront.load();
  assert.equal(failedSnapshot.business,null); assert.equal(failedSnapshot.catalog,null);
  assert.equal(Object.values(failedSnapshot.view.sections).some(Boolean),false);
  failed = false; assert.equal((await storefront.load(true)).business.business.display_name,'TEST recovered');
});
test('a late older publication cannot replace a refreshed shared chrome',async () => {
  const display = {tagName:'P',hidden:true,textContent:''};
  const root = {querySelectorAll:selector => selector === '[data-business-name]' ? [display] : []};
  let release, calls = 0;
  const oldBusiness = new Promise(resolve => release = resolve);
  const storefront = createStorefront(root,async () => ++calls === 1 ? oldBusiness : {business:{display_name:'TEST current',public_surfaces:[]}});
  const first = storefront.load(); await Promise.resolve();
  await storefront.load(true); assert.equal(display.textContent,'TEST current');
  release({business:{display_name:'TEST stale',public_surfaces:[]}}); await first;
  assert.equal(display.textContent,'TEST current');
});
