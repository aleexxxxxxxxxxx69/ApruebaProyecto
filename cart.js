function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    displayCart();
    updateCartCount();
}

function updateQuantity(productId, change) {
    let cart = getCart();
    const item = cart.find(i => i.id === productId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        saveCart(cart);
        displayCart();
        updateCartCount();
    }
}

function displayCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart"><h2>Tu carrito está vacío</h2><p>¡Añade algunos productos para empezar!</p><a href="index.html" class="btn-add-cart">Ir a la tienda</a></div>';
        updateSummary(0);
        return;
    }
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        html += '<div class="cart-item"><div class="cart-item-image"></div><div class="cart-item-details"><h3>' + item.name + '</h3><p class="cart-item-price">' + item.price.toFixed(2) + ' €</p><div class="quantity-controls"><button onclick="updateQuantity(' + item.id + ', -1)">-</button><span>' + item.quantity + '</span><button onclick="updateQuantity(' + item.id + ', 1)">+</button></div></div><div class="cart-item-total"><p><strong>' + itemTotal.toFixed(2) + ' €</strong></p><button class="cart-item-remove" onclick="removeFromCart(' + item.id + ')">Eliminar</button></div></div>';
    });
    
    cartItemsContainer.innerHTML = html;
    updateSummary(subtotal);
}

function updateSummary(subtotal) {
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) {
        subtotalElement.textContent = subtotal.toFixed(2) + ' €';
    }
    
    if (totalElement) {
        totalElement.textContent = subtotal.toFixed(2) + ' €';
    }
}

function checkout() {
    const cart = getCart();
    
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    alert('¡Gracias por tu compra! Total: ' + document.getElementById('total').textContent);
    localStorage.removeItem('cart');
    displayCart();
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countElements = document.querySelectorAll('.cart-count, #cartCount');
    countElements.forEach(el => {
        if (el) el.textContent = totalItems;
    });
}
