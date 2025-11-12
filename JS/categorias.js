// JS/categorias.js

function getCategoryFromURL(){
  const p = new URLSearchParams(location.search);
  return p.get("cat") || "anells"; // por defecto
}
function prettyCat(c){
  const map = { anells:"Anells", arracades:"Arracades", polseres:"Polseres" };
  return map[c] || c;
}

window.addEventListener("DOMContentLoaded", ()=>{
  const all = getAllProductsFromData();
  const cat = getCategoryFromURL();
  document.getElementById("catTitle").textContent = prettyCat(cat);

  const filtered = all.filter(p => (p.category||"").toLowerCase() === cat.toLowerCase());
  renderProductsSimple(filtered, "productsGrid");
  attachSearchInput(filtered, "productsGrid");
});
