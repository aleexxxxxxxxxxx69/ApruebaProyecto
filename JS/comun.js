// JS/comun.js

// --- carrito simple en memoria ---
const cart = [];
let currentProduct = null;

function updateCartCount() {
  const span = document.getElementById("cartCount");
  if (span) span.textContent = String(cart.length);
}

function toggleCartModal(show) {
  const m = document.getElementById("cartModal");
  if (!m) return;
  if (typeof show === "boolean") m.classList.toggle("active", show);
  else m.classList.toggle("active");
}

function renderCart() {
  const box = document.getElementById("cartItems");
  if (!box) return;
  if (cart.length === 0) {
    box.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-text">El cistell està buit</div>
        <div class="empty-cart-subtext">Afegeix alguns productes per començar</div>
      </div>
    `;
    return;
  }
  let total = 0;
  box.innerHTML = cart.map((p, i) => {
    total += p.price;
    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">${p.price}€</div>
        </div>
        <button class="remove-item" onclick="removeFromCart(${i})" title="Eliminar">×</button>
      </div>
    `;
  }).join("") + `
    <div class="cart-summary">
      <div class="cart-summary-row"><span>Subtotal:</span><span>${total}€</span></div>
      <div class="cart-summary-row"><span>Enviament:</span><span class="free">GRATUÏT</span></div>
      <div class="cart-total"><span>Total:</span><span>${total}€</span></div>
    </div>
  `;
}
function removeFromCart(i){ cart.splice(i,1); updateCartCount(); renderCart(); }
function clearCart(){ if(cart.length && confirm("Estàs segur que vols buidar el cistell?")){ cart.length=0; updateCartCount(); renderCart(); } }
function checkout(){ if(!cart.length){ alert("El cistell està buit!"); return; } document.getElementById("checkoutPopup").style.display="flex"; }
function closeCheckoutPopup(){ document.getElementById("checkoutPopup").style.display="none"; }

// --- modal de producto ---
function openProductModal(p){
  currentProduct = p;
  document.getElementById("modalName").textContent = p.name;
  document.getElementById("modalDesc").textContent = p.description || "";
  document.getElementById("modalPrice").textContent = (p.price||0) + "€";
  const thumb = document.getElementById("modalThumb");
  thumb.innerHTML = p.image ? `<img src="${p.image}" alt="${p.name}" />` : "";
  document.getElementById("productModal").classList.add("active");
}
function closeProductModal(){ document.getElementById("productModal").classList.remove("active"); }
function addCurrentToCart(){
  if(!currentProduct) return;
  cart.push(currentProduct);
  updateCartCount(); renderCart();
  const btn = document.getElementById("modalAddBtn");
  btn.innerHTML = '<span class="btn-text">Afegit!</span>';
  btn.classList.add("added");
  setTimeout(()=>{ btn.innerHTML='<span class="btn-text">Afegir al Cistell</span>'; btn.classList.remove("added"); }, 1000);
}

// --- adaptador de datos (para que funcione con TU data.js tal cual) ---
function normalizeProduct(p){
  // nombre
  const name = p.name || p.nombre || p.title || "Producte";
  // categoria
  const category = p.category || p.categoria || p.type || "altres";
  // precio
  const price = Number(p.price ?? p.precio ?? 0);
  // descripción
  const description = p.description || p.descripcion || p.desc || "";
  // imagen
  const image = p.image || p.img || p.foto || p.thumbnail || "";

  return {
    id: p.id ?? cryptoRandomId(),
    name, category, price, description, image,
    // conservamos lo demás por si alguien lo quiere usar
    ...p
  };
}
function cryptoRandomId(){
  return Math.random().toString(36).slice(2);
}

function getAllProductsFromData(){
  // Acepta PRODUCTS o products
  const raw = (typeof PRODUCTS !== "undefined" ? PRODUCTS : (typeof products !== "undefined" ? products : []));
  return raw.map(normalizeProduct);
}

// --- render tarjetas ---
function renderProductsSimple(list, gridId){
  const grid = document.getElementById(gridId);
  grid.innerHTML = "";
  if(!list.length){
    grid.innerHTML = '<div class="no-results">No hi ha productes</div>';
    return;
  }
  list.forEach(p=>{
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-thumb">${p.image ? `<img src="${p.image}" alt="${p.name}">` : ""}</div>
      <div class="product-badge">NOU</div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${p.price}€</div>
        <button class="see-details">Veure detalls</button>
      </div>
    `;
    card.querySelector(".see-details").addEventListener("click",(e)=>{ e.stopPropagation(); openProductModal(p); });
    grid.appendChild(card);
  });
}

// --- buscador ---
function attachSearchInput(sourceArray, gridId){
  const input = document.getElementById("searchInput");
  if(!input) return;
  input.addEventListener("input",(e)=>{
    const q = e.target.value.toLowerCase();
    const filtered = sourceArray.filter(p =>
      (p.name||"").toLowerCase().includes(q) ||
      (p.description||"").toLowerCase().includes(q)
    );
    renderProductsSimple(filtered, gridId);
  });
}

// --- listeners comunes ---
window.addEventListener("DOMContentLoaded", ()=>{
  // carrito
  document.getElementById("cartBtn")?.addEventListener("click", ()=>{ toggleCartModal(); renderCart(); });
  document.getElementById("closeCart")?.addEventListener("click", ()=> toggleCartModal(false));
  document.getElementById("clearCartBtn")?.addEventListener("click", clearCart);
  document.getElementById("checkoutBtn")?.addEventListener("click", checkout);
  document.getElementById("closeCheckout")?.addEventListener("click", closeCheckoutPopup);

  // modal
  document.getElementById("closeProductModal")?.addEventListener("click", closeProductModal);
  document.getElementById("modalAddBtn")?.addEventListener("click", addCurrentToCart);

  updateCartCount();
});
