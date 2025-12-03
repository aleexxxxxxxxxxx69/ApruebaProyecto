/* ============================================================
   SHINYWEB - main.js (versión simplificada con model-viewer)
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

// ============================================================
// INICIALIZACIÓN PRINCIPAL
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('Inicializando ShinyWeb...');
    updateCartCount();
    initSearch();
});

// ============================================================
// BUSCADOR
// ============================================================

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.product-card');
        const sections = document.querySelectorAll('.category-section');

        cards.forEach(card => {
            const name = card.dataset.name;
            const category = card.dataset.category;
            card.classList.toggle('hidden', !(name.includes(searchTerm) || category.includes(searchTerm)));
        });

        sections.forEach(section => {
            const visible = section.querySelectorAll('.product-card:not(.hidden)').length > 0;
            section.style.display = visible ? 'block' : 'none';
        });
    });
}

// ============================================================
// NAVEGACIÓN A LA PÁGINA DE DETALLE
// ============================================================

function viewProduct(id) {
    window.location.href = 'producto.html?id=' + id;
}

// ============================================================
// CARGAR PRODUCTO EN LA PÁGINA DE DETALLE
// ============================================================

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
    featuresList.innerHTML = product.features.map(f => `<li>${f}</li>`).join('');

    const viewer = document.getElementById('detailViewer');
    if (viewer) {
        viewer.setAttribute("src", "models/" + product.model);
    }

    window.currentProductId = id;
}

// ============================================================
// CARRITO
// ============================================================

function addToCart(id) {
    const product = products[id];
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, name: product.name, price: product.price, model: product.model, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(product.name + ' añadido al carrito');
}

function addToCartFromDetail() {
    if (window.currentProductId) addToCart(window.currentProductId);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((s, item) => s + item.quantity, 0);

    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = total;
    });
}

function showNotification(message) {
    const div = document.createElement('div');
    div.className = 'notification';
    div.style.cssText =
        'position:fixed;top:100px;right:20px;background:var(--gold);color:var(--text-dark);padding:1rem 2rem;border-radius:10px;box-shadow:0 5px 15px rgba(0,0,0,0.3);z-index:10000;font-weight:bold;';
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2000);
}
