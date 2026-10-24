import {initAccount} from './account.js';
import {t,locale,initLanguageChooser} from './language.js';
import {ApiError,request,checkReceipt,catalogFrom,money,unit,filterProducts,cartSummary,CartDraft,isDefinitiveRejection,orderStatus,photoUrl,productImageUrls} from './commerce.js';
import {createStorefront,hasSurface,storeEnabled} from './storefront.js';
import {loadPublicationPage} from './publications.js';
import {loadRooms} from './rooms.js';
import {loadPublicPage} from './public-pages.js';
import {loadCampaigns} from './marketing.js';

const $ = (selector,root = document) => root.querySelector(selector);
const all = (selector,root = document) => [...root.querySelectorAll(selector)];
initLanguageChooser();
const page = document.body.dataset.page;
const dealerMode = page === 'account';
const publicationPage = ['restaurant','qr-menu','rooms','room','contact','about','gallery','reviews','announcements'].includes(page);
const storefront = createStorefront();
const RETAIL_KEY = 'teknikel.retail.v1';
const LOCK_KEY = 'teknikel.dealer.signed-out';
const EVENT_KEY = 'teknikel.dealer.visibility';
const params = new URLSearchParams(location.search);
const el = (tag,text,cls) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (cls) node.className = cls; return node; };
const action = (text,callback,cls = 'btn btn-red') => { const button = el('button',text,cls); button.type = 'button'; button.addEventListener('click',callback); return button; };
const link = (text,href,cls = 'text-link') => { const node = el('a',text,cls); node.href = href; return node; };
const state = {business:null,catalog:null,cart:null,epoch:0,busy:false,identity:null,tab:'catalog',detail:null,orders:null,catalogError:'',ordersError:'',filter:{q:params.get('q') || '',category:params.get('category') || '',brand:params.get('brand') || ''},favoritesOnly:false,pageNo:1};
let retailCart;
const checkoutValues = {};
function notify(message,privateMessage = false) {
  const target = privateMessage ? $('[data-dealer-state]') : $('[data-shop-message]');
  if (target) { target.textContent = message; target.hidden = !message; }
}
function protect(callback) { return async (...args) => { try { await callback(...args); } catch (error) { notify(error.message,dealerMode && !!state.identity); } }; }
function openCart(key) { return new CartDraft(key,localStorage); }
function updateCounts() {
  if (retailCart) { retailCart.read(); all('[data-retail-count]').forEach(node => node.textContent = Object.keys(retailCart.items).length); }
  if (state.cart && state.identity) { state.cart.read(); all('[data-dealer-count]').forEach(node => node.textContent = Object.keys(state.cart.items).length); }
}
function products() { return state.catalog?.products || []; }
function publicEnabled() { return storeEnabled(state.business,state.catalog); }
function canBrowse() { return dealerMode ? !!state.identity && !!state.catalog : publicEnabled(); }
function canOrder() { return canBrowse() && state.catalog.delivery_methods.length > 0; }
function failure() {
  if (canBrowse() && !state.catalog.delivery_methods.length) return t('Katalog görüntülenebilir; şu anda yeni sipariş alınamıyor.');
  if (dealerMode) return state.catalogError || t('Bayi kataloğu henüz hazır değil.');
  const unpublished = t('Ürün kataloğu şu anda yayında değil. Yeni sipariş alınamıyor.');
  if (state.business && !hasSurface(state.business,'store')) return unpublished;
  if (!state.business || !state.catalog) return t('Katalog bağlantısı kurulamadı. Yenile ile tekrar deneyin.');
  return publicEnabled() ? t('Henüz yayınlanmış ürün bulunmuyor.') : unpublished;
}
function photo(url,name) {
  const box = el('div',undefined,'product-media'); const blank = el('span',t('Ürün görseli yok'),'missing-photo'); box.append(blank);
  const safeUrl = photoUrl(url,location.origin);
  if (safeUrl) {
    const img = el('img'); img.alt = name; img.loading = 'lazy'; img.decoding = 'async'; img.referrerPolicy = 'no-referrer';
    img.addEventListener('load',() => blank.hidden = true); img.addEventListener('error',() => { img.remove(); blank.hidden = false; }); box.append(img);
    img.src = safeUrl;
  }
  return box;
}
function productGallery(product) {
  const urls = productImageUrls(product,location.origin);
  const gallery = el('section',undefined,'product-gallery'); gallery.setAttribute('aria-label',product.name + t(' görselleri'));
  const hero = el('div',undefined,'gallery-hero'); gallery.append(hero);
  if (!urls.length) { hero.append(photo(null,product.name)); return gallery; }

  let selected = 0;
  let scrollBeforeInspection = 0;
  const label = index => product.name + t(' — görsel ') + (index + 1) + '/' + urls.length + (index === 0 ? t(' (kapak)') : '');
  const tools = el('div',undefined,'gallery-tools');
  const status = el('p',undefined,'gallery-status'); status.setAttribute('role','status'); status.setAttribute('aria-live','polite'); status.setAttribute('aria-atomic','true');
  const dialog = el('dialog',undefined,'gallery-dialog'); dialog.setAttribute('aria-label',product.name + t(' büyük görsel'));
  const dialogHead = el('div',undefined,'gallery-dialog-head');
  const title = el('h2'); const close = action(t('Kapat'),() => dialog.close(),'gallery-button'); close.autofocus = true;
  dialogHead.append(title,close);
  const viewer = el('div',undefined,'gallery-viewer'); viewer.tabIndex = 0; viewer.setAttribute('role','region'); viewer.setAttribute('aria-label',t('Ürün görseli; yakınlaştırıldığında kaydırılabilir'));
  const zoom = action(t('Yakınlaştır'),() => {
    const zoomed = viewer.classList.toggle('is-zoomed'); zoom.setAttribute('aria-pressed',String(zoomed));
    zoom.textContent = zoomed ? t('Görseli sığdır') : t('Yakınlaştır'); viewer.scrollTo(0,0);
  },'gallery-button'); zoom.setAttribute('aria-pressed','false');
  dialog.append(dialogHead,viewer,zoom);
  // Keep dialog keyboard navigation inside the image inspector on browsers
  // whose native <dialog> focus cycle does not wrap at the last control.
  dialog.addEventListener('keydown',event => {
    if (event.key !== 'Tab') return;
    const last = zoom.disabled ? viewer : zoom;
    if (event.shiftKey && document.activeElement === close) {
      event.preventDefault(); last.focus({preventScroll:true});
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); close.focus({preventScroll:true});
    }
  });
  dialog.addEventListener('close',() => {
    viewer.replaceChildren(); viewer.classList.remove('is-zoomed'); zoom.setAttribute('aria-pressed','false'); zoom.textContent = t('Yakınlaştır');
    enlarge.focus({preventScroll:true});
    window.scrollTo({top:scrollBeforeInspection,behavior:'instant'});
  });
  const enlarge = action(t('Büyük görüntüle'),() => {
    title.textContent = label(selected); const media = photo(urls[selected],label(selected)); const img = $('img',media);
    viewer.replaceChildren(media); zoom.disabled = true;
    if (img) {
      img.loading = 'eager';
      img.addEventListener('load',() => { if (viewer.firstElementChild === media) zoom.disabled = false; });
      img.addEventListener('error',() => { if (viewer.firstElementChild === media) zoom.disabled = true; });
    }
    scrollBeforeInspection = window.scrollY; dialog.showModal(); viewer.scrollTo(0,0);
  },'gallery-button');
  tools.append(status,enlarge);
  const thumbs = el('div',undefined,'gallery-thumbnails'); thumbs.setAttribute('role','group'); thumbs.setAttribute('aria-label',t('Ürün görseli seçimi (ok tuşları, Home ve End)'));
  const buttons = urls.map((url,index) => {
    const button = action('',() => select(index),'gallery-thumb'); button.setAttribute('aria-label',product.name + ', ' + (index + 1) + t('. görseli göster'));
    button.append(photo(url,''));
    button.addEventListener('keydown',event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % urls.length;
      else if (event.key === 'ArrowLeft') next = (index + urls.length - 1) % urls.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = urls.length - 1;
      else return;
      event.preventDefault(); select(next); buttons[next].focus({preventScroll:true});
    });
    return button;
  });
  function select(index) {
    selected = index; status.textContent = t('Görsel ') + (index + 1) + ' / ' + urls.length;
    buttons.forEach((button,i) => { button.setAttribute('aria-pressed',String(i === index)); button.tabIndex = i === index ? 0 : -1; });
    const media = photo(urls[index],label(index)); const img = $('img',media); hero.replaceChildren(media); enlarge.disabled = true;
    if (img) {
      img.loading = 'eager';
      img.addEventListener('load',() => { if (hero.firstElementChild === media) enlarge.disabled = false; });
      img.addEventListener('error',() => { if (hero.firstElementChild === media) status.textContent = t('Görsel ') + (index + 1) + ' / ' + urls.length + t(' yüklenemedi.'); });
    }
  }
  thumbs.append(...buttons); thumbs.hidden = urls.length < 2; gallery.append(thumbs,tools,dialog); select(0);
  return gallery;
}
function add(product,quantity = 1) {
  if (!canOrder()) throw new Error(t('Bu katalogda şu anda yeni sipariş alınamıyor.'));
  state.cart.read(); const items = {...state.cart.items,[product.product_id]:(state.cart.items[product.product_id] || 0) + quantity};
  cartSummary(items,products()); state.cart.quantity(product.product_id,items[product.product_id]); updateCounts(); notify(t('Ürün sepetinize eklendi.'),dealerMode);
}
function productCard(product) {
  const card = el('article',undefined,'product-card'); const info = el('div',undefined,'product-info');
  info.append(el('h3',product.name));
  if (product.brand || product.category_name) info.append(el('span',[product.brand,product.category_name].filter(Boolean).join(' · '),'product-meta'));
  if (product.sku) info.append(el('span',t('Stok kodu: ') + product.sku,'sku'));
  info.append(el('div',money(product.price,product.currency),'price'));
  const actions = el('div',undefined,'card-actions');
  const detail = dealerMode ? action(t('Ürünü incele →'),() => { state.detail = product.product_id; renderDealer(); },'product-link') : link(t('Ürünü incele →'),'/urun/?id=' + encodeURIComponent(product.product_id),'product-link');
  detail.setAttribute('aria-label',product.name + t(' ürününü incele')); actions.append(detail);
  const button = action(t('Sepete ekle'),protect(() => add(product))); button.setAttribute('aria-label',product.name + t(' sepete ekle')); button.disabled = !canOrder() || !!state.cart?.pending || state.busy; actions.append(button);
  info.append(actions); card.append(photo(product.image_url,product.name),info); return card;
}
function productDetail(root,product) {
  root.replaceChildren(); const view = el('div',undefined,'product-detail'); const info = el('div');
  info.append(el('div',dealerMode ? t('TEKNİKEL / BAYİ ÜRÜNÜ') : t('TEKNİKEL / ÜRÜN'),'eyebrow'),el('h1',product.name));
  if (product.brand || product.category_name) info.append(el('p',[product.brand,product.category_name].filter(Boolean).join(' · '),'product-meta'));
  if (product.sku) info.append(el('p',t('Stok kodu: ') + product.sku,'sku'));
  info.append(el('div',money(product.price,product.currency),'price'),el('p',product.description || t('Bu ürün için açıklama yayınlanmamış.'),'description'));
  const quantity = field(info,t('Miktar'),1,{type:'number',min:'0.0001',max:'1000',step:'0.0001',id:'detail-quantity'});
  const addButton = action(t('Sepete ekle'),protect(() => { if (!quantity.reportValidity()) return; add(product,quantity.valueAsNumber); })); addButton.disabled = !canOrder() || !!state.cart?.pending; info.append(addButton);
  if (dealerMode) {
    const favorite = action(state.cart.favorites.includes(product.product_id) ? t('Favorilerimden çıkar') : t('Favorilerime ekle'),protect(() => { state.cart.favorite(product.product_id); renderDealer(); }),'btn btn-outline');
    info.append(favorite);
  }
  info.append(el('p',dealerMode ? t('Bayi fiyatınız sunucunun size özel kataloğundan alınır. Sipariş tutarı masaüstünde güncel fiyatlarla kesinleşir.') : t('Ödeme alınmaz. Siparişiniz işletmenin onayını bekler.'),'aside-info'));
  view.append(productGallery(product),info); root.append(view);
}
function filterSelects(form,catalog) {
  const category = form.elements.category; category.replaceChildren(new Option(t('Tüm kategoriler'),''));
  for (const item of catalog?.categories || []) category.add(new Option(item.name,item.id));
  category.value = state.filter.category;
  const brand = form.elements.brand; const brands = [...new Set((catalog?.products || []).map(p => p.brand).filter(value => typeof value === 'string' && value))].sort((a,b) => a.localeCompare(b,'tr'));
  brand.replaceChildren(new Option(t('Tüm markalar'),'')); brands.forEach(value => brand.add(new Option(value,value))); brand.hidden = !brands.length;
  const label = $('[data-brand-label]',form); if (label) label.hidden = !brands.length;
  brand.value = state.filter.brand; form.elements.q.value = state.filter.q;
}
function bindFilters(form,render) {
  let debounce;
  const update = () => { state.filter = {q:form.elements.q.value,category:form.elements.category.value,brand:form.elements.brand.value}; state.pageNo = 1; render(); };
  form.addEventListener('submit',event => { event.preventDefault(); update(); });
  form.elements.q.addEventListener('input',() => { clearTimeout(debounce); debounce = setTimeout(update,150); });
  form.elements.category.addEventListener('change',update); form.elements.brand.addEventListener('change',update);
}
function renderPublic() {
  if (state.cart?.pending && page !== 'cart') notify(t('Son gönderiminizin sonucu belirsiz. Sepet’ten aynı siparişi kontrol edin.'));
  if ($('[data-featured-grid]')) {
    const valid = publicEnabled() ? products() : []; $('[data-featured-grid]').replaceChildren(...valid.slice(0,4).map(productCard)); $('[data-catalog-state]').textContent = valid.length ? '' : failure();
  }
  if ($('[data-product-grid]')) renderPublicCatalog();
  if ($('[data-product-detail]')) {
    const product = canBrowse() ? products().find(p => p.product_id === params.get('id')) : null;
    if (product) { productDetail($('[data-product-detail]'),product); $('[data-detail-state]').textContent = ''; }
    else { $('[data-product-detail]').replaceChildren(); $('[data-detail-state]').textContent = canBrowse() ? t('Ürün bulunamadı veya artık yayında değil.') : failure(); }
  }
  if ($('[data-cart-root]')) { $('[data-catalog-state]').textContent = canOrder() ? '' : failure(); renderCheckout($('[data-cart-root]')); }
}
function renderPublicCatalog() {
  const hits = filterProducts(canBrowse() ? products() : [],state.filter); const pages = Math.max(1,Math.ceil(hits.length / 18)); state.pageNo = Math.min(state.pageNo,pages);
  $('[data-product-grid]').replaceChildren(...hits.slice((state.pageNo - 1) * 18,state.pageNo * 18).map(productCard));
  $('[data-count]').textContent = hits.length ? hits.length.toLocaleString(locale) + t(' ürün') : '';
  $('[data-catalog-state]').textContent = hits.length ? hits.length.toLocaleString(locale) + t(' ürün bulundu') : canBrowse() && products().length ? t('Aramanızla eşleşen ürün bulunamadı.') : failure();
  $('[data-pagination]').hidden = pages <= 1; $('[data-page-number]').textContent = state.pageNo + ' / ' + pages; $('[data-prev]').disabled = state.pageNo <= 1; $('[data-next]').disabled = state.pageNo >= pages;
  const url = new URL(location.href); for (const [key,value] of Object.entries(state.filter)) value ? url.searchParams.set(key,value) : url.searchParams.delete(key); history.replaceState(null,'',url.pathname + url.search + url.hash);
}
async function loadPublic(refresh = false) {
  const epoch = ++state.epoch; state.catalog = null; state.business = null; all('[data-product-grid],[data-featured-grid],[data-product-detail]').forEach(node => node.replaceChildren());
  const snapshot = await storefront.load(refresh); if (epoch !== state.epoch) return;
  state.business = snapshot.business; state.catalog = snapshot.catalog;
  if (!publicEnabled() && state.catalog) state.catalog = {...state.catalog,products:[],categories:[]};
  const form = $('[data-catalog-filter]'); if (form) { filterSelects(form,state.catalog); form.hidden = !publicEnabled(); } renderPublic();
}
function field(parent,caption,value,{id,type = 'text',name = id,required = true,maxLength = 180,...attributes} = {}) {
  const wrap = el('div',undefined,'form-field'); const label = el('label',caption); const input = el('input');
  input.id = id; input.name = name; input.type = type; input.value = value ?? ''; input.required = required; input.maxLength = maxLength;
  for (const [key,setting] of Object.entries(attributes)) input.setAttribute(key,setting);
  label.htmlFor = id; wrap.append(label,input); parent.append(wrap); return input;
}
function renderCheckout(root) {
  state.cart.read(); root.replaceChildren(); const pending = state.cart.pending;
  const lines = pending ? pending.items : state.cart.items;
  if (!Object.keys(lines).length) {
    if (state.cart.receipt) root.append(el('div',t('Son alınan talep: ') + state.cart.receipt.order_id + t('. Ödeme alınmadı; işletmenin onayı bekleniyor.'),'order-notice'));
    root.append(el('h2',t('Sepetiniz boş')),el('p',t('Katalogdan ürün ekleyerek başlayın.'))); if (!dealerMode && publicEnabled()) root.append(link(t('Kataloğa dön →'),'/magaza/')); return;
  }
  const grid = el('div',undefined,'checkout-grid'); const itemList = el('section',undefined,'cart-lines'); itemList.setAttribute('aria-label',dealerMode ? t('Bayi sepeti') : t('Perakende sepeti'));
  const quantityInputs = [];
  for (const [id,quantity] of Object.entries(lines)) {
    const product = canBrowse() ? products().find(p => p.product_id === id) : null; const title = product?.name || t('Yayında olmayan ürün'); const row = el('article',undefined,'cart-line');
    const info = el('div'); info.append(el('h2',title),el('span',product?.sku ? t('Stok kodu: ') + product.sku : id,'sku'));
    if (product) info.append(el('p',money(product.price,product.currency) + ' / ' + unit(product.unit),'product-meta'));
    row.append(info); const controls = el('div',undefined,'quantity-controls'); const input = field(controls,title + t(' miktarı'),quantity,{id:'quantity-' + id,type:'number',min:'0.0001',max:'1000',step:'0.0001'}); input.disabled = !!pending; quantityInputs.push([id,input]);
    const apply = () => { input.setCustomValidity(''); try { if (!input.checkValidity()) return input.reportValidity(); state.cart.quantity(id,input.valueAsNumber); updateCounts(); updateTotal(); } catch (error) { input.setCustomValidity(error.message); input.reportValidity(); } };
    input.addEventListener('input',() => input.setCustomValidity('')); input.addEventListener('change',apply);
    const remove = action(t('Çıkar'),protect(() => { state.cart.quantity(id,0); updateCounts(); renderCheckout(root); }),'quiet-button'); remove.setAttribute('aria-label',title + t(' sepetten çıkar')); remove.disabled = !!pending;
    controls.append(remove); row.append(controls); itemList.append(row);
  }
  const panel = el('section',undefined,'checkout-panel'); const heading = el('h2',pending ? t('Gönderim sonucunu kontrol edin') : t('Sipariş bilgileri')); panel.append(heading);
  const summary = el('p',undefined,'cart-total'); panel.append(summary);
  const updateTotal = () => { try { summary.textContent = canBrowse() ? t('Tahmini toplam: ') + money(cartSummary(state.cart.items,products()).total,cartSummary(state.cart.items,products()).currency) : t('Yeni sipariş alınamıyor.'); } catch (error) { summary.textContent = error.message; } };
  updateTotal(); panel.append(el('p',t('Ödeme alınmaz. Sipariş talebiniz işletmenin onayını bekler. Kesin tutar masaüstündeki yetkili fiyatlarla belirlenir.'),'aside-info'));
  const feedback = el('p',undefined,'checkout-feedback'); feedback.setAttribute('role','status'); feedback.setAttribute('aria-live','polite'); panel.append(feedback);
  if (pending) feedback.textContent = state.cart.payload ? t('Gönderim sonucu belirsiz. Sepet korunuyor; aynı siparişi tekrar deneyin.') : t('Önceki gönderimin sonucu belirsiz. İletişim, teslimat ve not bilgileri tarayıcıda saklanmaz. Gerekirse aynı bilgileri yeniden girin; yeni sipariş kimliği oluşturulmaz.');
  const form = el('form'); form.noValidate = true; panel.append(form); const controls = el('fieldset',undefined,'checkout-fields'); form.append(controls);
  const values = checkoutValues[state.cart.key] ||= {};
  const bind = (input,key) => { input.addEventListener('input',() => values[key] = input.value); return input; };
  if (!dealerMode) {
    bind(field(controls,t('Ad soyad'),values.name,{id:'buyer-name',maxLength:160,autocomplete:'name'}),'name');
    bind(field(controls,t('Telefon'),values.phone,{id:'buyer-phone',type:'tel',maxLength:40,autocomplete:'tel'}),'phone');
    bind(field(controls,t('E-posta (isteğe bağlı)'),values.email,{id:'buyer-email',type:'email',required:false,maxLength:254,autocomplete:'email'}),'email');
  }
  const deliveryWrap = el('div',undefined,'form-field'); const deliveryLabel = el('label',t('Teslimat tercihi')); deliveryLabel.htmlFor = 'delivery-method'; const delivery = el('select'); delivery.id = 'delivery-method'; delivery.name = 'method'; delivery.required = true;
  const methods = pending ? [pending.method] : (canOrder() ? state.catalog.delivery_methods : []);
  for (const method of methods) delivery.add(new Option(method === 'shipping' ? t('Adrese gönderim') : t('Elden teslim'),method));
  delivery.value = methods.includes(values.method) ? values.method : methods[0] || ''; values.method = delivery.value; delivery.disabled = !!pending;
  deliveryWrap.append(deliveryLabel,delivery); controls.append(deliveryWrap);
  const address = el('fieldset',undefined,'address-fields'); address.append(el('legend',t('Teslimat adresi'))); controls.append(address);
  const addressFields = [['recipientName',t('Teslim alacak kişi'),160,'name'],['addressLine1',t('Açık adres'),300,'street-address'],['district',t('İlçe'),120,'address-level2'],['city',t('İl'),120,'address-level1'],['countryCode',t('Ülke kodu'),2,'country'],['postalCode',t('Posta kodu (isteğe bağlı)'),32,'postal-code']];
  for (const [key,caption,limit,autocomplete] of addressFields) bind(field(address,caption,values[key] ?? (key === 'countryCode' ? 'TR' : ''),{id:'delivery-' + key,required:key !== 'postalCode',maxLength:limit,autocomplete}),key);
  const updateDelivery = () => { address.hidden = delivery.value !== 'shipping'; address.disabled = delivery.value !== 'shipping'; if (!address.hidden && !$('#delivery-recipientName',address).value && !dealerMode) { $('#delivery-recipientName',address).value = values.name || ''; values.recipientName = values.name || ''; } };
  delivery.addEventListener('change',() => { values.method = delivery.value; updateDelivery(); }); updateDelivery();
  const noteWrap = el('div',undefined,'form-field'); const noteLabel = el('label',t('Sipariş notu (isteğe bağlı)')); noteLabel.htmlFor = 'order-note'; const note = el('textarea'); note.id = 'order-note'; note.rows = 2; note.maxLength = 2000; note.value = values.note || ''; note.addEventListener('input',() => values.note = note.value); noteWrap.append(noteLabel,note); controls.append(noteWrap);
  controls.disabled = !!pending && !!state.cart.payload;
  const submit = el('button',pending ? t('Aynı siparişi tekrar dene') : t('Sipariş talebini gönder'),'btn btn-red'); submit.type = 'submit'; submit.disabled = state.busy || (!canOrder() && !pending); form.append(submit);
  if (!canOrder() && !pending) feedback.textContent = failure();
  form.addEventListener('submit',event => {
    event.preventDefault(); if (state.busy) return;
    protect(async () => {
      for (const [id,input] of quantityInputs) if (!state.cart.pending) { if (!input.reportValidity()) return; state.cart.quantity(id,input.valueAsNumber); }
      const cart = state.cart; const epoch = state.epoch; const owner = state.identity?.access_id;
      const setBusy = busy => { if (epoch !== state.epoch) return; state.busy = busy; submit.disabled = busy; submit.textContent = busy ? t('Gönderim kontrol ediliyor…') : cart.pending ? t('Aynı siparişi tekrar dene') : t('Sipariş talebini gönder'); };
      setBusy(true); feedback.textContent = t('Siparişinizin sonucu kontrol ediliyor…');
      try {
        // A renewed dealer session can recover acceptance before asking for any personal fields.
        if (dealerMode && cart.pending) {
          const recovered = await dealerRequest('receipt',{idempotencyKey:cart.pending.key},epoch);
          if (recovered.receipt) {
            const receipt = checkReceipt(recovered.receipt); const key = cart.pending.key; cart.accepted(receipt,key);
            if (epoch === state.epoch && state.identity?.access_id === owner) accepted(root,receipt,cart); return;
          }
        }
        if (epoch !== state.epoch) return;
        if (!cart.payload && !form.reportValidity()) return;
        if (!cart.pending) { if (!canOrder()) throw new Error(t('Yeni sipariş alınamıyor.')); cartSummary(cart.items,products()); }
        const payload = await cart.prepare((key,attempt) => {
          const method = attempt?.method || delivery.value; const data = new FormData(form);
          const text = name => String(data.get(name) ?? '').trim();
          const shippingAddress = method === 'shipping' ? Object.fromEntries(addressFields.filter(([key]) => key !== 'postalCode' || text('delivery-' + key)).map(([key]) => [key,key === 'countryCode' ? text('delivery-' + key).toUpperCase() : text('delivery-' + key)])) : null;
          const result = {idempotencyKey:key,items:Object.entries(attempt?.items || cart.items).sort(([a],[b]) => a.localeCompare(b)).map(([productId,quantity]) => ({productId,quantity})),delivery:{method,address:shippingAddress},note:note.value.trim()};
          if (!dealerMode) { const phone = text('buyer-phone').replace(/[ ()./-]/g,''); if (!/^\+?[0-9]{7,15}$/.test(phone)) throw new Error(t('Geçerli bir iletişim telefonu girin.')); result.buyer = {name:text('buyer-name'),phone,...(text('buyer-email') ? {email:text('buyer-email')} : {})}; }
          else result.catalogRevision = attempt?.revision || state.catalog.catalog_revision;
          return result;
        });
        if (epoch !== state.epoch) return;
        // Lock editing before the first POST. Only ids/quantities/key/hash were persisted.
        controls.disabled = true; quantityInputs.forEach(([,input]) => input.disabled = true); all('.cart-line button',root).forEach(button => button.disabled = true);
        const receipt = checkReceipt(await (dealerMode ? dealerRequest('order',payload,epoch) : request('order',payload)));
        cart.accepted(receipt,payload.idempotencyKey);
        if (epoch === state.epoch) accepted(root,receipt,cart);
      } catch (error) {
        if (isDefinitiveRejection(error)) { cart.rejected(); if (['online_sales_disabled','online_ordering_disabled'].includes(error.code)) { state.catalog = null; notify(error.message); renderPublic(); } }
        if (epoch === state.epoch) {
          feedback.textContent = error.message + (cart.pending ? t(' Gönderim sonucu doğrulanana kadar aynı kimlikle tekrar deneyin.') : t(' Sepetiniz korunuyor.'));
          if (!cart.pending) { controls.disabled = false; quantityInputs.forEach(([,input]) => input.disabled = false); all('.cart-line button',root).forEach(button => button.disabled = false); }
        }
      } finally { setBusy(false); updateCounts(); }
    })();
  });
  grid.append(itemList,panel); root.append(grid);
}
function accepted(root,receipt,cart) {
  delete checkoutValues[cart.key]; state.busy = false; updateCounts(); root.replaceChildren();
  const notice = el('section',undefined,'order-accepted'); notice.append(el('div',t('TALEBİNİZ ULAŞTI'),'eyebrow'),el('h2',t('Sipariş talebiniz alındı')),el('p',t('Ödeme alınmadı. Talebiniz işletmenin onayını bekliyor.')),el('p',t('Sipariş numarası: ') + receipt.order_id,'order-ref'));
  if (receipt.quoted_total !== undefined) notice.append(el('p',t('Sunucu katalog toplamı: ') + money(receipt.quoted_total,receipt.currency) + t('. Kesin tutarı sipariş geçmişinden takip edin.')));
  if (dealerMode) notice.append(action(t('Siparişlerimi göster'),() => { state.tab = 'orders'; renderDealer(); loadOrders(); }));
  else notice.append(link(t('Kataloğa dön →'),'/magaza/','btn btn-red')); root.append(notice);
}
function broadcastDealerLock() {
  try { localStorage.setItem(EVENT_KEY,JSON.stringify({state:'locked',nonce:crypto.randomUUID()})); } catch { /* Server validation remains authoritative. */ }
}
function lockDealer(message = t('Bayi erişimi gerekli.'),broadcast = true) {
  state.epoch++; state.busy = false; if (state.cart) { delete checkoutValues[state.cart.key]; state.cart.payload = null; }
  state.identity = null; state.catalog = null; state.orders = null; state.cart = null; state.detail = null;
  $('[data-dealer-workspace]').hidden = true; $('[data-dealer-content]').replaceChildren(); $('[data-dealer-name]').textContent = ''; $('[data-dealer-state]').textContent = ''; $('[data-dealer-login]').hidden = false;
  $('[data-login-state]').textContent = message; notify('');
  if (broadcast) broadcastDealerLock();
}
async function dealerRequest(name,body,epoch = state.epoch) {
  try { return await request('dealer/' + name,body); }
  catch (error) { if ((error.status === 401 || error.status === 403) && epoch === state.epoch) { lockDealer(t('Hesabınıza yeniden giriş yapın.')); document.dispatchEvent(new Event('account:revalidate')); } throw error; }
}
async function loadDealer() {
  const epoch = ++state.epoch; state.catalog = null; state.orders = null; state.catalogError = ''; state.ordersError = ''; $('[data-dealer-content]').replaceChildren(el('p',t('Hesabınız kontrol ediliyor…')));
  try {
    const session = await dealerRequest('session',undefined,epoch); if (epoch !== state.epoch) return;
    if (session.authenticated !== true || !session.dealer?.access_id || typeof session.dealer.display_name !== 'string') throw new ApiError(t('Bayi oturumu doğrulanamadı.'),502);
    if (!state.identity || state.identity.access_id !== session.dealer.access_id) { state.cart = openCart('teknikel.dealer.v1:' + session.dealer.access_id); state.filter = {q:'',category:'',brand:''}; state.favoritesOnly = false; state.pageNo = 1; state.tab = 'catalog'; state.detail = null; }
    state.identity = session.dealer; $('[data-dealer-login]').hidden = false; $('[data-dealer-workspace]').hidden = false; $('[data-dealer-name]').textContent = session.dealer.display_name; $('[data-dealer-state]').textContent = t('Katalog ve siparişler yükleniyor…');
    const [catalog,orders] = await Promise.allSettled([dealerRequest('catalog',undefined,epoch),dealerRequest('orders',undefined,epoch)]); if (epoch !== state.epoch) return;
    if (catalog.status === 'fulfilled') {
      try { const safe = catalogFrom(catalog.value,true); if (safe.access_id !== state.identity.access_id) throw new Error(t('Bayi kataloğunun hesabı doğrulanamadı.')); state.catalog = safe; } catch (error) { state.catalogError = error.message; }
    } else state.catalogError = catalog.reason.message;
    if (orders.status === 'fulfilled' && Array.isArray(orders.value.orders)) state.orders = orders.value.orders; else state.ordersError = orders.status === 'rejected' ? orders.reason.message : t('Sipariş geçmişi okunamadı.');
    state.lastUpdate = new Date(); updateCounts(); notify('',true); renderDealer();
  } catch (error) { if (epoch === state.epoch) lockDealer(error.message); }
}
async function loadOrders() {
  const epoch = state.epoch;
  try { const result = await dealerRequest('orders',undefined,epoch); if (epoch !== state.epoch) return; if (!Array.isArray(result.orders)) throw new Error(t('Sipariş geçmişi okunamadı.')); state.orders = result.orders; state.ordersError = ''; state.lastUpdate = new Date(); if (state.tab === 'orders') renderDealer(); }
  catch (error) { if (epoch === state.epoch) { state.ordersError = error.message; if (state.tab === 'orders') renderDealer(); } }
}
function renderDealer() {
  if (!state.identity) return;
  const root = $('[data-dealer-content]'); root.replaceChildren();
  all('[data-dealer-tab]').forEach(button => { if (button.dataset.dealerTab === state.tab) button.setAttribute('aria-current','page'); else button.removeAttribute('aria-current'); });
  updateCounts();
  if (state.cart.pending) root.append(el('p',t('Gönderim sonucu belirsiz bir talebiniz var. Sepet’ten aynı siparişi kontrol edebilirsiniz.'),'order-notice'));
  if (state.tab === 'cart') { renderCheckout(root); return; }
  if (state.tab === 'orders') { renderOrders(root); return; }
  if (state.tab === 'account') {
    const panel = el('section',undefined,'account-panel'); panel.append(el('div',t('FİRMA HESABI'),'eyebrow'),el('h2',state.identity.display_name),el('p',t('Bayi fiyatlarınız ve siparişleriniz yalnız geçerli bayi oturumunuzla gösterilir. Web ve Android aynı sunucu hesabını kullanır.')),el('p',t('Favoriler ve sepet yalnız bu tarayıcıdaki bayi hesabınıza aittir. Özel fiyatlar tarayıcı depolamasına kaydedilmez.')));
    panel.append(link(t('Hesap ayarları'), '#main','btn btn-outline')); root.append(panel); return;
  }
  if (state.detail) {
    root.append(action(t('← Bayi kataloğuna dön'),() => { state.detail = null; renderDealer(); },'text-link'));
    const product = products().find(item => item.product_id === state.detail); if (product) productDetail(root.appendChild(el('div')),product); else root.append(el('p',failure())); return;
  }
  renderDealerCatalog(root);
}
function renderDealerCatalog(root) {
  if (!state.catalog) { root.append(el('p',failure(),'order-notice')); return; }
  const layout = el('div',undefined,'catalog-layout dealer-catalog'); const aside = el('aside',undefined,'filter-side'); aside.append(el('h2',t('Bayi kataloğunu filtrele')));
  const form = el('form'); form.setAttribute('aria-label',t('Bayi katalog filtresi')); aside.append(form);
  field(form,t('Ürün, marka veya stok kodu'),state.filter.q,{id:'dealer-query',name:'q',type:'search',required:false});
  for (const [name,caption] of [['category',t('Kategori')],['brand',t('Marka')]]) { const wrap = el('div',undefined,'form-field'); const label = el('label',caption); label.htmlFor = 'dealer-' + name; if (name === 'brand') label.dataset.brandLabel = ''; const select = el('select'); select.id = label.htmlFor; select.name = name; wrap.append(label,select); form.append(wrap); }
  const favoriteLabel = el('label',undefined,'favorite-filter'); const favorite = el('input'); favorite.type = 'checkbox'; favorite.checked = state.favoritesOnly; favoriteLabel.append(favorite,document.createTextNode(t(' Yalnız favorilerim'))); form.append(favoriteLabel);
  const main = el('section',undefined,'catalog-main'); main.setAttribute('aria-label',t('Bayi ürünleri')); const info = el('p',undefined,'status-line'); info.setAttribute('role','status'); const grid = el('div',undefined,'product-grid'); const pagination = el('div',undefined,'pagination'); main.append(info,grid,pagination);
  const render = () => {
    const hits = filterProducts(products(),{...state.filter,favorites:state.favoritesOnly ? state.cart.favorites : null}); const pages = Math.max(1,Math.ceil(hits.length / 18)); state.pageNo = Math.min(state.pageNo,pages);
    grid.replaceChildren(...hits.slice((state.pageNo - 1) * 18,state.pageNo * 18).map(productCard)); info.textContent = hits.length + t(' ürün · Bayi fiyatlarınız · Son kontrol: ') + state.lastUpdate.toLocaleTimeString(locale,{hour:'2-digit',minute:'2-digit'});
    if (!hits.length) info.textContent = t('Filtrelerinize uygun ürün bulunamadı.');
    pagination.replaceChildren(); pagination.hidden = pages <= 1;
    const previous = action(t('← Önceki'),() => { state.pageNo--; render(); },'quiet-button'); previous.disabled = state.pageNo <= 1;
    const next = action(t('Sonraki →'),() => { state.pageNo++; render(); },'quiet-button'); next.disabled = state.pageNo >= pages;
    pagination.append(previous,el('span',state.pageNo + ' / ' + pages),next);
  };
  filterSelects(form,state.catalog); bindFilters(form,render); favorite.addEventListener('change',() => { state.favoritesOnly = favorite.checked; state.pageNo = 1; render(); }); render(); layout.append(aside,main); root.append(layout);
}
function renderOrders(root) {
  const toolbar = el('div',undefined,'catalog-toolbar'); toolbar.append(el('h2',t('Sipariş geçmişi')),action(t('Siparişleri yenile'),loadOrders,'refresh')); root.append(toolbar);
  if (state.ordersError) { root.append(el('p',state.ordersError + t(' Siparişleri yenileyerek tekrar deneyin.'),'order-notice')); return; }
  if (!state.orders) { root.append(el('p',t('Sipariş geçmişi yükleniyor…'))); return; }
  if (!state.orders.length) { root.append(el('p',t('Henüz sipariş görünmüyor. Yeni taleplerinizi yenileyerek kontrol edebilirsiniz.'))); return; }
  const list = el('div',undefined,'order-list'); root.append(list);
  for (const order of state.orders) {
    if (!order || typeof order.order_id !== 'string' || !Array.isArray(order.items)) { list.append(el('p',t('Bir sipariş kaydı okunamadı.'))); continue; }
    const card = el('article',undefined,'order-card'); card.append(el('h3',orderStatus(order.status)),el('p',order.order_id,'order-ref'));
    if (Number.isFinite(Date.parse(order.created_at))) card.append(el('time',new Date(order.created_at).toLocaleString(locale)));
    if (Number.isFinite(order.total) && /^[A-Z]{3}$/.test(order.currency)) card.append(el('p',money(order.total,order.currency),'price'));
    const lines = el('ul'); for (const line of order.items) { const product = products().find(item => item.product_id === line.product_id); lines.append(el('li',line.quantity + ' × ' + (line.name || product?.name || t('Ürün artık katalogda bulunmuyor.')))); } card.append(lines);
    if (order.items.length) { const reorder = action(t('Ürünleri yeniden sepete ekle'),protect(() => { if (!canOrder()) throw new Error(t('Yeni sipariş alınamıyor.')); const missing = state.cart.reorder(order.items,products()); state.tab = 'cart'; renderDealer(); notify(missing ? missing + t(' ürün artık katalogda yok; diğer ürünler güncel bayi fiyatlarıyla eklendi.') : t('Ürünler güncel bayi kataloğunuzla sepete eklendi.'),true); }),'btn btn-outline'); reorder.setAttribute('aria-label',order.order_id + t(' ürünlerini yeniden sepete ekle')); reorder.disabled = !canOrder() || !!state.cart.pending; card.append(reorder); }
    list.append(card);
  }
}
function initDealer() {
  $('[data-dealer-refresh]').addEventListener('click',protect(loadDealer));
  all('[data-dealer-tab]').forEach(button => button.addEventListener('click',() => { if (state.busy) return; state.tab = button.dataset.dealerTab; state.detail = null; notify('',true); renderDealer(); }));
  document.addEventListener('account:ready',event => { if (event.detail?.dealer) loadDealer(); else lockDealer('',false); });
  document.addEventListener('account:locked',() => lockDealer('',false));
  document.addEventListener('visibilitychange',() => { if (!document.hidden && state.identity && !state.busy) loadDealer(); });
  window.addEventListener('pagehide',() => lockDealer('',false));
}
window.addEventListener('storage',event => {
  if (dealerMode && (event.key === EVENT_KEY || event.key === LOCK_KEY) && event.newValue) { lockDealer(t('Bayi oturumu başka bir sekmede kapatıldı veya sona erdi.'),false); return; }
  if (event.key === RETAIL_KEY || event.key === state.cart?.key) protect(() => { updateCounts(); if (page === 'cart') renderCheckout($('[data-cart-root]')); if (dealerMode && state.identity) renderDealer(); })();
});
// Chrome and read-only publications also work when cart storage is unavailable.
storefront.load().then(snapshot => {
  if (page === 'home') { if (snapshot.business) return loadCampaigns(storefront.read); return loadCampaigns(() => Promise.reject(new Error('business_unavailable'))); }
  if (['restaurant','qr-menu'].includes(page)) return loadPublicationPage(page,snapshot.business,document,storefront.read);
  if (['rooms','room'].includes(page)) return loadRooms(page,snapshot.business,storefront.read);
  if (publicationPage) return loadPublicPage(page,snapshot.business,storefront.read);
}).catch(() => {});
try {
  retailCart = openCart(RETAIL_KEY); updateCounts();
  if (dealerMode) initDealer();
  else if (!publicationPage) {
    state.cart = retailCart;
    const form = $('[data-catalog-filter]'); if (form) { bindFilters(form,renderPublicCatalog); $('[data-prev]').addEventListener('click',() => { state.pageNo--; renderPublicCatalog(); }); $('[data-next]').addEventListener('click',() => { state.pageNo++; renderPublicCatalog(); }); $('[data-reload]').addEventListener('click',protect(() => loadPublic(true))); }
    loadPublic().catch(error => notify(error.message));
  }
} catch (error) { notify(error.message); if (dealerMode) lockDealer(error.message,false); }

initAccount();
