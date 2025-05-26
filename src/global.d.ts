// Declaraciones de tipos globales

interface Window {
  // Función para inicializar el carrito
  initCartEventListeners?: () => void;
  
  // Función para inicializar el buscador
  initSearch?: (options: {
    searchInputSelector: string;
    storeSelector: string;
    storeNameSelector: string;
    productNameSelector: string;
  }) => void;
}
