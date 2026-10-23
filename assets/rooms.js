import {money} from './commerce.js';
import {hasSurface} from './storefront.js';
import {text,namedPublication,publicationImages,contactInfo} from './public-info.js';

export async function loadRooms(page,business,fetchPublic,root = document) {
  const content = root.querySelector('[data-public-content]'), status = root.querySelector('[data-publication-state]');
  const el = (tag,value,cls) => { const node = root.createElement(tag); if (value !== undefined) node.textContent = value; if (cls) node.className = cls; return node; };
  const message = value => { status.textContent = value; status.hidden = !value; };
  content.replaceChildren(); content.hidden = true;
  if (!business) { message('Oda bilgilerine ulaşılamadı. Lütfen tekrar deneyin.'); return; }
  if (!hasSurface(business,'rooms')) { message('Odalar şu anda yayında değil.'); return; }
  try {
    const value = await fetchPublic('rooms');
    if (value.enabled !== true) { message('Odalar şu anda yayında değil.'); return; }
    if (!Array.isArray(value.rooms)) throw new Error('invalid_rooms');
    const rooms = value.rooms.filter(namedPublication);
    const detail = page === 'room';
    const id = new URLSearchParams(root.defaultView.location.search).get('id');
    const shown = detail ? rooms.filter(room => room.id === id) : rooms;
    if (!shown.length) { message(detail ? 'Bu oda bulunamadı veya artık yayında değil.' : 'Henüz yayınlanmış oda bulunmuyor.'); return; }
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
      else { root.querySelector('h1').textContent = room.name; root.title = room.name + ' | Teknikel'; }
      if (Number.isInteger(room.capacity) && room.capacity > 0) body.append(el('p',room.capacity + ' kişi','table-capacity'));
      for (const field of ['bed_info','description','price_note']) if (text(room[field])) body.append(el('p',text(room[field])));
      if (Number.isInteger(room.floor)) body.append(el('p','Kat: ' + room.floor));
      if (Number.isSafeInteger(room.nightly_price_minor) && room.nightly_price_minor >= 0 && /^[A-Z]{3}$/.test(room.currency)) body.append(el('p',money(room.nightly_price_minor / 100,room.currency) + ' / gece','price'));
      if (!detail) {
        const link = el('a','Odayı incele →','btn btn-outline'); link.href = '/odalar/oda/?id=' + encodeURIComponent(room.id); body.append(link);
      } else if (contactInfo(business.business).available) {
        const link = el('a','İletişime geç →','btn btn-red'); link.href = '/iletisim/'; body.append(link);
      }
      card.append(body); return card;
    }));
    content.hidden = false; message('');
  } catch (error) { message([403,404].includes(error.status) ? 'Odalar şu anda yayında değil.' : 'Oda bilgilerine ulaşılamadı. Lütfen tekrar deneyin.'); }
}
