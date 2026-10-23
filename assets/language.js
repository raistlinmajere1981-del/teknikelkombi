/** UI copy is explicit: API names and user-entered values never pass through t(). */
export const language = globalThis.document?.documentElement.lang === 'en' ? 'en' : 'tr';
export const locale = language === 'en' ? 'en-GB' : 'tr-TR';
const words = JSON.parse(globalThis.document?.getElementById('teknikel-english')?.textContent || '{}');
export function translate(source, values = {}, selected = language, dictionary = words) {
  return String(selected === 'en' ? dictionary[source] ?? source : source)
    .replace(/\{(\w+)\}/g, (match, key) => Object.hasOwn(values,key) ? String(values[key]) : match);
}
export const t = (source, values = {}) => translate(source,values);
export function languageUrl(href, selected) {
  const url = new URL(href);
  url.searchParams.set('lang',selected === 'en' ? 'en' : 'tr');
  return url.pathname + url.search + url.hash;
}

/** Copy only the public fields covered by the publication contract. */
export function localizePublic(source, endpoint, selected = language) {
  const metadata = source?.localization;
  if (selected !== 'en' || metadata?.version !== 1 || metadata.source_language !== 'tr'
      || !Array.isArray(metadata.target_languages) || !metadata.target_languages.includes('en')) return source;
  const row = (kind, record, id, fields) => {
    if (!record || typeof record !== 'object' || id === undefined || id === null) return record;
    const byKind = metadata.translations?.[kind];
    const translation = byKind && Object.hasOwn(byKind,id) ? byKind[id]?.en : null;
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
  const update = () => root.querySelectorAll('[data-language]').forEach(link => {
    link.setAttribute('href',languageUrl(root.defaultView.location.href,link.dataset.language));
  });
  update();
  root.defaultView.addEventListener('hashchange',update);
  root.querySelectorAll('[data-language]').forEach(link => link.addEventListener('click',() => {
    // Filters may have changed through history.replaceState since the last render.
    update();
  }));
}
