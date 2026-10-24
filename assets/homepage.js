import {t,locale} from './language.js';
import {publicationImages,text,httpsUrl} from './public-info.js';
import {renderCampaign} from './marketing.js';
import {menuPrice,tableCapacity} from './publications.js';

export function renderHomepage(view,root = document) {
  if (root.body?.dataset.page !== 'home') return;
  const el = (tag,value,cls) => { const node = root.createElement(tag); if (value !== undefined) node.textContent = value; if (cls) node.className = cls; return node; };
  const title = root.querySelector('[data-hero-title]');
  title.textContent = view.store ? t('Detayları görün.') : view.name;
  if (view.store) title.append(el('em',t('Karşılaştırarak seçin.')));
  const media = root.querySelector('[data-hero-media]'), photos = view.heroImages;
  const key = JSON.stringify(photos);
  if (media.dataset.images !== key) {
    media.dataset.images = key; media.replaceChildren();
    photos.forEach((photo,index) => {
      const figure = el('figure',undefined,'hero-published-photo hero-photo-' + index), img = el('img');
      img.alt = photo.title; img.src = photo.url; img.decoding = 'async'; img.referrerPolicy = 'no-referrer';
      img.addEventListener('error',() => { figure.remove(); media.hidden = !media.childElementCount; });
      figure.append(img); if (photo.title) figure.append(el('figcaption',photo.title)); media.append(figure);
    });
  }
  media.hidden = !media.childElementCount;
  root.querySelector('.hero-wrap').classList.toggle('hero-without-media',media.hidden);
  const campaigns = root.querySelector('[data-campaign-grid]');
  campaigns.replaceChildren(...view.campaigns.slice(0,6).map(renderCampaign));
  campaigns.classList.add('campaign-grid--live'); campaigns.classList.toggle('campaign-grid--single',view.campaigns.length === 1);
  const descriptors = {
    rooms:{items:view.rooms,href:item => '/odalar/oda/?id='+encodeURIComponent(item.id),note:tableCapacity},
    restaurant:{items:view.tables,href:() => '/restoran/',note:tableCapacity},
    qr_menu:{items:view.menu.items,href:() => '/qr-menu/',note:menuPrice},
    gallery:{items:view.gallery,href:() => '/galeri/'},reviews:{items:view.reviews?.reviews || []}
  };
  for (const [key,{items,href,note}] of Object.entries(descriptors)) {
    const grid = root.querySelector('[data-home-list="'+key+'"]');
    grid.replaceChildren(...items.slice(0,3).map(item => {
      const card = el('article',undefined,'publication-card'), body = el('div',undefined,'publication-card-body');
      const url = key === 'gallery' ? item.url : publicationImages(item,root.defaultView.location.origin)[0];
      if (url) { const img = el('img'); img.src = url; img.alt = item.title || item.name || ''; img.loading = 'lazy'; img.decoding = 'async'; img.referrerPolicy = 'no-referrer'; img.addEventListener('error',() => img.remove()); card.append(img); }
      if (key === 'reviews') {
        if (text(item.author)) body.append(el('h3',item.author));
        if (Number.isFinite(item.rating) && item.rating >= 0 && item.rating <= 5) body.append(el('p',item.rating+' / 5','review-rating'));
        body.append(el('p',item.text)); if (text(item.relative_time)) body.append(el('small',item.relative_time));
        if (httpsUrl(item.google_maps_uri)) { const link = el('a',t('Google’da görüntüle ↗'),'public-link'); link.href = httpsUrl(item.google_maps_uri); link.rel = 'noopener noreferrer'; body.append(link); }
      } else {
        const heading = el('h3'), link = el('a',item.name || item.title || t('Görseli incele')); link.href = href(item); heading.append(link); body.append(heading);
        if (note && note(item)) body.append(el('p',note(item),'product-meta'));
        if (text(item.description)) body.append(el('p',item.description));
      }
      card.append(body); return card;
    }));
  }
  const summary = root.querySelector('[data-home-review-summary]'); summary.replaceChildren();
  if (view.sections.reviews) {
    if (view.reviews.rating !== null) summary.append(el('strong',view.reviews.rating.toLocaleString(locale)+' / 5'));
    if (Number.isSafeInteger(view.reviews.user_rating_count) && view.reviews.user_rating_count > 0) summary.append(el('span',view.reviews.user_rating_count.toLocaleString(locale)+t(' Google değerlendirmesi')));
    if (view.reviews.stale === true) summary.append(el('small',t('Son alınan değerlendirmeler')));
  }
  const support = root.querySelector('[data-home-support]');
  if (support) support.replaceChildren(...view.flows.slice(0,4).map(flow => {
    const button = el('button',t(flow.label),'btn btn-outline'); button.type = 'button'; button.dataset.supportFlow = flow.id; return button;
  }));
}
