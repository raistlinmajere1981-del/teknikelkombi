import {ApiError,request,checkReceipt,catalogFrom,money,unit,filterProducts,cartSummary,CartDraft,isDefinitiveRejection,orderStatus,photoUrl,productImageUrls} from './commerce.js';

const $ = (selector,root = document) => root.querySelector(selector);
const all = (selector,root = document) => [...root.querySelectorAll(selector)];
const page = document.body.dataset.page;
const dealerMode = page === 'dealer';
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
let inviteToken = '';
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
function publicEnabled() { return state.catalog?.enabled === true && state.business?.business?.public_surfaces?.includes('store') === true; }
function canBrowse() { return dealerMode ? !!state.identity && !!state.catalog : publicEnabled(); }
function canOrder() { return canBrowse() && state.catalog.delivery_methods.length > 0; }
function failure() {
  if (canBrowse() && !state.catalog.delivery_methods.length) return 'Katalog görüntülenebilir; şu anda yeni sipariş alınamıyor.';
  if (dealerMode) return state.catalogError || 'Bayi kataloğu henüz hazır değil.';
  return !state.business || !state.catalog ? 'Katalog bağlantısı kurulamadı. Yenile ile tekrar deneyin.' : !publicEnabled() ? 'Ürün kataloğu şu anda yayında değil. Yeni sipariş alınamıyor.' : 'Henüz yayınlanmış ürün bulunmuyor.';
}
function photo(url,name) {
  const box = el('div',undefined,'product-media'); const blank = el('span','Ürün görseli yok','missing-photo'); box.append(blank);
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
  const gallery = el('section',undefined,'product-gallery'); gallery.setAttribute('aria-label',product.name + ' görselleri');
  const hero = el('div',undefined,'gallery-hero'); gallery.append(hero);
  if (!urls.length) { hero.append(photo(null,product.name)); return gallery; }

  let selected = 0;
  let scrollBeforeInspection = 0;
  const label = index => product.name + ' — görsel ' + (index + 1) + '/' + urls.length + (index === 0 ? ' (kapak)' : '');
  const tools = el('div',undefined,'gallery-tools');
  const status = el('p',undefined,'gallery-status'); status.setAttribute('role','status'); status.setAttribute('aria-live','polite'); status.setAttribute('aria-atomic','true');
  const dialog = el('dialog',undefined,'gallery-dialog'); dialog.setAttribute('aria-label',product.name + ' büyük görsel');
  const dialogHead = el('div',undefined,'gallery-dialog-head');
  const title = el('h2'); const close = action('Kapat',() => dialog.close(),'gallery-button'); close.autofocus = true;
  dialogHead.append(title,close);
  const viewer = el('div',undefined,'gallery-viewer'); viewer.tabIndex = 0; viewer.setAttribute('role','region'); viewer.setAttribute('aria-label','Ürün görseli; yakınlaştırıldığında kaydırılabilir');
  const zoom = action('Yakınlaştır',() => {
    const zoomed = viewer.classList.toggle('is-zoomed'); zoom.setAttribute('aria-pressed',String(zoomed));
    zoom.textContent = zoomed ? 'Görseli sığdır' : 'Yakınlaştır'; viewer.scrollTo(0,0);
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
    viewer.replaceChildren(); viewer.classList.remove('is-zoomed'); zoom.setAttribute('aria-pressed','false'); zoom.textContent = 'Yakınlaştır';
    enlarge.focus({preventScroll:true});
    window.scrollTo({top:scrollBeforeInspection,behavior:'instant'});
  });
  const enlarge = action('Büyük görüntüle',() => {
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
  const thumbs = el('div',undefined,'gallery-thumbnails'); thumbs.setAttribute('role','group'); thumbs.setAttribute('aria-label','Ürün görseli seçimi (ok tuşları, Home ve End)');
  const buttons = urls.map((url,index) => {
    const button = action('',() => select(index),'gallery-thumb'); button.setAttribute('aria-label',product.name + ', ' + (index + 1) + '. görseli göster');
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
    selected = index; status.textContent = 'Görsel ' + (index + 1) + ' / ' + urls.length;
    buttons.forEach((button,i) => { button.setAttribute('aria-pressed',String(i === index)); button.tabIndex = i === index ? 0 : -1; });
    const media = photo(urls[index],label(index)); const img = $('img',media); hero.replaceChildren(media); enlarge.disabled = true;
    if (img) {
      img.loading = 'eager';
      img.addEventListener('load',() => { if (hero.firstElementChild === media) enlarge.disabled = false; });
      img.addEventListener('error',() => { if (hero.firstElementChild === media) status.textContent = 'Görsel ' + (index + 1) + ' / ' + urls.length + ' yüklenemedi.'; });
    }
  }
  thumbs.append(...buttons); thumbs.hidden = urls.length < 2; gallery.append(thumbs,tools,dialog); select(0);
  return gallery;
}
function add(product,quantity = 1) {
  if (!canOrder()) throw new Error('Bu katalogda şu anda yeni sipariş alınamıyor.');
  state.cart.read(); const items = {...state.cart.items,[product.product_id]:(state.cart.items[product.product_id] || 0) + quantity};
  cartSummary(items,products()); state.cart.quantity(product.product_id,items[product.product_id]); updateCounts(); notify('Ürün sepetinize eklendi.',dealerMode);
}
function productCard(product) {
  const card = el('article',undefined,'product-card'); const info = el('div',undefined,'product-info');
  info.append(el('h3',product.name));
  if (product.brand || product.category_name) info.append(el('span',[product.brand,product.category_name].filter(Boolean).join(' · '),'product-meta'));
  if (product.sku) info.append(el('span','Stok kodu: ' + product.sku,'sku'));
  info.append(el('div',money(product.price,product.currency),'price'));
  const actions = el('div',undefined,'card-actions');
  const detail = dealerMode ? action('Ürünü incele →',() => { state.detail = product.product_id; renderDealer(); },'product-link') : link('Ürünü incele →','/urun/?id=' + encodeURIComponent(product.product_id),'product-link');
  detail.setAttribute('aria-label',product.name + ' ürününü incele'); actions.append(detail);
  const button = action('Sepete ekle',protect(() => add(product))); button.setAttribute('aria-label',product.name + ' sepete ekle'); button.disabled = !canOrder() || !!state.cart?.pending || state.busy; actions.append(button);
  info.append(actions); card.append(photo(product.image_url,product.name),info); return card;
}
function productDetail(root,product) {
  root.replaceChildren(); const view = el('div',undefined,'product-detail'); const info = el('div');
  info.append(el('div',dealerMode ? 'TEKNİKEL / BAYİ ÜRÜNÜ' : 'TEKNİKEL / ÜRÜN','eyebrow'),el('h1',product.name));
  if (product.brand || product.category_name) info.append(el('p',[product.brand,product.category_name].filter(Boolean).join(' · '),'product-meta'));
  if (product.sku) info.append(el('p','Stok kodu: ' + product.sku,'sku'));
  info.append(el('div',money(product.price,product.currency),'price'),el('p',product.description || 'Bu ürün için açıklama yayınlanmamış.','description'));
  const quantity = field(info,'Miktar',1,{type:'number',min:'0.0001',max:'1000',step:'0.0001',id:'detail-quantity'});
  const addButton = action('Sepete ekle',protect(() => { if (!quantity.reportValidity()) return; add(product,quantity.valueAsNumber); })); addButton.disabled = !canOrder() || !!state.cart?.pending; info.append(addButton);
  if (dealerMode) {
    const favorite = action(state.cart.favorites.includes(product.product_id) ? 'Favorilerimden çıkar' : 'Favorilerime ekle',protect(() => { state.cart.favorite(product.product_id); renderDealer(); }),'btn btn-outline');
    info.append(favorite);
  }
  info.append(el('p',dealerMode ? 'Bayi fiyatınız sunucunun size özel kataloğundan alınır. Sipariş tutarı masaüstünde güncel fiyatlarla kesinleşir.' : 'Ödeme alınmaz. Siparişiniz işletmenin onayını bekler.','aside-info'));
  view.append(productGallery(product),info); root.append(view);
}
function filterSelects(form,catalog) {
  const category = form.elements.category; category.replaceChildren(new Option('Tüm kategoriler',''));
  for (const item of catalog?.categories || []) category.add(new Option(item.name,item.id));
  category.value = state.filter.category;
  const brand = form.elements.brand; const brands = [...new Set((catalog?.products || []).map(p => p.brand).filter(value => typeof value === 'string' && value))].sort((a,b) => a.localeCompare(b,'tr'));
  brand.replaceChildren(new Option('Tüm markalar','')); brands.forEach(value => brand.add(new Option(value,value))); brand.hidden = !brands.length;
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
  if (state.cart?.pending && page !== 'cart') notify('Son gönderiminizin sonucu belirsiz. Sepet’ten aynı siparişi kontrol edin.');
  if ($('[data-featured-grid]')) {
    const valid = publicEnabled() ? products() : []; $('[data-featured-grid]').replaceChildren(...valid.slice(0,4).map(productCard)); $('[data-catalog-state]').textContent = valid.length ? '' : failure();
    if (publicEnabled() && state.catalog.categories.length) $('[data-category-grid]').replaceChildren(...state.catalog.categories.slice(0,9).map((category,index) => {
      const node = link('','/katalog/?category=' + encodeURIComponent(category.id),'cat'); node.append(el('span',String(index + 1).padStart(2,'0'),'cat-num'),el('strong',category.name),el('span','↗')); return node;
    }));
  }
  if ($('[data-product-grid]')) renderPublicCatalog();
  if ($('[data-product-detail]')) {
    const product = canBrowse() ? products().find(p => p.product_id === params.get('id')) : null;
    if (product) { productDetail($('[data-product-detail]'),product); $('[data-detail-state]').textContent = ''; }
    else { $('[data-product-detail]').replaceChildren(); $('[data-detail-state]').textContent = canBrowse() ? 'Ürün bulunamadı veya artık yayında değil.' : failure(); }
  }
  if ($('[data-cart-root]')) { $('[data-catalog-state]').textContent = canOrder() ? '' : failure(); renderCheckout($('[data-cart-root]')); }
}
function renderPublicCatalog() {
  const hits = filterProducts(canBrowse() ? products() : [],state.filter); const pages = Math.max(1,Math.ceil(hits.length / 18)); state.pageNo = Math.min(state.pageNo,pages);
  $('[data-product-grid]').replaceChildren(...hits.slice((state.pageNo - 1) * 18,state.pageNo * 18).map(productCard));
  $('[data-count]').textContent = hits.length ? hits.length.toLocaleString('tr-TR') + ' ürün' : '';
  $('[data-catalog-state]').textContent = hits.length ? hits.length.toLocaleString('tr-TR') + ' ürün bulundu' : canBrowse() && products().length ? 'Aramanızla eşleşen ürün bulunamadı.' : failure();
  $('[data-pagination]').hidden = pages <= 1; $('[data-page-number]').textContent = state.pageNo + ' / ' + pages; $('[data-prev]').disabled = state.pageNo <= 1; $('[data-next]').disabled = state.pageNo >= pages;
  const url = new URL(location.href); for (const [key,value] of Object.entries(state.filter)) value ? url.searchParams.set(key,value) : url.searchParams.delete(key); history.replaceState(null,'',url.pathname + url.search);
}
async function loadPublic() {
  const epoch = ++state.epoch; state.catalog = null; state.business = null; all('[data-product-grid],[data-featured-grid],[data-product-detail]').forEach(node => node.replaceChildren());
  const responses = await Promise.allSettled([request('business'),request('catalog')]); if (epoch !== state.epoch) return;
  state.business = responses[0].status === 'fulfilled' ? responses[0].value : null;
  if (responses[1].status === 'fulfilled') { try { state.catalog = catalogFrom(responses[1].value); } catch (error) { notify(error.message); } }
  if (!publicEnabled() && state.catalog) state.catalog = {...state.catalog,products:[],categories:[]};
  const form = $('[data-catalog-filter]'); if (form) filterSelects(form,state.catalog); renderPublic();
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
    if (state.cart.receipt) root.append(el('div','Son alınan talep: ' + state.cart.receipt.order_id + '. Ödeme alınmadı; işletmenin onayı bekleniyor.','order-notice'));
    root.append(el('h2','Sepetiniz boş'),el('p','Katalogdan ürün ekleyerek başlayın.')); if (!dealerMode) root.append(link('Kataloğa dön →','/katalog/')); return;
  }
  const grid = el('div',undefined,'checkout-grid'); const itemList = el('section',undefined,'cart-lines'); itemList.setAttribute('aria-label',dealerMode ? 'Bayi sepeti' : 'Perakende sepeti');
  const quantityInputs = [];
  for (const [id,quantity] of Object.entries(lines)) {
    const product = canBrowse() ? products().find(p => p.product_id === id) : null; const title = product?.name || 'Yayında olmayan ürün'; const row = el('article',undefined,'cart-line');
    const info = el('div'); info.append(el('h2',title),el('span',product?.sku ? 'Stok kodu: ' + product.sku : id,'sku'));
    if (product) info.append(el('p',money(product.price,product.currency) + ' / ' + unit(product.unit),'product-meta'));
    row.append(info); const controls = el('div',undefined,'quantity-controls'); const input = field(controls,title + ' miktarı',quantity,{id:'quantity-' + id,type:'number',min:'0.0001',max:'1000',step:'0.0001'}); input.disabled = !!pending; quantityInputs.push([id,input]);
    const apply = () => { input.setCustomValidity(''); try { if (!input.checkValidity()) return input.reportValidity(); state.cart.quantity(id,input.valueAsNumber); updateCounts(); updateTotal(); } catch (error) { input.setCustomValidity(error.message); input.reportValidity(); } };
    input.addEventListener('input',() => input.setCustomValidity('')); input.addEventListener('change',apply);
    const remove = action('Çıkar',protect(() => { state.cart.quantity(id,0); updateCounts(); renderCheckout(root); }),'quiet-button'); remove.setAttribute('aria-label',title + ' sepetten çıkar'); remove.disabled = !!pending;
    controls.append(remove); row.append(controls); itemList.append(row);
  }
  const panel = el('section',undefined,'checkout-panel'); const heading = el('h2',pending ? 'Gönderim sonucunu kontrol edin' : 'Sipariş bilgileri'); panel.append(heading);
  const summary = el('p',undefined,'cart-total'); panel.append(summary);
  const updateTotal = () => { try { summary.textContent = canBrowse() ? 'Tahmini toplam: ' + money(cartSummary(state.cart.items,products()).total,cartSummary(state.cart.items,products()).currency) : 'Yeni sipariş alınamıyor.'; } catch (error) { summary.textContent = error.message; } };
  updateTotal(); panel.append(el('p','Ödeme alınmaz. Sipariş talebiniz işletmenin onayını bekler. Kesin tutar masaüstündeki yetkili fiyatlarla belirlenir.','aside-info'));
  const feedback = el('p',undefined,'checkout-feedback'); feedback.setAttribute('role','status'); feedback.setAttribute('aria-live','polite'); panel.append(feedback);
  if (pending) feedback.textContent = state.cart.payload ? 'Gönderim sonucu belirsiz. Sepet korunuyor; aynı siparişi tekrar deneyin.' : 'Önceki gönderimin sonucu belirsiz. İletişim, teslimat ve not bilgileri tarayıcıda saklanmaz. Gerekirse aynı bilgileri yeniden girin; yeni sipariş kimliği oluşturulmaz.';
  const form = el('form'); form.noValidate = true; panel.append(form); const controls = el('fieldset',undefined,'checkout-fields'); form.append(controls);
  const values = checkoutValues[state.cart.key] ||= {};
  const bind = (input,key) => { input.addEventListener('input',() => values[key] = input.value); return input; };
  if (!dealerMode) {
    bind(field(controls,'Ad soyad',values.name,{id:'buyer-name',maxLength:160,autocomplete:'name'}),'name');
    bind(field(controls,'Telefon',values.phone,{id:'buyer-phone',type:'tel',maxLength:40,autocomplete:'tel'}),'phone');
    bind(field(controls,'E-posta (isteğe bağlı)',values.email,{id:'buyer-email',type:'email',required:false,maxLength:254,autocomplete:'email'}),'email');
  }
  const deliveryWrap = el('div',undefined,'form-field'); const deliveryLabel = el('label','Teslimat tercihi'); deliveryLabel.htmlFor = 'delivery-method'; const delivery = el('select'); delivery.id = 'delivery-method'; delivery.name = 'method'; delivery.required = true;
  const methods = pending ? [pending.method] : (canOrder() ? state.catalog.delivery_methods : []);
  for (const method of methods) delivery.add(new Option(method === 'shipping' ? 'Adrese gönderim' : 'Elden teslim',method));
  delivery.value = methods.includes(values.method) ? values.method : methods[0] || ''; values.method = delivery.value; delivery.disabled = !!pending;
  deliveryWrap.append(deliveryLabel,delivery); controls.append(deliveryWrap);
  const address = el('fieldset',undefined,'address-fields'); address.append(el('legend','Teslimat adresi')); controls.append(address);
  const addressFields = [['recipientName','Teslim alacak kişi',160,'name'],['addressLine1','Açık adres',300,'street-address'],['district','İlçe',120,'address-level2'],['city','İl',120,'address-level1'],['countryCode','Ülke kodu',2,'country'],['postalCode','Posta kodu (isteğe bağlı)',32,'postal-code']];
  for (const [key,caption,limit,autocomplete] of addressFields) bind(field(address,caption,values[key] ?? (key === 'countryCode' ? 'TR' : ''),{id:'delivery-' + key,required:key !== 'postalCode',maxLength:limit,autocomplete}),key);
  const updateDelivery = () => { address.hidden = delivery.value !== 'shipping'; address.disabled = delivery.value !== 'shipping'; if (!address.hidden && !$('#delivery-recipientName',address).value && !dealerMode) { $('#delivery-recipientName',address).value = values.name || ''; values.recipientName = values.name || ''; } };
  delivery.addEventListener('change',() => { values.method = delivery.value; updateDelivery(); }); updateDelivery();
  const noteWrap = el('div',undefined,'form-field'); const noteLabel = el('label','Sipariş notu (isteğe bağlı)'); noteLabel.htmlFor = 'order-note'; const note = el('textarea'); note.id = 'order-note'; note.rows = 2; note.maxLength = 2000; note.value = values.note || ''; note.addEventListener('input',() => values.note = note.value); noteWrap.append(noteLabel,note); controls.append(noteWrap);
  controls.disabled = !!pending && !!state.cart.payload;
  const submit = el('button',pending ? 'Aynı siparişi tekrar dene' : 'Sipariş talebini gönder','btn btn-red'); submit.type = 'submit'; submit.disabled = state.busy || (!canOrder() && !pending); form.append(submit);
  if (!canOrder() && !pending) feedback.textContent = failure();
  form.addEventListener('submit',event => {
    event.preventDefault(); if (state.busy) return;
    protect(async () => {
      for (const [id,input] of quantityInputs) if (!state.cart.pending) { if (!input.reportValidity()) return; state.cart.quantity(id,input.valueAsNumber); }
      const cart = state.cart; const epoch = state.epoch; const owner = state.identity?.access_id;
      const setBusy = busy => { if (epoch !== state.epoch) return; state.busy = busy; submit.disabled = busy; submit.textContent = busy ? 'Gönderim kontrol ediliyor…' : cart.pending ? 'Aynı siparişi tekrar dene' : 'Sipariş talebini gönder'; };
      setBusy(true); feedback.textContent = 'Siparişinizin sonucu kontrol ediliyor…';
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
        if (!cart.pending) { if (!canOrder()) throw new Error('Yeni sipariş alınamıyor.'); cartSummary(cart.items,products()); }
        const payload = await cart.prepare((key,attempt) => {
          const method = attempt?.method || delivery.value; const data = new FormData(form);
          const text = name => String(data.get(name) ?? '').trim();
          const shippingAddress = method === 'shipping' ? Object.fromEntries(addressFields.filter(([key]) => key !== 'postalCode' || text('delivery-' + key)).map(([key]) => [key,key === 'countryCode' ? text('delivery-' + key).toUpperCase() : text('delivery-' + key)])) : null;
          const result = {idempotencyKey:key,items:Object.entries(attempt?.items || cart.items).sort(([a],[b]) => a.localeCompare(b)).map(([productId,quantity]) => ({productId,quantity})),delivery:{method,address:shippingAddress},note:note.value.trim()};
          if (!dealerMode) { const phone = text('buyer-phone').replace(/[ ()./-]/g,''); if (!/^\+?[0-9]{7,15}$/.test(phone)) throw new Error('Geçerli bir iletişim telefonu girin.'); result.buyer = {name:text('buyer-name'),phone,...(text('buyer-email') ? {email:text('buyer-email')} : {})}; }
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
          feedback.textContent = error.message + (cart.pending ? ' Gönderim sonucu doğrulanana kadar aynı kimlikle tekrar deneyin.' : ' Sepetiniz korunuyor.');
          if (!cart.pending) { controls.disabled = false; quantityInputs.forEach(([,input]) => input.disabled = false); all('.cart-line button',root).forEach(button => button.disabled = false); }
        }
      } finally { setBusy(false); updateCounts(); }
    })();
  });
  grid.append(itemList,panel); root.append(grid);
}
function accepted(root,receipt,cart) {
  delete checkoutValues[cart.key]; state.busy = false; updateCounts(); root.replaceChildren();
  const notice = el('section',undefined,'order-accepted'); notice.append(el('div','TALEBİNİZ ULAŞTI','eyebrow'),el('h2','Sipariş talebiniz alındı'),el('p','Ödeme alınmadı. Talebiniz işletmenin onayını bekliyor.'),el('p','Sipariş numarası: ' + receipt.order_id,'order-ref'));
  if (receipt.quoted_total !== undefined) notice.append(el('p','Sunucu katalog toplamı: ' + money(receipt.quoted_total,receipt.currency) + '. Kesin tutarı sipariş geçmişinden takip edin.'));
  if (dealerMode) notice.append(action('Siparişlerimi göster',() => { state.tab = 'orders'; renderDealer(); loadOrders(); }));
  else notice.append(link('Kataloğa dön →','/katalog/','btn btn-red')); root.append(notice);
}
function broadcastDealerLock() {
  try { localStorage.setItem(EVENT_KEY,JSON.stringify({state:'locked',nonce:crypto.randomUUID()})); } catch { /* Server validation remains authoritative. */ }
}
function lockDealer(message = 'Bayi erişimi gerekli.',broadcast = true) {
  state.epoch++; state.busy = false; if (state.cart) { delete checkoutValues[state.cart.key]; state.cart.payload = null; }
  state.identity = null; state.catalog = null; state.orders = null; state.cart = null; state.detail = null;
  $('[data-dealer-workspace]').hidden = true; $('[data-dealer-content]').replaceChildren(); $('[data-dealer-name]').textContent = ''; $('[data-dealer-state]').textContent = ''; $('[data-dealer-login]').hidden = false;
  $('[data-login-state]').textContent = message; notify('');
  if (broadcast) broadcastDealerLock();
}
async function dealerRequest(name,body,epoch = state.epoch) {
  try { return await request('dealer/' + name,body); }
  catch (error) { if (error.status === 401 && epoch === state.epoch) lockDealer(state.identity ? 'Oturumunuz sona erdi veya bayi erişiminiz kapatıldı. Firmanızdan yeni davet isteyin.' : 'Bayi davetinizle giriş yapın.'); throw error; }
}
async function loadDealer() {
  const epoch = ++state.epoch; state.catalog = null; state.orders = null; state.catalogError = ''; state.ordersError = ''; $('[data-dealer-content]').replaceChildren(el('p','Hesabınız kontrol ediliyor…'));
  try {
    const session = await dealerRequest('session',undefined,epoch); if (epoch !== state.epoch) return;
    if (session.authenticated !== true || !session.dealer?.access_id || typeof session.dealer.display_name !== 'string') throw new ApiError('Bayi oturumu doğrulanamadı.',502);
    if (!state.identity || state.identity.access_id !== session.dealer.access_id) { state.cart = openCart('teknikel.dealer.v1:' + session.dealer.access_id); state.filter = {q:'',category:'',brand:''}; state.favoritesOnly = false; state.pageNo = 1; state.tab = 'catalog'; state.detail = null; }
    state.identity = session.dealer; $('[data-dealer-login]').hidden = true; $('[data-dealer-workspace]').hidden = false; $('[data-dealer-name]').textContent = session.dealer.display_name; $('[data-dealer-state]').textContent = 'Katalog ve siparişler yükleniyor…';
    const [catalog,orders] = await Promise.allSettled([dealerRequest('catalog',undefined,epoch),dealerRequest('orders',undefined,epoch)]); if (epoch !== state.epoch) return;
    if (catalog.status === 'fulfilled') {
      try { const safe = catalogFrom(catalog.value,true); if (safe.access_id !== state.identity.access_id) throw new Error('Bayi kataloğunun hesabı doğrulanamadı.'); state.catalog = safe; } catch (error) { state.catalogError = error.message; }
    } else state.catalogError = catalog.reason.message;
    if (orders.status === 'fulfilled' && Array.isArray(orders.value.orders)) state.orders = orders.value.orders; else state.ordersError = orders.status === 'rejected' ? orders.reason.message : 'Sipariş geçmişi okunamadı.';
    state.lastUpdate = new Date(); updateCounts(); notify('',true); renderDealer();
  } catch (error) { if (epoch === state.epoch) lockDealer(error.message); }
}
async function loadOrders() {
  const epoch = state.epoch;
  try { const result = await dealerRequest('orders',undefined,epoch); if (epoch !== state.epoch) return; if (!Array.isArray(result.orders)) throw new Error('Sipariş geçmişi okunamadı.'); state.orders = result.orders; state.ordersError = ''; state.lastUpdate = new Date(); if (state.tab === 'orders') renderDealer(); }
  catch (error) { if (epoch === state.epoch) { state.ordersError = error.message; if (state.tab === 'orders') renderDealer(); } }
}
function renderDealer() {
  if (!state.identity) return;
  const root = $('[data-dealer-content]'); root.replaceChildren();
  all('[data-dealer-tab]').forEach(button => { if (button.dataset.dealerTab === state.tab) button.setAttribute('aria-current','page'); else button.removeAttribute('aria-current'); });
  updateCounts();
  if (state.cart.pending) root.append(el('p','Gönderim sonucu belirsiz bir talebiniz var. Sepet’ten aynı siparişi kontrol edebilirsiniz.','order-notice'));
  if (state.tab === 'cart') { renderCheckout(root); return; }
  if (state.tab === 'orders') { renderOrders(root); return; }
  if (state.tab === 'account') {
    const panel = el('section',undefined,'account-panel'); panel.append(el('div','FİRMA HESABI','eyebrow'),el('h2',state.identity.display_name),el('p','Bayi fiyatlarınız ve siparişleriniz yalnız geçerli bayi oturumunuzla gösterilir. Web ve Android aynı sunucu hesabını kullanır.'),el('p','Favoriler ve sepet yalnız bu tarayıcıdaki bayi hesabınıza aittir. Özel fiyatlar tarayıcı depolamasına kaydedilmez.'));
    panel.append(action('Oturumu kapat',protect(async () => {
      try { localStorage.setItem(LOCK_KEY,'1'); } catch { /* Always clear the private view, including when browser storage is unavailable. */ }
      lockDealer('Oturum kapatılıyor…'); state.busy = true; const claimButton = $('[data-dealer-claim] button[type="submit"]'); claimButton.disabled = true;
      try { await request('dealer/logout',{}); $('[data-login-state]').textContent = 'Oturumunuz kapatıldı. Yeniden giriş için yeni davet kullanın.'; }
      catch { $('[data-login-state]').textContent = 'Özel görünüm kapatıldı; sunucudaki çıkış doğrulanamadı. Oturumu kapatmayı tekrar deneyin.'; const retry = action('Oturumu kapatmayı tekrar dene',protect(async () => { await request('dealer/logout',{}); retry.remove(); $('[data-login-state]').textContent = 'Sunucudaki oturumunuz kapatıldı.'; }),'text-link'); $('[data-dealer-claim]').append(retry); }
      finally { state.busy = false; claimButton.disabled = false; }
    }),'btn btn-outline')); root.append(panel); return;
  }
  if (state.detail) {
    root.append(action('← Bayi kataloğuna dön',() => { state.detail = null; renderDealer(); },'text-link'));
    const product = products().find(item => item.product_id === state.detail); if (product) productDetail(root.appendChild(el('div')),product); else root.append(el('p',failure())); return;
  }
  renderDealerCatalog(root);
}
function renderDealerCatalog(root) {
  if (!state.catalog) { root.append(el('p',failure(),'order-notice')); return; }
  const layout = el('div',undefined,'catalog-layout dealer-catalog'); const aside = el('aside',undefined,'filter-side'); aside.append(el('h2','Bayi kataloğunu filtrele'));
  const form = el('form'); form.setAttribute('aria-label','Bayi katalog filtresi'); aside.append(form);
  field(form,'Ürün, marka veya stok kodu',state.filter.q,{id:'dealer-query',name:'q',type:'search',required:false});
  for (const [name,caption] of [['category','Kategori'],['brand','Marka']]) { const wrap = el('div',undefined,'form-field'); const label = el('label',caption); label.htmlFor = 'dealer-' + name; if (name === 'brand') label.dataset.brandLabel = ''; const select = el('select'); select.id = label.htmlFor; select.name = name; wrap.append(label,select); form.append(wrap); }
  const favoriteLabel = el('label',undefined,'favorite-filter'); const favorite = el('input'); favorite.type = 'checkbox'; favorite.checked = state.favoritesOnly; favoriteLabel.append(favorite,document.createTextNode(' Yalnız favorilerim')); form.append(favoriteLabel);
  const main = el('section',undefined,'catalog-main'); main.setAttribute('aria-label','Bayi ürünleri'); const info = el('p',undefined,'status-line'); info.setAttribute('role','status'); const grid = el('div',undefined,'product-grid'); const pagination = el('div',undefined,'pagination'); main.append(info,grid,pagination);
  const render = () => {
    const hits = filterProducts(products(),{...state.filter,favorites:state.favoritesOnly ? state.cart.favorites : null}); const pages = Math.max(1,Math.ceil(hits.length / 18)); state.pageNo = Math.min(state.pageNo,pages);
    grid.replaceChildren(...hits.slice((state.pageNo - 1) * 18,state.pageNo * 18).map(productCard)); info.textContent = hits.length + ' ürün · Bayi fiyatlarınız · Son kontrol: ' + state.lastUpdate.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
    if (!hits.length) info.textContent = 'Filtrelerinize uygun ürün bulunamadı.';
    pagination.replaceChildren(); pagination.hidden = pages <= 1;
    const previous = action('← Önceki',() => { state.pageNo--; render(); },'quiet-button'); previous.disabled = state.pageNo <= 1;
    const next = action('Sonraki →',() => { state.pageNo++; render(); },'quiet-button'); next.disabled = state.pageNo >= pages;
    pagination.append(previous,el('span',state.pageNo + ' / ' + pages),next);
  };
  filterSelects(form,state.catalog); bindFilters(form,render); favorite.addEventListener('change',() => { state.favoritesOnly = favorite.checked; state.pageNo = 1; render(); }); render(); layout.append(aside,main); root.append(layout);
}
function renderOrders(root) {
  const toolbar = el('div',undefined,'catalog-toolbar'); toolbar.append(el('h2','Sipariş geçmişi'),action('Siparişleri yenile',loadOrders,'refresh')); root.append(toolbar);
  if (state.ordersError) { root.append(el('p',state.ordersError + ' Siparişleri yenileyerek tekrar deneyin.','order-notice')); return; }
  if (!state.orders) { root.append(el('p','Sipariş geçmişi yükleniyor…')); return; }
  if (!state.orders.length) { root.append(el('p','Henüz sipariş görünmüyor. Yeni taleplerinizi yenileyerek kontrol edebilirsiniz.')); return; }
  const list = el('div',undefined,'order-list'); root.append(list);
  for (const order of state.orders) {
    if (!order || typeof order.order_id !== 'string' || !Array.isArray(order.items)) { list.append(el('p','Bir sipariş kaydı okunamadı.')); continue; }
    const card = el('article',undefined,'order-card'); card.append(el('h3',orderStatus(order.status)),el('p',order.order_id,'order-ref'));
    if (Number.isFinite(Date.parse(order.created_at))) card.append(el('time',new Date(order.created_at).toLocaleString('tr-TR')));
    if (Number.isFinite(order.total) && /^[A-Z]{3}$/.test(order.currency)) card.append(el('p',money(order.total,order.currency),'price'));
    const lines = el('ul'); for (const line of order.items) { const product = products().find(item => item.product_id === line.product_id); lines.append(el('li',line.quantity + ' × ' + (line.name || product?.name || 'Ürün artık katalogda bulunmuyor.'))); } card.append(lines);
    if (order.items.length) { const reorder = action('Ürünleri yeniden sepete ekle',protect(() => { if (!canOrder()) throw new Error('Yeni sipariş alınamıyor.'); const missing = state.cart.reorder(order.items,products()); state.tab = 'cart'; renderDealer(); notify(missing ? missing + ' ürün artık katalogda yok; diğer ürünler güncel bayi fiyatlarıyla eklendi.' : 'Ürünler güncel bayi kataloğunuzla sepete eklendi.',true); }),'btn btn-outline'); reorder.setAttribute('aria-label',order.order_id + ' ürünlerini yeniden sepete ekle'); reorder.disabled = !canOrder() || !!state.cart.pending; card.append(reorder); }
    list.append(card);
  }
}
function parseInvite(input) {
  const url = new URL(input,location.origin);
  if (url.origin !== location.origin || url.username || url.password || url.search || !/^#invite=[A-Za-z0-9_-]{43}$/.test(url.hash)) throw new Error('Bu siteye ait geçerli bayi davet bağlantısını kullanın.');
  return url.hash.slice(8);
}
function captureInvite() {
  if (location.hash.startsWith('#invite=')) {
    try { inviteToken = parseInvite(location.href); $('[data-invite-state]').textContent = 'Davetiniz hazır. Giriş yapmak için “Daveti kullan” düğmesine dokunun.'; } catch (error) { $('[data-login-state]').textContent = error.message; }
    history.replaceState(null,'',location.pathname + location.search);
  }
}
function initDealer() {
  captureInvite(); window.addEventListener('hashchange',captureInvite);
  $('[data-dealer-claim]').addEventListener('submit',event => {
    event.preventDefault(); if (state.busy) return;
    protect(async () => {
      const input = $('#dealer-invite'); const token = input.value.trim() ? parseInvite(input.value.trim()) : inviteToken;
      if (!token) throw new Error('Size gönderilen bayi davet bağlantısını yapıştırın.');
      state.busy = true; const button = $('[data-dealer-claim] button[type="submit"]'); button.disabled = true; $('[data-login-state]').textContent = 'Davetiniz kontrol ediliyor…';
      broadcastDealerLock();
      try { await request('dealer/claim',{invite_token:token}); broadcastDealerLock(); inviteToken = ''; input.value = ''; localStorage.removeItem(LOCK_KEY); await loadDealer(); }
      catch (error) { $('[data-login-state]').textContent = error.message; }
      finally { state.busy = false; button.disabled = false; if (state.identity) renderDealer(); }
    })();
  });
  $('[data-session-retry]').addEventListener('click',protect(async () => { localStorage.removeItem(LOCK_KEY); await loadDealer(); }));
  $('[data-dealer-refresh]').addEventListener('click',protect(loadDealer));
  all('[data-dealer-tab]').forEach(button => button.addEventListener('click',() => { if (state.busy) return; state.tab = button.dataset.dealerTab; state.detail = null; notify('',true); renderDealer(); }));
  setInterval(() => { if (!document.hidden && state.identity && !state.busy) { const epoch = state.epoch; dealerRequest('session',undefined,epoch).then(value => { if (epoch === state.epoch && (value.authenticated !== true || value.dealer?.access_id !== state.identity?.access_id)) lockDealer('Oturumunuz sona erdi veya hesap başka bir sekmede değişti.'); }).catch(() => {}); } },30000);
  document.addEventListener('visibilitychange',() => { if (!document.hidden && state.identity && !state.busy) loadDealer(); });
  window.addEventListener('pagehide',() => lockDealer('Hesap yeniden doğrulanıyor…',false));
  window.addEventListener('pageshow',event => { if (event.persisted && !localStorage.getItem(LOCK_KEY)) loadDealer(); });
  if (localStorage.getItem(LOCK_KEY)) {
    lockDealer('Bu tarayıcıda bayi görünümü kapalı. Yeni davet kullanabilir veya oturumu kontrol edebilirsiniz.',false);
    const retry = action('Sunucudaki çıkışı tekrar dene',protect(async () => { await request('dealer/logout',{}); retry.remove(); $('[data-login-state]').textContent = 'Sunucudaki oturumunuz kapatıldı.'; }),'text-link'); $('[data-dealer-claim]').append(retry);
  } else loadDealer();
}
window.addEventListener('storage',event => {
  if (dealerMode && (event.key === EVENT_KEY || event.key === LOCK_KEY) && event.newValue) { lockDealer('Bayi oturumu başka bir sekmede kapatıldı veya sona erdi.',false); return; }
  if (event.key === RETAIL_KEY || event.key === state.cart?.key) protect(() => { updateCounts(); if (page === 'cart') renderCheckout($('[data-cart-root]')); if (dealerMode && state.identity) renderDealer(); })();
});
try {
  retailCart = openCart(RETAIL_KEY); updateCounts();
  if (dealerMode) initDealer();
  else {
    state.cart = retailCart;
    const form = $('[data-catalog-filter]'); if (form) { bindFilters(form,renderPublicCatalog); $('[data-prev]').addEventListener('click',() => { state.pageNo--; renderPublicCatalog(); }); $('[data-next]').addEventListener('click',() => { state.pageNo++; renderPublicCatalog(); }); $('[data-reload]').addEventListener('click',protect(loadPublic)); }
    loadPublic().catch(error => notify(error.message));
  }
} catch (error) { notify(error.message); if (dealerMode) lockDealer(error.message,false); }
