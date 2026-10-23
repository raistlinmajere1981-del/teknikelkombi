import {photoUrl} from './commerce.js';

export const text = value => typeof value === 'string' ? value.trim() : '';
export function phoneUrl(value) {
  const phone = text(value);
  if (!/^[+\d ()./-]+$/.test(phone)) return '';
  const number = phone.replace(/[ ()./-]/g,'');
  return /^\+?\d{7,15}$/.test(number) ? 'tel:' + number : '';
}
export function emailUrl(value) {
  const email = text(value);
  return /^[A-Za-z0-9.!$'*+_=-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(email) ? 'mailto:' + encodeURIComponent(email).replace(/%40/g,'@') : '';
}
export function websiteUrl(value) {
  const address = text(value);
  if (!/^https?:\/\//i.test(address) || /[\u0000-\u0020\u007f\\]/.test(address)) return '';
  try { const url = new URL(address); return !url.username && !url.password ? url.href : ''; } catch { return ''; }
}
export const httpsUrl = value => websiteUrl(value).startsWith('https:') ? websiteUrl(value) : '';
export function whatsappUrl(info) {
  const phone = phoneUrl(info?.whatsapp);
  return info?.whatsapp_enabled === true && phone ? 'https://wa.me/' + phone.slice(4).replace(/^\+/,'') : '';
}
export function socialLinks(info) {
  return (Array.isArray(info?.social_links) ? info.social_links : []).flatMap(item => {
    const url = httpsUrl(item?.url), label = text(item?.label) || text(item?.platform);
    return url && label ? [{url,label}] : [];
  });
}
export function directionsUrl(info = {}) {
  const {latitude:lat,longitude:lon} = info;
  if (Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
    return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(lat + ',' + lon);
  }
  const map = httpsUrl(info.map_url);
  if (map) {
    const url = new URL(map), host = url.hostname;
    const google = ['google.com','www.google.com','maps.google.com','google.com.tr','www.google.com.tr'].includes(host);
    if ((google && (url.pathname.startsWith('/maps/') || host === 'maps.google.com') && (url.pathname.length > 6 || url.searchParams.get('q') || url.searchParams.get('destination')))
      || (host === 'maps.app.goo.gl' && /^\/[A-Za-z0-9_-]+$/.test(url.pathname))
      || (host === 'goo.gl' && /^\/maps\/[A-Za-z0-9_-]+$/.test(url.pathname))
      || (['openstreetmap.org','www.openstreetmap.org'].includes(host) && (url.searchParams.has('mlat') || /^\/(node|way|relation)\/\d+$/.test(url.pathname)))) return map;
  }
  return text(info.address) ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(text(info.address)) : '';
}
export function contactInfo(info = {}) {
  const value = {phone:phoneUrl(info.phone),email:emailUrl(info.email),whatsapp:whatsappUrl(info),address:text(info.address),website:websiteUrl(info.website),socials:socialLinks(info),directions:directionsUrl(info)};
  return {...value,available:!!(value.phone || value.email || value.whatsapp || value.address || value.website || value.socials.length || value.directions)};
}
export const aboutText = info => text(info?.about_text) || text(info?.description);
export function galleryImages(info,origin) {
  return (Array.isArray(info?.gallery) ? info.gallery : []).flatMap(item => {
    if (!item || item.published === false || item.is_active === false || (item.kind && !['cover','photo','image'].includes(item.kind))) return [];
    const url = photoUrl(typeof item === 'string' ? item : item.url,origin);
    return url ? [{url,title:text(item.title) || text(item.caption)}] : [];
  });
}
export function reviewsFrom(value) {
  if (value?.available !== true || !Array.isArray(value.reviews)) return null;
  const rating = Number.isFinite(value.rating) && value.rating >= 0 && value.rating <= 5 ? value.rating : null;
  return {...value,rating,reviews:value.reviews.filter(item => text(item?.text))};
}
export const namedPublication = item => item && item.is_active !== false && item.active !== false && item.published !== false && text(item.id) && text(item.name);
export function publicationImages(item,origin) {
  const media = (Array.isArray(item.media) ? item.media : []).filter(media => media && ['cover','photo','image'].includes(media.kind) && media.published !== false);
  return [...new Set([item.image_url,...media.map(media => media.url)].map(url => photoUrl(url,origin)).filter(Boolean))];
}
