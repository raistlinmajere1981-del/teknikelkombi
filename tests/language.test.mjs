import assert from 'node:assert/strict';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {translate,localizePublic,languageUrl,publishedLanguages,selectedLanguage,verifiedMessages,applyLocalization,language,locale} from '../assets/language.js';

const catalog = JSON.parse(readFileSync(new URL('../assets/i18n/tr.json',import.meta.url),'utf8'));
const languages = [{code:'tr',locale:'tr-TR',nativeName:'Türkçe'}, {code:'en',locale:'en-GB',nativeName:'English'}];
const meta = translations => ({version:1,source_language:'tr',target_languages:['en'],languages,site_catalog:catalog,translations});
const key = text => 'phrase.' + createHash('sha256').update(text).digest('hex');
const siteText = (source, text) => ({[catalog.id + ':' + key(source)]:{en:{text}}});

test('only published target languages enable selection; stale URL and both cookies cannot grant English',() => {
  const href = 'https://example.com/magaza/?q=POMPA&lang=en#filter';
  for (const metadata of [undefined,{}, {...meta({}),target_languages:[]}, {...meta({}),languages:[languages[0]]}, {...meta({}),version:2}]) {
    assert.deepEqual(publishedLanguages(metadata).map(item => item.code),['tr']);
    assert.equal(selectedLanguage(metadata,href,'teknikel_language=en; teknikel_site_language=en').code,'tr');
  }
  assert.equal(selectedLanguage(meta({}),href).code,'en');
  assert.equal(selectedLanguage(meta({}),'https://example.com/','teknikel_site_language=en').code,'en');
  assert.equal(selectedLanguage(meta({}),'https://example.com/','teknikel_language=en').code,'tr');
  assert.equal(selectedLanguage(meta({}),'https://example.com/','teknikel_site_language=%broken').code,'tr');
  assert.equal(selectedLanguage(meta({}),'https://example.com/?lang=xx','teknikel_site_language=en').code,'tr');
});
test('verified app site_text is the sole UI dictionary; missing or stale source publication stays Turkish',async () => {
  const metadata = meta({site_text:siteText('Mağaza','Published Store')});
  assert.equal((await verifiedMessages(catalog,metadata,'en')).get('Mağaza'),'Published Store');
  assert.equal((await verifiedMessages(catalog,metadata,'tr')).size,0);
  for (const mutate of [
    item => { item.site_catalog.entries[key('Mağaza')].hash = '0'.repeat(64); },
    item => { item.site_catalog.entries[key('Mağaza')].text = 'Eski mağaza'; },
    item => { item.site_catalog.id = 'other-site'; },
    item => { delete item.site_catalog; },
    item => { item.translations = {}; },
    item => { item.target_languages = []; }
  ]) {
    const copy = structuredClone(metadata); mutate(copy);
    assert.equal((await verifiedMessages(catalog,copy,'en')).size,0);
  }
  const forged = structuredClone(catalog);
  forged.entries[key('Mağaza')].text = 'Sahte kaynak';
  const forgedMeta = meta({site_text:siteText('Mağaza','Forged')}); forgedMeta.site_catalog = forged;
  assert.equal((await verifiedMessages(forged,forgedMeta,'en')).size,0,'matching published/local hashes must still hash the actual UTF-8 text');
});
test('translation placeholders must match including duplicate placeholders',async () => {
  const text = 'Ürün {count}', hash = createHash('sha256').update(text).digest('hex');
  const source = {...catalog,entries:{['phrase.'+hash]:{text,hash}}};
  for (const [translation,allowed] of [['Products {count}',true],['Products',false],['Products {other}',false],['Products {count} {count}',false]]) {
    const metadata = meta({site_text:siteText(text,translation)}); metadata.site_catalog = source;
    assert.equal((await verifiedMessages(source,metadata,'en')).has(text),allowed);
  }
  const metadata = meta({site_text:siteText(' ürün','products')});
  assert.equal((await verifiedMessages(catalog,metadata,'en')).get(' ürün'),' products');
});
test('language switch preserves path, query, filter and fragment',() => {
  assert.equal(languageUrl('https://example.com/magaza/?q=POMPA&category=c1#filter','en'),'/magaza/?q=POMPA&category=c1&lang=en#filter');
});
test('business translations use the canonical public business key and preserve identity and contacts',() => {
  const input = {ok:true,business:{id:'',about_text:'Orijinal açıklama',description:'Türkçe açıklama',phone:'5554443322',gallery:[{id:'img1',title:'Türkçe başlık'}]},localization:meta({business:{'server-pub-1':{en:{about_text:'About us',description:'English description'}}},gallery:{img1:{en:{title:'English photo'}}}})};
  const translated = localizePublic(input,'business','en');
  assert.equal(translated.business.about_text,'About us');
  assert.equal(translated.business.description,'English description');
  assert.equal(translated.business.phone,'5554443322');
  assert.equal(translated.business.gallery[0].title,'English photo');
  assert.equal(input.business.about_text,'Orijinal açıklama');
});
test('published content translations keep Turkish fallback, IDs, URLs, prices and currency',() => {
  const input = {ok:true,enabled:true,products:[{product_id:'sku-x',category_id:'c1',name:'Türkçe ürün',price:89,currency:'TRY'}],categories:[{id:'c1',name:'Pompalar'}],localization:meta({catalog_category:{c1:{en:{name:'Pumps'}}},catalog_product:{'sku-x':{en:{name:'Pump assembly'}}}})};
  const en = localizePublic(input,'catalog','en');
  assert.equal(en.products[0].name,'Pump assembly');
  assert.equal(en.products[0].product_id,'sku-x');
  assert.equal(en.products[0].price,89);
  assert.equal(en.products[0].category_name,'Pumps');
  assert.equal(en.categories[0].name,'Pumps');
  assert.equal(localizePublic(input,'catalog','tr'),input);
  const source = {ok:true,rooms:[{id:'r1',name:'Oda',description:'Açıklama',image_url:'/yardimci-asistan/media/room.jpg'}],localization:meta({room:{r1:{en:{name:'Room'}}}})};
  delete source.localization.languages; // Only business carries chooser metadata in the real PHP contract.
  assert.equal(localizePublic(source,'rooms','en').rooms[0].description,'Açıklama');
  assert.equal(localizePublic(source,'rooms','en').rooms[0].name,'Room');
  assert.equal(localizePublic(source,'rooms','en').rooms[0].image_url,source.rooms[0].image_url);
});
test('live language and locale start Turkish and update only after business metadata',async () => {
  assert.equal(language,'tr'); assert.equal(locale,'tr-TR');
  assert.equal(translate('Mağaza'),'Mağaza');
  // No browser document means no requested language. Metadata alone does not select English.
  await applyLocalization(meta({}));
  assert.equal(language,'tr'); assert.equal(locale,'tr-TR');
  assert.equal(translate('Ürün {count}',{count:3}),'Ürün 3');
  await applyLocalization(null);
});

test('business GET awaits verified UI publication before localizing data; live exports, SSR ownership and revocation work together',async () => {
  const {languageDocument} = await import('./fixtures/language-dom.mjs');
  const {request,money} = await import('../assets/commerce.js');
  const {initLanguageChooser} = await import('../assets/language.js');
  const fixture = languageDocument('https://example.com/magaza/?q=Pompa&lang=en#filter');
  const {root,heading,spaced,user,widget,search,chooser,texts,text,listeners} = fixture;
  const beforeFetch = globalThis.fetch, beforeDocument = globalThis.document;
  let finishSource;
  const sourceGate = new Promise(resolve => { finishSource = resolve; });
  const metadata = meta({business:{pub:{en:{description:'Published description'}}},site_text:{...siteText('Mağaza','App Store'),...siteText('Tüm kategoriler','Published categories')}});
  globalThis.document = root;
  const calls = [];
  globalThis.fetch = async url => {
    calls.push(String(url));
    if (String(url).endsWith('/i18n/tr.json')) { await sourceGate; return new Response(JSON.stringify(catalog),{headers:{'content-type':'application/json'}}); }
    return new Response(JSON.stringify({ok:true,business:{id:'',display_name:'Mağaza',description:'Türkçe açıklama'},localization:metadata}));
  };
  try {
    initLanguageChooser(root);
    root.cookie = 'teknikel_language=en';
    root.cookie = 'teknikel_site_language=en';
    const laterProduct = text('Mağaza'); texts.push(laterProduct);
    let resolved = false;
    const reading = request('business').then(value => { resolved = true; return value; });
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(resolved,false,'business must await manifest verification');
    assert.equal(language,'tr'); assert.equal(chooser.hidden,true);
    finishSource();
    const business = await reading;
    assert.equal(language,'en'); assert.equal(locale,'en-GB');
    assert.equal(business.business.description,'Published description');
    assert.equal(business.business.display_name,'Mağaza');
    assert.equal(root.documentElement.lang,'en'); assert.equal(root.documentElement.dir,'ltr');
    assert.equal(translate('Mağaza'),'App Store'); assert.equal(translate('Unknown product'),'Unknown product');
    assert.match(money(1234.5,'TRY'),/1,234\.50/);
    assert.equal(heading.nodeValue,'App Store'); assert.equal(spaced.nodeValue,' Published categories ');
    assert.equal(search.getAttribute('placeholder'),'App Store'); assert.equal(search.getAttribute('aria-label'),'App Store');
    assert.equal(user.nodeValue,'Mağaza'); assert.equal(widget.nodeValue,'Mağaza'); assert.equal(laterProduct.nodeValue,'Mağaza');
    assert.equal(chooser.hidden,false); assert.equal(chooser.getAttribute('inert'),null);
    assert.deepEqual(chooser.children.map(link => link.dataset.language),['tr','en']);
    assert.equal(chooser.children[1].getAttribute('aria-current'),'true');
    root.defaultView.location = new URL('https://example.com/magaza/?q=Latest&category=c1&lang=en#latest');
    root.defaultView.location.assign = value => { root.assigned = value; };
    listeners.get('click')({target:{closest:() => chooser.children[0]},preventDefault() {}});
    assert.equal(root.assigned,'/magaza/?q=Latest&category=c1&lang=tr#latest');
    await applyLocalization({...metadata,target_languages:[]},root);
    assert.equal(language,'tr'); assert.equal(locale,'tr-TR');
    assert.equal(heading.nodeValue,'Mağaza'); assert.equal(spaced.nodeValue,' Tüm kategoriler ');
    assert.equal(search.getAttribute('placeholder'),'Mağaza'); assert.equal(chooser.hidden,true);
    assert.equal(chooser.getAttribute('inert'),''); assert.deepEqual(chooser.children,[]);
    assert.match(money(1234.5,'TRY'),/1\.234,50/);
    assert.equal(calls.filter(url => url.endsWith('/i18n/tr.json')).length,1);
  } finally {
    finishSource(); globalThis.fetch = beforeFetch; globalThis.document = beforeDocument;
    await applyLocalization(null);
  }
});
