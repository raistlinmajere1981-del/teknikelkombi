import {t,locale} from './language.js';
import {money} from './commerce.js';
import {hasSurface,publicationAllowed} from './publication-model.js';
import {text,namedPublication,publicationImages,contactInfo} from './public-info.js';

export async function loadRooms(page,business,fetchPublic,root = document,view) {
  const content = root.querySelector('[data-public-content]'), status = root.querySelector('[data-publication-state]');
  const el = (tag,value,cls) => { const node = root.createElement(tag); if (value !== undefined) node.textContent = value; if (cls) node.className = cls; return node; };
  const message = value => { status.textContent = value; status.hidden = !value; };
  content.replaceChildren(); content.hidden = true;
  if (!business) { message(t('Oda bilgilerine ulaşılamadı. Lütfen tekrar deneyin.')); return; }
  if (!hasSurface(business,'rooms') || !publicationAllowed(business,'rooms')) { message(t('Odalar şu anda yayında değil.')); return; }
  try {
    const value = await fetchPublic('rooms');
    if (value.enabled !== true) { message(t('Odalar şu anda yayında değil.')); return; }
    if (!Array.isArray(value.rooms)) throw new Error('invalid_rooms');
    const rooms = view ? view.rooms : value.rooms.filter(namedPublication);
    const detail = page === 'room';
    const id = new URLSearchParams(root.defaultView.location.search).get('id');
    const shown = detail ? rooms.filter(room => room.id === id) : rooms;
    if (!shown.length) { message(detail ? t('Bu oda bulunamadı veya artık yayında değil.') : t('Henüz yayınlanmış oda bulunmuyor.')); return; }
    content.className = detail ? 'room-detail' : 'publication-grid';
    content.append(...shown.map(room => {
      const card = el('article',undefined,'publication-card');
      const photos = publicationImages(room,root.defaultView.location.origin);
      for (const url of detail ? photos : photos.slice(0,1)) {
        const img = el('img'); img.src = url; img.alt = room.name; img.loading = 'lazy'; img.decoding = 'async'; img.referrerPolicy = 'no-referrer';
        img.addEventListener('error',() => img.remove()); card.append(img);
      }
      const body = el('div',undefined,'publication-card-body');
      if (!detail) body.append(el('h2',room.name));
      else { root.querySelector('h1').textContent = room.name; root.title = [room.name,business.business?.display_name].filter(Boolean).join(' | '); }
      if (Number.isInteger(room.capacity) && room.capacity > 0) body.append(el('p',room.capacity + t(' kişi'),'table-capacity'));
      for (const field of ['bed_info','description','price_note']) if (text(room[field])) body.append(el('p',text(room[field])));
      if (Number.isInteger(room.floor)) body.append(el('p',t('Kat: ') + room.floor));
      if (Number.isSafeInteger(room.nightly_price_minor) && room.nightly_price_minor >= 0 && /^[A-Z]{3}$/.test(room.currency)) body.append(el('p',money(room.nightly_price_minor / 100,room.currency) + t(' / gece'),'price'));
      if (!detail) {
        const link = el('a',t('Odayı incele →'),'btn btn-outline'); link.href = '/odalar/oda/?id=' + encodeURIComponent(room.id); body.append(link);
      } else if (contactInfo(business.business).available) {
        const link = el('a',t('İletişime geç →'),'btn btn-red'); link.href = '/iletisim/'; body.append(link);
      }
      card.append(body); return card;
    }));
    content.hidden = false; message('');
  } catch (error) { message([403,404].includes(error.status) ? t('Odalar şu anda yayında değil.') : t('Oda bilgilerine ulaşılamadı. Lütfen tekrar deneyin.')); }
}
