/* Teknikel catalog presentation. Data, session fencing and orders belong to YaCommerce. */
(() => {
  'use strict';
  const root = document.querySelector('.teknikel-catalog');
  if (!root) return;
  const $ = id => root.querySelector(`#${id}`);
  const {ui,locale} = window.DemoLanguage;
  const controller = window.YaCommerce.create({apiBase:document.currentScript.dataset.apiBase});
  let commerceState, auth, generation, catalog, catalogStatus, loading, categories, favorites, cart, pending, busy, deliveryMethods, deliveryMethod, units, deliveryLabels, scale;
  const selected = new Set(), filters = {q:'',category:'',brand:'',sku:''};
  let favoritesOnly = false, pageNumber = 1;
  let pageSize = 18, sortMode = 'published', viewMode = 'grid';
  const collator = new Intl.Collator(locale,{numeric:true,sensitivity:'base'});
  const parameters = new URLSearchParams(location.search), reorderId = parameters.get('reorder');
  const detailId = parameters.get('id') || '';
  const initialComparison = (new URLSearchParams(location.hash.replace(/^#/, '')).get('compare') || '')
    .split(',').filter(id=>id && id.length<=180).slice(0,2);
  let comparisonHandled = false;
  const requestHook = $('detail-request-hook');
  let detailImageIndex = 0, detailImageProduct = '';
  let reorderHandled = false;
  for (const key of Object.keys(filters)) filters[key] = (parameters.get(key) || '').slice(0,180);
  const current = stamp => stamp === generation && auth.status !== 'unavailable';
  const {quantity,discrete,safeImage} = controller;
  const addProduct = product => controller.add(product.product_id);
  const changeQuantity = (item,q) => controller.setQuantity(item.productId,q / scale);
  function clearComparison() {
    selected.clear();
    closeLightbox();
    $('comparison-panel')?.replaceChildren(); if ($('comparison-panel')) $('comparison-panel').hidden = true;
  }
  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function button(text, action, className = 'secondary') {
    const node = el('button', text, className); node.type = 'button'; node.addEventListener('click', action); return node;
  }
  function money(value,currency) { return new Intl.NumberFormat(locale,{style:'currency',currency}).format(value); }
  function productUrl(id) {
    const url = new URL(location.pathname,location.origin); url.searchParams.set('page','catalog');
    const language = new URLSearchParams(location.search).get('lang');
    if (language && /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i.test(language)) url.searchParams.set('lang',language);
    for (const [key,value] of Object.entries(filters)) if (value) url.searchParams.set(key,value);
    if (id) url.searchParams.set('id',id);
    return url.pathname + url.search;
  }
  function selectedCategoryIds() {
    return new Set(filters.category.split(',').filter(Boolean));
  }
  function setCategories(ids) {
    const next = categories.filter(row => ids.has(row.id)).map(row => row.id).join(',');
    // Keep the URL within the shared 180-character category query contract.
    if (next.length > 180) return;
    $('catalog-category').value = next;
    $('catalog-category').dispatchEvent(new Event('change', {bubbles:true}));
  }
  function renderFilters() {
    $('catalog-category').value = filters.category;
    $('catalog-brand').value = filters.brand;
    $('catalog-category-field').hidden = categories.length === 0;
    $('catalog-sku').closest('label').hidden = ![...catalog.values()].some(product => product.sku);
    $('catalog-search').value = filters.q; $('catalog-sku').value = filters.sku;
    const brands = [...new Set([...catalog.values()].map(row => row.brand).filter(Boolean))]
      .sort((a,b) => a.localeCompare(b,locale));
    $('catalog-brand-field').hidden = brands.length === 0;
    renderCategoryOptions();
    renderBrandOptions(brands);
  }
  function renderCategoryOptions() {
    const options = $('category-options'), query = $('category-query');
    const active = selectedCategoryIds();
    const count = $('category-selected-count');
    count.hidden = active.size === 0;
    count.textContent = String(active.size);
    $('category-clear').hidden = active.size === 0;
    const fold = text => String(text || '').toLocaleLowerCase(locale).normalize('NFKD');
    const matching = categories.filter(row => fold(row.name).includes(fold(query.value.trim())));
    // Preserve the scroll position while selecting successive categories.
    const scroll = options.scrollTop, focused = document.activeElement?.dataset.categoryId;
    options.replaceChildren();
    for (const row of matching) {
      const item = el('label',undefined,'category-choice');
      const input = el('input');
      input.type = 'checkbox'; input.value = row.id; input.checked = active.has(row.id);
      input.dataset.categoryId = row.id;
      input.addEventListener('change', () => {
        const next = selectedCategoryIds();
        if (input.checked) next.add(row.id); else next.delete(row.id);
        setCategories(next);
      });
      const name = el('span',row.name,'category-choice-name');
      item.append(input,name);
      options.append(item);
    }
    if (!matching.length) options.append(el('p',ui('Ürün bulunamadı.'),'category-no-results'));
    options.scrollTop = scroll;
    if (focused) [...options.querySelectorAll('input')].find(node => node.dataset.categoryId === focused)?.focus({preventScroll:true});
  }
  function renderBrandOptions(brands) {
    const options = $('brand-options'), scroll = options.scrollTop, focused = document.activeElement?.dataset.brand;
    options.replaceChildren();
    for (const brand of brands) {
      const item = el('label',undefined,'brand-choice'), input = el('input');
      input.type = 'checkbox'; input.value = brand; input.checked = filters.brand === brand;
      input.dataset.brand = brand;
      input.addEventListener('change', () => {
        $('catalog-brand').value = input.checked ? brand : '';
        $('catalog-brand').dispatchEvent(new Event('change',{bubbles:true}));
      });
      item.append(input,el('span',brand,'brand-choice-name')); options.append(item);
    }
    options.scrollTop = scroll;
    if (focused) [...options.querySelectorAll('input')].find(node => node.dataset.brand === focused)?.focus({preventScroll:true});
  }
  function syncFilterUrl() {
    const url = new URL(location.href);
    for (const [key,value] of Object.entries(filters)) { if (value) url.searchParams.set(key,value); else url.searchParams.delete(key); }
    history.replaceState(null,'',url.pathname + url.search + url.hash);
    // The header GET form must follow in-page filters, not its initial PHP snapshot.
    for (const form of document.querySelectorAll('.language-picker')) for (const [key,value] of Object.entries(filters)) {
      let field = form.querySelector(`input[name="${key}"]`);
      if (!value) { field?.remove(); continue; }
      if (!field) { field = document.createElement('input'); field.type = 'hidden'; field.name = key; form.append(field); }
      field.value = value;
    }
  }
  function favoriteButton(product) {
    const saved = favorites.has(product.product_id);
    const node = button(ui(saved ? 'Favorilerimden çıkar' : 'Favorilerime ekle'), () => {
      controller.toggleFavorite(product.product_id);
    }, 'quiet');
    node.dataset.favoriteToggle = ''; node.dataset.productId = product.product_id;
    node.setAttribute('aria-pressed',String(saved));
    return node;
  }
  function closeLightbox() { window.TeknikelProductCard.closeInspector(); }
  function openLightbox(product, urls, startIndex, opener, onSelect) {
    window.TeknikelProductCard.inspect({product,urls,index:startIndex,opener,onSelect});
  }
  function detailGallery(product) {
    const urls = [...new Set([product.image_url,...product.image_urls].map(safeImage).filter(Boolean))].slice(0,12);
    const gallery = el('div',undefined,'teknikel-detail-gallery');
    if (!urls.length) {
      gallery.append(el('div',ui('Görsel yok'),'teknikel-detail-empty'));
      return gallery;
    }
    if (detailImageProduct !== product.product_id) { detailImageProduct = product.product_id; detailImageIndex=0; }
    detailImageIndex = Math.min(detailImageIndex,urls.length-1);
    const stage = button('',()=>openLightbox(product,urls,detailImageIndex,stage,select),'teknikel-detail-main-photo');
    stage.setAttribute('aria-label',ui('Fotoğrafı büyüt'));
    stage.setAttribute('title',ui('Fotoğrafı büyüt'));
    const image=el('img'); image.referrerPolicy='no-referrer';image.alt=product.name;
    const fallback=el('span',ui('Fotoğraf yüklenemedi'),'teknikel-detail-fallback');
    fallback.hidden=true;
    image.addEventListener('error',() => {image.hidden=true;fallback.hidden=false;});
    image.addEventListener('load',() => {image.hidden=false;fallback.hidden=true;});
    const hint=el('span',ui('Fotoğrafı büyüt'),'teknikel-detail-zoom-hint');
    stage.append(image,fallback,hint);
    const strip=el('div',undefined,'teknikel-detail-strip');
    strip.setAttribute('role','group');strip.setAttribute('aria-label',ui('Ürün fotoğrafları'));
    const controls=urls.map((url,i) => {
      const thumb=button('',()=>{ select(i);openLightbox(product,urls,i,thumb,select); },'teknikel-detail-thumb');
      thumb.setAttribute('aria-label',ui('{0}. fotoğrafı göster',{0:i+1}));
      const img=el('img');img.src=url;img.alt='';img.loading='lazy';img.referrerPolicy='no-referrer';
      img.addEventListener('error',()=>thumb.replaceChildren(String(i+1)));
      thumb.append(img);return thumb;
    });
    const select = i => {
      detailImageIndex=i;
      image.hidden=false;fallback.hidden=true;
      image.src=urls[i];
      image.alt=ui('{0}, fotoğraf {1}',{0:product.name,1:i+1});
      controls.forEach((thumb,j)=>thumb.setAttribute('aria-pressed',String(j===i)));
    };
    strip.append(...controls);
    const count=el('p',ui('Fotoğraflar ({0})',{0:urls.length}),'teknikel-detail-photo-count');
    gallery.append(stage,strip,count);
    select(detailImageIndex);
    return gallery;
  }
  function renderDetail() {
    const detail=$('product-detail');
    detail.replaceChildren();detail.hidden = !detailId;
    if(requestHook)requestHook.hidden=true;
    if (!detailId) return;
    const back=el('a',ui('Tüm ürünlere dön'),'teknikel-detail-back');
    back.href=productUrl('');
    detail.append(back);
    const product=catalog.get(detailId);
    if(!product) {
      const heading=el('h2',catalogStatus === 'loading' ? ui('Ürün yükleniyor…') : ui('Ürün bulunamadı.'));
      heading.id='product-detail-title';detail.append(heading);
      return;
    }
    const layout=el('div',undefined,'teknikel-detail-layout');
    const body=el('div',undefined,'teknikel-detail-info');
    const group=[product.brand,product.category_name].filter(Boolean).join(' · ');
    if(group)body.append(el('p',group,'teknikel-detail-kicker'));
    const title=el('h2',product.name);title.id='product-detail-title';body.append(title);
    const facts=el('dl',undefined,'teknikel-detail-facts');
    if(product.sku)facts.append(el('dt',ui('Stok kodu')),el('dd',product.sku));
    if(product.brand)facts.append(el('dt',ui('Marka')),el('dd',product.brand));
    if(product.category_name)facts.append(el('dt',ui('Kategori')),el('dd',product.category_name));
    if(facts.children.length)body.append(facts);
    if(product.description) {
      const description=el('section',undefined,'teknikel-detail-description');
      description.append(el('h3',ui('Açıklama')),el('p',product.description));
      body.append(description);
    }
    const commerce=el('div',undefined,'teknikel-detail-purchase');
    commerce.append(el('p',money(product.price,product.currency)+' / '+units[product.unit],'teknikel-detail-price'));
    const actions=el('div',undefined,'teknikel-detail-actions');
    const add=button(ui('Sepete ekle'),() => addProduct(product),'button');
    add.disabled = !commerceState.canEdit || !deliveryMethods.length;
    actions.append(add,favoriteButton(product));
    if(requestHook && requestHook.querySelector('button')) {
      requestHook.hidden=false;
      actions.append(requestHook);
    }
    commerce.append(actions);body.append(commerce);
    layout.append(detailGallery(product),body);detail.append(layout);
  }
  function updateComparisonControls() {
    $('compare-open').disabled = selected.size === 0 || catalogStatus !== 'ready';
    for (const input of root.querySelectorAll('.compare-select')) {
      input.checked = selected.has(input.dataset.productId);
      input.disabled = !input.checked && selected.size >= 2;
    }
    // Never leave stale private prices in an open comparison after a publication refresh.
    if (!$('comparison-panel').hidden) showComparison(false);
  }
  function showComparison(focus = true) {
    const panel = $('comparison-panel'); panel.replaceChildren(); panel.hidden = selected.size === 0;
    if (!selected.size) return;
    const products = [...selected].map(id=>catalog.get(id)).filter(Boolean);
    if (!products.length) return;
    panel.append(el('h2',ui('Ürün karşılaştırma')),el('p',products.map(p=>p.name).join(' · ')));
    const open = () => window.TeknikelProductCard.openInspector({
      title:ui('Ürün karşılaştırma'), mode:products.length===2?'compare':'inspect',
      items:products.map(product=>({name:product.name,urls:[...new Set([product.image_url,...product.image_urls].map(safeImage).filter(Boolean))]})),
      details:host=>{
        const grid=el('div'); host.append(grid);
        for(const product of products){
          const slot=el('article');slot.dataset.compareSlot=product.product_id;
          slot.append(el('h3',product.name));
          const fields=el('dl');
          for(const [label,value] of [[ui('Stok kodu'),product.sku],[ui('Marka'),product.brand],[ui('Kategori'),product.category_name],[ui('Açıklama'),product.description],[ui('Fiyat'),money(product.price,product.currency)+' / '+units[product.unit]]]){
            if(value)fields.append(el('dt',label),el('dd',value));
          }
          slot.append(fields);
          const add=button(ui('Sepete ekle'),()=>addProduct(product));add.disabled=!commerceState.canEdit;
          const detail=el('a',ui('Ürün detayı'));detail.href=productUrl(product.product_id);
          slot.append(add,detail);grid.append(slot);
        }
      }
    });
    panel.append(button(ui('Karşılaştır'),open),button(ui('Karşılaştırmayı kapat'),()=>{closeLightbox();panel.hidden=true;},'quiet'));
    if(focus)open();
  }
  function renderProducts() {
    $('product-grid').replaceChildren();
    $('catalog-pagination').hidden = true;
    // A detail route is a separate presentation, not a catalog with cards hidden over it.
    if (detailId || catalogStatus !== 'ready') return;
    const fold = value => value.toLocaleLowerCase(locale).normalize('NFKD');
    const products = [...catalog.values()].filter(product => (!filters.q || fold([product.name,product.description,product.sku,product.brand,product.category_name].join(' ')).includes(fold(filters.q)))
      && (!filters.sku || fold(product.sku).includes(fold(filters.sku))) && (!filters.category || selectedCategoryIds().has(product.category_id))
      && (!filters.brand || product.brand === filters.brand) && (!favoritesOnly || favorites.has(product.product_id)));
    $('catalog-count').textContent = ui('{0} ürün', {0:products.length});
    // Presentation-only ordering. Never mutate published data or the shared commerce catalog.
    if (sortMode === 'name-asc' || sortMode === 'name-desc') {
      const direction = sortMode === 'name-asc' ? 1 : -1;
      products.sort((a,b) => direction * collator.compare(a.name,b.name));
    } else if (sortMode === 'price-asc' || sortMode === 'price-desc') {
      const direction = sortMode === 'price-asc' ? 1 : -1;
      // Currency groups are kept separate: no conversion or misleading cross-currency total.
      products.sort((a,b) => collator.compare(a.currency,b.currency) || direction * (a.price-b.price));
    }
    $('product-grid').classList.toggle('is-list',viewMode === 'list');
    $('catalog-view-grid').setAttribute('aria-pressed',String(viewMode === 'grid'));
    $('catalog-view-list').setAttribute('aria-pressed',String(viewMode === 'list'));
    const pages = Math.max(1,Math.ceil(products.length / pageSize));
    pageNumber = Math.min(Math.max(1,pageNumber),pages);
    $('catalog-pagination').hidden = pages <= 1;
    $('catalog-prev').disabled = pageNumber === 1; $('catalog-next').disabled = pageNumber === pages;
    $('catalog-page-status').textContent = ui('Sayfa {0} / {1}',{0:pageNumber,1:pages});
    for (const product of products.slice((pageNumber - 1) * pageSize,pageNumber * pageSize)) {
      $('product-grid').append(window.TeknikelProductCard.create({
        product,ui,money,units,safeImage,productUrl,addProduct,favoriteButton,
        selected,canAdd:commerceState.canEdit && Boolean(deliveryMethods.length),
        onCompare:(id,checked)=>{
          if(checked)selected.add(id);else selected.delete(id);
          updateComparisonControls();
        }
      }));
    }
    updateComparisonControls();
  }
  function updateControls() {
    $('clear-cart').disabled = !cart.length || !commerceState.canEdit;
    $('open-checkout').disabled = !commerceState.canCheckout;
    $('buyer-fields').disabled = busy || Boolean(pending?.hasPayload);
    $('delivery-fields').disabled = busy || Boolean(pending?.hasPayload);
    renderDelivery();
    $('submit-order').disabled = !commerceState.canSubmit;
    $('submit-order').textContent = busy ? ui("Gönderiliyor…") : pending ? ui("Aynı siparişi tekrar dene") : ui("Siparişi gönder");
    $('checkout-form').setAttribute('aria-busy', String(busy));
    const detailAdd = $('product-detail')?.querySelector('button.button');
    if (detailAdd) detailAdd.disabled = !commerceState.canEdit || !deliveryMethods.length;
  }
  function renderCart() {
    const focusedLabel = document.activeElement?.closest('.quantity-controls') ? document.activeElement.getAttribute('aria-label') : null;
    $('cart-lines').replaceChildren();
    $('cart-count').textContent = String(cart.length);
    const headerCount = document.getElementById('header-cart-count');
    if (headerCount) { headerCount.textContent = String(cart.length); headerCount.hidden = cart.length === 0; }
    if (!cart.length) $('cart-lines').append(el('li', ui("Sepetiniz henüz boş.")));
    cart.forEach((item, index) => {
      const product = item.display, row = el('li', undefined, 'cart-line');
      const heading = el('div', undefined, 'cart-line-heading'), thumbnail = el('div', undefined, 'cart-line-thumb');
      const thumbnailUrl = safeImage(product.image_url);
      if (thumbnailUrl) {
        const photo = el('img'); photo.src = thumbnailUrl; photo.alt = '';
        photo.loading = 'lazy'; photo.referrerPolicy = 'no-referrer';
        photo.addEventListener('error', () => photo.remove(), {once:true});
        thumbnail.append(photo);
      }
      const copy = el('div',undefined,'cart-line-copy');
      copy.append(el('strong',product.name), el('p', money(product.price, product.currency) + ' / ' + units[product.unit]));
      heading.append(thumbnail,copy); row.append(heading);
      const available = catalogStatus === 'ready' && catalog.has(item.productId);
      if (!available || !quantity(item.q / scale, product.unit)) row.append(el('p', catalogStatus === 'loading' ? ui("Ürün kontrol ediliyor…") : !available ? ui("Artık satışta değil veya katalog doğrulanamadı. Satırı kaldırın ya da ürünleri yenileyin.") : ui("Bu ürünün birimi değişti. Miktarı güncelleyin."), 'unavailable'));
      const controls = el('div', undefined, 'quantity-controls');
      const step = ['kg', 'l', 'meter', 'other'].includes(product.unit) ? 1000 : scale;
      const minus = button('−', () => changeQuantity(item, Math.max(discrete(product.unit) ? scale : 1, item.q - step)));
      minus.setAttribute('aria-label', ui("{0}: miktarı azalt", {0: product.name}));
      const input = el('input'); input.type = 'text'; input.inputMode = discrete(product.unit) ? 'numeric' : 'decimal'; input.value = String(item.q / scale);
      input.setAttribute('aria-label', ui("{0}: miktar ({1})", {0: product.name, 1: units[product.unit]}));
      const error = el('p', '', 'field-error'); error.id = `quantity-error-${index}`; input.setAttribute('aria-describedby', error.id);
      input.addEventListener('change', () => {
        const q = quantity(input.value, product.unit);
        if (!q || !controller.setQuantity(item.productId,q / scale)) {
          error.textContent = ui("Pozitif, en fazla 1000 {0} girin{1}. Toplam miktar 10000'i aşamaz.", {0: units[product.unit], 1: discrete(product.unit) ? ui(" (tam sayı)") : ui(" (en fazla 4 ondalık)")});
          input.setAttribute('aria-invalid', 'true'); $('submit-order').disabled = true; $('open-checkout').disabled = true;
        }
      });
      const plus = button('+', () => changeQuantity(item, item.q + step)); plus.setAttribute('aria-label', ui("{0}: miktarı artır", {0: product.name}));
      const remove = button(ui("Kaldır"), () => controller.remove(item.productId), 'quiet'); remove.setAttribute('aria-label', ui("{0}: satırı kaldır", {0: product.name}));
      for (const control of [minus, input, plus, remove]) { control.disabled = !commerceState.canEdit; controls.append(control); }
      row.append(controls, error); $('cart-lines').append(row);
    });
    $('subtotal').replaceChildren();
    for (const {currency,amount} of commerceState.totals) $('subtotal').append(el('p', ui("Ara toplam: {0}", {0: money(amount,currency)})));
    if (!cart.length && !pending) $('checkout').hidden = true;
    updateControls();
    if (focusedLabel) Array.from($('cart-lines').querySelectorAll('[aria-label]')).find((node) => node.getAttribute('aria-label') === focusedLabel)?.focus();
  }
  function renderDelivery() {
    $('delivery-choice').hidden = deliveryMethods.length < 2 || Boolean(pending);
    $('delivery-summary').textContent = deliveryLabels[deliveryMethod] || ui("Teslimat yöntemleri katalogla birlikte yüklenir.");
    for (const option of $('delivery-method').options) option.hidden = !deliveryMethods.includes(option.value);
    $('delivery-method').value = deliveryMethod;
    $('shipping-fields').hidden = deliveryMethod !== 'shipping';
  }
  function consumeReorder() {
    const url = new URL(location.href); url.searchParams.delete('reorder');
    history.replaceState(null,'',url.pathname + url.search + url.hash);
    for (const input of document.querySelectorAll('.language-picker input[name="reorder"]')) input.remove();
  }
  function resetPrivateView() {
    closeLightbox();
    favoritesOnly = false; pageNumber = 1; $('favorites-only').checked = false;
    clearComparison(); $('checkout-form').reset(); $('checkout').hidden = true;
    $('product-detail').replaceChildren(); $('product-detail').hidden = true;
    $('success').hidden = true; $('reference').textContent = ''; $('store-layout').hidden = false;
  }
  controller.subscribe((next,reason) => {
    commerceState = next;
    ({auth,generation,catalogStatus,loading,categories,cart,pending,busy,deliveryMethods,deliveryMethod,units,deliveryLabels,scale} = next);
    catalog = new Map(next.products.map(product => [product.product_id,product])); favorites = new Set(next.favorites);
    if (reason === 'fence') resetPrivateView();
    // A refresh can revoke, replace or reprice product media. Don't retain stale lightbox content.
    if (reason === 'catalog' || catalogStatus !== 'ready') closeLightbox();
    if (reason === 'owner' || reason === 'new-order') {
      if (auth.account) { $('buyer-name').value = auth.account.fullName || ''; $('buyer-email').value = auth.account.email || ''; }
      $('buyer-name').readOnly = Boolean(auth.account); $('buyer-email').readOnly = Boolean(auth.account);
    }
    for (const id of [...selected]) if (!catalog.has(id)) selected.delete(id);
    $('favorites-only').disabled = catalogStatus !== 'ready' || auth.status === 'unavailable';
    $('catalog-account').hidden = !auth.account; $('catalog-account').textContent = auth.account?.fullName || '';
    $('catalog-state').hidden = !next.catalogMessage; $('catalog-state').textContent = next.catalogMessage;
    $('cart-message').textContent = next.cartMessage; $('submission-message').textContent = next.submissionMessage;
    $('refresh').disabled = loading; $('product-grid').setAttribute('aria-busy',String(loading));
    if (reason === 'catalog' || reason === 'fence') renderFilters();
    if (catalogStatus !== 'ready') clearComparison();
    renderProducts(); renderCart(); renderDetail();
    if(reason==='catalog' && catalogStatus==='ready' && !detailId && initialComparison.length && !comparisonHandled){
      comparisonHandled=true;
      for(const id of initialComparison)if(catalog.has(id))selected.add(id);
      const url=new URL(location.href);url.hash='';
      history.replaceState(null,'',url.pathname+url.search);
      if(selected.size){
        renderProducts();showComparison();
        $('comparison-panel').scrollIntoView({block:'start'});
      }
    }
    if (pending) $('checkout').hidden = false;
    if (reason === 'accepted') {
      $('checkout-form').reset(); $('checkout').hidden = true;
      $('reference').textContent = next.receipt.order_id; $('success').hidden = false; $('store-layout').hidden = true; $('success').focus();
    }
    if (reason === 'new-order') { $('success').hidden = true; $('store-layout').hidden = false; $('products').focus(); }
    if (reason === 'reorder') $('cart').focus();
    if (reason === 'catalog' && reorderId && !reorderHandled) { reorderHandled = true; consumeReorder(); void controller.reorder(reorderId); }
  });
  async function submit(event) {
    event.preventDefault();
    if (root.querySelector('.quantity-controls [aria-invalid="true"]')) return;
    const input = Object.fromEntries(['name','phone','email','note'].map(key => [key,$(key === 'note' ? 'order-note' : `buyer-${key}`).value]));
    input.address = Object.fromEntries(['recipientName','addressLine1','addressLine2','district','city','postalCode','countryCode','note'].map(key => [key,$(`delivery-${key}`).value]));
    const result = await controller.submit(input), errors = result?.errors || {};
    let first;
    for (const key of ['name','phone','email','note',...Object.keys(input.address).map(key => 'delivery-' + key)]) {
      const field = $(key.startsWith('delivery-') ? key : key === 'note' ? 'order-note' : `buyer-${key}`);
      $(`${key}-error`).textContent = errors[key] || ''; field.setAttribute('aria-invalid',String(Boolean(errors[key])));
      if (!first && errors[key]) first = field;
    }
    first?.focus();
  }
  $('catalog-filters').addEventListener('submit',event => event.preventDefault());
  for (const [id,key,event] of [['catalog-search','q','input'],['catalog-sku','sku','input'],['catalog-category','category','change'],['catalog-brand','brand','change']]) {
    $(id).addEventListener(event,() => { filters[key] = $(id).value; pageNumber = 1; syncFilterUrl(); if (key === 'category') renderCategoryOptions(); if (key === 'brand') renderBrandOptions([...new Set([...catalog.values()].map(row => row.brand).filter(Boolean))].sort((a,b) => a.localeCompare(b,locale))); renderProducts(); });
  }
  $('category-query').addEventListener('input', renderCategoryOptions);
  $('category-query').addEventListener('keydown',event => {
    if (event.key === 'Escape') { $('category-query').value = ''; renderCategoryOptions(); }
    if (event.key === 'ArrowDown') {
      event.preventDefault(); $('category-options').querySelector('input')?.focus();
    }
  });
  $('category-clear').addEventListener('click',() => setCategories(new Set()));
  $('catalog-reset').addEventListener('click',() => {
    for (const key of Object.keys(filters)) filters[key] = '';
    favoritesOnly = false; $('favorites-only').checked = false; pageNumber = 1;
    $('category-query').value = ''; renderFilters(); syncFilterUrl(); renderProducts();
  });
  $('favorites-only').addEventListener('change',() => { favoritesOnly = $('favorites-only').checked; pageNumber = 1; renderProducts(); });
  $('catalog-sort').addEventListener('change',() => {
    sortMode = $('catalog-sort').value; pageNumber = 1; renderProducts();
  });
  $('catalog-page-size').addEventListener('change',() => {
    const next = Number($('catalog-page-size').value);
    if (![18,36,54].includes(next)) return;
    pageSize = next; pageNumber = 1; renderProducts();
  });
  for (const mode of ['grid','list']) $('catalog-view-'+mode).addEventListener('click',() => {
    viewMode = mode; renderProducts();
  });
  $('filter-panel-toggle').addEventListener('click', () => {
    const collapsed = $('catalog-filter-rail').classList.toggle('rail-collapsed');
    $('filter-panel-toggle').setAttribute('aria-expanded',String(!collapsed));
    if (!collapsed) $('category-query').focus();
  });
  $('cart-panel-toggle').addEventListener('click', () => $('cart').scrollIntoView({behavior:'smooth',block:'start'}));
  for (const [id,step] of [['catalog-prev',-1],['catalog-next',1]]) $(id).addEventListener('click',() => { pageNumber += step; renderProducts(); });
  $('compare-open').addEventListener('click',() => showComparison());
  $('delivery-method').addEventListener('change', () => controller.setDelivery($('delivery-method').value));
  $('refresh').addEventListener('click', () => controller.refresh());
  $('clear-cart').addEventListener('click', () => controller.clearCart());
  $('open-checkout').addEventListener('click', () => { if ($('open-checkout').disabled) return; $('checkout').hidden = false; (auth.account ? $('buyer-phone') : $('buyer-name')).focus(); });
  $('checkout-form').addEventListener('submit', submit);
  $('new-order').addEventListener('click', () => controller.newOrder());
  // A bfcache/pagehide transition may fence private product imagery.
  window.addEventListener('pagehide',closeLightbox);
  controller.start();
})();
