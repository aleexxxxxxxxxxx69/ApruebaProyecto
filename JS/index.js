// JS/index.js
window.addEventListener("DOMContentLoaded", ()=>{
  const all = getAllProductsFromData();
  renderProductsSimple(all, "productsGrid");
  attachSearchInput(all, "productsGrid");
});
