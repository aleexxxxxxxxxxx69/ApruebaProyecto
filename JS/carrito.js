let cart = [];

function addToCartFromModal(productId) {
  const product = products.find(p => p.id === productId);
  cart.push(product);
  updateCartCount();
  const button = document.getElementById('modalAddToCart');
  button.innerHTML = '<span class="btn-text">Afegit!</span>';
  button.classList.add('added');
  setTimeout(() => {
    button.innerHTML = '<span class="btn-text">Afegir al Cistell</span>';
    button.classList.remove('added');
  }, 1500);
  const cartCount = document.getElementById('cartCount');
  cartCount.classList.add('bump');
  setTimeout(() => cartCount.classList.remove('bump'), 300);
}

function updateCartCount() {
  document.getElementById('cartCount').textContent = cart.length;
}

function toggleCart() {
  document.getElementById('cartModal').classList.toggle('active');
  renderCart();
}

function closeCartOutside(event) {
  if (event.target.id === "cartModal") toggleCart();
}

function renderCart() {
  const container = document.getElementById('cartItems');
  if (cart.length === 0) {
    container.innerHTML = `<div class="empty-cart"><div class="empty-cart-text">El cistell està buit</div><div class="empty-cart-subtext">Afegeix alguns productes per començar</div></div>`;
    return;
  }
  let total = 0;
  let html = '<div class="cart-items-list">';
  cart.forEach((item, index) => {
    total += item.price;
    html += `<div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">€${item.price}</div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${index})" title="Eliminar">×</button>
    </div>`;
  });
  html += `</div>
    <div class="cart-summary">
      <div class="cart-summary-row"><span>Subtotal</span><span>€${total}</span></div>
      <div class="cart-summary-row"><span>Enviament</span><span class="free">GRATUT</span></div>
      <div class="cart-total"><span>Total</span><span>€${total}</span></div>
    </div>`;
  container.innerHTML = html;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  renderCart();
}

function clearCart() {
  if (cart.length === 0) return;
  if (confirm("Estàs segur que vols buidar el cistell?")) {
    cart = [];
    updateCartCount();
    renderCart();
  }
}

function checkout() {
  if (cart.length === 0) {
    alert("El cistell està buit!");
    return;
  }
  document.getElementById('checkoutPopup').style.display = 'flex';
}

function closeCheckoutPopup() {
  document.getElementById('checkoutPopup').style.display = 'none';
}
