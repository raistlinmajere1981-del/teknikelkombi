import {t} from '../language.js';

// Site-owned, date-free forms. Deliberately omit data-ya-form: the bundled
// direct-request adapter only supports reservations and must not intercept us.
const endpoint = '/yardimci-asistan/api/request.php';
const bytes = value => new TextEncoder().encode(value).length;
const clean = value => String(value ?? '').trim();
export function requestPhone(value) {
  const raw = clean(value);
  if (!/^[+\d\s().\/-]+$/.test(raw)) return '';
  let phone = raw.replace(/[\s().\/-]/g,'').replace(/^00/,'+');
  if (!phone.startsWith('+')) {
    if (/^90\d{10}$/.test(phone)) phone = phone.slice(2);
    else if (/^0\d{10}$/.test(phone)) phone = phone.slice(1);
    if (!/^5\d{9}$/.test(phone)) return '';
    phone = '+90' + phone;
  }
  return /^\+[1-9]\d{6,14}$/.test(phone) && (!phone.startsWith('+90') || /^\+905\d{9}$/.test(phone)) ? phone : '';
}
function invalid(field,message) { throw Object.assign(new Error(message),{field}); }
export function customerRequestPayload(view,id,values,sourcePath) {
  const flow = view?.flows.find(item => item.id === id && item.siteForm);
  if (!flow || !view.requests?.enabled || !view.requests.types.includes(flow.requestType)
      || !['general_info','price_question'].includes(flow.requestType)) invalid('',t('Bu talep türü artık yayında değil. Sayfayı yenileyin.'));
  const name = clean(values.customer_name), phone = requestPhone(values.customer_phone), question = clean(values.message);
  if (!name || bytes(name) > 160) invalid('customer_name',t('Lütfen adınızı ve soyadınızı kontrol edin.'));
  if (!phone) invalid('customer_phone',t('Geçerli bir telefon numarası girin. Yurt dışı numaralarında ülke kodunu ekleyin.'));
  if (!question) invalid('message',t('Lütfen sorunuzu yazın.'));
  const product = id === 'product' ? view.products.find(item => String(item.product_id) === clean(values.product_id)) : null;
  if (id === 'product' && !product) invalid('product_id',t('Lütfen yayınlanmış bir ürün seçin.'));
  // Include context in the readable message as well as the official context
  // object, so Desktop can display it without knowing about this site's UI.
  const message = product ? `${t('İlgili ürün')}: ${product.name}${product.sku ? ` (${product.sku})` : ''}\n${question}` : question;
  if (bytes(message) > 3000) invalid('message',t('Sorunuz çok uzun. Lütfen kısaltın.'));
  return {request_type:flow.requestType,customer_name:name,customer_phone:phone,message,source:'web_form',
    guest_count:1,whatsapp_message:'',context:{resourceType:product ? 'product' : '',resourceId:product ? String(product.product_id) : '',resourceName:product?.name || '',sourcePath}};
}

export function createCustomerRequestSender(fetcher = globalThis.fetch,makeKey = () => Array.from(crypto.getRandomValues(new Uint8Array(16)),byte => byte.toString(16).padStart(2,'0')).join('')) {
  // Memory only; no contacts/questions/keys in browser storage. Preserve a key
  // after ambiguous network/server failures, including closing/reopening a form.
  const intents = new Map();
  return async (id,payload,signal) => {
    const intent = JSON.stringify(payload), previous = intents.get(id);
    const key = previous?.intent === intent ? previous.key : makeKey();
    intents.set(id,{intent,key});
    const response = await fetcher(endpoint,{method:'POST',credentials:'same-origin',cache:'no-store',redirect:'error',signal,
      headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({...payload,idempotency_key:key})});
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.ok !== true || typeof result.request_id !== 'string' || !result.request_id.trim()) {
      throw Object.assign(new Error('request_failed'),{status:response.status});
    }
    if (intents.get(id)?.key === key) intents.delete(id);
    return result;
  };
}

export function createCustomerRequestFlow({root,getView,onBack}) {
  let active;
  const send = createCustomerRequestSender();
  const el = (tag,copy,cls) => { const node = root.createElement(tag); if (copy !== undefined) node.textContent = t(copy); if (cls) node.className = cls; return node; };
  function cancel() {
    if (!active) return;
    active.controller?.abort(); active = undefined;
  }
  function back() { const id = active?.id; cancel(); onBack(id); }
  function reconcile() {
    if (!active) return;
    if (!active.node.isConnected) { cancel(); return; }
    const view = getView(), flow = view.flows.find(item => item.id === active.id && item.siteForm);
    if (!flow || flow.requestType !== active.type || (active.productId && !view.products.some(item => String(item.product_id) === active.productId))) back();
  }
  function open(id,widgetRoot) {
    cancel();
    const view = getView(), flow = view.flows.find(item => item.id === id && item.siteForm);
    const content = widgetRoot?.querySelector('.ya-widget-content');
    if (!flow || !content) return;
    const section = el('div',undefined,'ya-widget-subview publication-request'); section.dataset.customerRequest = id;
    const backButton = el('button','Geri','ya-widget-secondary-action'); backButton.type = 'button'; backButton.addEventListener('click',back);
    const title = el('h2',flow.label,'ya-widget-view-title'); title.tabIndex = -1;
    const intro = el('p','Talebinizi işletme değerlendirecek ve sizinle iletişime geçecek.');
    const form = el('form'); form.dataset.customerRequestForm = id;
    const fields = el('fieldset'); fields.append(el('legend','Talep bilgileri','sr-only'));
    const status = el('p',undefined,'publication-request-status'); status.setAttribute('role','status'); status.setAttribute('aria-live','polite');
    function field(name,caption,tag = 'input') {
      const label = el('label',undefined,'ya-widget-field'), input = el(tag); input.name = name; input.required = true;
      label.append(el('span',caption),input); fields.append(label); return input;
    }
    let productSelect;
    if (id === 'product') {
      productSelect = field('product_id','İlgili ürün','select');
      const placeholder = el('option','Ürün seçin'); placeholder.value = ''; productSelect.append(placeholder);
      for (const product of view.products) {
        const option = el('option'); option.textContent = product.name + (product.sku ? ` (${product.sku})` : ''); option.value = product.product_id; productSelect.append(option);
      }
      productSelect.addEventListener('change',() => { if (active) active.productId = productSelect.value; });
    }
    const name = field('customer_name','Ad soyad'); name.autocomplete = 'name'; name.maxLength = 160;
    const phone = field('customer_phone','Telefon'); phone.type = 'tel'; phone.autocomplete = 'tel'; phone.maxLength = 40;
    const question = field('message','Sorunuz','textarea'); question.rows = 4; question.maxLength = 3000;
    const submit = el('button','Talebi Gönder','ya-widget-primary-action'); submit.type = 'submit';
    fields.append(submit); form.append(fields,status); section.append(backButton,title,intro,form);
    active = {id,type:flow.requestType,node:section,productId:'',controller:null};
    form.addEventListener('input',event => event.target.setCustomValidity?.(''));
    form.addEventListener('submit',async event => {
      event.preventDefault(); event.stopPropagation();
      const session = active;
      if (!session || session.node !== section || fields.disabled || !form.reportValidity()) return;
      let payload;
      try { payload = customerRequestPayload(getView(),id,Object.fromEntries(new FormData(form)),root.defaultView.location.pathname); }
      catch (error) {
        status.textContent = error.message;
        const input = form.elements.namedItem(error.field); input?.setCustomValidity(error.message); input?.reportValidity(); input?.focus(); return;
      }
      const controller = new AbortController(); session.controller = controller;
      const timeout = setTimeout(() => controller.abort(),15000);
      fields.disabled = true; form.setAttribute('aria-busy','true'); status.textContent = t('Talep gönderiliyor…');
      try {
        await send(id,payload,controller.signal);
        if (active !== session || !section.isConnected) return;
        const success = el('div',undefined,'publication-request-success'); success.setAttribute('role','status'); success.tabIndex = -1;
        success.append(el('strong','Talebiniz işletmeye iletildi.'),el('p','İşletme talebinizi inceleyip sizinle iletişime geçecek.'));
        const done = el('button','Tamam','ya-widget-primary-action'); done.type = 'button'; done.addEventListener('click',back); success.append(done);
        form.replaceWith(success); success.focus();
      } catch (error) {
        if (active !== session || !section.isConnected) return;
        if (error.status === 403) status.textContent = t('Bu talep türü artık yayında değil. Sayfayı yenileyin.');
        else {
          status.textContent = error.status === 429 ? t('Çok fazla istek gönderildi. Biraz sonra aynı talebi tekrar deneyin.')
            : error.status >= 400 && error.status < 500 ? t('İstek işlenemedi. Lütfen bilgileri kontrol edip tekrar deneyin.')
              : t('Gönderim doğrulanamadı. Bilgileri değiştirmeden tekrar deneyebilirsiniz.');
          fields.disabled = false;
        }
      } finally { clearTimeout(timeout); form.removeAttribute('aria-busy'); }
    });
    content.replaceChildren(section); title.focus();
  }
  return {open,reconcile};
}
