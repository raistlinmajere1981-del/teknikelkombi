import {t} from '../language.js';
import {createCustomerRequestFlow} from './customer-request.js';

export function assistantPublication(view) {
  const flows = view.flows, has = id => flows.some(flow => flow.id === id);
  const surfaces = [];
  if (view.sections.featured) surfaces.push('catalog');
  if (has('reservation')) surfaces.push('accommodation');
  if (has('table')) surfaces.push('food_service');
  if (view.sections.qr_menu) surfaces.push('menu','qr_menu');
  if (has('directions')) surfaces.push('directions');
  return {businessName:view.name,publicSurfaces:surfaces,aiEnabled:has('chat'),
    requestsEnabled:view.requests.enabled,requestTypes:view.requests.types,dealerApplicationEnabled:has('dealer'),
    whatsappEnabled:has('whatsapp'),whatsappPhone:has('whatsapp') ? view.info.whatsapp : '',
    address:view.contact.address,mapUrl:has('directions') ? view.contact.directions : ''};
}

// Original avatar, AI, reservations and dealer documents stay in widget.js.
// The site owns date-free public information/product requests.
export function initAssistantPresentation(storefront,root = document) {
  let view, widgetRoot, observer, lastConfig = '', activeTab = 'actions';
  const customerRequests = createCustomerRequestFlow({root,getView:() => view,onBack:id => {
    window.YardimciAsistanWidget?.open(); decorate();
    widgetRoot?.querySelector(`[data-support-flow="${id}"]`)?.focus();
  }});
  const el = (tag,value,cls) => { const node = root.createElement(tag); if (value !== undefined) node.textContent = t(value); if (cls) node.className = cls; return node; };
  function config() {
    return assistantPublication(view);
  }
  function openFlow(id) {
    const flow = view?.flows.find(flow => flow.id === id); if (!flow) return;
    const widget = window.YardimciAsistanWidget;
    if (flow.siteForm) { widget?.open(); customerRequests.open(id,widgetRoot); }
    else if (flow.kind === 'request') widget?.openRequest(flow.requestType);
    else if (flow.kind === 'widget') widget?.open({intent:flow.intent});
    else if (flow.kind === 'info') widget?.open({intent:'info',context:{question:flow.id === 'parts' ? t('Ürünle ilgili teknik destek almak istiyorum.') : '',sourcePath:location.pathname}});
    else if (flow.href) location.assign(flow.href);
  }
  function decorate() {
    if (!widgetRoot || !view) return;
    customerRequests.reconcile();
    widgetRoot.hidden = !view.flows.length;
    const home = widgetRoot.querySelector('.ya-widget-home');
    if (home && home.dataset.publication !== JSON.stringify(view.flows)) {
      home.dataset.publication = JSON.stringify(view.flows);
      const actions = home.querySelector('.ya-widget-actions');
      if (actions) {
        actions.replaceChildren(...view.flows.map((flow,index) => {
          const button = el('button',undefined,'ya-widget-action-card publication-flow-card'); button.type = 'button'; button.dataset.supportFlow = flow.id;
          const marker = el('span',String(index+1).padStart(2,'0'),'publication-flow-marker'), copy = el('span',undefined,'ya-widget-action-copy');
          marker.setAttribute('aria-hidden','true'); copy.append(el('strong',flow.label),el('small',flow.description)); button.append(marker,copy,el('span','↗','publication-flow-arrow')); return button;
        }));
      }
      home.querySelector('.publication-widget-tabs')?.remove();
      const tabs = el('div',undefined,'publication-widget-tabs'); tabs.setAttribute('role','tablist'); tabs.setAttribute('aria-label',t('Destek seçenekleri'));
      for (const [id,label] of [['actions','İşlemler'],['chat','Sohbet'],['contact','İletişim']]) {
        if (id === 'chat' && !view.flows.some(flow => flow.id === 'chat') || id === 'contact' && !view.flows.some(flow => ['whatsapp','directions'].includes(flow.id))) continue;
        const tab = el('button',label); tab.type = 'button'; tab.setAttribute('role','tab'); tab.dataset.widgetTab = id;
        tab.addEventListener('click',() => {
          activeTab = id;
          tabs.querySelectorAll('[role=tab]').forEach(button => { button.setAttribute('aria-selected',String(button === tab)); button.tabIndex = button === tab ? 0 : -1; });
          const allowed = id === 'chat' ? ['chat','parts'] : id === 'contact' ? ['whatsapp','directions'] : view.flows.filter(flow => !['chat','parts'].includes(flow.id)).map(flow => flow.id);
          actions.querySelectorAll('[data-support-flow]').forEach(card => card.hidden = !allowed.includes(card.dataset.supportFlow));
        });
        tab.addEventListener('keydown',event => { if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return; event.preventDefault(); const buttons = [...tabs.children], at = buttons.indexOf(tab); const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length-1 : (at+(event.key === 'ArrowRight' ? 1 : buttons.length-1))%buttons.length; buttons[next].focus(); buttons[next].click(); });
        tabs.append(tab);
      }
      home.querySelector('.ya-widget-welcome')?.after(tabs);
      const initial = [...tabs.children].find(tab => tab.dataset.widgetTab === activeTab) || tabs.firstElementChild; initial?.click();
    }
    const aiInput = widgetRoot.querySelector('[data-ya-ai-form] textarea');
    if (aiInput && view.sections.featured) aiInput.placeholder = t('Ürün adı, stok kodu veya sorunuz…');
    const form = widgetRoot.querySelector('[data-dealer-application]');
    if (form && !form.dataset.presentation) {
      form.dataset.presentation = '1';
      const intro = el('div',undefined,'dealer-application-intro'); intro.append(el('span','B2B','dealer-application-badge'),el('p','Firma bilgilerinizi ve iletişim bilgilerinizi iletin. Başvurunuzu işletme değerlendirecek.'));
      form.before(intro);
      // Move existing controls into semantic groups. Their field names and event
      // handlers (including private document upload) are left intact.
      let previous;
      for (const [legend,names] of [['Firma bilgileri',['company_name','tax_office','tax_number']],['İletişim bilgileri',['authorized_person','customer_phone','email']]]) {
        const group = el('fieldset',undefined,'dealer-application-group'); group.append(el('legend',legend));
        for (const name of names) { const field = form.querySelector('[name="'+name+'"]')?.closest('label'); if (field) group.append(field); }
        if (previous) previous.after(group); else form.prepend(group);
        previous = group;
      }
      for (const label of form.querySelectorAll('label>span,legend,option,button[type="submit"]')) if (!label.children.length) label.textContent = t(label.textContent);
      const heading = form.parentElement.querySelector('h2'); if (heading) heading.textContent = t('Bayi Başvurusu');
    }
  }
  function connect() {
    const widget = window.YardimciAsistanWidget; if (!widget?.setPublication || !view) return;
    const next = config(), key = JSON.stringify(next);
    if (lastConfig !== key) { lastConfig = key; widget.setPublication(next); }
    const target = root.getElementById('yardimci-asistan-widget');
    if (target && widgetRoot !== target) { observer?.disconnect(); widgetRoot = target; observer = new MutationObserver(decorate); observer.observe(target,{childList:true,subtree:true}); }
    decorate();
  }
  storefront.subscribe(snapshot => { view = snapshot.view; connect(); });
  root.addEventListener('ya:ready',connect);
  root.addEventListener('DOMContentLoaded',connect,{once:true});
  root.addEventListener('click',event => {
    const flow = event.target.closest?.('[data-support-flow]'); if (flow) { event.preventDefault(); openFlow(flow.dataset.supportFlow); }
    const open = event.target.closest?.('[data-support-open]'); if (open && view?.flows.length) window.YardimciAsistanWidget?.open();
  });
}
