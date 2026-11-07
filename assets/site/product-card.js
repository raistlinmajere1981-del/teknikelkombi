/* Teknikel product-card presentation. One renderer for home and catalog.
 * Product data, buyer prices, favorites and cart operations stay with YaCommerce.
 */
(() => {
  'use strict';
  const el = (tag,text,className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const button = (text,action,className='') => {
    const node=el('button',text,className);
    node.type='button';node.addEventListener('click',action);return node;
  };
  function create({
    product,ui,money,units,safeImage,productUrl,addProduct,favoriteButton,
    selected,onCompare,canAdd
  }) {
    const card=el('article',undefined,'product-card');
    card.dataset.productId=product.product_id;
    const urls=[...new Set([product.image_url,...(product.image_urls||[])].map(safeImage).filter(Boolean))].slice(0,12);
    const media=el('div',undefined,'product-media teknikel-product-media teknikel-gallery');
    media.dataset.galleryImages=JSON.stringify(urls);
    media.dataset.galleryName=product.name;
    const imageLink=el('a',undefined,'teknikel-gallery-image-link');
    imageLink.href=productUrl(product.product_id);
    imageLink.setAttribute('aria-label',product.name);
    const fallback=el('span',ui('Görsel yok'),'teknikel-gallery-missing');
    fallback.hidden=urls.length>0;imageLink.append(fallback);
    if(urls.length){
      const image=el('img');image.alt=product.name;image.loading='lazy';image.referrerPolicy='no-referrer';
      image.addEventListener('error',()=>{image.hidden=true;fallback.hidden=false;});
      image.addEventListener('load',()=>{image.hidden=false;fallback.hidden=true;});
      image.src=urls[0];imageLink.append(image);
    }
    media.append(imageLink);
    if(urls.length>1){
      const controls=el('div',undefined,'teknikel-gallery-controls');
      controls.setAttribute('role','group');controls.setAttribute('aria-label',ui('Ürün fotoğrafları'));
      for(const [step,symbol,label] of [[-1,'‹',ui('Önceki fotoğraf')],[1,'›',ui('Sonraki fotoğraf')]]){
        const arrow=el('button',symbol);arrow.type='button';arrow.dataset.galleryStep=String(step);
        arrow.setAttribute('aria-label',label);
        if(step===1)controls.append(el('span',`1 / ${urls.length}`,'teknikel-gallery-count'));
        controls.append(arrow);
      }
      controls.querySelector('.teknikel-gallery-count').setAttribute('aria-live','polite');
      media.append(controls);
    }
    const body=el('div',undefined,'product-body');
    const heading=el('h3'),link=el('a',product.name);
    link.href=productUrl(product.product_id);link.dataset.productLink='';
    heading.append(link);body.append(heading);
    if(product.sku)body.append(el('p',`${ui('Stok kodu')}: ${product.sku}`,'product-sku'));
    if(product.brand)body.append(el('span',product.brand,'product-brand'));
    if(urls.length>1){
      const galleryLink=el('a',ui('Fotoğraflar ({0})',{0:urls.length}),'product-gallery-link');
      galleryLink.href=productUrl(product.product_id);galleryLink.setAttribute('aria-label',product.name);
      body.append(galleryLink);
    }
    body.append(el('div',money(product.price,product.currency)+' / '+units[product.unit],'price'));
    const compareLabel=el('label',undefined,'compare-choice'),compare=el('input',undefined,'compare-select');
    compare.type='checkbox';compare.checked=selected.has(product.product_id);compare.dataset.productId=product.product_id;
    compare.disabled=!compare.checked&&selected.size>=2;
    compare.addEventListener('change',()=>onCompare(product.product_id,compare.checked));
    compareLabel.append(compare,document.createTextNode(ui('Karşılaştır')));
    const add=button(ui('Sepete ekle'),()=>addProduct(product),'');
    add.disabled=!canAdd;
    body.append(compareLabel,favoriteButton(product),add);
    card.append(media,body);
    return card;
  }
  window.TeknikelProductCard=Object.freeze({create});
})();
