import {request,catalogFrom} from './commerce.js';

import {text,contactInfo,aboutText,galleryImages,reviewsFrom} from './public-info.js';
import {websiteCampaigns} from './marketing.js';
export {phoneUrl,emailUrl,websiteUrl} from './public-info.js';

export const hasSurface = (business,surface) => Array.isArray(business?.business?.public_surfaces) && business.business.public_surfaces.includes(surface);
export const storeEnabled = (business,catalog) => hasSurface(business,'store') && catalog?.enabled === true;
export function publicCategories(catalog) {
  const seen = new Set();
  return (Array.isArray(catalog?.categories) ? catalog.categories : []).filter(category => {
    if (!text(category?.id) || !text(category?.name) || seen.has(category.id)) return false;
    seen.add(category.id); return true;
  });
}

// One snapshot per document, shared by commerce and the public chrome. Dealer
// catalogs never enter this state. Explicit reloads fetch a fresh publication.
export function createStorefront(root = document,fetchPublic = request) {
  const all = selector => [...root.querySelectorAll(selector)];
  const node = (tag,label,cls) => { const item = root.createElement(tag); if (label !== undefined) item.textContent = label; if (cls) item.className = cls; return item; };
  let pending, reads = new Map();
  const cachedRead = (cache,endpoint) => { if (!cache.has(endpoint)) cache.set(endpoint,Promise.resolve().then(() => fetchPublic(endpoint))); return cache.get(endpoint); };
  const read = endpoint => cachedRead(reads,endpoint);
  const origin = root.defaultView?.location.origin || 'https://localhost';
  function field(selector,value,href) {
    all(selector).forEach(item => {
      item.hidden = !value || (item.tagName === 'A' && !href);
      if (item.tagName === 'A') { item.removeAttribute('href'); if (href) item.setAttribute('href',href); }
      item.textContent = item.hidden ? '' : value;
    });
  }
  function render({business,catalog},publications = {}) {
    const info = business?.business || {};
    const contact = contactInfo(info), {phone,email,website} = contact;
    field('[data-business-name]',text(info.display_name));
    field('[data-business-phone]',phone ? text(info.phone) : '',phone);
    field('[data-business-email]',email ? text(info.email) : '',email);
    field('[data-business-address]',contact.address);
    all('[data-business-website],[data-business-whatsapp],[data-business-directions]').forEach(item => {
      const href = item.hasAttribute('data-business-whatsapp') ? contact.whatsapp : item.hasAttribute('data-business-directions') ? contact.directions : website;
      item.hidden = !href; item.removeAttribute('href'); if (href) item.setAttribute('href',href);
    });
    all('[data-business-socials]').forEach(item => {
      item.replaceChildren(...contact.socials.map(social => {
        const anchor = node('a',social.label); anchor.setAttribute('href',social.url); anchor.setAttribute('rel','noopener noreferrer'); return anchor;
      })); item.hidden = !contact.socials.length;
    });
    all('[data-business-contact],[data-contact-link]').forEach(item => { item.hidden = !contact.available; });
    const surfaces = {
      rooms:publications.rooms?.enabled === true && Array.isArray(publications.rooms.rooms),
      restaurant:publications.tables?.enabled === true && Array.isArray(publications.tables.tables),
      qr_menu:publications.menu && publications.menu.enabled !== false && Array.isArray(publications.menu.categories) && Array.isArray(publications.menu.items)
    };
    all('[data-surface]').forEach(item => { item.hidden = !(hasSurface(business,item.dataset.surface) && surfaces[item.dataset.surface]); });
    const pages = {about:!!aboutText(info),gallery:galleryImages(info,origin).length > 0,reviews:info.google_reviews_enabled === true && !!reviewsFrom(publications['google-reviews']),announcements:websiteCampaigns(publications.marketing).length > 0};
    all('[data-public-page]').forEach(item => { item.hidden = !pages[item.dataset.publicPage]; });
    const enabled = storeEnabled(business,catalog), categories = enabled ? publicCategories(catalog) : [];
    all('[data-store-only]').forEach(item => { item.hidden = !enabled; });
    all('[data-category-nav]').forEach(item => {
      item.replaceChildren(...categories.slice(0,6).map(category => { const anchor = node('a',category.name); anchor.setAttribute('href','/katalog/?category=' + encodeURIComponent(category.id)); return anchor; }));
      item.hidden = !categories.length;
    });
    all('[data-category-grid]').forEach(item => {
      item.replaceChildren(...categories.slice(0,9).map((category,index) => {
        const anchor = node('a',undefined,'cat'); anchor.setAttribute('href','/katalog/?category=' + encodeURIComponent(category.id));
        anchor.append(node('span',String(index + 1).padStart(2,'0'),'cat-num'),node('strong',category.name),node('span','↗')); return anchor;
      }));
    });
    all('[data-category-section]').forEach(item => { item.hidden = !categories.length; });
    const brands = enabled ? [...new Set((catalog.products || []).map(product => text(product.brand)).filter(Boolean))].sort((a,b) => a.localeCompare(b,'tr-TR')).slice(0,24) : [];
    all('[data-brand-list]').forEach(item => item.replaceChildren(...brands.map(brand => node('span',brand))));
    all('[data-brand-section]').forEach(item => { item.hidden = !brands.length; });
  }
  function load(refresh = false) {
    if (!pending || refresh) {
      render({business:null,catalog:null});
      const cache = new Map(); reads = cache;
      const currentRead = endpoint => cachedRead(cache,endpoint);
      const current = Promise.resolve().then(async () => {
        let business = null, catalog = null;
        const publications = {};
        try { business = await currentRead('business'); } catch { /* No stale contact or optional navigation. */ }
        if (pending === current) render({business,catalog});
        const endpoints = [];
        if (business) endpoints.push('marketing');
        if (business?.business?.google_reviews_enabled === true) endpoints.push('google-reviews');
        for (const [surface,endpoint] of [['rooms','rooms'],['restaurant','tables'],['qr_menu','menu'],['store','catalog']]) {
          if (hasSurface(business,surface)) endpoints.push(endpoint);
        }
        await Promise.all(endpoints.map(async endpoint => {
          try {
            const value = await currentRead(endpoint);
            if (endpoint === 'catalog') { catalog = catalogFrom(value); catalog.categories = publicCategories(catalog); }
            else publications[endpoint] = value;
          } catch { /* A failed publication cannot reveal navigation. */ }
          if (pending === current) render({business,catalog},publications);
        }));
        return {business,catalog};
      });
      pending = current;
    }
    return pending;
  }
  return {load,read};
}
