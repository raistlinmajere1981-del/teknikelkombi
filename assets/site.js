/* Teknikel presentation: public Yardımcı Asistan publication only. No example commerce records. */
(() => {
  'use strict';
  const page = document.body.dataset.page;
  if (page === 'dealer') return;
  const $ = s => document.querySelector(s);
  const all = s => [...document.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);
  const create = (tag, text, cls) => { const e = document.createElement(tag); if (text !== undefined) e.textContent = text; if (cls) e.className = cls; return e; };
  const money = p => { try { return new Intl.NumberFormat('tr-TR', {style:'currency',currency:p.currency||'TRY'}).format(Number(p.price)); } catch { return String(p.price); } };
  const state = { business:null, catalog:null, pageNo:1, q:params.get('q')||'', category:params.get('category')||'' };
  let products = [], categories = [];
  const endpoint = '/yardimci-asistan/api/';
  const request = async name => {
    const response = await fetch(endpoint+name+'.php', {cache:'no-store',signal:AbortSignal.timeout(12000)});
    if (!response.ok) throw new Error('Yayın alınamadı');
    const result = await response.json();
    if (result?.ok !== true) throw new Error('Yayın alınamadı');
    return result;
  };
  const published = () => state.catalog?.enabled === true && state.business?.business?.public_surfaces?.includes('store') === true;
  const failure = () => !state.business || !state.catalog ? 'Katalog henüz bağlı değil. Ürünler masaüstünden yayınlandığında burada görünecek.'
    : !published() ? 'Ürün kataloğu şu anda yayında değil.' : 'Henüz yayınlanmış ürün bulunmuyor.';
  function photo(url, name) {
    const box = create('div', undefined, 'product-media');
    const blank = create('span','Ürün görseli yok','missing-photo'); box.append(blank);
    if (!url || typeof url !== 'string') return box;
    try {
      const parsed = new URL(url,location.origin);
      if (parsed.protocol !== 'https:' && !(parsed.origin===location.origin && parsed.protocol==='http:')) return box;
      const img = create('img'); img.alt=name; img.loading='lazy'; img.decoding='async'; img.referrerPolicy='no-referrer'; img.src=parsed.href;
      img.addEventListener('load',()=>{blank.hidden=true;});
      img.addEventListener('error',()=>{img.remove();blank.hidden=false;});
      box.append(img);
    } catch {}
    return box;
  }
  function productCard(p) {
    const card=create('article',undefined,'product-card');
    const info=create('div',undefined,'product-info');
    const title=create('h3',p.name||'Ürün');
    info.append(title);
    if(p.sku) info.append(create('span','Stok kodu: '+p.sku,'sku'));
    info.append(create('div',money(p),'price'));
    const link=create('a','Ürünü incele →','product-link');
    link.href='/urun/?id='+encodeURIComponent(p.product_id);
    info.append(link); card.append(photo(p.image_url,p.name),info); return card;
  }
  function renderHome() {
    const grid=$('[data-featured-grid]'); if(!grid) return;
    const valid=published()?products:[];
    grid.replaceChildren(...valid.slice(0,4).map(productCard));
    $('[data-catalog-state]').textContent=valid.length ? '' : failure();
    const categoryGrid=$('[data-category-grid]');
    if (published() && categories.length) {
      categoryGrid.replaceChildren(...categories.slice(0,9).map((c,i)=>{
        const a=create('a',undefined,'cat');
        a.href='/katalog/?category='+encodeURIComponent(c.id);
        a.append(create('span',String(i+1).padStart(2,'0'),'cat-num'),create('strong',c.name||'Kategori'),create('span','↗')); return a;
      }));
    }
  }
  function renderCatalog() {
    const grid=$('[data-product-grid]'); if(!grid) return;
    const form=$('[data-catalog-filter]');
    const input=form.elements.q,category=form.elements.category;
    const q=input.value.trim().toLocaleLowerCase('tr');
    const selected=category.value;
    const hits=(published()?products:[]).filter(p=>(!selected || p.category_id===selected)&&[p.name,p.sku,p.description].some(s=>String(s||'').toLocaleLowerCase('tr').includes(q)));
    const count=$('[data-count]'); count.textContent=hits.length?hits.length.toLocaleString('tr-TR')+' ürün':'';
    const pages=Math.max(1,Math.ceil(hits.length/18));state.pageNo=Math.min(state.pageNo,pages);
    const visible=hits.slice((state.pageNo-1)*18,state.pageNo*18);
    grid.replaceChildren(...visible.map(productCard));
    $('[data-catalog-state]').textContent=hits.length ? hits.length.toLocaleString('tr-TR')+' ürün bulundu'
      : published()&&products.length ? 'Aramanızla eşleşen ürün bulunamadı.' : failure();
    $('[data-pagination]').hidden=pages<=1;
    $('[data-page-number]').textContent=state.pageNo+' / '+pages;
    $('[data-prev]').disabled=state.pageNo<=1;$('[data-next]').disabled=state.pageNo>=pages;
    const url=new URL(location.href);
    for (const [key,value] of [['q',input.value.trim()],['category',selected]]) value?url.searchParams.set(key,value):url.searchParams.delete(key);
    history.replaceState(null,'',url.pathname+url.search);
  }
  function renderDetail() {
    const root=$('[data-product-detail]'); if(!root)return;
    const product=(published()?products:[]).find(p=>p.product_id===params.get('id'));
    const label=$('[data-detail-state]');
    if(!product){label.textContent=published()?'Ürün bulunamadı veya artık yayında değil.':failure();root.replaceChildren();return;}
    label.textContent='';
    const view=create('div',undefined,'product-detail');
    const info=create('div');info.append(create('div','TEKNİKEL / ÜRÜN','eyebrow'),create('h1',product.name));
    if(product.sku)info.append(create('p','Stok kodu: '+product.sku,'sku'));
    info.append(create('div',money(product),'price'));
    if(product.description)info.append(create('p',product.description,'description'));
    const notice=create('p','Sipariş işlemleri bayi ve perakende satış kanalı bağlandığında açılacak.','aside-info');info.append(notice);
    view.append(photo(product.image_url,product.name),info);root.replaceChildren(view);
  }
  async function init() {
    const [b,c]=await Promise.allSettled([request('business'),request('catalog')]);
    state.business=b.status==='fulfilled'?b.value:null;
    state.catalog=c.status==='fulfilled'?c.value:null;
    products=published()&&Array.isArray(state.catalog.products)?state.catalog.products:[];
    categories=published()&&Array.isArray(state.catalog.categories)?state.catalog.categories:[];
    const form=$('[data-catalog-filter]');
    if(form){
      form.elements.q.value=state.q;
      const select=form.elements.category;select.replaceChildren(new Option('Tüm kategoriler',''));
      for(const c of categories)select.add(new Option(c.name,c.id));
      select.value=categories.some(c=>c.id===state.category)?state.category:'';
    }
    renderHome();renderCatalog();renderDetail();
  }
  const form=$('[data-catalog-filter]');
  if(form){
    form.addEventListener('submit',e=>{e.preventDefault();state.pageNo=1;renderCatalog();});
    let debounce;
    form.elements.q.addEventListener('input',()=>{clearTimeout(debounce);debounce=setTimeout(()=>{state.pageNo=1;renderCatalog()},180);});
    form.elements.category.addEventListener('change',()=>{state.pageNo=1;renderCatalog();});
    $('[data-prev]').addEventListener('click',()=>{state.pageNo--;renderCatalog();});
    $('[data-next]').addEventListener('click',()=>{state.pageNo++;renderCatalog();});
    $('[data-reload]').addEventListener('click',init);
  }
  init().catch(()=>{const s=$('[data-catalog-state]')||$('[data-detail-state]');if(s)s.textContent='Katalog bağlantısı kurulamadı.';});
})();