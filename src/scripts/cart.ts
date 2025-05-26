// src/scripts/cart.ts

// Definir tipos para TypeScript
type Producto = {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad?: number;
};

class Carrito {
  private static instance: Carrito;
  private carrito: Producto[] = [];
  private total: number = 0;
  private listaCarrito: HTMLElement | null = null;
  private contadorCarrito: HTMLElement | null = null;
  private totalElemento: HTMLElement | null = null;
  private botonVaciar: HTMLElement | null = null;
  private botonPagar: HTMLElement | null = null;
  private carritoVacioMsg: HTMLElement | null = null;
  private isInitialized: boolean = false;

  private constructor() {
    this.inicializarElementos();
    this.cargarCarrito();
    this.configurarEventListeners();
    this.isInitialized = true;
  }

  public static getInstance(): Carrito {
    if (!Carrito.instance) {
      Carrito.instance = new Carrito();
    }
    return Carrito.instance;
  }

  private inicializarElementos() {
    this.listaCarrito = document.getElementById('lista-carrito');
    this.contadorCarrito = document.getElementById('contador-carrito');
    this.totalElemento = document.getElementById('total');
    this.botonVaciar = document.getElementById('vaciar-carrito');
    this.botonPagar = document.getElementById('procesar-pago');
    this.carritoVacioMsg = document.querySelector('.carrito__vacio');
  }

  private configurarEventListeners() {
    // Delegación de eventos para los botones dinámicos
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const button = target.closest('[data-accion]') as HTMLButtonElement;
      
      if (!button) return;
      
      const accion = button.dataset.accion;
      const id = button.dataset.id;
      
      if (!id) return;
      
      switch (accion) {
        case 'aumentar':
          this.actualizarCantidad(id, (this.getCantidadProducto(id) || 0) + 1);
          break;
        case 'disminuir':
          this.actualizarCantidad(id, (this.getCantidadProducto(id) || 0) - 1);
          break;
      }
    });
    
    // Evento para eliminar producto
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const button = target.closest('.carrito__eliminar') as HTMLButtonElement;
      
      if (button && button.dataset.id) {
        this.eliminarProducto(button.dataset.id);
      }
    });
    
    // Evento para el botón de vaciar
    if (this.botonVaciar) {
      this.botonVaciar.addEventListener('click', () => this.vaciarCarrito());
    }
    
    // Evento para el botón de pagar
    if (this.botonPagar) {
      this.botonPagar.addEventListener('click', () => this.procesarPago());
    }
  }

  private getCantidadProducto(id: string): number {
    const producto = this.carrito.find(p => p.id === id);
    return producto ? (producto.cantidad || 1) : 0;
  }

  private cargarCarrito() {
    try {
      const carritoGuardado = localStorage.getItem('carrito');
      if (carritoGuardado) {
        this.carrito = JSON.parse(carritoGuardado);
        this.actualizarCarrito();
      }
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      this.carrito = [];
    }
  }

  private guardarCarrito() {
    try {
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
      this.actualizarCarrito();
    } catch (error) {
      console.error('Error al guardar el carrito:', error);
    }
  }

  public agregarProducto(producto: Producto) {
    const existe = this.carrito.find(p => p.id === producto.id);
    if (existe) {
      existe.cantidad = (existe.cantidad || 1) + 1;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }
    this.guardarCarrito();
    this.mostrarNotificacion(`"${producto.nombre}" se ha añadido al carrito`);
  }

  public eliminarProducto(id: string) {
    this.carrito = this.carrito.filter(p => p.id !== id);
    this.guardarCarrito();
  }

  public actualizarCantidad(id: string, cantidad: number) {
    const producto = this.carrito.find(p => p.id === id);
    if (producto) {
      producto.cantidad = cantidad;
      if (producto.cantidad <= 0) {
        this.eliminarProducto(id);
      } else {
        this.guardarCarrito();
      }
    }
  }

  private actualizarCarrito() {
    if (!this.listaCarrito || !this.contadorCarrito || !this.totalElemento || !this.carritoVacioMsg) {
      if (!this.isInitialized) {
        console.warn('Elementos del carrito no encontrados, reintentando...');
        setTimeout(() => this.actualizarCarrito(), 100);
      }
      return;
    }

    // Actualizar la lista de productos
    this.listaCarrito.innerHTML = '';
    this.total = 0;

    if (this.carrito.length === 0) {
      if (this.carritoVacioMsg) this.carritoVacioMsg.style.display = 'block';
      if (this.contadorCarrito) this.contadorCarrito.textContent = '0';
      if (this.totalElemento) this.totalElemento.textContent = '0.00';
      return;
    }

    if (this.carritoVacioMsg) this.carritoVacioMsg.style.display = 'none';
    
    this.carrito.forEach(producto => {
      const subtotal = producto.precio * (producto.cantidad || 1);
      this.total += subtotal;

      if (this.listaCarrito) {
        const li = document.createElement('li');
        li.className = 'carrito__item';
        li.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}" class="carrito__imagen">
          <div class="carrito__detalles">
            <h4 class="carrito__nombre">${producto.nombre}</h4>
            <p class="carrito__precio">$${producto.precio.toFixed(2)}</p>
            <div class="carrito__cantidad">
              <button class="carrito__btn" data-accion="disminuir" data-id="${producto.id}">-</button>
              <span>${producto.cantidad || 1}</span>
              <button class="carrito__btn" data-accion="aumentar" data-id="${producto.id}">+</button>
            </div>
          </div>
          <button class="carrito__eliminar" data-id="${producto.id}">
            <i class="fas fa-trash"></i>
          </button>
        `;
        this.listaCarrito.appendChild(li);
      }
    });

    // Actualizar contador y total
    const totalItems = this.carrito.reduce((sum, p) => sum + (p.cantidad || 1), 0);
    if (this.contadorCarrito) this.contadorCarrito.textContent = totalItems.toString();
    if (this.totalElemento) this.totalElemento.textContent = this.total.toFixed(2);
  }

  public vaciarCarrito() {
    this.carrito = [];
    this.guardarCarrito();
    this.mostrarNotificacion('Carrito vaciado');
  }

  public procesarPago() {
    // Implementar lógica de pago aquí
    alert('Procesando pago...');
  }

  private mostrarNotificacion(mensaje: string) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    
    // Estilos para la notificación
    notificacion.style.position = 'fixed';
    notificacion.style.bottom = '20px';
    notificacion.style.right = '20px';
    notificacion.style.padding = '15px 25px';
    notificacion.style.backgroundColor = '#4CAF50';
    notificacion.style.color = 'white';
    notificacion.style.borderRadius = '4px';
    notificacion.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notificacion.style.zIndex = '1000';
    notificacion.style.transform = 'translateY(100px)';
    notificacion.style.opacity = '0';
    notificacion.style.transition = 'all 0.3s ease-out';
    
    // Agregar al documento
    document.body.appendChild(notificacion);
    
    // Forzar reflow para que la animación funcione
    notificacion.getBoundingClientRect();
    
    // Mostrar con animación
    notificacion.style.transform = 'translateY(0)';
    notificacion.style.opacity = '1';
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
      notificacion.style.transform = 'translateY(100px)';
      notificacion.style.opacity = '0';
      
      // Eliminar después de la animación
      setTimeout(() => {
        if (document.body.contains(notificacion)) {
          document.body.removeChild(notificacion);
        }
      }, 300);
    }, 3000);
  }
}

// Exportar funciones para uso externo
export function initCartEventListeners(): void {
  // Inicializar la instancia del carrito si no existe
  Carrito.getInstance();
  console.log('Event listeners del carrito inicializados');
}

export function addToCart(producto: Producto): void {
  const carrito = Carrito.getInstance();
  carrito.agregarProducto(producto);
}

// Inicializar automáticamente si se carga directamente
// Esta inicialización se maneja desde el Header.astro
// para asegurar que solo se ejecute una vez

// Inicializa el carrito
export async function initCart(): Promise<void> {
  try {
    // Inicializar los event listeners del carrito
    initCartEventListeners();
    
    // Cualquier otra inicialización necesaria
    console.log('Carrito inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar el carrito:', error);
  }
}
