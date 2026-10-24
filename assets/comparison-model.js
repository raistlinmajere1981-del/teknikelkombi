import {money,unit} from './commerce.js';
import {text} from './public-info.js';

// Small, platform-neutral state: IDs and view transforms, never product copies.
// The active authorized catalog is the only source of products and prices.
export const freshTransform = () => ({zoom:1,x:0,y:0,rotation:0,flipX:1,flipY:1,filter:'normal',contrast:100});
export const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
export function transformCss(value) {
  return `translate(${value.x}px, ${value.y}px) rotate(${value.rotation}deg) scale(${value.zoom * value.flipX}, ${value.zoom * value.flipY})`;
}
export function filterCss(value) {
  if (value.filter === 'normal' && value.contrast === 100) return 'none';
  return [value.filter === 'negative' ? 'invert(1)' : value.filter === 'gray' ? 'grayscale(1)' : '',`contrast(${value.contrast}%)`].filter(Boolean).join(' ');
}
export function comparisonRows(a,b,categories = []) {
  const fields = [
    ['name','Ürün adı',p => text(p.name)],['brand','Marka',p => text(p.brand)],['sku','SKU / stok kodu',p => text(p.sku)],
    ['manufacturer_part_code','Üretici parça kodu',p => text(p.manufacturer_part_code) || text(p.manufacturer_part_number)],
    ['model','Model',p => text(p.model)],['category','Kategori',p => text(p.category_name) || text(categories.find(c => c.id === p.category_id)?.name)],
    ['unit','Birim',p => text(p.unit) ? unit(p.unit) : ''],
    ['price','Fiyat',p => Number.isFinite(p.price) && /^[A-Z]{3}$/.test(p.currency) ? money(p.price,p.currency) : ''],
    ['description','Teknik açıklama',p => text(p.technical_description) || text(p.description)]
  ];
  return fields.map(([key,label,read]) => { const left = a ? read(a) : '', right = b ? read(b) : ''; return {key,label,left,right,different:!!a && !!b && left !== right}; });
}
export class ComparisonSelection {
  ids = [null,null];
  add(id,products) {
    if (!products.some(product => product.product_id === id)) return false;
    if (this.ids.includes(id)) return true;
    if (!this.ids[0]) this.ids[0] = id; else this.ids[1] = id;
    return true;
  }
  reconcile(products) {
    const ids = new Set(products.map(product => product.product_id));
    this.ids = this.ids.map(id => ids.has(id) ? id : null);
    return this.ids;
  }
  clear() { this.ids = [null,null]; }
}
