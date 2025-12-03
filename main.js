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

document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando ShinyWeb...');
    updateCartCount();
    
    Object.keys(products).forEach(id => {
        const product = products[id];
        const viewerId = 'viewer-' + product.category + (id <= 2 ? id : id - 2 * Math.floor((id-1)/2));
        const container = document.getElementById(viewerId);
        
        if (container) {
            console.log('Cargando modelo: ' + product.model + ' en ' + viewerId);
            initViewer(container, product.model);
        }
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    initSearch();
});

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) {
        console.error('No se encontró el input de búsqueda');
        return;
    }
    
    console.log('Buscador inicializado');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        console.log('Buscando: ' + searchTerm);
        
        const allCards = document.querySelectorAll('.product-card');
        const allSections = document.querySelectorAll('.category-section');
        
        const existingNoResults = document.querySelector('.no-results');
        if (existingNoResults) {
            existingNoResults.remove();
        }
        
        if (searchTerm === '') {
            allCards.forEach(card => card.classList.remove('hidden'));
            allSections.forEach(section => section.classList.remove('hidden'));
            return;
        }
        
        let hasResults = false;
        
        allCards.forEach(card => {
            const productName = card.getAttribute('data-name');
            const category = card.getAttribute('data-category');
            
            if (productName.includes(searchTerm) || category.includes(searchTerm)) {
                card.classList.remove('hidden');
                hasResults = true;
            } else {
                card.classList.add('hidden');
            }
        });
        
        allSections.forEach(section => {
            const visibleCards = section.querySelectorAll('.product-card:not(.hidden)');
            if (visibleCards.length === 0) {
                section.classList.add('hidden');
            } else {
                section.classList.remove('hidden');
            }
        });
        
        if (!hasResults) {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = '<h3>😔 No se encontraron resultados</h3><p>Intenta buscar: "anillo", "pulsera" o "pendiente"</p>';
            
            const container = document.querySelector('.products-container');
            const firstSection = container.querySelector('.category-section');
            container.insertBefore(noResultsDiv, firstSection);
        }
    });
}

function viewProduct(id) {
    window.location.href = 'producto.html?id=' + id;
}

function addToCart(id) {
    const product = products[id];
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: product.name,
            price: product.price,
            model: product.model,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(product.name + ' añadido al carrito');
}

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
    featuresList.innerHTML = product.features.map(f => '<li>' + f + '</li>').join('');
    
    const viewer = document.getElementById('detailViewer');
    if (viewer) {
        initViewer(viewer, product.model, true);
    }
    
    window.currentProductId = id;
}

function addToCartFromDetail() {
    if (window.currentProductId) {
        addToCart(window.currentProductId);
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countElements = document.querySelectorAll('.cart-count');
    countElements.forEach(el => {
        el.textContent = totalItems;
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = 'position: fixed; top: 100px; right: 20px; background: var(--gold); color: var(--text-dark); padding: 1rem 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); z-index: 10000; font-weight: bold; animation: slideIn 0.3s ease;';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

const style = document.createElement('style');
style.textContent = '@keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }';
document.head.appendChild(style);
