import {text,contactInfo,aboutText,galleryImages,reviewsFrom,namedPublication,mapEmbedUrl} from './public-info.js';
import {productImageUrls} from './commerce.js';

// The API owns capabilities and publication. Templates consume this projection,
// never profile names or private dealer catalogs. Missing/failed sources are empty.
export const hasSurface = (source,surface) => Array.isArray(source?.business?.public_surfaces) && source.business.public_surfaces.includes(surface);
export const storeEnabled = (source,catalog) => hasSurface(source,'store') && catalog?.enabled === true && publicationAllowed(source,'store');
export const visibleRecord = item => item && item.published !== false && item.is_active !== false && item.active !== false && item.visible !== false;
const list = value => Array.isArray(value) ? value : [];
const requestTypes = new Set(['dealer_application','general_info','pension_reservation','restaurant_reservation','breakfast_request','qr_menu_question','location_question','price_question','other']);
export function publicRequests(source) {
  const enabled = source?.business?.requests_enabled === true;
  return {enabled,types:enabled ? [...new Set(list(source.business.request_types).filter(type => requestTypes.has(type)))] : []};
}
export const websiteCampaigns = value => (value?.enabled === false ? [] : list(value?.publications)).filter(item => visibleRecord(item) && item.published === true && item.channel === 'website' && item.placement === 'homepage_feature' && text(item.title));
export function publicCategories(catalog) {
  const seen = new Set();
  return (Array.isArray(catalog?.categories) ? catalog.categories : []).filter(item => {
    if (!visibleRecord(item) || !text(item.id) || !text(item.name) || seen.has(item.id)) return false;
    seen.add(item.id); return true;
  });
}
export function menuData(value) {
  if (!Array.isArray(value?.categories) || !Array.isArray(value?.items)) return {categories:[],items:[]};
  const categories = value.categories.filter(namedPublication), ids = new Set(categories.map(item => item.id));
  return {categories,items:value.items.filter(item => namedPublication(item) && ids.has(item.category_id))};
}
// public_surfaces already reflects the server's module + published-channel gates.
// Optional publication_visibility can only restrict those gates, never grant them.
export function publicationAllowed(source,key) {
  const visibility = source?.business?.publication_visibility;
  return visibility?.[key] !== false && visibility?.[key]?.visible !== false;
}
export function publicationEndpoints(source) {
  if (!source?.business) return [];
  const endpoints = ['marketing'];
  if (source.business.google_reviews_enabled === true && publicationAllowed(source,'reviews')) endpoints.push('google-reviews');
  for (const [surface,endpoint] of [['rooms','rooms'],['restaurant','tables'],['qr_menu','menu'],['store','catalog']]) {
    if (hasSurface(source,surface) && publicationAllowed(source,surface)) endpoints.push(endpoint);
  }
  return endpoints;
}
export function projectPublication({business = null,catalog = null,publications = {}},origin = 'https://localhost') {
  if (!business?.business) { catalog = null; publications = {}; }
  const info = business?.business || {}, allow = key => publicationAllowed(business,key);
  const contact = allow('contact') ? contactInfo(info) : contactInfo();
  const store = storeEnabled(business,catalog) && allow('store');
  const products = store ? list(catalog.products).filter(visibleRecord) : [];
  const categories = store ? publicCategories(catalog) : [];
  const brands = [...new Set(products.map(item => text(item.brand)).filter(Boolean))].sort((a,b) => a.localeCompare(b,'tr'));
  const rooms = hasSurface(business,'rooms') && allow('rooms') && publications.rooms?.enabled === true ? list(publications.rooms.rooms).filter(namedPublication) : [];
  const tables = hasSurface(business,'restaurant') && allow('restaurant') && publications.tables?.enabled === true ? list(publications.tables.tables).filter(namedPublication) : [];
  const menu = hasSurface(business,'qr_menu') && allow('qr_menu') && publications.menu?.enabled !== false ? menuData(publications.menu) : {categories:[],items:[]};
  const gallery = allow('gallery') ? galleryImages(info,origin) : [];
  const campaigns = allow('campaigns') ? websiteCampaigns(publications.marketing) : [];
  const reviews = info.google_reviews_enabled === true && allow('reviews') ? reviewsFrom(publications['google-reviews']) : null;
  const about = allow('about') ? aboutText(info) : '';
  const ai = !!business && info.ai_enabled === true && allow('assistant');
  const requests = publicRequests(business), permits = type => requests.types.includes(type);
  const dealer = permits('dealer_application') && info.dealer_application_enabled === true && allow('dealer');
  const productRequestType = permits('price_question') ? 'price_question' : permits('general_info') ? 'general_info' : '';
  const sections = {
    hero:!!(text(info.display_name) || text(info.description) || about),
    store,featured:products.length > 0 && allow('featured'),categories:categories.length > 0 && allow('categories'),brands:brands.length > 0 && allow('brands'),
    rooms:rooms.length > 0,restaurant:tables.length > 0,qr_menu:menu.items.length > 0,
    campaigns:campaigns.length > 0,reviews:!!reviews?.reviews.length,gallery:gallery.length > 0,
    about:!!about,contact:contact.available,dealer,support:ai || dealer || contact.available
  };
  // The floating assistant is a task surface, not a second site menu.
  // Do not duplicate Mağaza / Hesabım / İletişim navigational links inside it.
  const flows = [
    {id:'chat',label:'Genel sohbet',description:'Sorunuzu yazın',kind:'info',enabled:ai},
    {id:'parts',label:'Parça hakkında sor',description:'Parça kodu ve teknik bilgi',kind:'info',enabled:ai && sections.featured},
    {id:'general',label:'Bilgi talebi oluştur',description:'Sorunuzu işletmeye iletin',kind:'request',requestType:'general_info',siteForm:true,enabled:permits('general_info')},
    {id:'product',label:'Ürün / stok sor',description:'Ürün seçip sorunuzu iletin',kind:'request',requestType:productRequestType,siteForm:true,enabled:store && products.length > 0 && !!productRequestType},
    {id:'dealer',label:'Bayi başvurusu',description:'Firma bilgilerinizi iletin',kind:'request',requestType:'dealer_application',enabled:dealer},
    {id:'reservation',label:'Rezervasyon',description:'Konaklama talebinizi iletin',kind:'request',requestType:'pension_reservation',enabled:permits('pension_reservation') && sections.rooms},
    {id:'table',label:'Masa talebi',description:'Tarih ve saat seçin',kind:'request',requestType:'restaurant_reservation',enabled:permits('restaurant_reservation') && sections.restaurant},
    {id:'whatsapp',label:'WhatsApp ile iletişim',description:'Mesajınızı hazırlayın',kind:'widget',intent:'contact.whatsapp',enabled:!!contact.whatsapp},
    {id:'directions',label:'Yol tarifi',description:'Konum bilgilerini inceleyin',kind:'widget',intent:'directions',enabled:!!contact.directions}
  ].filter(flow => flow.enabled);
  sections.support = flows.length > 0;
  // Stores showcase actual published product photos, not arbitrary gallery uploads
  // (which might be screenshots or unrelated services). Without product photos,
  // the generic site's published gallery remains a suitable hero fallback.
  const productHeroImages = products.flatMap(item => productImageUrls(item,origin).slice(0,1).map(url => ({url,title:item.name}))).slice(0,3);
  const heroImages = productHeroImages.length ? productHeroImages : gallery.slice(0,3);
  return {info,requests,name:text(info.display_name),description:text(info.description) || about,about,contact,map:contact.available ? mapEmbedUrl(info) : '',store,products,categories,brands,rooms,tables,menu,gallery,campaigns,reviews,sections,flows,
    pages:{about:sections.about,gallery:sections.gallery,reviews:sections.reviews,announcements:sections.campaigns},
    heroImages};
}
