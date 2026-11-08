const cart = [];
const el = id => document.getElementById(id);
const brl = value => value.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});

function refreshCart() {
  el('cartCount').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  el('cartTotal').textContent = brl(cart.reduce((sum, item) => sum + item.price * item.qty, 0));
  if (!cart.length) {
    el('cartItems').innerHTML = '<p class="empty">Seu carrinho está vazio.</p>';
    return;
  }
  el('cartItems').innerHTML = cart.map((item, index) => `
    <div class="cart-row">
      <div><b>${item.name}</b><br><small>${item.qty} × ${brl(item.price)}</small></div>
      <div>${brl(item.price * item.qty)}<br><button class="remove" data-remove="${index}">Remover</button></div>
    </div>`).join('');
}
function openCart() {
  el('cart').classList.add('open');
  el('shade').classList.add('show');
  el('cart').setAttribute('aria-hidden', 'false');
}
function closeCart() {
  el('cart').classList.remove('open');
  el('shade').classList.remove('show');
  el('cart').setAttribute('aria-hidden', 'true');
}
document.querySelectorAll('.add').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    const existing = cart.find(item => item.name === name);
    if (existing) existing.qty += 1;
    else cart.push({name, price, qty:1});
    refreshCart();
    openCart();
  });
});
el('cartOpen').addEventListener('click', openCart);
el('cartClose').addEventListener('click', closeCart);
el('shade').addEventListener('click', closeCart);
el('cartItems').addEventListener('click', event => {
  const removeButton = event.target.closest('[data-remove]');
  if (removeButton) {
    cart.splice(Number(removeButton.dataset.remove), 1);
    refreshCart();
  }
});
el('checkout').addEventListener('click', () => {
  if (!cart.length) {
    alert('Adicione pelo menos um produto ao carrinho.');
    return;
  }
  const lines = cart.map(item => `${item.qty}x ${item.name} — ${brl(item.price * item.qty)}`);
  const total = brl(cart.reduce((sum, item) => sum + item.price * item.qty, 0));
  const message = `Olá, Parceiros Burguês! Quero fazer este pedido:\n\n${lines.join('\n')}\n\nTotal: ${total}\n\nComo faço para confirmar?`;
  window.open(`https://wa.me/5583999722597?text=${encodeURIComponent(message)}`, '_blank');
});
el('menuToggle').addEventListener('click', () => el('nav').classList.toggle('show'));
document.querySelectorAll('#nav a').forEach(link => link.addEventListener('click', () => el('nav').classList.remove('show')));
refreshCart();
