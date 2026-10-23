import {t,locale} from './language.js';
import {request} from './commerce.js';
import {text as publishedText} from './public-info.js';
/** Teknikel public website campaigns; display-only, always backed by Yardımcı Asistan publication. */
const root = globalThis.document?.querySelector('[data-campaign-grid]');
const feedback = globalThis.document?.querySelector('[data-campaign-feedback]');
const intro = globalThis.document?.querySelector('.campaign-intro');
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
    img.alt = String(image.altText || item.title || t('Teknikel kampanya görseli')).slice(0, 300);
    img.src = mediaUrl(image.url);
    card.append(img);
  }
  const content = text('div', '', 'campaign-content');
  content.append(text('span', t('TEKNİKEL · DUYURU ') + String(index + 1).padStart(2, '0'), 'campaign-tag'));
  content.append(text('h3', item.title || t('Güncel duyuru')));
  if (item.text) content.append(text('p', item.text));
  card.append(content);
  return card;
}
export const websiteCampaigns = value => (Array.isArray(value?.publications) ? value.publications : []).filter(item => item?.published === true && item?.channel === 'website' && item?.placement === 'homepage_feature' && publishedText(item.title));
export async function loadCampaigns(fetchPublic = request) {
  if (!root || !feedback) return;
  const section = root.closest('.campaign-section');
  section.hidden = true;
  root.replaceChildren();
  feedback.hidden = true;
  try {
    const published = websiteCampaigns(await fetchPublic('marketing'));
    if (!published.length) return;
    root.replaceChildren(...published.slice(0, 6).map(renderCampaign));
    root.classList.add('campaign-grid--live');
    root.classList.toggle('campaign-grid--single', published.length === 1);
    if (intro) intro.hidden = true;
    section.hidden = false;
  } catch {
    // Never reveal outdated marketing examples on a failed or disabled publication.
    root.replaceChildren();
  }
}
