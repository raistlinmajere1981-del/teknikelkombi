import {t,locale} from './language.js';
import {text,contactInfo,aboutText,galleryImages,reviewsFrom,httpsUrl} from './public-info.js';
import {websiteCampaigns,renderCampaign} from './marketing.js';

export async function loadPublicPage(page,business,fetchPublic,root = document,view) {
  const content = root.querySelector('[data-public-content]'), status = root.querySelector('[data-publication-state]');
  const el = (tag,value,cls) => { const node = root.createElement(tag); if (value !== undefined) node.textContent = value; if (cls) node.className = cls; return node; };
  const message = value => { status.textContent = value; status.hidden = !value; };
  const link = (label,url) => { const anchor = el('a',label,'public-link'); anchor.href = url; anchor.rel = 'noopener noreferrer'; return anchor; };
  const note = (heading,value) => { if (text(value)) { const section = el('section'); section.append(el('h2',heading),el('p',text(value))); content.append(section); } };
  content.hidden = true;
  if (page !== 'contact') content.replaceChildren();
  if (!business) { message(t('Bilgilere ulaşılamadı. Lütfen tekrar deneyin.')); return; }
  const info = business.business || {};
  function unavailable() { message(t('Bu sayfa şu anda yayında değil.')); }
  if (view && !(page === 'contact' ? view.sections.contact : page === 'brands' ? view.sections.brands : view.pages[page])) { unavailable(); return; }
  try {
    if (page === 'brands') {
      content.className = 'brands public-brands';
      content.append(...view.brands.map(brand => link(brand,'/magaza/?brand='+encodeURIComponent(brand))));
    } else if (page === 'contact') {
      if (!contactInfo(info).available) { unavailable(); return; }
      note(t('Ulaşım bilgileri'),info.directions_note);
      note(t('Ödeme bilgileri'),info.payment_note);
      note(t('İşletme koşulları'),info.policy_note);
    } else if (page === 'about') {
      const about = aboutText(info);
      if (!about) { unavailable(); return; }
      content.className = 'public-prose'; content.append(el('p',about));
      if (text(info.description) && text(info.description) !== about) content.append(el('p',text(info.description)));
      for (const [heading,field] of [[t('Olanaklar'),'features'],[t('Diller'),'languages']]) {
        const values = (Array.isArray(info[field]) ? info[field] : []).map(value => text(value) || text(value?.label)).filter(Boolean);
        if (values.length) { const section = el('section'), list = el('ul'); list.append(...values.map(value => el('li',value))); section.append(el('h2',heading),list); content.append(section); }
      }
      note(t('İşletme koşulları'),info.policy_note); note(t('Ödeme bilgileri'),info.payment_note);
    } else if (page === 'gallery') {
      const photos = galleryImages(info,root.defaultView.location.origin);
      if (!photos.length) { unavailable(); return; }
      content.className = 'publication-grid public-gallery';
      content.append(...photos.map(photo => {
        const figure = el('figure',undefined,'publication-card'), img = el('img');
        img.alt = photo.title; img.src = photo.url; img.loading = 'lazy'; img.decoding = 'async'; img.referrerPolicy = 'no-referrer';
        img.addEventListener('error',() => figure.remove()); figure.append(img);
        if (photo.title) figure.append(el('figcaption',photo.title,'publication-card-body'));
        return figure;
      }));
    } else if (page === 'reviews') {
      if (info.google_reviews_enabled !== true) { unavailable(); return; }
      const value = reviewsFrom(await fetchPublic('google-reviews'));
      if (!value) { unavailable(); return; }
      content.className = 'public-reviews';
      const summary = el('div',undefined,'review-summary');
      if (text(value.name)) summary.append(el('h2',value.name));
      if (value.rating !== null) summary.append(el('p',value.rating.toLocaleString(locale) + ' / 5','price'));
      if (Number.isSafeInteger(value.user_rating_count) && value.user_rating_count > 0) summary.append(el('p',value.user_rating_count.toLocaleString(locale) + t(' Google değerlendirmesi')));
      const url = httpsUrl(value.reviews_uri) || httpsUrl(value.google_maps_uri);
      if (url) summary.append(link(t('Google yorumlarını görüntüle ↗'),url));
      content.append(summary);
      const grid = el('div',undefined,'publication-grid');
      grid.append(...value.reviews.map(review => {
        const card = el('article',undefined,'publication-card publication-card-body');
        if (text(review.author)) {
          const heading = el('h3'), authorUrl = httpsUrl(review.author_uri);
          heading.append(authorUrl ? link(text(review.author),authorUrl) : el('span',text(review.author))); card.append(heading);
        }
        if (Number.isFinite(review.rating) && review.rating >= 0 && review.rating <= 5) card.append(el('p',review.rating + ' / 5','review-rating'));
        if (text(review.relative_time)) card.append(el('p',text(review.relative_time),'product-meta'));
        card.append(el('p',review.text));
        if (httpsUrl(review.google_maps_uri)) card.append(link(t('Google’da görüntüle ↗'),httpsUrl(review.google_maps_uri)));
        return card;
      }));
      content.append(grid); content.hidden = false;
      message(value.reviews.length ? '' : t('Henüz gösterilebilecek yorum bulunmuyor.')); return;
    } else if (page === 'announcements') {
      const campaigns = websiteCampaigns(await fetchPublic('marketing'));
      if (!campaigns.length) { message(t('Henüz yayınlanmış duyuru bulunmuyor.')); return; }
      content.className = 'campaign-grid campaign-grid--live announcements';
      content.append(...campaigns.map(renderCampaign));
    }
    content.hidden = false; message('');
  } catch { message(t('Bilgilere ulaşılamadı. Lütfen tekrar deneyin.')); }
}
