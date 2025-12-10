/* ============================================================
   SHINYWEB - main.js
   ============================================================ */

const products = {
  1: {
    name: 'Anillo Elegance',
    price: 349.99,
    model: 'anillo1.glb',
    category: 'anillos',
    description: 'Anillo de oro blanco 18k con diamantes. Diseño elegante y atemporal perfecto para cualquier ocasión especial.',
    features: ['Oro blanco 18k', 'Diamantes certificados 0.5ct', 'Garantía de por vida', 'Estuche incluido']
  },
  2: {
    name: 'Anillo Royal',
    price: 429.99,
    model: 'anilloplata2.glb',
    category: 'anillos',
    description: 'Anillo de plata con diseño exclusivo. Pieza única inspirada en diseños reales.',
    features: ['Plata 925', 'Diseño exclusivo', 'Certificado de autenticidad', 'Ajuste gratuito']
  },
  3: {
    name: 'Pulsera Sparkle',
    price: 289.99,
    model: 'pulseraplata1.glb',
    category: 'pulseras',
    description: 'Pulsera de plata que brilla con cada movimiento. Perfecta para el día a día con elegancia.',
    features: ['Plata 925', 'Diseño brillante', 'Cierre de seguridad', 'Longitud ajustable']
  },
  4: {
    name: 'Pulsera Diamond',
    price: 389.99,
    model: 'pulseraplata2.glb',
    category: 'pulseras',
    description: 'Pulsera de lujo con diseño engastado. Diseño moderno y sofisticado.',
    features: ['Plata 925', 'Diseño premium', 'Diseño exclusivo', 'Grabado personalizado']
  },
  5: {
    name: 'Pendientes Shine',
    price: 259.99,
    model: 'pendientesplata1.glb',
    category: 'pendientes',
    description: 'Pendientes de plata elegantes. Elegancia clásica que nunca pasa de moda.',
    features: ['Plata 925', 'Diseño clásico', 'Cierre de seguridad', 'Hipoalergénicos']
  },
  6: {
    name: 'Pendientes Luxury',
    price: 329.99,
    model: 'pendientesplata2.glb',
    category: 'pendientes',
    description: 'Pendientes largos de plata. Lujo y distinción en cada detalle.',
    features: ['Plata 925', 'Diseño largo', 'Acabado brillante', 'Edición limitada']
  }
};

/* ============================================================
   INICIALIZACIÓN
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  console.log('Inicializando ShinyWeb...');
  updateCartCount();
  initSearch();
});

/* ============================================================
   BUSCADOR CON MENSAJE “NO RESULTADOS”
   ============================================================ */

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  const noResultsBox = document.getElementById('noResults');

  searchInput.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.product-card');
    const sections = document.querySelectorAll('.category-section');

    let visibleCards = 0;

    cards.forEach(card => {
      const name = (card.dataset.name || '').toLowerCase();
      const category = (card.dataset.category || '').toLowerCase();
      const matches =
        !searchTerm ||
        name.includes(searchTerm) ||
        category.includes(searchTerm);

      card.classList.toggle('hidden', !matches);
      if (matches) visibleCards++;
    });

    sections.forEach(section => {
      const hasVisible = section.querySelectorAll('.product-card:not(.hidden)').length > 0;
      section.style.display = hasVisible ? 'block' : 'none';
    });

    // Mensaje vistoso cuando no hay productos
    if (noResultsBox) {
      if (searchTerm && visibleCards === 0) {
        noResultsBox.style.display = 'block';
        noResultsBox.style.animation = 'fadeBounceIn 1.2s cubic-bezier(.37,1.12,.91,.91)';
      } else {
        noResultsBox.style.display = 'none';
      }
    }
  });
}

/* ============================================================
   NAVEGACIÓN A LA PÁGINA DE DETALLE
   ============================================================ */

function viewProduct(id) {
  window.location.href = 'producto.html?id=' + id;
}

/* ============================================================
   DETALLE DE PRODUCTO
   ============================================================ */

function loadProductDetail(id) {
  const product = products[id];
  if (!product) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('productName').textContent = product.name;
  document.getElementById('productPrice').textContent = product.price + ' €';
  document.getElementById('productDescription').textContent = product.description;

  const featuresList = document.getElementById('productFeatures');
  featuresList.innerHTML = product.features
    .map(f => `<li>${f}</li>`)
    .join('');

  const viewer = document.getElementById('productViewer');
  if (viewer) {
    viewer.innerHTML = `
      <model-viewer
        src="${product.model}"
        alt="${product.name}"
        auto-rotate
        camera-controls
        exposure="1.1"
        environment-image="neutral"
      ></model-viewer>
    `;
  }
}

/* ============================================================
   CARRITO (se apoya en cart.js)
   ============================================================ */

function addToCart(id) {
  if (typeof window.addProductToCart === 'function') {
    window.addProductToCart(id);
    updateCartCount();
  }
}

function updateCartCount() {
  if (typeof window.getCartCount === 'function') {
    const count = window.getCartCount();
    const span = document.getElementById('cartCount');
    if (span) span.textContent = count;
  }
}
