/* Teknikel homepage commerce view. The same validated YaCommerce controller
 * and product-card renderer as the catalog page, without a second cart or API.
 */
(() => {
  'use strict';
  // The site-owned script appears before layout-level account-session.js.
  // DOMContentLoaded guarantees that deferred account/session dependencies are ready.
  const apiBase=document.currentScript?.dataset.apiBase;
  document.addEventListener('DOMContentLoaded',() => {
  const root=document.getElementById('catalog-preview');
  if(!root)return;
  const $=id=>root.querySelector('#'+id);
  const {ui,locale}=window.DemoLanguage;
  const controller=window.YaCommerce.shared({apiBase});
  const selected=new Set();
  const el=(tag,text,className)=>{
    const node=document.createElement(tag);
    if(text!==undefined)node.textContent=text;
    if(className)node.className=className;
    return node;
  };
  const money=(value,currency)=>new Intl.NumberFormat(locale,{style:'currency',currency}).format(value);
  const catalogUrl=id=>{
    const url=new URL(location.href);
    url.searchParams.set('page','catalog');
    if(id)url.searchParams.set('id',id);
    else url.searchParams.delete('id');
    url.searchParams.delete('compare');
    return url.pathname+url.search;
  };
  let state;
  const updateHeaderCart=next=>{
    const count=document.getElementById('header-cart-count');
    if(count){count.textContent=String(next.cart.length);count.hidden=!next.cart.length;}
  };
  const renderComparison=()=>{
    const button=$('home-compare-open');
    button.disabled=selected.size!==2 || state?.catalogStatus!=='ready';
    $('home-product-status').textContent=selected.size
      ?ui('{0} ürün seçildi',{0:selected.size}):'';
    for(const field of root.querySelectorAll('.compare-select')){
      field.checked=selected.has(field.dataset.productId);
      field.disabled=!field.checked&&selected.size>=2;
    }
  };
  const favoriteButton=product=>{
    const saved=state.favorites.includes(product.product_id);
    const control=el('button',ui(saved?'Favorilerimden çıkar':'Favorilerime ekle'),'quiet');
    control.type='button';control.dataset.favoriteToggle='';
    control.dataset.productId=product.product_id;
    control.setAttribute('aria-pressed',String(saved));
    control.disabled=!state.canEdit;
    control.addEventListener('click',()=>controller.toggleFavorite(product.product_id));
    return control;
  };
  const render=next=>{
    window.TeknikelProductCard.closeInspector();
    state=next;
    for(const id of [...selected])if(!next.products.some(product=>product.product_id===id))selected.delete(id);
    if(next.catalogStatus!=='ready')selected.clear();
    updateHeaderCart(next);
    const grid=$('home-product-grid');
    grid.replaceChildren();
    grid.setAttribute('aria-busy',String(next.loading));
    const actions=$('home-product-actions');actions.hidden=next.catalogStatus!=='ready'||!next.products.length;
    if(next.catalogStatus==='ready'){
      // Site-owned selection policy; the publication only supplies placement data.
      // No selected products yet means the existing first-four fallback stays visible.
      const featured=next.products.filter(product=>product.is_featured === true);
      featured.sort((a,b)=>(a.featured_order-b.featured_order)
        || (a.sort_order-b.sort_order) || a.name.localeCompare(b.name,locale) || a.product_id.localeCompare(b.product_id));
      for(const product of (featured.length ? featured : next.products).slice(0,4)){
        grid.append(window.TeknikelProductCard.create({
          product,ui,money,units:next.units,safeImage:controller.safeImage,productUrl:catalogUrl,
          addProduct:item=>controller.add(item.product_id),
          favoriteButton,selected,
          canAdd:next.canEdit && Boolean(next.deliveryMethods.length),
          onCompare:(id,checked)=>{
            if(checked)selected.add(id);else selected.delete(id);
            renderComparison();
          }
        }));
      }
    }else{
      grid.append(el('p',next.catalogMessage || (
        next.catalogStatus==='loading'?ui('Ürünler yükleniyor…'):ui('Ürünler şu anda görüntülenemiyor.')
      ),'teknikel-home-product-state'));
    }
    renderComparison();

  };
  $('home-compare-open').addEventListener('click',()=>{
    if(selected.size!==2||state?.catalogStatus!=='ready')return;
    const url=new URL(catalogUrl(''),location.origin);
    // Use a fragment: the canonical router rejects unknown query parameters.
    url.hash='compare='+encodeURIComponent([...selected].join(','));
    location.assign(url.pathname+url.search+url.hash);
  });
  controller.subscribe(render);
  controller.start();
  });
})();
