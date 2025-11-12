function openProductDetail(productId) {
  currentProductId = productId;
  const product = products.find(p => p.id === productId);

  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalProductDescription').textContent = product.description;
  document.getElementById('modalProductPrice').textContent = "€" + product.price;

  const addButton = document.getElementById('modalAddToCart');
  addButton.onclick = () => addToCartFromModal(productId);

  document.getElementById('productModal').classList.add('active');
  setTimeout(() => {
    const container = document.getElementById('productModal3D');
    if (container) create3DPreview(productId, container); // Reutilizamos la misma función que el grid
  }, 100);
}

function closeProductModal(event) {
  if (
    (event && event.target.classList && event.target.classList.contains('close-modal')) ||
    (event && event.target.id === 'productModal') ||
    (!event)
  ) {
    document.getElementById('productModal').classList.remove('active');
    currentProductId = null;
    const container = document.getElementById('productModal3D');
    if (container) container.innerHTML = '';
    activeScene = null;
  }
}
