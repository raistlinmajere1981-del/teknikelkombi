import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {translate,localizePublic,languageUrl} from '../assets/language.js';

const words = JSON.parse(readFileSync(new URL('../assets/i18n/en.json',import.meta.url),'utf8'));
const meta = translations => ({version:1,source_language:'tr',target_languages:['en'],translations});

test('public UI has explicit Turkish and English copy without changing unknown text',() => {
  assert.equal(translate('Mağaza',{},'en',words),'Store');
  assert.equal(translate('Mağaza',{},'tr',words),'Mağaza');
  assert.equal(translate('TEST bilinmeyen özel ürün',{},'en',words),'TEST bilinmeyen özel ürün');
});
test('language switch preserves query, filter, fragment and uses same-site route',() => {
  assert.equal(languageUrl('https://example.com/magaza/?q=POMPA&category=c1#filter','en'),'/magaza/?q=POMPA&category=c1&lang=en#filter');
});
test('business translations use the canonical public business key, not a fake hosting ID',() => {
  const input = {ok:true,business:{id:'',about_text:'Orijinal açıklama',description:'Türkçe açıklama',phone:'5554443322',gallery:[{id:'img1',title:'Türkçe başlık'}]},localization:meta({business:{'server-pub-1':{en:{about_text:'About us',description:'English description'}}},gallery:{img1:{en:{title:'English photo'}}}})};
  const translated = localizePublic(input,'business','en');
  assert.equal(translated.business.about_text,'About us');
  assert.equal(translated.business.description,'English description');
  assert.equal(translated.business.phone,'5554443322');
  assert.equal(translated.business.gallery[0].title,'English photo');
  assert.equal(input.business.about_text,'Orijinal açıklama');
});
test('missing translation preserves Turkish published data while keeping all identity and prices',() => {
  const input = {ok:true,enabled:true,delivery_methods:['pickup'],products:[{product_id:'sku-x',category_id:'c1',name:'Türkçe ürün',price:89,currency:'TRY'}],categories:[{id:'c1',name:'Pompalar'}],localization:meta({catalog_category:{c1:{en:{name:'Pumps'}}},catalog_product:{'sku-x':{en:{name:'Pump assembly'}}}})};
  const en = localizePublic(input,'catalog','en');
  assert.equal(en.products[0].name,'Pump assembly');
  assert.equal(en.products[0].product_id,'sku-x');
  assert.equal(en.products[0].price,89);
  assert.equal(en.products[0].category_name,'Pumps');
  assert.equal(en.categories[0].name,'Pumps');
  assert.equal(input.products[0].name,'Türkçe ürün');
  assert.equal(localizePublic(input,'catalog','tr'),input);
});
test('partial room and menu translations keep names, descriptions and currency fallback without changing URLs',() => {
  const source = {ok:true,rooms:[{id:'r1',name:'Oda',description:'Açıklama',image_url:'/yardimci-asistan/media/room.jpg'}],localization:meta({room:{r1:{en:{name:'Room'}}}})};
  assert.equal(localizePublic(source,'rooms','en').rooms[0].description,'Açıklama');
  assert.equal(localizePublic(source,'rooms','en').rooms[0].name,'Room');
  assert.equal(localizePublic(source,'rooms','en').rooms[0].image_url,source.rooms[0].image_url);
  const menu={ok:true,items:[{id:'x',name:'Çay',price:12.25,currency:'TRY'}],localization:meta({menu_product:{x:{en:{name:'Tea'}}}})};
  assert.equal(localizePublic(menu,'menu','en').items[0].name,'Tea');
  assert.equal(localizePublic(menu,'menu','en').items[0].price,12.25);
  assert.equal(localizePublic(menu,'menu','en').items[0].currency,'TRY');
});
