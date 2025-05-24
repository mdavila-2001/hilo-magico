// src/scripts/catalog.ts

// Declarar la interfaz extendida de Window
interface Window {
  initCartEventListeners?: () => void;
  mostrarNotificacion?: (mensaje: string) => void;
}

/**
 * Inicializa los filtros móviles
 */
function initMobileFilters(): void {
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
  const form = document.getElementById('searchForm') as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    const formData = new FormData(form);
    const searchTerm = formData.get('q')?.toString().trim() || '';
    const url = new URL(window.location.href);
    
    if (searchTerm) {
      url.searchParams.set('q', searchTerm);
    } else {
      url.searchParams.delete('q');
    }
    
    window.location.href = url.toString();
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
  initMobileFilters();
  
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
