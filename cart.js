// ======= Catálogo de productos (id -> datos) =======
const PRODUCT_CATALOG = {
  1: { nombre: "Anillo Elegance", precio: 349.99, img: "image.jpg" },
  2: { nombre: "Anillo Royal", precio: 429.99, img: "image.jpg" },
  3: { nombre: "Pulsera Sparkle", precio: 289.99, img: "image.jpg" },
  4: { nombre: "Pulsera Diamond", precio: 389.99, img: "image.jpg" },
  5: { nombre: "Pendientes Shine", precio: 259.99, img: "image.jpg" },
  6: { nombre: "Pendientes Luxury", precio: 329.99, img: "image.jpg" }
};

const CART_KEY = "cart";

// ======= utilidades de carrito =======
function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    localStorage.removeItem(CART_KEY);
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ======= contador en botón Carrito =======
function updateCartCount() {
  const cart = getCart();
  const countSpan = document.getElementById("cartCount");
  if (countSpan) countSpan.textContent = cart.length;  // nº productos distintos
}

// ======= añadir producto al carrito (cantidad inicial 1) =======
function addToCart(id) {
  const cart = getCart();
  const idx = cart.findIndex(item => item.id === id);

  if (idx === -1) {
    cart.push({ id, cantidad: 1 });
  } else {
    cart[idx].cantidad += 1;
  }

  saveCart(cart);
  updateCartCount();
  showCartToast("Producto añadido al carrito");
}

// ======= render completo del carrito =======
function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");

  if (!container || !subtotalEl || !totalEl) return;

  updateCartCount();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <h2>🛒 Tu carrito está vacío</h2>
        <p>Cuando añadas productos desde la tienda aparecerán aquí.</p>
      </div>
    `;
    subtotalEl.textContent = "0.00 €";
    totalEl.textContent = "0.00 €";
    return;
  }

  let html = "";
  let subtotal = 0;

  cart.forEach(item => {
    const data = PRODUCT_CATALOG[item.id];
    if (!data) return;

    const precio = Number(data.precio) || 0;
    // Normaliza cantidad: si viene 0 o undefined, muéstralo como 1
    let cantidad = Number(item.cantidad);
    if (!cantidad || cantidad < 1) {
      cantidad = 1;
      item.cantidad = 1;           // actualiza también en memoria
    }
    const lineTotal = precio * cantidad;
    subtotal += lineTotal;

    html += `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image dynamic-image"
             style="background-image:url('${data.img}'); background-size:cover; background-position:center;"></div>
        <div class="cart-item-details">
          <h3>${data.nombre}</h3>
          <span class="cart-item-price">${precio.toFixed(2)} €</span>
          <div class="quantity-controls">
            <button onclick="changeQty(${item.id}, -1)">-</button>
            <span>${cantidad}</span>
            <button onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Eliminar</button>
      </div>
    `;
  });

  // Guarda posibles normalizaciones de cantidad
  saveCart(cart);

  container.innerHTML = html;
  subtotalEl.textContent = subtotal.toFixed(2) + " €";
  totalEl.textContent = subtotal.toFixed(2) + " €";
}

// ======= cambiar cantidad (+/-) =======
function changeQty(id, delta) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === id);
  if (idx === -1) return;

  const current = Number(cart[idx].cantidad) || 0;
  cart[idx].cantidad = current + delta;

  if (cart[idx].cantidad <= 0) {
    cart.splice(idx, 1);
  }

  saveCart(cart);
  renderCart();
}

// ======= eliminar producto completo =======
function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
  showCartToast("Producto eliminado del carrito");
}

// ======= toast flotante =======
function showCartToast(msg) {
  let toast = document.querySelector(".cart-toast");
  if (toast) toast.remove();

  toast = document.createElement("div");
  toast.className = "cart-toast";
  toast.innerText = msg;
  document.body.appendChild(toast);

  setTimeout(() => (toast.style.opacity = "1"), 50);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 600);
  }, 1500);
}

// ======= checkout (placeholder) =======
function checkout() {
  showCartToast("Función de compra próximamente");
}

// ======= inicialización (NO borra el carrito) =======
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cartItems")) {
    renderCart();      // página carrito
  } else {
    updateCartCount(); // resto de páginas
  }
});
