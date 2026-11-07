// Site-only presentation: canonical widget continues to own forms, transport and validation.
export function mount({language}) {
  let widgetObserver;
  let discoveryObserver;
  // The header height varies by breakpoint and available published actions.
  // Keep sticky filter/cart rails entirely below the actual header, not a fixed guess.
  const siteHeader = document.querySelector('.teknikel-header');
  const updateStickyClearance = () => {
    if (siteHeader && document.querySelector('.teknikel-catalog')) {
      document.documentElement.style.setProperty('--teknikel-sticky-clearance',
        Math.ceil(siteHeader.getBoundingClientRect().height + 12) + 'px');
    }
  };
  updateStickyClearance();
  if (siteHeader && document.querySelector('.teknikel-catalog')) {
    if ('ResizeObserver' in window) new ResizeObserver(updateStickyClearance).observe(siteHeader);
    window.addEventListener('resize',updateStickyClearance,{passive:true});
  }
  const locale = document.documentElement.lang === 'en' ? 'en' : 'tr';
  const copy = locale === 'en' ? {
    steps:['Contact','Company','Documents'], next:'Continue', back:'Previous',
    file:'Select files', empty:'No files selected', count:n=>n+' file(s) selected',
    details:'PDF, JPG or PNG · Up to 5 files · 10 MB per file',
    question:'E.g. Which spare part is compatible with the Bosch U072 Condense?',
    request:'Enter the part name, stock code, or compatibility question.',
    note:'Optionally add product groups or brands you want to distribute.',
    company:'Company / business name', person:'Contact person', telephone:'Phone number',
    taxOffice:'Tax office (optional)', taxNumber:'Tax number (optional)'
  } : {
    steps:['İletişim','Firma','Belgeler'], next:'Devam et', back:'Önceki',
    file:'Dosya seç', empty:'Henüz dosya seçilmedi', count:n=>n+' dosya seçildi',
    details:'PDF, JPG veya PNG · En fazla 5 dosya · Dosya başına 10 MB',
    question:'Örn. Bosch U072 Condense için hangi pompa modeli uyumludur?',
    request:'Aradığınız parça, stok kodu veya uyumluluk sorunuzu yazın.',
    note:'İlgilendiğiniz ürün gruplarını veya markaları belirtebilirsiniz.',
    company:'Firma / unvan', person:'Yetkili adı soyadı', telephone:'Telefon',
    taxOffice:'Vergi dairesi (isteğe bağlı)', taxNumber:'Vergi numarası (isteğe bağlı)'
  };
  const textIfChanged = (node, value) => {
    if (node && node.textContent !== value) node.textContent = value;
  };
  const placeholder = (root, selector, value) => {
    const node = root.querySelector(selector);
    if (node && node.placeholder !== value) node.placeholder = value;
  };
  const create = (tag, className, text='') => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const decorateApplication = root => {
    const form = root.querySelector('form.ya-widget-form');
    if (!form || !form.querySelector('[name="company_name"]') || form.dataset.teknikelWizard === '1') return;
    form.dataset.teknikelWizard = '1';
    form.classList.add('teknikel-application');
    const picker = form.querySelector('input[data-document-picker]');
    const fieldset = picker?.closest('fieldset') || form.querySelector('fieldset');
    const originalChildren = [...form.children];
    const steps = copy.steps.map((title,index) => {
      const panel = create('div','teknikel-form-step');
      panel.dataset.teknikelStep = String(index+1);
      panel.hidden = index !== 0;
      return panel;
    });
    for (const child of originalChildren) {
      const field = child.querySelector?.('input[name],textarea[name]') || null;
      const name = field?.name;
      const index = ['company_name','authorized_person','customer_phone','email'].includes(name) ? 0
        : ['tax_office','tax_number','message'].includes(name) ? 1 : 2;
      steps[index].append(child);
    }
    for (const [name,value] of [
      ['company_name',copy.company],['authorized_person',copy.person],
      ['customer_phone',copy.telephone],['tax_office',copy.taxOffice],
      ['tax_number',copy.taxNumber]
    ]) {
      const label = form.querySelector('[name="'+name+'"]')?.closest('label');
      if (label) textIfChanged(label.querySelector('span'),value);
    }
    placeholder(form,'textarea[name="message"]',copy.note);
    const progress = create('div','teknikel-form-progress');
    progress.setAttribute('role','group');
    progress.setAttribute('aria-label',locale==='en'?'Application steps':'Başvuru aşamaları');
    const markers = copy.steps.map((title,index) => {
      const marker = create('span','teknikel-form-progress-item');
      const number = create('span','teknikel-form-progress-number',String(index+1));
      number.setAttribute('aria-hidden','true');
      marker.append(number,create('span','teknikel-form-progress-label',title));
      progress.append(marker);
      return marker;
    });
    form.before(progress);
    let current = 0;
    const show = index => {
      current = index;
      steps.forEach((step,i) => {step.hidden=i!==current;});
      markers.forEach((marker,i) => {
        marker.classList.toggle('is-current',i===current);
        marker.classList.toggle('is-complete',i<current);
        if(i===current)marker.setAttribute('aria-current','step');
        else marker.removeAttribute('aria-current');
      });
    };
    const navButton = (label,style,action) => {
      const button = create('button','teknikel-form-nav '+style,label);
      button.type='button';
      button.addEventListener('click',action);
      return button;
    };
    const next = () => {
      const invalid = [...steps[current].querySelectorAll('input,textarea,select')].find(field=>!field.checkValidity());
      if(invalid) {invalid.reportValidity();invalid.focus();return;}
      show(Math.min(2,current+1));
    };
    const firstFooter = create('div','teknikel-form-footer');
    firstFooter.append(navButton(copy.next,'teknikel-form-next',next));
    steps[0].append(firstFooter);
    const secondFooter = create('div','teknikel-form-footer');
    secondFooter.append(navButton(copy.back,'teknikel-form-previous',()=>show(0)),navButton(copy.next,'teknikel-form-next',next));
    steps[1].append(secondFooter);
    const thirdFooter = create('div','teknikel-form-footer');
    const originalSubmit=steps[2].querySelector('button[type="submit"]');
    thirdFooter.append(navButton(copy.back,'teknikel-form-previous',()=>show(1)));
    // Move the same canonical submit node; keep its native form ownership and event wiring.
    if(originalSubmit)thirdFooter.append(originalSubmit);
    steps[2].append(thirdFooter);
    form.append(...steps);
    form.addEventListener('submit',event=>{
      if(current===2)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      next();
    },true);
    if(picker && fieldset) {
      const pickerLabel=picker.closest('label');
      if(pickerLabel) {
        pickerLabel.classList.add('teknikel-file-label');
        textIfChanged(pickerLabel.querySelector('span'),locale==='en'?'Attachments':'Belge ekle');
        const fileButton=create('span','teknikel-file-button',copy.file);
        fileButton.setAttribute('aria-hidden','true');
        const fileStatus=create('span','teknikel-file-selection',copy.empty);
        fileStatus.setAttribute('role','status');
        fileStatus.setAttribute('aria-live','polite');
        const hint=create('small','teknikel-file-hint',copy.details);
        picker.insertAdjacentElement('beforebegin',fileButton);
        picker.insertAdjacentElement('afterend',fileStatus);
        pickerLabel.append(hint);
        // Canonical document handling stores accepted files and clears the native input.
        // Read only its published selection list; never duplicate or replace that logic.
        const selected=fieldset.querySelector('[data-document-list]');
        const syncFiles=()=>{
          const items=selected ? [...selected.children] : [];
          textIfChanged(fileStatus,items.length===0 ? copy.empty : copy.count(items.length));
        };
        if(selected)new MutationObserver(syncFiles).observe(selected,{childList:true,subtree:true});
        picker.addEventListener('change',syncFiles);
        syncFiles();
      }
    }
    show(0);
  };
  const decorate = root => {
    const title = root.querySelector('#ya-widget-title');
    if (title) {
      const nodes = [...title.childNodes].filter(node => node.nodeType === Node.TEXT_NODE);
      const value = language.text('theme.teknikel.support.title');
      if (nodes.length) {
        if (nodes[0].data !== value) nodes[0].data = value;
        nodes.slice(1).forEach(node => node.remove());
      } else title.append(document.createTextNode(value));
    }
    for(const back of root.querySelectorAll('.ya-widget-content button:not([class])')) {
      if(['Geri','Back'].includes(back.textContent.trim()))back.classList.add('teknikel-widget-back');
    }
    // Only sector-specific placeholders; preserve the canonical prompt wiring.
    placeholder(root,'.ya-widget-content textarea[name="message"][placeholder*="masa"]',copy.question);
    const generalForm=root.querySelector('form.ya-widget-form input[name="customer_name"]');
    if (generalForm) placeholder(generalForm.closest('form'),'textarea[name="message"]',copy.request);
    decorateApplication(root);
    const actions = root.querySelector('.ya-widget-actions');
    if (actions) {
      const priority = button => {
        if (button.dataset.yaRequestType === 'general_info') return 0;
        if (button.dataset.yaRequestType === 'dealer_application') return 1;
        if (button.dataset.yaView === 'whatsapp') return 2;
        if (button.dataset.yaView === 'directions') return 3;
        return 4;
      };
      const original = [...actions.children];
      const sorted = [...original].sort((a,b)=>priority(a)-priority(b));
      if(sorted.some((node,i)=>node!==original[i]))sorted.forEach(node=>actions.append(node));
    }
    document.querySelectorAll('[data-theme-widget-trigger]').forEach(button=>{
      button.hidden=!window.YardimciAsistanWidget||root.hidden;
    });
  };
  const attach = () => {
    const root = document.getElementById('yardimci-asistan-widget');
    if(!root)return false;
    discoveryObserver?.disconnect();
    widgetObserver?.disconnect();
    decorate(root);
    widgetObserver=new MutationObserver(()=>decorate(root));
    widgetObserver.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
    return true;
  };
  if(!attach()){
    discoveryObserver=new MutationObserver(attach);
    discoveryObserver.observe(document.body,{childList:true});
  }
  // The same delegated gallery controller owns home (PHP) and catalog (JS) cards.
  // Cards are allowed to be replaced by the catalog without re-attaching listeners.
  document.addEventListener('click',event=>{
    const stepButton=event.target.closest?.('[data-gallery-step]');
    const gallery=stepButton?.closest('.teknikel-gallery');
    if(!gallery)return;
    let urls;
    try { urls=JSON.parse(gallery.dataset.galleryImages); } catch { return; }
    if(!Array.isArray(urls)||urls.length<2||urls.some(url=>typeof url!=='string'))return;
    const picture=gallery.querySelector('.teknikel-gallery-image-link img');
    if(!picture)return;
    const step=Number(stepButton.dataset.galleryStep);
    if(![-1,1].includes(step))return;
    const current=Number(gallery.dataset.galleryIndex)||0;
    const next=(current+step+urls.length)%urls.length;
    gallery.dataset.galleryIndex=String(next);
    picture.hidden=false;
    picture.src=urls[next];
    picture.alt=gallery.dataset.galleryName+' · '+(next+1)+' / '+urls.length;
    const label=gallery.querySelector('.teknikel-gallery-count');
    if(label)label.textContent=(next+1)+' / '+urls.length;
  });
  document.addEventListener('error',event=>{
    const picture=event.target;
    if(!(picture instanceof HTMLImageElement)||!picture.closest('.teknikel-gallery'))return;
    picture.hidden=true;
    const fallback=picture.closest('.teknikel-gallery-image-link')?.querySelector('.teknikel-gallery-missing');
    if(fallback)fallback.hidden=false;
  },true);
  document.addEventListener('load',event=>{
    const picture=event.target;
    if(!(picture instanceof HTMLImageElement)||!picture.closest('.teknikel-gallery'))return;
    picture.hidden=false;
    const fallback=picture.closest('.teknikel-gallery-image-link')?.querySelector('.teknikel-gallery-missing');
    if(fallback)fallback.hidden=true;
  },true);
  window.addEventListener('pagehide',()=>{
    discoveryObserver?.disconnect();
    widgetObserver?.disconnect();
  });
  window.addEventListener('pageshow',event=>{if(event.persisted){attach();updateStickyClearance();}});
}
