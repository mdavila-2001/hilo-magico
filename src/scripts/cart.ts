// src/scripts/cart.ts
import { createElement, showNotification } from './utils/domUtils';

// Función para convertir precio a número
const parsearPrecio = (precio: number | string): number => {
  if (typeof precio === 'number') return precio;
  // Eliminar símbolos de moneda, comas y espacios, luego convertir a número
  const precioLimpio = precio.replace(/[^0-9.,]/g, '').replace(',', '.');
  return parseFloat(precioLimpio) || 0;
};

// Definir tipos para TypeScript
type Producto = {
  id: string;
  nombre: string;
  precio: number | string; // Acepta número o string
  imagen: string;
  cantidad?: number;
};

// Interfaz para los elementos del DOM
interface CarritoElements {
  listaCarrito: HTMLElement | null;
  contadorCarrito: HTMLElement | null;
  totalElemento: HTMLElement | null;
  botonVaciar: HTMLElement | null;
  botonPagar: HTMLElement | null;
  carritoVacioMsg: HTMLElement | null;
}

class Carrito {
  private static instance: Carrito;
  private carrito: Producto[] = [];
  private total: number = 0;
  private elements: CarritoElements = {
    listaCarrito: null,
    contadorCarrito: null,
    totalElemento: null,
    botonVaciar: null,
    botonPagar: null,
    carritoVacioMsg: null,
  };
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
    
    // Asegurarse de que el contador se inicialice correctamente
    if (this.contadorCarrito) {
      this.contadorCarrito.textContent = this.carrito.reduce((sum, p) => sum + (p.cantidad || 1), 0).toString();
    }
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
    const productoExistente = this.carrito.find(p => p.id === producto.id);
    let mensaje = '';
    
    if (productoExistente) {
      productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
      mensaje = `Cantidad de ${producto.nombre} actualizada a ${productoExistente.cantidad}`;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
      mensaje = `¡${producto.nombre} agregado al carrito!`;
    }
    
    this.guardarCarrito();
    this.actualizarCarrito();
    this.mostrarNotificacion(mensaje);
    
    // Mostrar el contador si estaba oculto
    if (this.contadorCarrito) {
      this.contadorCarrito.style.display = 'flex';
    }
  }

  public eliminarProducto(id: string) {
    const index = this.carrito.findIndex(p => p.id === id);
    if (index !== -1) {
      const productoEliminado = this.carrito[index];
      this.carrito.splice(index, 1);
      this.guardarCarrito();
      this.actualizarCarrito();
      this.mostrarNotificacion(`Se eliminó ${productoEliminado.nombre} del carrito`);
    }
  }

  public actualizarCantidad(id: string, cantidad: number) {
    const producto = this.carrito.find(p => p.id === id);
    if (producto) {
      if (cantidad <= 0) {
        this.eliminarProducto(id);
      } else {
        const cantidadAnterior = producto.cantidad || 1;
        producto.cantidad = cantidad;
        
        // Mostrar notificación solo si la cantidad cambió
        if (cantidadAnterior !== cantidad) {
          const accion = cantidad > cantidadAnterior ? 'aumentó' : 'disminuyó';
          this.mostrarNotificacion(`Cantidad de ${producto.nombre} ${accion} a ${cantidad}`);
        }
      }
      this.guardarCarrito();
      this.actualizarCarrito();
    }
  }

  private createProductElement(producto: Producto): HTMLLIElement {
    const li = document.createElement('li');
    li.className = 'carrito__item';
    li.dataset.id = producto.id;
    
    // Asegurarse de que el precio sea un número
    const precio = parsearPrecio(producto.precio);
    const cantidad = producto.cantidad || 1;
    
    // Crear elementos del producto
    const img = document.createElement('img');
    img.src = producto.imagen;
    img.alt = producto.nombre;
    img.className = 'carrito__imagen';
    img.loading = 'lazy';
    
    const nombre = document.createElement('h3');
    nombre.className = 'carrito__nombre';
    nombre.textContent = producto.nombre;
    
    const precioElemento = document.createElement('p');
    precioElemento.className = 'carrito__precio';
    precioElemento.textContent = `$${precio.toFixed(2)}`;
    
    // Botones de cantidad
    const btnDisminuir = document.createElement('button');
    btnDisminuir.className = 'carrito__item-btn';
    btnDisminuir.dataset.accion = 'disminuir';
    btnDisminuir.dataset.id = producto.id;
    btnDisminuir.ariaLabel = 'Disminuir cantidad';
    btnDisminuir.disabled = cantidad <= 1;
    const minusIcon = document.createElement('i');
    minusIcon.className = 'fas fa-minus';
    btnDisminuir.appendChild(minusIcon);
    
    const cantidadElemento = document.createElement('span');
    cantidadElemento.className = 'carrito__cantidad';
    cantidadElemento.dataset.id = producto.id;
    cantidadElemento.textContent = cantidad.toString();
    
    const btnAumentar = document.createElement('button');
    btnAumentar.className = 'carrito__item-btn';
    btnAumentar.dataset.accion = 'aumentar';
    btnAumentar.dataset.id = producto.id;
    btnAumentar.ariaLabel = 'Aumentar cantidad';
    const plusIcon = document.createElement('i');
    plusIcon.className = 'fas fa-plus';
    btnAumentar.appendChild(plusIcon);
    
    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'carrito__eliminar';
    btnEliminar.dataset.id = producto.id;
    btnEliminar.ariaLabel = 'Eliminar producto';
    const trashIcon = document.createElement('i');
    trashIcon.className = 'fas fa-trash';
    btnEliminar.appendChild(trashIcon);
    
    const cantidadContainer = document.createElement('div');
    cantidadContainer.className = 'carrito__item-cantidad';
    cantidadContainer.appendChild(btnDisminuir);
    cantidadContainer.appendChild(cantidadElemento);
    cantidadContainer.appendChild(btnAumentar);
    cantidadContainer.appendChild(btnEliminar);
    
    const subtotal = document.createElement('p');
    subtotal.className = 'carrito__subtotal';
    
    const detalles = document.createElement('div');
    detalles.className = 'carrito__detalles';
    detalles.appendChild(nombre);
    detalles.appendChild(precioElemento);
    detalles.appendChild(cantidadContainer);
    detalles.appendChild(subtotal);
    
    li.appendChild(img);
    li.appendChild(detalles);
    return li;
  }

  private actualizarCarrito() {
    if (!this.listaCarrito || !this.contadorCarrito || !this.totalElemento || !this.carritoVacioMsg) {
      if (!this.isInitialized) {
        console.warn('Elementos del carrito no encontrados, reintentando...');
        setTimeout(() => this.actualizarCarrito(), 100);
      }
      return;
    }

    // Reiniciar el total
    this.total = 0;
    this.listaCarrito.innerHTML = '';

    if (this.carrito.length === 0) {
      if (this.carritoVacioMsg) this.carritoVacioMsg.style.display = 'block';
      if (this.contadorCarrito) this.contadorCarrito.textContent = '0';
      if (this.totalElemento) this.totalElemento.textContent = '0.00';
      return;
    }

    // Calcular el total de items y el precio total
    const totalItems = this.carrito.reduce((sum, p) => sum + (p.cantidad || 1), 0);
    
    // Calcular el total usando la función parsearPrecio
    this.total = this.carrito.reduce((sum, producto) => {
      const cantidad = producto.cantidad || 1;
      const precio = parsearPrecio(producto.precio);
      return sum + (precio * cantidad);
    }, 0);
    
    console.log('Total calculado:', this.total); // Para depuración

    if (this.carritoVacioMsg) this.carritoVacioMsg.style.display = 'none';
    
    // Crear elementos del carrito
    this.carrito.forEach(producto => {
      const li = this.createProductElement(producto);
      this.listaCarrito?.appendChild(li);
    });

    // Actualizar contador y total
    if (this.contadorCarrito) {
      this.contadorCarrito.textContent = totalItems.toString();
      this.contadorCarrito.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    if (this.totalElemento) {
      this.totalElemento.textContent = this.total.toFixed(2);
    }
  }

  public vaciarCarrito() {
    if (this.carrito.length > 0) {
      this.carrito = [];
      this.guardarCarrito();
      this.actualizarCarrito();
      this.mostrarNotificacion('Se ha vaciado el carrito');
      
      // Ocultar el contador
      if (this.contadorCarrito) {
        this.contadorCarrito.style.display = 'none';
      }
    }
  }

  public procesarPago() {
    // Implementar lógica de pago aquí
    alert('Procesando pago...');
  }

  private mostrarNotificacion(mensaje: string) {
    try {
      // Asegurarse de que el mensaje sea seguro
      const mensajeSeguro = typeof mensaje === 'string' ? mensaje : 'Operación realizada correctamente';
      
      // Mostrar la notificación
      showNotification(mensajeSeguro);
      
      // Log para depuración
      console.log('Notificación mostrada:', mensajeSeguro);
    } catch (error) {
      console.error('Error al mostrar notificación:', error);
    }
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
