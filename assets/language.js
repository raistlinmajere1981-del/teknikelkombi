/** Only app-published metadata authorizes languages and translations. SSR is Turkish. */
export let language = 'tr';
export let locale = 'tr-TR';
const SOURCE_ID = 'teknikel-site', COOKIE = 'teknikel_site_language';
let messages = new Map(), available = [], sourcePromise, generation = 0;
const snapshots = new WeakMap();
export function translate(source, values = {}) {
  return String(language === 'tr' ? source : messages.get(source) ?? source)
    .replace(/\{(\w+)\}/g, (match, key) => Object.hasOwn(values,key) ? String(values[key]) : match);
}
export const t = (source, values = {}) => translate(source,values);
export function languageUrl(href, selected) {
  const url = new URL(href);
  url.searchParams.set('lang',selected);
  return url.pathname + url.search + url.hash;
}

export function publishedLanguages(metadata) {
  const tr = {code:'tr',name:'Türkçe',locale:'tr-TR',direction:'ltr'};
  if (metadata?.version !== 1 || metadata.source_language !== 'tr'
      || !Array.isArray(metadata.target_languages) || !Array.isArray(metadata.languages)) return [tr];
  const declared = new Map();
  for (const item of metadata.languages) {
    if (!item || typeof item.code !== 'string' || !/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(item.code) || declared.has(item.code)) continue;
    let formatLocale = typeof item.locale === 'string' ? item.locale : item.code;
    try { new Intl.NumberFormat(formatLocale); } catch { formatLocale = item.code; }
    declared.set(item.code,{code:item.code,name:String(item.nativeName || item.name || item.code),
      locale:formatLocale,direction:item.direction === 'rtl' ? 'rtl' : 'ltr'});
  }
  return [tr,...[...new Set(metadata.target_languages)].filter(code => code !== 'tr' && declared.has(code)).map(code => declared.get(code))];
}

export function selectedLanguage(metadata, href, cookie = '') {
  const choices = publishedLanguages(metadata);
  let saved = '';
  try { saved = decodeURIComponent(cookie.split(';').map(row => row.trim()).find(row => row.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1) || ''); } catch { /* Malformed cookies have no preference. */ }
  const wanted = new URL(href).searchParams.get('lang') || saved || 'tr';
  return choices.find(item => item.code === wanted) || choices[0];
}

const digest = async text => [...new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(byte => byte.toString(16).padStart(2,'0')).join('');
const placeholders = text => [...text.matchAll(/\{[a-zA-Z0-9_]+\}/g)].map(match => match[0]).sort().join('|');
export async function verifiedMessages(catalog, metadata, selected) {
  const result = new Map();
  if (selected === 'tr' || !publishedLanguages(metadata).some(item => item.code === selected)
      || catalog?.version !== 1 || catalog.id !== SOURCE_ID || catalog.source_language !== 'tr'
      || metadata?.site_catalog?.id !== SOURCE_ID || !catalog.entries || typeof catalog.entries !== 'object'
      || Array.isArray(catalog.entries) || Object.keys(catalog.entries).length > 2048) return result;
  await Promise.all(Object.entries(catalog.entries).map(async ([key,current]) => {
    const published = metadata.site_catalog.entries?.[key];
    if (typeof current?.text !== 'string' || !current.text.trim() || current.text.length > 12000
        || /[<>\u0000-\u0008]/u.test(current.text) || !/^[a-f0-9]{64}$/.test(current.hash)
        || key !== 'phrase.' + current.hash || !published || published.text !== current.text || published.hash !== current.hash) return;
    if (await digest(current.text) !== current.hash) return;
    const translated = metadata.translations?.site_text?.[SOURCE_ID + ':' + key]?.[selected]?.text;
    if (typeof translated !== 'string' || !translated.trim() || translated.length > 12000
        || placeholders(translated) !== placeholders(current.text)) return;
    // Published fields are trimmed by the API; sentence fragments still need
    // the source's separating whitespace when concatenated by client controls.
    result.set(current.text,(current.text.match(/^\s*/)?.[0] || '') + translated.trim() + (current.text.match(/\s*$/)?.[0] || ''));
  }));
  return result;
}

async function sourceCatalog() {
  return sourcePromise ??= fetch(new URL('./i18n/tr.json',import.meta.url),{credentials:'same-origin',cache:'no-cache',redirect:'error'})
    .then(async response => {
      if (!response.ok || !/application\/json\b/i.test(response.headers.get('content-type') || '')) return null;
      const body = await response.text();
      return new TextEncoder().encode(body).length <= 512 * 1024 ? JSON.parse(body) : null;
    }).catch(() => null);
}

// Capture only SSR nodes before API/product/widget rendering. A later exact text
// match in user data must never turn it into site copy.
const EXCLUDED = 'script,style,noscript,#yardimci-asistan-widget,[data-no-translate],[data-business-name],[data-business-description],[data-business-address],[data-business-socials],[data-public-description],[data-public-content],[data-hero-title],[data-hero-media]';
function capture(root) {
  if (snapshots.has(root)) return snapshots.get(root);
  const entries = [];
  const walk = root.createTreeWalker(root.documentElement,4);
  let node;
  while ((node = walk.nextNode())) {
    if (!node.parentElement?.closest(EXCLUDED + ',input,textarea,select') && node.nodeValue.trim()) entries.push({node,attribute:'',source:node.nodeValue,last:node.nodeValue});
  }
  root.querySelectorAll('[aria-label],[title],[placeholder],[alt]').forEach(node => {
    if (node.closest(EXCLUDED)) return;
    for (const attribute of ['aria-label','title','placeholder','alt']) {
      const value = node.getAttribute(attribute);
      if (value) entries.push({node,attribute,source:value,last:value});
    }
  });
  snapshots.set(root,entries);
  return entries;
}

function translateDocument(root) {
  for (const entry of snapshots.get(root) || []) {
    const {node,attribute,source,last} = entry;
    if (!node.isConnected || (attribute ? node.getAttribute(attribute) : node.nodeValue) !== last) continue;
    // Preserve literal spaces in catalog fragments and surrounding HTML spacing.
    const key = messages.has(source) ? source : source.trim();
    const translated = language === 'tr' ? undefined : messages.get(key);
    const value = translated === undefined ? source : key === source ? translated : source.slice(0,source.indexOf(key)) + translated + source.slice(source.indexOf(key) + key.length);
    if (attribute) node.setAttribute(attribute,value); else node.nodeValue = value;
    entry.last = value;
  }
}

function save(root, code) {
  root.cookie = COOKIE + '=' + encodeURIComponent(code) + '; Path=/; Max-Age=31536000; SameSite=Lax'
    + (root.defaultView.location.protocol === 'https:' ? '; Secure' : '');
}

function updateChooser(root) {
  const enabled = available.length > 1;
  root.querySelectorAll('.language-chooser').forEach(chooser => {
    chooser.hidden = !enabled;
    chooser.toggleAttribute('inert',!enabled);
    chooser.replaceChildren();
    if (!enabled) return;
    for (const item of available) {
      const link = root.createElement('a');
      link.dataset.language = item.code; link.lang = item.code; link.textContent = item.code.toUpperCase();
      link.setAttribute('aria-label',item.name);
      if (item.code === language) link.setAttribute('aria-current','true');
      link.href = languageUrl(root.defaultView.location.href,item.code);
      chooser.append(link);
    }
  });
}

export async function applyLocalization(metadata, root = globalThis.document) {
  const current = ++generation;
  if (root) capture(root);
  const choices = publishedLanguages(metadata);
  const selected = selectedLanguage(metadata,root?.defaultView?.location.href || 'https://localhost/',root?.cookie || '');
  let verified = new Map();
  try { if (selected.code !== 'tr') verified = await verifiedMessages(await sourceCatalog(),metadata,selected.code); } catch { /* Keep Turkish source copy on validation failure. */ }
  if (current !== generation) return;
  available = choices; language = selected.code; locale = selected.locale; messages = verified;
  if (root) {
    root.documentElement.lang = language;
    root.documentElement.dir = selected.direction;
    translateDocument(root);
    updateChooser(root);
    save(root,language);
  }
  return {language,locale,direction:selected.direction};
}

/** Copy only the public fields covered by the publication contract. */
export function localizePublic(source, endpoint, selected = language) {
  const metadata = source?.localization;
  if (selected === 'tr' || metadata?.version !== 1 || metadata.source_language !== 'tr'
      || !Array.isArray(metadata.target_languages) || !metadata.target_languages.includes(selected)) return source;
  const row = (kind, record, id, fields) => {
    if (!record || typeof record !== 'object' || id === undefined || id === null) return record;
    const byKind = metadata.translations?.[kind];
    const translation = byKind && Object.hasOwn(byKind,id) ? byKind[id]?.[selected] : null;
    const result = {...record};
    for (const field of fields) {
      if (Object.hasOwn(record,field) && translation && Object.hasOwn(translation,field)
          && typeof translation[field] === 'string' && translation[field].trim()) result[field] = translation[field];
    }
    return result;
  };
  const lists = {
    rooms:[['rooms','room','id',['name','description','bed_info','price_note']]],
    tables:[['tables','table','id',['name','description','area']]],
    menu:[['categories','menu_category','id',['name','description']],['items','menu_product','id',['name','description']]],
    catalog:[['categories','catalog_category','id',['name']],['products','catalog_product','product_id',['name','description']]],
    marketing:[['publications','marketing','id',['title','text']]]
  };
  if (!Object.hasOwn(lists,endpoint) && endpoint !== 'business') return source;
  const result = {...source};
  for (const [list,kind,id,fields] of lists[endpoint] || []) {
    if (Array.isArray(source[list])) result[list] = source[list].map(record => row(kind,record,record?.[id],fields));
  }
  if (endpoint === 'catalog' && Array.isArray(result.categories) && Array.isArray(result.products)) {
    const categories = new Map(result.categories.map(category => [category?.id,category]));
    result.products = result.products.map(product => {
      const category = categories.get(product?.category_id);
      return category && category.name !== source.categories?.find(item => item.id === category.id)?.name
        ? {...product,category_name:category.name} : product;
    });
  }
  if (endpoint === 'business' && source.business) {
    // Hosting publication id and Desktop business id can differ; the public
    // business translation collection has one canonical record.
    const businessKeys = Object.keys(metadata.translations?.business || {});
    const businessId = businessKeys.includes(String(source.business.id)) ? source.business.id : businessKeys[0];
    result.business = row('business',source.business,businessId,['description','about_text','directions_note','policy_note','payment_note']);
    if (Array.isArray(source.business.gallery)) result.business.gallery = source.business.gallery.map(record => row('gallery',record,record?.id,['title']));
  }
  return result;
}

export function initLanguageChooser(root = document) {
  capture(root);
  updateChooser(root);
  const update = () => root.querySelectorAll('[data-language]').forEach(link => {
    link.setAttribute('href',languageUrl(root.defaultView.location.href,link.dataset.language));
  });
  update();
  root.defaultView.addEventListener('hashchange',update);
  root.addEventListener('click',event => {
    const link = event.target.closest?.('.language-chooser [data-language]');
    if (!link) return;
    event.preventDefault();
    if (!available.some(item => item.code === link.dataset.language)) return;
    save(root,link.dataset.language);
    // Read at click time: filters can change through history.replaceState.
    root.defaultView.location.assign(languageUrl(root.defaultView.location.href,link.dataset.language));
  });
}
