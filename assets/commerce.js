import {t,locale,localizePublic,language} from './language.js';
/* Existing Yardımcı Asistan API contract. Device drafts never contain prices, contacts or tokens. */
export const API_ROOT = '/yardimci-asistan/api/';
export class ApiError extends Error {
  constructor(message, status = 0, code = '') { super(message); this.status = status; this.code = code; }
}
let sessionRefresh;
export async function request(endpoint, body, retry = true) {
  if (!/^(business|catalog|menu|tables|rooms|marketing|google-reviews|order|dealer\/(session|catalog|order|orders|receipt|logout)|account\/(config|session|login|register|logout|logout-all|refresh|recover|verify|reset|profile|oauth|orders))$/.test(endpoint)) throw new Error(t('Geçersiz işlem.'));
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const headers = {Accept:'application/json'};
    if (body !== undefined) { headers['Content-Type'] = 'application/json'; if (endpoint.startsWith('dealer/')) headers['X-YA-Dealer'] = '1'; if (endpoint.startsWith('account/')) headers['X-YA-Account'] = '1'; }
    const response = await fetch(API_ROOT + endpoint + '.php', {method:body === undefined ? 'GET' : 'POST', headers, credentials:'same-origin', cache:'no-store', redirect:'error', signal:controller.signal, ...(body === undefined ? {} : {body:JSON.stringify(body)})});
    if (response.status === 401 && retry && !['account/login','account/refresh','account/logout','account/config'].includes(endpoint)) {
      sessionRefresh ||= fetch(API_ROOT + 'account/refresh.php',{method:'POST',headers:{'Content-Type':'application/json','X-YA-Account':'1'},credentials:'same-origin',cache:'no-store',redirect:'error',signal:controller.signal,body:'{}'}).finally(() => { sessionRefresh = null; });
      if ((await sessionRefresh).ok) return request(endpoint,body,false);
    }
    let value;
    try { value = await response.json(); } catch { throw new ApiError(t('Sunucudan geçerli yanıt alınamadı. Gönderim yapılmış olabilir; aynı siparişi tekrar deneyin.'), response.ok ? 502 : response.status); }
    if (!response.ok) throw new ApiError(typeof value?.message === 'string' && language === 'tr' ? value.message : t('İşlem tamamlanamadı. Lütfen tekrar deneyin.'), response.status, value?.code || '');
    if (endpoint === 'google-reviews' && typeof value?.available !== 'boolean') throw new ApiError(t('Yorum yayını okunamadı.'), 502);
    if (!['dealer/session','google-reviews'].includes(endpoint) && value?.ok !== true) throw new ApiError(t('İşlemin sonucu doğrulanamadı. Aynı siparişi tekrar deneyin.'), 502);
    return body === undefined ? localizePublic(value,endpoint) : value;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(t(endpoint.startsWith('account/') ? 'Hesap hizmetine bağlanılamadı. Lütfen tekrar deneyin.' : 'Bağlantı kurulamadı. Gönderim yapılmış olabilir; aynı siparişi tekrar deneyin.'));
  } finally { clearTimeout(timeout); }
}
export function checkReceipt(value) {
  if (value?.ok !== true || typeof value.order_id !== 'string' || !/^[A-Za-z0-9_-]{1,180}$/.test(value.order_id) || typeof value.accepted_at !== 'string' || !Number.isFinite(Date.parse(value.accepted_at))) throw new ApiError(t('Sipariş kabulü doğrulanamadı. Aynı siparişi tekrar deneyin.'), 502);
  if ('quoted_total' in value && (!Number.isFinite(value.quoted_total) || value.quoted_total < 0 || !/^[A-Z]{3}$/.test(value.currency))) throw new ApiError(t('Sipariş tutarı doğrulanamadı. Aynı siparişi tekrar deneyin.'), 502);
  return value;
}
export function photoUrl(url,origin) {
  if (typeof url !== 'string' || !url.trim()) return '';
  try {
    const context = new URL(origin),parsed = new URL(url,context.origin);
    const localDev = parsed.origin === context.origin && ['localhost','127.0.0.1','[::1]'].includes(context.hostname);
    if (parsed.username || parsed.password || (parsed.protocol !== 'https:' && !(localDev && parsed.protocol === 'http:'))) return '';
    return parsed.href;
  } catch { return ''; }
}
export function productImageUrls(product,origin) {
  const urls = new Set();
  for (const url of [product.image_url,...(Array.isArray(product.image_urls) ? product.image_urls : [])]) {
    const safe = photoUrl(url,origin); if (safe) urls.add(safe);
    if (urls.size === 12) break;
  }
  return [...urls];
}
export function catalogFrom(value, dealer = false) {
  const raw = dealer ? value?.catalog : value;
  if (!raw || !Array.isArray(raw.products) || !Array.isArray(raw.delivery_methods)) throw new ApiError(t('Katalog bilgileri okunamadı.'), 502);
  if (dealer && (typeof raw.access_id !== 'string' || !/^[a-f0-9]{64}$/.test(raw.catalog_revision))) throw new ApiError(t('Bayi kataloğu doğrulanamadı.'), 502);
  const products = raw.products.map(p => {
    if (!p || typeof p.product_id !== 'string' || !p.product_id || typeof p.name !== 'string' || !p.name || !Number.isFinite(p.price) || p.price < 0 || !/^[A-Z]{3}$/.test(p.currency)) throw new ApiError(t('Ürün yayını geçersiz.'), 502);
    return {...p};
  });
  const categories = dealer ? [...new Map(products.filter(p => p.category_id && p.category_name).map(p => [p.category_id,{id:p.category_id,name:p.category_name}])).values()] : (Array.isArray(raw.categories) ? raw.categories : []);
  return {...raw,products,categories,delivery_methods:raw.delivery_methods.filter(method => ['pickup','shipping'].includes(method))};
}
export const normalized = value => String(value || '').toLocaleLowerCase('tr-TR');
export const money = (amount, currency) => new Intl.NumberFormat(locale,{style:'currency',currency}).format(amount);
export const unit = value => ({piece:t('adet'),pack:t('paket'),box:t('kutu'),meter:t('metre'),other:t('birim')}[value] || value || t('birim'));
export function filterProducts(products, {q = '', category = '', brand = '', favorites = null} = {}) {
  return products.filter(p => (!category || p.category_id === category) && (!brand || p.brand === brand) && (!favorites || favorites.includes(p.product_id)) && normalized([p.name,p.sku,p.description,p.brand,p.category_name].join(' ')).includes(normalized(q.trim())));
}
export function cartSummary(items, products) {
  let total = 0, currency = '';
  for (const [id,quantity] of Object.entries(items)) {
    const product = products.find(p => p.product_id === id);
    if (!product) throw new Error(t('Sepette artık sunulmayan ürün var. Devam etmek için ürünü çıkarın.'));
    if (currency && currency !== product.currency) throw new Error(t('Farklı para birimleri aynı siparişte kullanılamaz.'));
    currency = product.currency; total += Math.round((product.price * quantity + Number.EPSILON) * 100) / 100;
  }
  return {total:Math.round((total + Number.EPSILON) * 100) / 100,currency};
}
function quantities(items) {
  if (!items || typeof items !== 'object' || Array.isArray(items)) throw new Error(t('Sepet verisi okunamadı.'));
  const entries = Object.entries(items);
  if (entries.length > 50 || entries.some(([id,q]) => !id || id.length > 180 || !Number.isFinite(q) || q <= 0 || q > 1000 || Math.abs(q - Math.round(q * 10000) / 10000) > 1e-8) || entries.reduce((sum,[,q]) => sum + q,0) > 10000) throw new Error(t('En fazla 50 ürün; ürün başına 1000, toplamda 10000 birim eklenebilir. Miktarda en fazla dört ondalık basamak kullanın.'));
  return Object.fromEntries(entries);
}
async function fingerprint(payload) {
  const bytes = await globalThis.crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(payload)));
  return [...new Uint8Array(bytes)].map(value => value.toString(16).padStart(2,'0')).join('');
}
export class CartDraft {
  constructor(key, storage) { this.key = key; this.storage = storage; this.payload = null; this.read(); }
  read() {
    let raw;
    try { raw = JSON.parse(this.storage.getItem(this.key) || '{}'); } catch { throw new Error(t('Kaydedilmiş sepet okunamadı. Veriler silinmedi; tarayıcı depolamasını kontrol edin.')); }
    this.items = quantities(raw.items || {});
    this.favorites = Array.isArray(raw.favorites) ? raw.favorites.filter(id => typeof id === 'string' && id.length <= 180) : [];
    this.receipt = raw.receipt && typeof raw.receipt.order_id === 'string' ? {order_id:raw.receipt.order_id,accepted_at:raw.receipt.accepted_at} : null;
    this.pending = null;
    if (raw.pending) {
      const p = raw.pending;
      if (!/^[A-Za-z0-9_-]{16,128}$/.test(p.key) || !/^[a-f0-9]{64}$/.test(p.hash) || !['pickup','shipping'].includes(p.method)) throw new Error(t('Bekleyen gönderim bilgisi okunamadı. Veriler silinmedi.'));
      this.pending = {key:p.key,hash:p.hash,method:p.method,items:quantities(p.items),...(p.revision ? {revision:p.revision} : {})};
    }
    if (!this.pending || this.payload?.idempotencyKey !== this.pending.key) this.payload = null;
    return this;
  }
  persist({items = this.items,favorites = this.favorites,pending = this.pending,receipt = this.receipt} = {}) {
    try { this.storage.setItem(this.key,JSON.stringify({items,favorites,pending,receipt})); }
    catch { throw new Error(t('Sepet bu tarayıcıda kaydedilemiyor. Gönderim yapılmadı; tarayıcı depolamasını kontrol edin.')); }
    this.items = items; this.favorites = favorites; this.pending = pending; this.receipt = receipt;
  }
  quantity(id, amount) {
    this.read();
    if (this.pending) throw new Error(t('Gönderim sonucu belirsiz. Önce aynı siparişi tekrar deneyin.'));
    if (!Number.isFinite(amount) || amount < 0) throw new Error(t('Geçerli bir miktar girin.'));
    const items = {...this.items}; if (!amount) delete items[id]; else items[id] = amount;
    this.persist({items:quantities(items)});
  }
  favorite(id) { this.read(); const favorites = this.favorites.includes(id) ? this.favorites.filter(value => value !== id) : [...this.favorites,id]; this.persist({favorites}); }
  reorder(lines, products) {
    this.read(); if (this.pending) throw new Error(t('Önce sonucu belirsiz siparişinizi kontrol edin.'));
    const items = {...this.items}; let missing = 0;
    for (const line of lines) { if (!products.some(p => p.product_id === line.product_id)) { missing++; continue; } items[line.product_id] = (items[line.product_id] || 0) + line.quantity; }
    quantities(items); cartSummary(items,products); this.persist({items}); return missing;
  }
  async prepare(build) {
    const prepare = async () => {
      this.read();
      if (this.pending && this.payload) return JSON.parse(JSON.stringify(this.payload));
      const payload = build(this.pending?.key || crypto.randomUUID(),this.pending);
      const hash = await fingerprint(payload);
      // Re-read after hashing: another tab may have begun the same cart submission.
      this.read();
      const sentItems = Object.fromEntries(payload.items.map(item => [item.productId,item.quantity]));
      const sorted = items => JSON.stringify(Object.entries(items).sort(([a],[b]) => a.localeCompare(b)));
      if (!this.pending && sorted(sentItems) !== sorted(this.items)) throw new Error(t('Sepet başka bir sekmede değişti. Güncel sepeti kontrol edip tekrar deneyin.'));
      if (this.pending && (this.pending.key !== payload.idempotencyKey || this.pending.hash !== hash)) throw new Error(t('Önceki denemeyle aynı iletişim, teslimat ve not bilgilerini girin. Yeni bir sipariş kimliği oluşturulmadı.'));
      const pending = {key:payload.idempotencyKey,hash,method:payload.delivery.method,items:Object.fromEntries(payload.items.map(item => [item.productId,item.quantity])),...(payload.catalogRevision ? {revision:payload.catalogRevision} : {})};
      this.persist({pending}); this.payload = JSON.parse(JSON.stringify(payload)); return payload;
    };
    return globalThis.navigator?.locks ? navigator.locks.request('teknikel-cart:' + this.key,prepare) : prepare();
  }
  accepted(receipt, key) {
    checkReceipt(receipt); this.read();
    if (this.pending?.key !== key) return;
    this.persist({items:{},pending:null,receipt:{order_id:receipt.order_id,accepted_at:receipt.accepted_at}}); this.payload = null;
  }
  rejected() { this.read(); this.persist({pending:null}); this.payload = null; }
}
export function isDefinitiveRejection(error) {
  return error instanceof ApiError && (([400,413,415,422].includes(error.status) && !!error.code) || error.code === 'online_sales_disabled' || error.code === 'online_ordering_disabled');
}
export const orderStatus = status => ({awaiting_desktop:t('Talep alındı · Masaüstüne aktarım bekleniyor'),placed:t('Sipariş alındı'),confirmed:t('Onaylandı'),fulfilled:t('Tamamlandı'),cancelled:t('İptal edildi'),rejected:t('Erişim iptali nedeniyle işlenemedi')}[status] || t('Durum henüz doğrulanamadı'));
