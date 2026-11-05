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
  let localPhoto = '', compareGeneration = 0, favoritesOnly = false, pageNumber = 1;
  const pageSize = 18, parameters = new URLSearchParams(location.search), reorderId = parameters.get('reorder');
  let reorderHandled = false;
  for (const key of Object.keys(filters)) filters[key] = (parameters.get(key) || '').slice(0,180);
  const current = stamp => stamp === generation && auth.status !== 'unavailable';
  const {quantity,discrete,safeImage} = controller;
  const addProduct = product => controller.add(product.product_id);
  const changeQuantity = (item,q) => controller.setQuantity(item.productId,q / scale);
  function clearComparison() {
    selected.clear(); compareGeneration++;
    if (localPhoto) URL.revokeObjectURL(localPhoto);
    localPhoto = '';
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
  function renderDetail() {
    const detail = $('product-detail'), id = new URLSearchParams(location.search).get('id');
    detail.replaceChildren(); detail.hidden = !id;
    if (!id) return;
    const back = el('a',ui('Tüm ürünlere dön')); back.href = productUrl(''); detail.append(back);
    const product = catalog.get(id);
    if (!product) { const title = el('h2',ui('Ürün bulunamadı.')); title.id = 'product-detail-title'; detail.append(title); return; }
    const heading = el('h2',product.name); heading.id = 'product-detail-title'; detail.append(heading);
    if (product.image_url) { const image = el('img'); image.src = product.image_url; image.alt = product.name; image.className = 'product-detail-image'; detail.append(image); }
    if (product.image_urls.length > 1) detail.append(productGallery(product));
    for (const value of [product.sku ? `${ui('Stok kodu')}: ${product.sku}` : '',product.brand,product.category_name,product.description]) if (value) detail.append(el('p',value));
    detail.append(el('p',`${money(product.price,product.currency)} / ${units[product.unit]}`,'price'));
    const add = button(ui('Sepete ekle'),() => addProduct(product),'button');
    add.disabled = !commerceState.canEdit || !deliveryMethods.length; detail.append(favoriteButton(product),add);
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
    const heading = el('h2',ui('Ürün karşılaştırma')); heading.id = 'comparison-title'; panel.append(heading);
    panel.append(el('p',ui('Görsel benzerlik teknik uyumluluk onayı değildir.')));
    const close = button(ui('Karşılaştırmayı kapat'),() => { panel.hidden = true; if (localPhoto) URL.revokeObjectURL(localPhoto); localPhoto = ''; },'quiet'); panel.append(close);
    const grid = el('div',undefined,'comparison-grid'); panel.append(grid);
    for (const id of selected) {
      const product = catalog.get(id); if (!product) continue;
      const slot = el('article',undefined,'comparison-slot'); slot.dataset.compareSlot = id;
      slot.append(el('h3',product.name));
      if (product.image_url) {
        const viewport = el('div',undefined,'comparison-viewport'), image = el('img');
        image.src = product.image_url; image.alt = product.name; image.draggable = false;
        viewport.append(image); slot.append(viewport);
        let zoom = 1, x = 0, y = 0, rotation = 0, dragging = null;
        const paint = () => { image.style.transform = `translate(${x}px,${y}px) scale(${zoom}) rotate(${rotation}deg)`; };
        const tools = el('div',undefined,'comparison-tools');
        tools.append(button(ui('Yakınlaştır'),() => { zoom = Math.min(5,zoom + .25); paint(); }),
          button(ui('Uzaklaştır'),() => { zoom = Math.max(1,zoom - .25); paint(); }),
          button(ui('Döndür'),() => { rotation = (rotation + 90) % 360; paint(); }),
          button(ui('Sıfırla'),() => { zoom = 1; x = 0; y = 0; rotation = 0; paint(); }));
        viewport.addEventListener('pointerdown',event => { dragging = {x:event.clientX - x,y:event.clientY - y}; viewport.setPointerCapture(event.pointerId); });
        viewport.addEventListener('pointermove',event => { if (dragging) { x = event.clientX - dragging.x; y = event.clientY - dragging.y; paint(); } });
        for (const event of ['pointerup','pointercancel']) viewport.addEventListener(event,() => { dragging = null; });
        slot.append(tools);
        if (product.image_urls.length > 1) {
          const label = el('label',ui('Fotoğraf')), picker = el('select'); picker.setAttribute('aria-label',ui('Fotoğraf'));
          product.image_urls.forEach((url,index) => { const option = el('option',String(index + 1)); option.value = url; picker.append(option); });
          picker.addEventListener('change',() => { image.src = picker.value; x = 0; y = 0; zoom = 1; paint(); }); label.append(picker); slot.append(label);
        }
      }
      const fields = el('dl');
      for (const [label,value] of [[ui('Stok kodu'),product.sku],[ui('Marka'),product.brand],[ui('Kategori'),product.category_name],[ui('Açıklama'),product.description]]) {
        if (value) fields.append(el('dt',label),el('dd',value));
      }
      fields.append(el('dt',ui('Fiyat')),el('dd',money(product.price,product.currency))); slot.append(fields); grid.append(slot);
    }
    const photoLabel = el('label',ui('Cihaz fotoğrafı seç')), photo = el('input'); photo.type = 'file'; photo.accept = 'image/jpeg,image/png,image/webp';
    photoLabel.append(photo); panel.append(photoLabel,el('p',ui('Fotoğraf yalnız bu tarayıcıda kalır; otomatik yüklenmez.')));
    const local = el('div',undefined,'comparison-local'); panel.append(local);
    const addPhoto = () => { local.replaceChildren(); if (localPhoto) { const image = el('img'); image.src = localPhoto; image.alt = ui('Cihaz fotoğrafı'); local.append(image); } };
    addPhoto();
    photo.addEventListener('change',async () => {
      const file = photo.files?.[0], stamp = generation, revision = ++compareGeneration;
      if (!file || !['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 15 * 1024 * 1024) return;
      const url = URL.createObjectURL(file);
      try {
        const image = new Image(); image.src = url; await image.decode();
        if (!current(stamp) || revision !== compareGeneration || panel.hidden || !panel.isConnected) { URL.revokeObjectURL(url); return; }
        if (localPhoto) URL.revokeObjectURL(localPhoto); localPhoto = url; addPhoto();
      } catch { URL.revokeObjectURL(url); }
    });
    if (focus) panel.focus();
  }
  function productGallery(product) {
    const detail = el('details', undefined, 'product-photo-detail');
    detail.append(el('summary', ui('Fotoğraflar ({0})', {0: product.image_urls.length})));
    const media = el('div', undefined, 'product-photo-preview');
    const image = el('img'); image.referrerPolicy = 'no-referrer'; image.loading = 'lazy';
    const fallback = el('span', ui('Fotoğraf yüklenemedi')); fallback.hidden = true;
    media.append(image, fallback);
    image.addEventListener('error', () => { image.hidden = true; fallback.hidden = false; });
    image.addEventListener('load', () => { image.hidden = false; fallback.hidden = true; });
    const thumbnails = el('div', undefined, 'product-photo-thumbnails');
    thumbnails.setAttribute('role', 'group'); thumbnails.setAttribute('aria-label', ui('Ürün fotoğrafları'));
    const buttons = product.image_urls.map((url, index) => {
      const thumbnail = button('', () => select(index), 'secondary');
      thumbnail.setAttribute('aria-label', ui('{0}. fotoğrafı göster', {0: index + 1}));
      const small = el('img'); small.src = url; small.alt = ''; small.loading = 'lazy'; small.referrerPolicy = 'no-referrer';
      small.addEventListener('error', () => { thumbnail.replaceChildren(String(index + 1)); }, {once: true});
      thumbnail.append(small);
      thumbnail.addEventListener('keydown', event => {
        const target = event.key === 'Home' ? 0 : event.key === 'End' ? product.image_urls.length - 1
          : event.key === 'ArrowRight' ? (index + 1) % product.image_urls.length
          : event.key === 'ArrowLeft' ? (index + product.image_urls.length - 1) % product.image_urls.length : null;
        if (target === null) return;
        event.preventDefault(); select(target); buttons[target].focus();
      });
      return thumbnail;
    });
    function select(index) {
      image.hidden = false; fallback.hidden = true;
      image.alt = ui('{0}, fotoğraf {1}', {0: product.name, 1: index + 1});
      image.src = product.image_urls[index];
      buttons.forEach((node, i) => node.setAttribute('aria-pressed', String(i === index)));
    }
    thumbnails.append(...buttons); select(0); detail.append(media, thumbnails); return detail;
  }
  function renderProducts() {
    $('product-grid').replaceChildren();
    $('catalog-pagination').hidden = true;
    if (catalogStatus !== 'ready') return;
    const fold = value => value.toLocaleLowerCase(locale).normalize('NFKD');
    const products = [...catalog.values()].filter(product => (!filters.q || fold([product.name,product.description,product.sku,product.brand,product.category_name].join(' ')).includes(fold(filters.q)))
      && (!filters.sku || fold(product.sku).includes(fold(filters.sku))) && (!filters.category || selectedCategoryIds().has(product.category_id))
      && (!filters.brand || product.brand === filters.brand) && (!favoritesOnly || favorites.has(product.product_id)));
    $('catalog-count').textContent = ui('{0} ürün', {0:products.length});
    const pages = Math.max(1,Math.ceil(products.length / pageSize));
    pageNumber = Math.min(Math.max(1,pageNumber),pages);
    $('catalog-pagination').hidden = pages <= 1;
    $('catalog-prev').disabled = pageNumber === 1; $('catalog-next').disabled = pageNumber === pages;
    $('catalog-page-status').textContent = ui('Sayfa {0} / {1}',{0:pageNumber,1:pages});
    for (const product of products.slice((pageNumber - 1) * pageSize,pageNumber * pageSize)) {
      const card = el('article', undefined, 'product-card');
      card.dataset.productId = product.product_id;
      const media = el('a', undefined, 'product-media'); media.href = productUrl(product.product_id); media.setAttribute('aria-label',product.name);
      const fallback = el('span', ui("Görsel yok")); media.append(fallback);
      const url = safeImage(product.image_url);
      if (url) {
        const image = el('img'); image.alt = product.name; image.loading = 'lazy'; image.referrerPolicy = 'no-referrer';
        image.addEventListener('error', () => { image.remove(); fallback.hidden = false; }, { once: true });
        fallback.hidden = true; image.src = url; media.append(image);
      }
      const body = el('div', undefined, 'product-body');
      const heading = el('h3'), link = el('a',product.name); link.href = productUrl(product.product_id); link.dataset.productLink = '';
      heading.append(link); body.append(heading);
      if (product.sku) body.append(el('p', `${ui('Stok kodu')}: ${product.sku}`, 'product-sku'));
      if (product.brand) body.append(el('span',product.brand,'product-brand'));
      if (product.image_urls.length > 1) {
        const galleryLink = el('a',ui('Fotoğraflar ({0})',{0:product.image_urls.length}),'product-gallery-link');
        galleryLink.href = productUrl(product.product_id);
        galleryLink.setAttribute('aria-label',product.name);
        body.append(galleryLink);
      }
      body.append(el('div', money(product.price, product.currency) + ' / ' + units[product.unit], 'price'));
      const add = button(ui("Sepete ekle"), () => addProduct(product), ''); add.disabled = !commerceState.canEdit || !deliveryMethods.length;
      const compareLabel = el('label',undefined,'compare-choice'), compare = el('input',undefined,'compare-select');
      compare.type = 'checkbox'; compare.checked = selected.has(product.product_id); compare.dataset.productId = product.product_id;
      compare.disabled = !selected.has(product.product_id) && selected.size >= 2;
      compare.addEventListener('change',() => { if (compare.checked) selected.add(product.product_id); else selected.delete(product.product_id); updateComparisonControls(); });
      compareLabel.append(compare,document.createTextNode(ui('Karşılaştır'))); body.append(compareLabel,favoriteButton(product),add);
      card.append(media, body); $('product-grid').append(card);
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
  controller.start();
})();
