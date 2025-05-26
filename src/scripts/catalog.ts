// src/scripts/catalog.ts

// Ampliar la interfaz Window para incluir nuestras propiedades personalizadas
declare global {
  interface Window {
    initCartEventListeners?: () => void;
    mostrarNotificacion?: (mensaje: string) => void;
    // Agregar otras propiedades globales aquí si es necesario
  }
}

/**
 * Obtiene las categorías seleccionadas de los checkboxes
 */
function getSelectedCategories(): string[] {
  const checkboxes = document.querySelectorAll<HTMLInputElement>('input[name="categoria"]:checked');
  return Array.from(checkboxes).map(checkbox => checkbox.value);
}

/**
 * Actualiza la URL con los parámetros de búsqueda y filtros
 */
function updateUrl(searchTerm: string, categorias: string[]): void {
  const url = new URL(window.location.href);
  
  // Actualizar término de búsqueda
  if (searchTerm) {
    url.searchParams.set('q', searchTerm);
  } else {
    url.searchParams.delete('q');
  }
  
  // Actualizar categorías
  if (categorias.length > 0) {
    url.searchParams.set('categorias', categorias.join(','));
  } else {
    url.searchParams.delete('categorias');
  }
  
  // Actualizar la URL sin recargar la página
  window.history.pushState({}, '', url.toString());
  
  // Disparar evento personalizado para notificar cambios
  document.dispatchEvent(new CustomEvent('filtrosCambiados', { 
    detail: { searchTerm, categorias } 
  }));
}

/**
 * Inicializa los filtros de categorías
 */
function initCategoryFilters(): void {
  const filterOptions = document.querySelector('.filter-options');
  if (!filterOptions) return;

  // Manejar cambios en los checkboxes
  filterOptions.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    if (target.matches('input[type="checkbox"]')) {
      const searchInput = document.querySelector<HTMLInputElement>('input[name="q"]');
      const searchTerm = searchInput?.value.trim() || '';
      const selectedCategories = getSelectedCategories();
      updateUrl(searchTerm, selectedCategories);
    }
  });

  // Actualizar estado activo de los filtros en móvil
  const updateActiveFilters = (): void => {
    if (window.innerWidth <= 768) {
      document.querySelectorAll('.filter-option').forEach(option => {
        const checkbox = option.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
        if (checkbox) {
          option.setAttribute('data-active', checkbox.checked.toString());
        }
      });
    }
  };
  
  // Inicializar y actualizar en cambios de tamaño
  updateActiveFilters();
  window.addEventListener('resize', updateActiveFilters);
}

/**
 * Inicializa el formulario de búsqueda
 */
function initSearchForm(): void {
  const form = document.querySelector('.search-form') as HTMLFormElement | null;
  if (!form) return;

  // Manejar envío del formulario
  form.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    const searchInput = form.querySelector<HTMLInputElement>('input[name="q"]');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.trim();
    const selectedCategories = getSelectedCategories();
    updateUrl(searchTerm, selectedCategories);
  });
}

/**
 * Inicializa la funcionalidad del catálogo
 */
export function initCatalog(): void {
  if (typeof document === 'undefined') return;
  
  console.log('Inicializando catálogo...');
  
  // Inicializar componentes
  initSearchForm();
  initCategoryFilters();
  
  // Inicializar carrito si está disponible
  if (typeof window.initCartEventListeners === 'function') {
    console.log('Inicializando carrito...');
    window.initCartEventListeners();
  } else {
    console.warn('initCartEventListeners no está disponible');
  }
}

// Inicializar cuando el DOM esté listo
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando catálogo...');
    initCatalog();
  });
}
