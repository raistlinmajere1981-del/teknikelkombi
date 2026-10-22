/** Teknikel public website campaigns; display-only, always backed by Yardımcı Asistan publication. */
const root = document.querySelector('[data-campaign-grid]');
const feedback = document.querySelector('[data-campaign-feedback]');
const intro = document.querySelector('.campaign-intro');
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
function renderCampaign(item, index) {
  const card = text('article', '', 'campaign-card campaign-card--published');
  const image = item.images?.find(asset => mediaUrl(asset?.url));
  if (image) {
    const img = document.createElement('img');
    img.className = 'campaign-image'; img.loading = 'lazy'; img.decoding = 'async';
    img.alt = String(image.altText || item.title || 'Teknikel kampanya görseli').slice(0, 300);
    img.src = mediaUrl(image.url);
    card.append(img);
  }
  const content = text('div', '', 'campaign-content');
  content.append(text('span', 'TEKNİKEL · DUYURU ' + String(index + 1).padStart(2, '0'), 'campaign-tag'));
  content.append(text('h3', item.title || 'Güncel duyuru'));
  if (item.text) content.append(text('p', item.text));
  card.append(content);
  return card;
}
async function loadCampaigns() {
  if (!root || !feedback) return;
  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), 9000);
  try {
    const response = await fetch('/yardimci-asistan/api/marketing.php', {
      headers: { Accept: 'application/json' }, cache: 'no-store', signal: abort.signal
    });
    if (!response.ok) throw new Error('Kampanya yayınına erişilemiyor.');
    const value = await response.json();
    if (value?.ok !== true || !Array.isArray(value.publications)) throw new Error('Kampanya yanıtı geçersiz.');
    const published = value.publications.filter(item => item?.published === true && item?.channel === 'website' && item?.placement === 'homepage_feature');
    if (published.length) {
      root.replaceChildren(...published.slice(0, 6).map(renderCampaign));
      root.classList.add('campaign-grid--live');
      root.classList.toggle('campaign-grid--single', published.length === 1);
      if (intro) intro.hidden = true;
      feedback.textContent = '';
    } else {
      feedback.textContent = 'Şu anda yayınlanmış kampanya yok. Aşağıdakiler yalnızca tasarım örneğidir.';
    }
  } catch {
    feedback.textContent = 'Kampanya yayını kontrol edilemedi. Aşağıdaki örnekler canlı kampanya değildir.';
  } finally { clearTimeout(timeout); }
}
loadCampaigns();
