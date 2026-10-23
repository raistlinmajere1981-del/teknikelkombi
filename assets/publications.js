import {request,money} from './commerce.js';
import {hasSurface} from './storefront.js';

import {text,namedPublication as named,publicationImages} from './public-info.js';
export function menuFrom(value) {
  if (!Array.isArray(value?.categories) || !Array.isArray(value?.items)) throw new Error('Menü yayını okunamadı.');
  const categories = value.categories.filter(named);
  const ids = new Set(categories.map(category => category.id));
  return {categories,items:value.items.filter(item => named(item) && ids.has(item.category_id))};
}
export function menuPrice(item) {
  const price = item.price ?? item.unit_price;
  return Number.isFinite(price) && price >= 0 && /^[A-Z]{3}$/.test(item.currency) ? money(price,item.currency) : '';
}
export function tableCapacity(table) {
  return Number.isInteger(table.capacity) && table.capacity > 0 ? table.capacity + ' kişi' : '';
}
export async function loadPublicationPage(page,business,root = document,fetchPublic = request) {
  const $ = selector => root.querySelector(selector);
  const el = (tag,label,cls) => { const node = root.createElement(tag); if (label !== undefined) node.textContent = label; if (cls) node.className = cls; return node; };
  const restaurant = page === 'restaurant', surface = restaurant ? 'restaurant' : 'qr_menu';
  const subject = restaurant ? 'Restoran' : 'Menü';
  const status = $('[data-publication-state]');
  const list = $(restaurant ? '[data-table-grid]' : '[data-menu-list]');
  const filters = $('[data-menu-filters]');
  function message(value) { status.textContent = value; status.hidden = !value; }
  function unavailable() {
    list.replaceChildren();
    if (filters) { filters.replaceChildren(); filters.hidden = true; }
    root.querySelectorAll('[data-surface="' + surface + '"]').forEach(node => { node.hidden = true; });
    message(subject + ' şu anda yayında değil.');
  }
  function image(item,card) {
    const url = publicationImages(item,root.defaultView.location.origin)[0];
    if (!url) return;
    const img = el('img'); img.alt = item.name; img.loading = 'lazy'; img.decoding = 'async'; img.referrerPolicy = 'no-referrer';
    img.addEventListener('error',() => img.remove()); img.src = url; card.append(img);
  }
  if (!business) { message(subject + ' bilgilerine ulaşılamadı. Lütfen tekrar deneyin.'); return; }
  if (!hasSurface(business,surface)) { unavailable(); return; }
  try {
    const value = await fetchPublic(restaurant ? 'tables' : 'menu');
    if (value.enabled === false) { unavailable(); return; }
    if (restaurant) {
      if (value.enabled !== true || !Array.isArray(value.tables)) throw new Error('Restoran yayını okunamadı.');
      const tables = value.tables.filter(named);
      list.replaceChildren(...tables.map(table => {
        const card = el('article',undefined,'publication-card'); image(table,card);
        const body = el('div',undefined,'publication-card-body'); body.append(el('h2',table.name));
        const capacity = tableCapacity(table);
        if (capacity) body.append(el('p',capacity,'table-capacity'));
        if (text(table.area)) body.append(el('p',table.area,'product-meta'));
        if (text(table.description)) body.append(el('p',table.description));
        card.append(body); return card;
      }));
      message(tables.length ? '' : 'Henüz yayınlanmış masa bulunmuyor.');
      return;
    }
    const {categories,items} = menuFrom(value);
    let selected = null;
    const buttons = [];
    function renderMenu() {
      buttons.forEach(({button,id}) => button.setAttribute('aria-pressed',String(id === selected)));
      const shown = categories.filter(category => selected === null || category.id === selected);
      list.replaceChildren(...shown.flatMap(category => {
        const entries = items.filter(item => item.category_id === category.id);
        if (!entries.length) return [];
        const section = el('section',undefined,'menu-category'); section.append(el('h2',category.name));
        if (text(category.description)) section.append(el('p',category.description,'product-meta'));
        const grid = el('div',undefined,'publication-grid');
        grid.append(...entries.map(item => {
          const card = el('article',undefined,'publication-card menu-item'); image(item,card);
          const body = el('div',undefined,'publication-card-body'); body.append(el('h3',item.name));
          if (text(item.description)) body.append(el('p',item.description));
          const price = menuPrice(item); if (price) body.append(el('p',price,'price'));
          card.append(body); return card;
        }));
        section.append(grid); return [section];
      }));
      message(list.childElementCount ? '' : items.length ? 'Bu kategoride yayınlanmış ürün bulunmuyor.' : 'Henüz yayınlanmış menü ürünü bulunmuyor.');
    }
    filters.replaceChildren();
    for (const category of [{id:null,name:'Tümü'},...categories]) {
      const button = el('button',category.name,'menu-chip'); button.type = 'button';
      button.addEventListener('click',() => { selected = category.id; renderMenu(); });
      buttons.push({button,id:category.id}); filters.append(button);
    }
    filters.hidden = !categories.length; renderMenu();
  } catch (error) {
    if ([403,404].includes(error.status)) { unavailable(); return; }
    list.replaceChildren(); if (filters) { filters.replaceChildren(); filters.hidden = true; }
    message(subject + ' bilgilerine ulaşılamadı. Lütfen tekrar deneyin.');
  }
}
