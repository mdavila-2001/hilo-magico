// src/scripts/cart.ts

// Definir tipos
declare global {
  interface Window {
    Carrito?: any;
    isCartReady?: boolean;
  }
}

// Variables globales
let Carrito: any = null;
let isCartReady = false;

/**
 * Muestra una notificación al usuario
 */
function showNotification(message: string): void {
  if (typeof document === 'undefined') return;
  
  // Verificar si ya existe un contenedor de notificaciones
  let container = document.querySelector('.notification-container');
  
  if (!container) {
    // Crear el contenedor si no existe
    container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
    
    // Agregar estilos
    const style = document.createElement('style');
    style.textContent = `
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .notification {
        background-color: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
      }
      
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Crear la notificación
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${message}</span>
  `;
  
  // Agregar la notificación al contenedor
  container.appendChild(notification);
  
  // Eliminar después de 3 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out forwards';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Inicializa los event listeners del carrito
 */
export function initCartEventListeners(): void {
  if (typeof document === 'undefined') return;
  
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    const button = target.closest('.add-to-cart-btn');
    
    if (!button) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const productId = button.getAttribute('data-product-id');
    const productName = button.getAttribute('data-product-name');
    const productPrice = parseFloat(button.getAttribute('data-product-price') || '0');
    const productImage = button.getAttribute('data-product-image');
    
    if (!productId || !productName || isNaN(productPrice)) return;
    
    const product = {
      id: productId,
      nombre: productName,
      precio: productPrice,
      imagen: productImage || ''
    };
    
    addToCart(product);
  });
}

/**
 * Añade un producto al carrito
 */
function addToCart(product: { id: string; nombre: string; precio: number; imagen: string }): void {
  if (!window.Carrito || !isCartReady) {
    console.error('El carrito no está disponible');
    return;
  }
  
  try {
    const carrito = new window.Carrito();
    carrito.agregarProducto(product);
    showNotification(`¡${product.nombre} añadido al carrito!`);
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
  }
}

/**
 * Inicializa el carrito
 */
export async function initCart(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const module = await import('./carrito');
    Carrito = module.Carrito;
    isCartReady = true;
    window.Carrito = Carrito;
    window.isCartReady = isCartReady;
    console.log('Carrito inicializado correctamente');
  } catch (error) {
    console.error('Error al cargar el carrito:', error);
  }
}

// Inicializar el carrito cuando se cargue el módulo
if (typeof window !== 'undefined') {
  initCart();
}
