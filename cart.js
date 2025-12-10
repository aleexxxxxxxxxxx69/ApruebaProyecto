// ======= Catálogo de productos con modelos 3D =======
const PRODUCT_CATALOG = {
  1: { nombre: "Anillo JAVA", precio: 349.99, model: "anillo1.glb" },
  2: { nombre: "Anillo FLUTTER ", precio: 429.99, model: "anilloplata2.glb" },
  3: { nombre: "Pulsera BLENDER", precio: 289.99, model: "pulseraplata1.glb" },
  4: { nombre: "Pulsera Diamond", precio: 389.99, model: "pulseraplata2.glb" },
  5: { nombre: "Pendientes SHINY", precio: 259.99, model: "pendientesplata1.glb" },
  6: { nombre: "Pendientes SHINY PREMIUM", precio: 329.99, model: "pendientesplata2.glb" }
};

const CART_KEY = "cart";

// ======= Obtener carrito =======
function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(CART_KEY);
    return [];
  }
}

// ======= Guardar carrito =======
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ======= Actualizar contador del menú =======
function updateCartCount() {
  const cart = getCart();
  const span = document.getElementById("cartCount");
  if (span) span.textContent = cart.length;
}

// ======= Añadir al carrito =======
function addToCart(id) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === id);

  if (idx === -1) {
    cart.push({ id, cantidad: 1 });
  } else {
    cart[idx].cantidad++;
  }

  saveCart(cart);
  updateCartCount();
  showCartToast("Producto añadido al carrito");
}

// ======= Renderizar carrito =======
function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cartItems");  
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");

  if (!container) return;

  updateCartCount();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <h2>🛒 Tu carrito está vacío</h2><br>
        <p>Cuando añadas productos desde la tienda aparecerán aquí.</p>
      </div>`;
    subtotalEl.textContent = "0.00 €";
    totalEl.textContent = "0.00 €";
    return;
  }

  let html = "";
  let subtotal = 0;

  cart.forEach(item => {
    const data = PRODUCT_CATALOG[item.id];
    if (!data) return;

    const precio = data.precio;
    const cantidad = item.cantidad || 1;
    const lineTotal = precio * cantidad;

    subtotal += lineTotal;

    html += `
      <div class="cart-item" data-id="${item.id}">
        
        <div class="cart-item-image" style="width:130px; height:130px;">
          <model-viewer
            src="models/${data.model}"
            auto-rotate
            camera-controls
            disable-zoom
            style="width:100%; height:100%; background:#f8f5ef; border-radius:12px;">
          </model-viewer>
        </div>

        <div class="cart-item-details">
          <h3>${data.nombre}</h3>
          <span class="cart-item-price">${precio.toFixed(2)} €</span>
          
          <div class="quantity-controls">
            <button onclick="changeQty(${item.id}, -1)">-</button><br>
            <br><span>${cantidad}</span><br>
            <br><button onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>

        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Eliminar</button>
      </div>
    `;
  });

  container.innerHTML = html;
  subtotalEl.textContent = subtotal.toFixed(2) + " €";
  totalEl.textContent = subtotal.toFixed(2) + " €";
}

// ======= Cambiar cantidad =======
function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.cantidad += delta;
  if (item.cantidad <= 0) {
    saveCart(cart.filter(i => i.id !== id));
  } else {
    saveCart(cart);
  }

  renderCart();
}

// ======= Eliminar producto =======
function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
  renderCart();
  showCartToast("Producto eliminado");
}

// ======= Mini mensaje flotante =======
function showCartToast(msg) {
  let t = document.createElement("div");
  t.className = "cart-toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => (t.style.opacity = "1"), 20);
  setTimeout(() => {
    t.style.opacity = "0";
    setTimeout(() => t.remove(), 400);
  }, 1500);
}

// ======= Inicialización =======
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cartItems")) {
    renderCart();
  } else {
    updateCartCount();
  }
});
