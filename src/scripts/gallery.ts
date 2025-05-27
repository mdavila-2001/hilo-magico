// Función para inicializar la galería
export function initGallery() {
  // Elementos del DOM
  const filtros = document.querySelectorAll('.filtro-galeria');
  const items = document.querySelectorAll('.galeria-item');
  
  // Función para filtrar los elementos
  const filtrarGaleria = (categoria: string) => {
    items.forEach((item: Element) => {
      const itemCategoria = item.getAttribute('data-categoria');
      const itemElement = item as HTMLElement;
      
      if (categoria === 'todos' || itemCategoria === categoria) {
        itemElement.style.display = 'block';
        // Pequeño retraso para la animación
        setTimeout(() => {
          itemElement.style.opacity = '1';
          itemElement.style.transform = 'translateY(0)';
        }, 10);
      } else {
        itemElement.style.opacity = '0';
        itemElement.style.transform = 'translateY(20px)';
        // Esperar a que termine la animación para ocultar
        setTimeout(() => {
          itemElement.style.display = 'none';
        }, 300);
      }
    });
  };
  
  // Agregar event listeners a los botones de filtro
  filtros.forEach((filtro: Element) => {
    filtro.addEventListener('click', () => {
      // Remover clase activa de todos los filtros
      filtros.forEach((f: Element) => f.classList.remove('activo'));
      // Añadir clase activa al filtro clickeado
      filtro.classList.add('activo');
      // Obtener la categoría del filtro
      const categoria = filtro.getAttribute('data-categoria');
      if (categoria) {
        // Filtrar la galería
        filtrarGaleria(categoria);
      }
    });
  });
  
  // Inicializar mostrando todos los elementos
  filtrarGaleria('todos');
}
if (document.readyState !== 'loading') {
  initGallery();
} else {
  document.addEventListener('DOMContentLoaded', initGallery);
}
