// Minimal DOM fixture for exercising SSR text/attribute ownership without a browser.
// Browser selector, navigation and rendering coverage lives in storefront.mjs.
export function languageDocument(href = 'https://example.com/?lang=en') {
  class Element {
    constructor(attributes = {}, excluded = false) { this.attributes = new Map(Object.entries(attributes)); this.dataset = {}; this.children = []; this.isConnected = true; this.excluded = excluded; }
    getAttribute(key) { return this.attributes.get(key) ?? null; }
    setAttribute(key,value) { this.attributes.set(key,String(value)); }
    toggleAttribute(key,on) { if (on) this.setAttribute(key,''); else this.attributes.delete(key); }
    closest() { return this.excluded ? this : null; }
    replaceChildren(...nodes) { this.children = nodes; }
    append(node) { this.children.push(node); }
    set href(value) { this.setAttribute('href',value); }
  }
  const text = (value,excluded = false) => ({nodeValue:value,isConnected:true,parentElement:new Element({},excluded)});
  const heading = text('Mağaza'), spaced = text(' Tüm kategoriler '), user = text('Mağaza',true), widget = text('Mağaza',true);
  const search = new Element({placeholder:'Mağaza','aria-label':'Mağaza'});
  const chooser = new Element(); chooser.hidden = true; chooser.setAttribute('inert','');
  const texts = [heading,spaced,user,widget], listeners = new Map(), cookies = new Map();
  const root = {
    documentElement:new Element(), defaultView:{location:new URL(href),addEventListener() {}},
    createTreeWalker() { let index = 0; return {nextNode:() => texts[index++] || null}; },
    querySelectorAll(selector) {
      if (selector === '.language-chooser') return [chooser];
      if (selector === '[data-language]') return chooser.children;
      return [search];
    },
    createElement:() => new Element(), addEventListener:(name,listener) => listeners.set(name,listener),
    get cookie() { return [...cookies].map(([key,value]) => key+'='+value).join('; '); },
    set cookie(value) { const [pair] = value.split(';'); const at = pair.indexOf('='); cookies.set(pair.slice(0,at),pair.slice(at+1)); }
  };
  root.defaultView.location.assign = value => { root.assigned = value; };
  return {root,heading,spaced,user,widget,search,chooser,texts,text,listeners};
}
