// Presentation only: retain canonical lifecycle, authorization and form owners.
export function mount({language}) {
  let widgetObserver;
  let discoveryObserver;
  const setText = (selector, key, root) => {
    const node = root.querySelector(selector);
    const text = language.text(key);
    if (node && node.textContent !== text) node.textContent = text;
  };
  const decorate = root => {
    const title = root.querySelector('#ya-widget-title');
    if (title) {
      // Replace only the title text, preserving an optional canonical brand mark.
      const nodes = [...title.childNodes].filter(node => node.nodeType === Node.TEXT_NODE);
      const text = language.text('theme.teknikel.support.title');
      if (nodes.length) {
        if (nodes[0].data !== text) nodes[0].data = text;
        nodes.slice(1).forEach(node => node.remove());
      } else title.append(document.createTextNode(text));
    }
    // Leave the identity and the live Nexa avatar intact; change home copy only.
    if (root.querySelector('.ya-widget-home')) {
      setText('.ya-widget-welcome .ya-widget-kicker', 'theme.teknikel.support.title', root);
      setText('.ya-widget-welcome p', 'theme.teknikel.support.text', root);
    }
    // Move existing buttons, keeping DOM, focus and visual order consistent.
    const actions = root.querySelector('.ya-widget-actions');
    if (actions) {
      const priority = button => {
        if (button.dataset.yaRequestType === 'general_info') return 0;
        if (button.dataset.yaRequestType === 'dealer_application') return 1;
        if (button.dataset.yaView === 'whatsapp') return 2;
        if (button.dataset.yaView === 'directions') return 3;
        return 4;
      };
      const current = [...actions.children];
      const sorted = [...current].sort((a,b) => priority(a) - priority(b));
      if (sorted.some((node, index) => node !== current[index])) sorted.forEach(node => actions.append(node));
    }
    document.querySelectorAll('[data-theme-widget-trigger]').forEach(button => {
      button.hidden = !window.YardimciAsistanWidget || root.hidden;
    });
  };
  const attach = () => {
    const root = document.getElementById('yardimci-asistan-widget');
    if (!root) return false;
    discoveryObserver?.disconnect();
    widgetObserver?.disconnect();
    decorate(root);
    widgetObserver = new MutationObserver(() => decorate(root));
    widgetObserver.observe(root, {childList:true, subtree:true, attributes:true, attributeFilter:['hidden']});
    return true;
  };
  if (!attach()) {
    discoveryObserver = new MutationObserver(attach);
    discoveryObserver.observe(document.body, {childList:true});
  }
  window.addEventListener('pagehide', () => {
    discoveryObserver?.disconnect();
    widgetObserver?.disconnect();
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) attach();
  });
}
