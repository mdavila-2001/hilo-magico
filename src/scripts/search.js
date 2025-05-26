// Hacer la función disponible globalmente
window.initSearch = function({
  searchInputSelector = '.search-input',
  storeSelector = '.tienda',
  storeNameSelector = '.tienda__nombre',
  productNameSelector = '.producto__nombre',
} = {}) {
  console.log('Inicializando búsqueda con selectores:', {
    searchInputSelector,
    storeSelector,
    storeNameSelector,
    productNameSelector
  });
  
  // Verificar si estamos en el navegador
  if (typeof document === 'undefined') {
    console.warn('No se está ejecutando en un navegador');
    return;
  }
  
  const searchInput = document.querySelector(searchInputSelector);
  if (!searchInput) {
    console.warn('No se encontró el campo de búsqueda con el selector:', searchInputSelector);
    return;
  }

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    // Si no hay término de búsqueda, mostrar todo
    if (!searchTerm) {
      document.querySelectorAll(storeSelector).forEach(store => {
        store.style.display = '';
      });
      return;
    }

    // Filtrar tiendas y productos
    document.querySelectorAll(storeSelector).forEach(store => {
      const storeName = store.querySelector(storeNameSelector)?.textContent?.toLowerCase() || '';
      const products = store.querySelectorAll(productNameSelector);
      
      // Verificar si el término de búsqueda coincide con el nombre de la tienda
      const storeMatch = storeName.includes(searchTerm);
      
      // Verificar si algún producto de la tienda coincide con el término de búsqueda
      let productMatch = false;
      products.forEach(product => {
        const productName = product.textContent?.toLowerCase() || '';
        if (productName.includes(searchTerm)) {
          productMatch = true;
          // Resaltar el texto coincidente
          const regex = new RegExp(`(${searchTerm})`, 'gi');
          product.innerHTML = product.textContent.replace(regex, '<mark>$1</mark>');
        } else {
          // Restaurar el texto original si no coincide
          product.innerHTML = product.textContent;
        }
      });

      // Mostrar u ocultar la tienda según coincida el término de búsqueda
      store.style.display = (storeMatch || productMatch) ? '' : 'none';
    });
  });

  // Manejar el envío del formulario de búsqueda (opcional)
  const searchForm = searchInput.closest('form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // La búsqueda ya se maneja con el evento input
    });
  }
}

// Inicialización automática cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
  initSearch();
});
