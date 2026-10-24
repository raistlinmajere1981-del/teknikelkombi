import {t} from './language.js';
import {filterProducts,productImageUrls} from './commerce.js';
import {ComparisonSelection,freshTransform,transformCss,filterCss,comparisonRows,clamp} from './comparison-model.js';

const MAX_FILE = 20 * 1024 * 1024;
const MIME_TYPES = new Set(['image/jpeg','image/png','image/webp','image/avif']);

export function createComparison({getSource,revalidate,root = document}) {
  const selection = new ComparisonSelection();
  const node = (tag,label,cls) => { const el = root.createElement(tag); if (label !== undefined) el.textContent = label; if (cls) el.className = cls; return el; };
  const button = (label,run,cls = 'compare-tool') => { const el = node('button',t(label),cls); el.type = 'button'; el.addEventListener('click',run); return el; };
  const dialog = node('dialog',undefined,'compare-dialog'); dialog.setAttribute('aria-labelledby','compare-title');
  const header = node('header',undefined,'compare-head'), title = node('h2',t('Ürün ve görsel karşılaştırma')); title.id = 'compare-title';
  const close = button('Kapat',() => dialog.close()); header.append(title,close);
  const notice = node('p',t('Görsel benzerlik teknik uyumluluk kanıtı değildir. Parça kodunu ve üretici bilgilerini doğrulayın.'),'compare-notice');
  const status = node('p',undefined,'compare-status'); status.setAttribute('role','status'); status.setAttribute('aria-live','polite');
  const sources = node('div',undefined,'compare-sources');
  const modebar = node('div',undefined,'compare-modebar');
  const side = button('Yan yana',() => setMode(false)), overlay = button('Üst üste',() => setMode(true));
  const syncLabel = node('label'), sync = node('input'); sync.type = 'checkbox'; sync.checked = true; syncLabel.append(sync,root.createTextNode(t(' Eş zamanlı zoom')));
  const opacityLabel = node('label',t('Şeffaflık')), opacity = node('input'); opacity.type = 'range'; opacity.min = '0'; opacity.max = '100'; opacity.value = '50'; opacity.setAttribute('aria-label',t('Şeffaflık')); opacityLabel.append(opacity);
  const reset = button('Orijinale dön',resetAll), refresh = button('Yayını yenile',() => validate());
  modebar.append(side,overlay,syncLabel,opacityLabel,reset,refresh);
  const workspace = node('div',undefined,'compare-workspace');
  const views = [0,1].map(index => {
    const pane = node('section',undefined,'compare-pane'); pane.dataset.compareSide = index;
    const caption = node('h3'), viewport = node('div',undefined,'compare-viewport'); viewport.tabIndex = 0;
    viewport.setAttribute('role','region'); viewport.setAttribute('aria-label',t(index ? 'Sağ görsel inceleme alanı' : 'Sol görsel inceleme alanı'));
    const empty = node('span',t('Görsel seçin'),'compare-image-empty');
    const img = node('img'); img.alt = ''; img.draggable = false; img.decoding = 'async'; img.referrerPolicy = 'no-referrer'; img.hidden = true;
    const crosshair = node('div',undefined,'compare-crosshair'); crosshair.setAttribute('aria-hidden','true'); viewport.append(empty,img,crosshair);
    const thumbnails = node('div',undefined,'compare-thumbnails'); thumbnails.setAttribute('aria-label',t(index ? 'Sağ ürün fotoğrafları' : 'Sol ürün fotoğrafları'));
    const tools = node('div',undefined,'compare-tools');
    tools.append(button('−',() => zoom(index,1/1.25)),button('+',() => zoom(index,1.25)),button('Döndür',() => edit(index,value => value.rotation = (value.rotation+90)%360)),
      button('Yatay çevir',() => edit(index,value => value.flipX *= -1)),button('Dikey çevir',() => edit(index,value => value.flipY *= -1)),button('Hizala',() => { transforms[index].x = 0; transforms[index].y = 0; apply(); }));
    tools.children[0].setAttribute('aria-label',t(index ? 'Sağ görseli uzaklaştır' : 'Sol görseli uzaklaştır'));
    tools.children[1].setAttribute('aria-label',t(index ? 'Sağ görseli yakınlaştır' : 'Sol görseli yakınlaştır'));
    const filter = node('select'); filter.setAttribute('aria-label',t(index ? 'Sağ görsel filtresi' : 'Sol görsel filtresi'));
    for (const [value,label] of [['normal','Orijinal'],['negative','Negatif'],['gray','Gri tonlama']]) { const option = node('option',t(label)); option.value = value; filter.append(option); }
    filter.addEventListener('change',() => edit(index,value => value.filter = filter.value));
    const contrastLabel = node('label',t('Kontrast')), contrast = node('input'); contrast.type = 'range'; contrast.min = '50'; contrast.max = '250'; contrast.value = '100'; contrast.setAttribute('aria-label',t(index ? 'Sağ görsel kontrastı' : 'Sol görsel kontrastı')); contrastLabel.append(contrast);
    contrast.addEventListener('input',() => edit(index,value => value.contrast = Number(contrast.value))); tools.append(filter,contrastLabel);
    pane.append(caption,viewport,thumbnails,tools); workspace.append(pane);
    const view = {pane,caption,viewport,img,empty,thumbnails,filter,contrast,urls:[],index:0,loaded:false};
    img.addEventListener('load',() => {
      view.loaded = true; img.hidden = false; empty.hidden = true;
      if (img.naturalWidth*img.naturalHeight > 48_000_000) status.textContent = t('Büyük görsel: mobil cihazlarda yakınlaştırma yavaş olabilir.');
    });
    img.addEventListener('error',() => { view.loaded = false; img.hidden = true; empty.hidden = false; empty.textContent = t('Görsel yüklenemedi. Başka bir fotoğraf seçin.'); });
    installGestures(view,index); return view;
  });
  const overlayControls = node('div',undefined,'compare-overlay-controls');
  const layerLabel = node('label',t('Düzenlenen katman')), layer = node('select'); layer.setAttribute('aria-label',t('Düzenlenen katman'));
  for (const [value,label] of [['0','Sol görsel'],['1','Sağ görsel']]) { const option = node('option',t(label)); option.value = value; layer.append(option); } layer.value = '1'; layerLabel.append(layer);
  const gridLabel = node('label'), grid = node('input'); grid.type = 'checkbox'; grid.checked = true; gridLabel.append(grid,root.createTextNode(t(' Hizalama çizgileri')));
  grid.addEventListener('change',() => workspace.classList.toggle('no-crosshair',!grid.checked));
  overlayControls.append(layerLabel,gridLabel);
  const info = node('section',undefined,'compare-info'); info.setAttribute('aria-label',t('Ürün bilgileri karşılaştırması'));
  const help = node('p',t('Sürükleyerek kaydırın; tekerlek veya iki parmakla yakınlaştırın. Çift dokunma görünümü sıfırlar. Ok tuşları kaydırır, +/− yakınlaştırır.'),'compare-help');
  dialog.append(header,notice,status,sources,modebar,overlayControls,workspace,help,info); root.body.append(dialog);
  const tray = node('aside',undefined,'compare-tray'); tray.hidden = true; tray.setAttribute('aria-label',t('Karşılaştırma seçimi'));
  const trayText = node('span'), trayOpen = button('Karşılaştırmayı aç',() => open(), 'btn btn-red'), trayClear = button('Seçimi temizle',clear);
  tray.append(trayText,trayOpen,trayClear); root.body.append(tray);
  let transforms = [freshTransform(),freshTransform()], current = getSource(), active = 0, isOverlay = false;
  let localPhoto = null, localVersion = 0, validation = 0, busy = false, savedFocus, savedScroll = 0, timer = 0, searchQuery = '';
  function message(value) { status.textContent = value ? t(value) : ''; }
  function apply() {
    views.forEach((view,index) => { view.img.style.transform = transformCss(transforms[index]); view.img.style.filter = filterCss(transforms[index]); view.img.style.opacity = isOverlay && index === 1 ? String(Number(opacity.value)/100) : '1'; view.filter.value = transforms[index].filter; view.contrast.value = String(transforms[index].contrast); view.viewport.setAttribute('aria-description',t('Yakınlaştırma')+' '+Math.round(transforms[index].zoom*100)+'%'); });
  }
  function edit(index,change) { active = index; change(transforms[index]); apply(); }
  function zoom(index,factor) {
    active = index;
    const next = clamp(transforms[index].zoom * factor,.25,8), ratio = next/transforms[index].zoom;
    transforms[index].zoom = next;
    if (sync.checked) transforms[1-index].zoom = clamp(transforms[1-index].zoom*ratio,.25,8);
    apply();
  }
  function resetAll() { transforms = [freshTransform(),freshTransform()]; opacity.value = '50'; apply(); }
  function setMode(value) { isOverlay = value; workspace.classList.toggle('is-overlay',value); side.setAttribute('aria-pressed',String(!value)); overlay.setAttribute('aria-pressed',String(value)); opacityLabel.hidden = !value; layerLabel.hidden = !value; apply(); }
  opacity.addEventListener('input',apply);
  sync.addEventListener('change',() => { if (sync.checked) { transforms[1-active].zoom = transforms[active].zoom; apply(); } });
  function installGestures(view,index) {
    const pointers = new Map(); let distance = 0, last = null, tap = 0, tapStart = null;
    const targetIndex = () => isOverlay ? Number(layer.value) : index;
    const resetGesture = () => { if (pointers.size === 1) { const point = [...pointers.values()][0]; last = {...point}; } else last = null; distance = pointers.size > 1 ? gap() : 0; };
    const gap = () => { const [a,b] = [...pointers.values()]; return Math.hypot(a.x-b.x,a.y-b.y); };
    view.viewport.addEventListener('pointerdown',event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      view.viewport.setPointerCapture(event.pointerId); pointers.set(event.pointerId,{x:event.clientX,y:event.clientY}); active = targetIndex(); resetGesture();
      if (pointers.size > 1) { tap = 0; tapStart = null; }
      else if (event.pointerType !== 'mouse') { const now = Date.now(); if (now-tap < 300) { transforms[active] = freshTransform(); apply(); } tap = now; tapStart = {x:event.clientX,y:event.clientY}; }
    });
    view.viewport.addEventListener('pointermove',event => {
      if (!pointers.has(event.pointerId)) return;
      pointers.set(event.pointerId,{x:event.clientX,y:event.clientY}); const selected = targetIndex();
      if (tapStart && Math.hypot(event.clientX-tapStart.x,event.clientY-tapStart.y) > 6) tap = 0;
      if (pointers.size > 1) { const next = gap(); if (distance > 0 && next > 0) zoom(selected,next/distance); distance = next; }
      else if (last) { transforms[selected].x = clamp(transforms[selected].x+event.clientX-last.x,-4000,4000); transforms[selected].y = clamp(transforms[selected].y+event.clientY-last.y,-4000,4000); last = {x:event.clientX,y:event.clientY}; apply(); }
    });
    for (const eventName of ['pointerup','pointercancel','lostpointercapture']) view.viewport.addEventListener(eventName,event => { pointers.delete(event.pointerId); resetGesture(); });
    view.viewport.addEventListener('wheel',event => { event.preventDefault(); zoom(targetIndex(),Math.exp(-clamp(event.deltaY,-100,100)*.008)); },{passive:false});
    view.viewport.addEventListener('dblclick',() => { transforms[targetIndex()] = freshTransform(); apply(); });
    view.viewport.addEventListener('keydown',event => {
      const index = targetIndex(), delta = event.shiftKey ? 40 : 10;
      if (['+','=','-','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','0'].includes(event.key)) event.preventDefault(); else return;
      if (event.key === '+' || event.key === '=') zoom(index,1.25);
      else if (event.key === '-') zoom(index,1/1.25);
      else if (event.key === '0') { transforms[index] = freshTransform(); apply(); }
      else { if (event.key === 'ArrowLeft') transforms[index].x -= delta; if (event.key === 'ArrowRight') transforms[index].x += delta; if (event.key === 'ArrowUp') transforms[index].y -= delta; if (event.key === 'ArrowDown') transforms[index].y += delta; apply(); }
    });
  }
  function resolved() { return selection.ids.map(id => (current.products || []).find(product => product.product_id === id)); }
  function image(view,urls,label) {
    view.caption.textContent = label; view.urls = urls;
    view.index = clamp(view.index,0,Math.max(0,urls.length-1));
    const select = index => {
      view.index = index; const url = urls[index];
      view.thumbnails.querySelectorAll('button').forEach((button,i) => button.setAttribute('aria-pressed',String(i === index)));
      if (view.img.getAttribute('src') !== url || !view.loaded) { view.loaded = false; view.img.hidden = true; view.empty.hidden = false; view.empty.textContent = t('Görsel yükleniyor…'); view.img.src = url; }
    };
    view.thumbnails.replaceChildren();
    if (!urls.length) { view.img.removeAttribute('src'); view.img.hidden = true; view.empty.hidden = false; view.empty.textContent = t('Yayınlanmış görsel yok. Ürün bilgilerini inceleyebilirsiniz.'); return; }
    urls.forEach((url,index) => {
      const thumb = button(String(index+1),() => select(index),'compare-thumb'); thumb.setAttribute('aria-label',label+' — '+(index+1)+t('. görsel'));
      // Load thumbnails only for remote catalog images; local photo stays one bitmap.
      if (!url.startsWith('blob:')) { const img = node('img'); img.src = url; img.alt = ''; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer'; img.addEventListener('error',() => img.remove()); thumb.prepend(img); }
      thumb.addEventListener('keydown',event => { if (!['ArrowLeft','ArrowRight'].includes(event.key)) return; event.preventDefault(); const next = (view.index+(event.key === 'ArrowRight'?1:urls.length-1))%urls.length; select(next); view.thumbnails.children[next].focus(); });
      view.thumbnails.append(thumb);
    }); select(view.index);
  }
  function renderImages() {
    const [a,b] = resolved(); image(views[0],a ? productImageUrls(a,location.origin) : [],a?.name || t('Sol ürün'));
    image(views[1],localPhoto ? [localPhoto.url] : b ? productImageUrls(b,location.origin) : [],localPhoto ? localPhoto.name : b?.name || t('Sağ ürün / cihaz fotoğrafı')); apply();
  }
  function renderInfo() {
    const [a,b] = resolved(); info.replaceChildren(node('h3',t('Ürün bilgileri')));
    if (current.private) info.append(node('p',t('Yetkili bayi kataloğunuzdaki fiyatlar gösteriliyor.'),'compare-price-scope'));
    else info.append(node('p',t('Halka açık katalog fiyatları gösteriliyor.'),'compare-price-scope'));
    const table = node('table'), caption = node('caption',t('Farklı bilgiler renkle ve “Farklı” etiketiyle işaretlenir.')); table.append(caption);
    const head = node('thead'), headings = node('tr'); headings.append(node('th',t('Bilgi')),node('th',a?.name || t('Sol ürün')),node('th',localPhoto ? t('Cihaz fotoğrafı') : b?.name || t('Sağ ürün'))); head.append(headings); table.append(head);
    const body = node('tbody');
    for (const row of comparisonRows(a,localPhoto ? null : b,current.categories)) {
      const line = node('tr'); line.dataset.field = row.key; if (row.different) line.className = 'is-different';
      const label = node('th',t(row.label)); label.scope = 'row'; if (row.different) label.append(node('small',t('Farklı')));
      line.append(label,node('td',row.left || t('Yayınlanmamış')),node('td',localPhoto ? '—' : row.right || t('Yayınlanmamış'))); body.append(line);
    }
    table.append(body); info.append(table);
  }
  function renderSources() {
    sources.replaceChildren();
    const searchLabel = node('label',t('İkinci ürünü katalogda ara')), search = node('input'); search.type = 'search'; search.placeholder = t('Ürün adı, marka veya stok kodu'); search.setAttribute('aria-label',t('İkinci ürünü katalogda ara')); searchLabel.append(search);
    search.value = searchQuery;
    const results = node('div',undefined,'compare-search-results'); results.setAttribute('aria-label',t('Karşılaştırma ürün sonuçları'));
    const renderResults = () => {
      const hits = filterProducts((current.products || []).filter(product => product.product_id !== selection.ids[0]),{q:search.value}).slice(0,12);
      results.replaceChildren(...hits.map(product => { const result = button(product.name,() => { selection.ids[1] = product.product_id; releaseLocal(); views[1].index = 0; transforms[1] = freshTransform(); if (sync.checked) transforms[1].zoom = transforms[0].zoom; message(''); renderImages(); renderInfo(); updateTray(); },'compare-result'); result.dataset.productId = product.product_id; return result; }));
      if (!hits.length) results.append(node('p',t('Eşleşen yayınlanmış ürün yok.')));
    };
    search.addEventListener('input',() => { searchQuery = search.value; renderResults(); }); renderResults();
    const uploadLabel = node('label',t('Cihazımdan fotoğraf seç'), 'compare-local-picker'), upload = node('input'); upload.type = 'file'; upload.accept = 'image/jpeg,image/png,image/webp,image/avif'; upload.setAttribute('aria-label',t('Cihazımdan fotoğraf seç')); upload.addEventListener('change',() => { choosePhoto(upload.files?.[0]); upload.value = ''; }); uploadLabel.append(upload,node('small',t('Fotoğraf yalnız bu tarayıcıda işlenir. Sunucuya yüklenmez. JPEG, PNG, WebP veya AVIF; en fazla 20 MB.')));
    const picker = node('div'); picker.append(searchLabel,results); sources.append(picker,uploadLabel);
  }
  function releaseLocal() { localVersion++; if (localPhoto) URL.revokeObjectURL(localPhoto.url); localPhoto = null; }
  async function choosePhoto(file) {
    if (!file) return;
    if (!MIME_TYPES.has(file.type) || file.size > MAX_FILE || file.size === 0) { message('Geçerli bir JPEG, PNG, WebP veya AVIF seçin (en fazla 20 MB).'); return; }
    const version = ++localVersion, originalUrl = URL.createObjectURL(file); let bitmap, temporaryUrl;
    try {
      // Downsample the personal image in memory for mobile. Never upload or save it.
      const preview = new Image(); preview.src = originalUrl; await preview.decode();
      if (typeof createImageBitmap === 'function') {
        if (preview.naturalWidth*preview.naturalHeight > 80_000_000) throw new Error('image_too_large');
        const edge = 2048, scale = Math.min(1,edge/Math.max(preview.naturalWidth,preview.naturalHeight));
        const width = Math.max(1,Math.round(preview.naturalWidth*scale)), height = Math.max(1,Math.round(preview.naturalHeight*scale));
        bitmap = await createImageBitmap(file,{resizeWidth:width,resizeHeight:height,resizeQuality:'high',imageOrientation:'from-image'});
        const canvas = root.createElement('canvas'); canvas.width = width; canvas.height = height;
        const context = canvas.getContext('2d'); if (!context) throw new Error('decode'); context.fillStyle = '#fff'; context.fillRect(0,0,width,height); context.drawImage(bitmap,0,0,width,height);
        const blob = await new Promise(resolve => canvas.toBlob(resolve,'image/jpeg',.93)); canvas.width = canvas.height = 1;
        if (!blob) throw new Error('decode'); temporaryUrl = URL.createObjectURL(blob);
      } else {
        if (preview.naturalWidth*preview.naturalHeight > 20_000_000) throw new Error('image_too_large'); temporaryUrl = URL.createObjectURL(file);
      }
      if (version !== localVersion || !dialog.open) { URL.revokeObjectURL(temporaryUrl); return; }
      if (localPhoto) URL.revokeObjectURL(localPhoto.url);
      localPhoto = {url:temporaryUrl,name:file.name}; selection.ids[1] = null; views[1].index = 0; transforms[1] = freshTransform(); if (sync.checked) transforms[1].zoom = transforms[0].zoom; message('Fotoğraf cihazınızda hazır. Sunucuya yüklenmedi.'); renderImages(); renderInfo(); updateTray();
    } catch { if (temporaryUrl) URL.revokeObjectURL(temporaryUrl); message('Fotoğraf açılamadı veya bu cihaz için fazla büyük. Daha küçük bir görsel seçin.'); }
    finally { bitmap?.close(); URL.revokeObjectURL(originalUrl); }
  }
  function updateTray() {
    const [a,b] = resolved(); tray.hidden = !a; trayText.textContent = a ? a.name+(b ? ' + '+b.name : t(' · ikinci ürün veya fotoğraf seçin')) : '';
  }
  function render() { renderSources(); renderImages(); renderInfo(); updateTray(); }
  async function validate() {
    const turn = ++validation; busy = true; refresh.disabled = true; message('Güncel yayın ve fiyat yetkisi kontrol ediliyor…');
    // Remove prices immediately; a response from an expired session must not linger.
    info.replaceChildren();
    try {
      const source = await revalidate(); if (turn !== validation) return false;
      if (current?.accessId && source.accessId !== current.accessId) { selection.clear(); releaseLocal(); }
      current = source; const previous = [...selection.ids]; selection.reconcile(current.products || []);
      const removed = previous.some((id,index) => id && id !== selection.ids[index]);
      if (removed) { releaseLocal(); message('Seçilen ürün artık bu yayında veya yetkinizde bulunmuyor.'); } else message('');
      render(); return true;
    } catch {
      if (turn !== validation) return false;
      current = {products:[],categories:[],private:false}; selection.clear(); releaseLocal(); render(); message('Yayın veya oturum doğrulanamadı. Yenileyerek tekrar deneyin.'); return false;
    } finally { if (turn === validation) { busy = false; refresh.disabled = false; } }
  }
  async function open(id,origin) {
    if (busy) return;
    current = getSource();
    const previousIds = [...selection.ids];
    if (id && !selection.add(id,current.products || [])) return;
    selection.ids.forEach((value,index) => { if (value !== previousIds[index]) { transforms[index] = freshTransform(); views[index].index = 0; if (sync.checked) transforms[index].zoom = transforms[1-index].zoom; } });
    const requested = selection.ids[0];
    if (!dialog.open) { savedFocus = origin || root.activeElement; savedScroll = window.scrollY; root.documentElement.classList.add('compare-open'); dialog.showModal(); }
    render(); await validate();
    clearInterval(timer); if (dialog.open) timer = setInterval(() => { if (dialog.open && !root.hidden && !busy) validate(); },30000);
    // An unpublished product is removed by validate and cannot be re-added from an old card.
    if (!requested) message('Bir katalog ürünü seçin.');
  }
  function clear() { validation++; busy = false; refresh.disabled = false; selection.clear(); releaseLocal(); current = {products:[],categories:[],private:false}; transforms = [freshTransform(),freshTransform()]; views.forEach(view => view.index = 0); if (dialog.open) dialog.close(); updateTray(); }
  dialog.addEventListener('cancel',releaseLocal);
  dialog.addEventListener('close',() => {
    clearInterval(timer); timer = 0;
    validation++; busy = false; refresh.disabled = false; releaseLocal(); views.forEach(view => { view.img.removeAttribute('src'); view.caption.textContent = ''; view.urls = []; view.thumbnails.replaceChildren(); }); info.replaceChildren(); sources.replaceChildren(); root.documentElement.classList.remove('compare-open');
    if (savedFocus?.isConnected) savedFocus.focus({preventScroll:true}); else root.querySelector('[data-compare-id]')?.focus({preventScroll:true}); window.scrollTo({top:savedScroll,behavior:'instant'}); updateTray();
  });
  dialog.addEventListener('keydown',event => {
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button,input,select,[tabindex="0"],a[href]')].filter(el => !el.disabled && el.getClientRects().length);
    if (event.shiftKey && root.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1)?.focus(); }
    else if (!event.shiftKey && root.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0]?.focus(); }
  });
  const suspend = () => { if (dialog.open) { validation++; current = {products:[],categories:[]}; renderImages(); info.replaceChildren(); } };
  root.addEventListener('visibilitychange',() => {
    clearInterval(timer); timer = 0;
    if (root.hidden) suspend();
    else if (dialog.open) {
      // Let the existing account/dealer visibility handlers establish their
      // new generation before validating this additional read-only surface.
      queueMicrotask(() => { if (dialog.open && !root.hidden) validate(); });
      timer = setInterval(() => { if (dialog.open && !root.hidden && !busy) validate(); },30000);
    }
  });
  window.addEventListener('pagehide',clear);
  window.addEventListener('pageshow',event => { if (event.persisted) clear(); });
  root.addEventListener('account:locked',clear);
  root.addEventListener('account:ready',() => { queueMicrotask(() => { if (dialog.open) validate(); }); });
  window.addEventListener('storage',event => { if (event.key?.includes('account') || event.key?.includes('dealer.visibility') || event.key?.includes('dealer.signed-out')) clear(); });
  setMode(false);
  return {open,clear,sourceChanged() { current = getSource(); selection.reconcile(current.products || []); if (dialog.open) render(); else updateTray(); }};
}
