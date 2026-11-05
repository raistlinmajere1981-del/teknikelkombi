// Deliberately different markup; no Teknikel selectors or business rules.
(() => {
  const client = window.TESTCommerce = window.YaCommerce.create({apiBase:document.currentScript.dataset.apiBase});
  client.subscribe(state => {
    const body = document.querySelector('[data-independent-catalog] tbody'); body.replaceChildren();
    if (state.catalogStatus === 'ready') for (const product of state.products) {
      const row = document.createElement('tr'); row.dataset.id = product.product_id;
      for (const value of [product.name,product.price]) { const cell = document.createElement('td'); cell.textContent = value; row.append(cell); }
      const cell = document.createElement('td'), add = document.createElement('button'); add.textContent = 'TEST add';
      add.disabled = !state.canEdit; add.addEventListener('click',() => client.add(product.product_id)); cell.append(add); row.append(cell); body.append(row);
    }
    document.querySelector('[data-independent-cart]').textContent = String(state.cart.length);
    document.querySelector('[data-independent-message]').textContent = state.receipt?.order_id || state.submissionMessage;
    document.querySelector('[data-independent-order]').disabled = !state.canSubmit;
  });
  document.querySelector('[data-independent-order]').addEventListener('click',() => client.submit({name:'TEST buyer',phone:'+905550000000'}));
  client.start();
})();
