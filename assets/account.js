import {request,money} from './commerce.js';
import {t,locale} from './language.js';

const messages = {
  invalid_oauth_state:'Giriş denemesi geçersiz veya süresi dolmuş. Yeniden deneyin.',
  provider_cancelled:'Sağlayıcı girişi iptal edildi.',
  customer_link_pending:'Müşteri hesabı işletmeyle eşitleniyor. Lütfen daha sonra tekrar deneyin.',
  online_sales_disabled:'Bu işletmede Online Satış kapalı. Hesap erişimi şu anda kullanılamıyor.',
  mail_unconfigured:'E-posta hizmeti henüz yapılandırılmadı. İşletmeyle iletişime geçin.',
  mail_unavailable:'E-posta gönderilemedi. Daha sonra yeniden deneyin.',
  invalid_credentials:'E-posta veya şifre hatalı.',
  email_verification_required:'E-posta adresinizi doğrulayın. Doğrulama e-postasını yeniden almak için Şifremi unuttum alanını kullanın.',
  invalid_token:'Bağlantı geçersiz, kullanılmış veya süresi dolmuş.',
  invalid_password:'Şifreniz 12–72 bayt uzunluğunda olmalı.',
  invalid_email:'Geçerli bir e-posta adresi girin.',
  invalid_name:'Adınızı ve soyadınızı girin.',
  try_later:'Çok fazla deneme yapıldı. Bir süre sonra yeniden deneyin.',
  account_exists_link_required:'Bu e-posta ile bir hesap var. Önce o hesaba giriş yapın, sonra giriş yöntemini bağlayın.',
  identity_conflict:'Bu giriş yöntemi başka bir hesaba bağlı.',
  provider_unconfigured:'Bu giriş sağlayıcısı henüz yapılandırılmadı.',
  provider_email_required:'Sağlayıcı e-posta paylaşmadı. E-posta/şifre hesabınıza giriş yapıp sağlayıcıyı bağlayın.',
  provider_failed:'Sağlayıcı girişi tamamlanamadı. Yeniden deneyin.',
  reauthentication_required:'Bu işlem için yeniden giriş yapın.',
};
export async function accountRequest(action,body) { return request('account/' + action,body); }
function node(tag,text,className) { const el = document.createElement(tag); if (text) el.textContent = t(text); if (className) el.className = className; return el; }
export function initAccount() {
  const root = document.querySelector('[data-account-root]'), status = document.querySelector('[data-login-state]');
  let account = null, config = null, busy = false, generation = 0, memoryLock = false;
  function isLocked() { try { return memoryLock || Boolean(localStorage.getItem('teknikel.account.lock')); } catch { return memoryLock; } }
  function setLock(value) { memoryLock = value; try { if(value) localStorage.setItem('teknikel.account.lock','1'); else localStorage.removeItem('teknikel.account.lock'); } catch {} }
  const notify = message => { if (status) status.textContent = t(message); };
  const signal = name => document.dispatchEvent(new CustomEvent(name,{detail:account}));
  function locked() { account = null; signal('account:locked'); }
  const run = fn => async event => {
    event?.preventDefault(); if (busy) return; busy = true;
    root?.querySelectorAll('button').forEach(button => { button.disabled = true; });
    try { await fn(); }
    catch (error) { if (error.status === 403 || error.status === 401) { locked(); await load(); } notify(messages[error.code] || error.message || 'İşlem tamamlanamadı. Lütfen tekrar deneyin.'); }
    finally { busy = false; root?.querySelectorAll('button').forEach(button => { button.disabled = false; }); }
  };
  function button(parent,text,fn) { const button = node('button',text,'btn btn-outline'); button.type = 'button'; button.addEventListener('click',run(fn)); parent.append(button); return button; }
  function form(title,fields,submit,fn) {
    const form = node('form',null,'account-form'); form.append(node('h2',title));
    for (const [name,label,type] of fields) {
      const wrap = node('label',label); const input = node('input'); input.name = name; input.type = type; input.required = true;
      input.maxLength = type === 'password' ? 72 : 254; if (type === 'password') input.minLength = 12;
      input.autocomplete = name === 'fullName' ? 'name' : type === 'email' ? 'email' : title === 'Giriş yap' ? 'current-password' : 'new-password';
      wrap.append(input); form.append(wrap);
    }
    const submitButton = node('button',submit,'btn btn-red'); submitButton.type = 'submit'; form.append(submitButton);
    form.addEventListener('submit',run(async () => { const values = Object.fromEntries(new FormData(form)); await fn(values); form.querySelectorAll('input[type=password]').forEach(input => { input.value = ''; }); }));
    return form;
  }
  async function load() {
    const current = ++generation;
    try {
      config = await request('account/config'); if (current !== generation) return;
      document.querySelectorAll('[data-account-only]').forEach(el => { el.hidden = !config.enabled; });
      if (!root) return;
      root.hidden = false; root.replaceChildren();
      if (!config.enabled) { locked(); notify(messages.online_sales_disabled); return; }
      const fragment = new URLSearchParams(location.hash.slice(1)); const token = fragment.get('token'); const action = new URLSearchParams(location.search).get('action');
      if (token && ['verify','reset'].includes(action)) {
        history.replaceState(null,'',location.pathname + location.search);
        root.append(form(action === 'verify' ? 'E-postayı doğrula' : 'Yeni şifre', [['password','Yeni şifre','password']], 'Kaydet', async values => {
          await request('account/' + action,{...values,token}); history.replaceState(null,'',location.pathname); notify('Kaydedildi. Hesabınıza giriş yapabilirsiniz.'); await load();
        })); return;
      }
      if (!isLocked()) {
        try { account = (await accountRequest('session')).account; }
        catch (error) { if (error.status !== 401) throw error; locked(); }
      }
      if (current !== generation) return;
      if (account) {
        notify(''); signal('account:ready');
        root.append(node('p',account.email));
        root.append(form('Müşteri profili',[['fullName','Ad soyad','text']],'Kaydet',async values => { await accountRequest('profile',values); notify('Profiliniz kaydedildi.'); }));
        root.querySelector('[name=fullName]').value = account.fullName;
        const actions = node('div',null,'account-actions'); root.append(actions);
        for (const provider of config.providers || []) if (!account.methods.includes(provider)) button(actions,provider === 'google' ? 'Google hesabını bağla' : 'Facebook hesabını bağla', async () => { const result = await accountRequest('oauth',{provider,link:true}); location.assign(result.url); });
        button(actions,'Oturumu kapat',async () => { setLock(true); locked(); root.replaceChildren(); try { await request('account/logout',{}); await load(); notify('Oturumunuz kapatıldı.'); } catch { await load(); notify('Özel görünüm kapatıldı; sunucudaki çıkış doğrulanamadı. Oturumu kapatmayı tekrar deneyin.'); } });
        if(config.passwordRegistration)button(actions,'Şifre oluştur veya değiştir',async () => { await accountRequest('recover',{email:account.email}); notify('Hesap mevcutsa e-posta gönderildi. E-posta kutunuzu kontrol edin.'); });
        button(actions,'Tüm cihazlardan çıkış yap',async () => { await accountRequest('logout-all',{}); locked(); await load(); });
        if (!account.dealer) root.append(node('p','Normal müşteri hesabınız açık. Bayi yetkisi için işletmeyle iletişime geçin.'));
        if (!account.dealer) {
        const orders = node('section'); orders.append(node('h2','Siparişlerim')); root.append(orders);
        const history = await accountRequest('orders'); if (current !== generation) return;
        if (!history.orders?.length) orders.append(node('p','Henüz siparişiniz yok.'));
        for (const order of history.orders || []) {
          const row = node('article',null,'account-order'); row.append(node('strong',order.order_id), node('p',({awaiting_desktop:'İşletmeye aktarım bekliyor',placed:'Alındı',confirmed:'Onaylandı',fulfilled:'Tamamlandı',cancelled:'İptal',rejected:'Reddedildi'})[order.status] || order.status));
          if (Number.isFinite(order.total)) row.append(node('p',money(order.total,order.currency)));
          if (Number.isFinite(Date.parse(order.created_at))) row.append(node('time',new Date(order.created_at).toLocaleString(locale)));
          orders.append(row);
        }
        }
      } else {
        const forms = node('div',null,'account-forms'); root.append(forms);
        forms.append(form('Giriş yap',[['email','E-posta','email'],['password','Şifre','password']],'Giriş yap',async values => { await request('account/login',values); setLock(false); await load(); }));
        if (config.passwordRegistration) forms.append(form('Hesap oluştur',[['fullName','Ad soyad','text'],['email','E-posta','email'],['password','Şifre','password']],'Hesap oluştur',async values => { await request('account/register',values); notify('E-posta kutunuzu kontrol edin. Doğrulama bağlantısı gönderildi.'); }));
        else root.append(node('p',messages.mail_unconfigured));
        const social = node('div',null,'account-actions'); root.append(social);
        for (const provider of config.providers || []) button(social,provider === 'google' ? 'Google ile giriş' : 'Facebook ile giriş',async () => { const result = await request('account/oauth',{provider}); setLock(false); location.assign(result.url); });
        if (config.passwordRegistration) root.append(form('Şifremi unuttum',[['email','E-posta','email']],'Bağlantı gönder',async values => { await request('account/recover',values); notify('Hesap mevcutsa e-posta gönderildi. E-posta kutunuzu kontrol edin.'); }));
      }
    } catch (error) { locked(); notify(messages[error.code] || error.message); }
  }
  document.querySelector('[data-account-local]')?.addEventListener('click',run(async () => {
    setLock(true); locked();
    try { await request('account/logout',{}); } finally { await load(); }
  }));
  window.addEventListener('storage',event => { if (event.key === 'teknikel.account.lock') { memoryLock=event.newValue==='1'; locked(); load(); } });
  async function validate() {
    if (document.hidden || busy) return;
    const current = generation;
    try {
      const next = await request('account/config'); if(current !== generation)return;
      document.querySelectorAll('[data-account-only]').forEach(el => { el.hidden = !next.enabled; });
      if (!next.enabled) { config=next; locked(); root?.replaceChildren(); notify(messages.online_sales_disabled); return; }
      if (config?.enabled !== next.enabled) { await load(); return; }
      if (account && !isLocked()) {
        const checked = (await accountRequest('session')).account; if(current !== generation)return;
        if (checked.id !== account.id || Boolean(checked.dealer) !== Boolean(account.dealer) || checked.dealer?.access_id !== account.dealer?.access_id) { locked(); await load(); }
      }
    } catch(error) { if(current===generation && [401,403].includes(error.status)) { locked(); root?.replaceChildren(); await load(); notify(messages[error.code] || 'Hesabınıza yeniden giriş yapın.'); } }
  }
  document.addEventListener('visibilitychange',validate);
  document.addEventListener('account:revalidate',validate);
  setInterval(validate,30000);
  const callbackError=new URLSearchParams(location.search).get('account_error') || new URLSearchParams(location.search).get('notice');
  load().then(() => { if(callbackError)notify(messages[callbackError] || 'İşlem tamamlanamadı. Lütfen tekrar deneyin.'); });
}
