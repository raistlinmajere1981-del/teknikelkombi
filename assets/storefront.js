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
  const all = selector => [...root.querySelectorAll(selector)].filter(item => item.tagName !== 'SCRIPT');
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
  function socialIcon(platform) {
    const name = String(platform).toLowerCase();
    const svg = root.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 24 24');
    svg.setAttribute('width','23'); svg.setAttribute('height','23');
    svg.setAttribute('fill','none'); svg.setAttribute('stroke','currentColor');
    svg.setAttribute('stroke-width','1.9'); svg.setAttribute('stroke-linecap','round'); svg.setAttribute('stroke-linejoin','round');
    svg.setAttribute('aria-hidden','true');
    const add=(tag,attrs)=>{const n=root.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));svg.append(n);};
    if (name.includes('instagram')) {
      add('rect',{x:2,y:2,width:20,height:20,rx:5});
      add('circle',{cx:12,cy:12,r:4});
      add('circle',{cx:18,cy:6,r:1,fill:'currentColor',stroke:'none'});
    } else if (name.includes('facebook')) {
      add('path',{d:'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'});
    } else if (name.includes('youtube')) {
      add('rect',{x:2,y:5,width:20,height:14,rx:4});
      add('path',{d:'m10 9 5 3-5 3z'});
    } else if (name.includes('linkedin')) {
      add('rect',{x:2,y:2,width:20,height:20,rx:2});
      add('path',{d:'M7 10v7M7 7v.01M11 17v-7h3v1a3 3 0 0 1 5 2v4'});
    } else if (name==='x' || name.includes('twitter')) {
      add('path',{d:'m4 3 16 18M20 3 4 21M4 3h5l11 18h-5z'});
    } else if (name.includes('tiktok')) {
      add('path',{d:'M14 3v11.5a4.5 4.5 0 1 1-4.5-4.5M14 3a6 6 0 0 0 6 6'});
    } else {
      add('path',{d:'M10 14 21 3M13 3h8v8M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6'});
    }
    return svg;
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
        const anchor = node('a'); anchor.className = 'social-icon-link';
        anchor.setAttribute('aria-label',social.label);
        anchor.setAttribute('title',social.label);
        anchor.setAttribute('href',social.url); anchor.setAttribute('target','_blank');
        anchor.setAttribute('rel','noopener noreferrer');
        anchor.append(socialIcon(social.label)); return anchor;
      })); item.hidden = !contact.socials.length;
    });
    all('[data-business-contact],[data-contact-link]').forEach(item => { item.hidden = !contact.available; });
    const latitude = Number(info.latitude), longitude = Number(info.longitude);
    const validLocation = info.latitude !== null && info.latitude !== undefined && info.longitude !== null && info.longitude !== undefined
      && Number.isFinite(latitude) && Number.isFinite(longitude) && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180;
    all('[data-business-map]').forEach(section => {
      section.hidden = !validLocation;
      const frame = section.querySelector('[data-business-map-frame]');
      const caption = section.querySelector('[data-business-map-caption]');
      if (!frame) return;
      if (!validLocation) {
        if (frame.hasAttribute('src')) frame.removeAttribute('src');
        if (caption) caption.textContent = '';
        return;
      }
      const dx=0.018,dy=0.010;
      const bbox=[longitude-dx,latitude-dy,longitude+dx,latitude+dy].join(',');
      const url=new URL('https://www.openstreetmap.org/export/embed.html');
      url.searchParams.set('bbox',bbox);
      url.searchParams.set('layer','mapnik');
      url.searchParams.set('marker',latitude+','+longitude);
      if (frame.getAttribute('src') !== url.href) frame.setAttribute('src',url.href);
      if (caption) caption.textContent=contact.address;
    });
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
      item.replaceChildren(...categories.slice(0,6).map(category => { const anchor = node('a',category.name); anchor.setAttribute('href','/magaza/?category=' + encodeURIComponent(category.id)); return anchor; }));
      item.hidden = !categories.length;
    });
    all('[data-category-grid]').forEach(item => {
      item.replaceChildren(...categories.slice(0,9).map((category,index) => {
        const anchor = node('a',undefined,'cat'); anchor.setAttribute('href','/magaza/?category=' + encodeURIComponent(category.id));
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
