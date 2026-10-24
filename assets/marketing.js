import {t} from './language.js';
export {websiteCampaigns} from './publication-model.js';
const text = (tag, value, className) => {
  const node = document.createElement(tag);
  node.textContent = String(value ?? '');
  if (className) node.className = className;
  return node;
};
function mediaUrl(raw) {
  if (typeof raw !== 'string') return '';
  try {
    const url = new URL(raw, location.origin);
    if (url.origin !== location.origin || url.username || url.password) return '';
    if (!/^\/yardimci-asistan\/media\/marketing\/[A-Za-z0-9_-]{1,100}\/asset_[A-Za-z0-9_-]+\.[a-f0-9]{64}\.png$/.test(url.pathname)) return '';
    return url.href;
  } catch { return ''; }
}
export function renderCampaign(item, index) {
  const card = text('article', '', 'campaign-card campaign-card--published');
  const image = (Array.isArray(item.images) ? item.images : []).find(asset => mediaUrl(asset?.url));
  if (image) {
    const img = document.createElement('img');
    img.className = 'campaign-image'; img.loading = 'lazy'; img.decoding = 'async';
    img.alt = String(image.altText || item.title || t('Kampanya görseli')).slice(0, 300);
    img.addEventListener('error',() => img.remove());
    img.src = mediaUrl(image.url);
    card.append(img);
  }
  const content = text('div', '', 'campaign-content');
  content.append(text('span', t('DUYURU ') + String(index + 1).padStart(2, '0'), 'campaign-tag'));
  content.append(text('h3', item.title || t('Güncel duyuru')));
  if (item.text) content.append(text('p', item.text));
  card.append(content);
  return card;
}
