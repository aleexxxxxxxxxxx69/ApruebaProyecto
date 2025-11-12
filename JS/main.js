// Haz que estas funciones estén en el ámbito global
window.filterCategory = filterCategory;
window.openProductDetail = openProductDetail;

document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.getElementById('productsGrid');

  // Usar los nombres usados en el original (categoría, etc)
  function renderProductos(productosList) {
    productGrid.innerHTML = '';
    productosList.forEach(producto => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.onclick = () => openProductDetail(producto.id);
      card.innerHTML = `
        <div class="product-3d" id="viewer-${producto.id}"></div>
        <div class="product-info">
          <div class="product-name">${producto.nombre}</div>
          <div class="product-price">€${producto.precio}</div>
        </div>
        <button class="add-to-cart-btn" onclick="addToCart(${producto.id}); event.stopPropagation();">Añadir al carrito</button>
      `;
      productGrid.appendChild(card);
      // Montar visor 3D en cada producto
      setTimeout(() => {
        const containerViewer = document.getElementById(`viewer-${producto.id}`);
        if (containerViewer) create3DPreview(producto.id, containerViewer);
      }, 80);
    });
  }

  window.renderProductos = renderProductos; // Por si necesitas llamarlo globalmente

  // Lógica para búsqueda
  document.getElementById('searchInput').addEventListener('input', e => {
    searchQuery = e.target.value;
    filtrarYMostrar();
  });

  window.searchQuery = '';
  window.currentCategory = 'tots';

  function filtrarYMostrar() {
    let productosList = getProductos();
    if (currentCategory !== 'tots') {
      productosList = productosList.filter(p => p.categoria === currentCategory);
    }
    if (searchQuery) {
      productosList = productosList.filter(p =>
        p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    renderProductos(productosList);
  }

  function filterCategory(category, event) {
    currentCategory = category;
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
      event.target.classList.add('active');
    } else {
      document.querySelector(`.nav-btn[onclick*="${category}"]`).classList.add('active');
    }
    filtrarYMostrar();
  }

  // Inicializar la vista
  filtrarYMostrar();
});
