// Clase para manejar el carrito de compras
export class Carrito {
  constructor() {
    this.carrito = [];
    this.total = 0;
    this.listaCarrito = document.getElementById('lista-carrito');
    this.contadorCarrito = document.getElementById('contador-carrito');
    this.totalElemento = document.getElementById('total');
    this.botonVaciar = document.getElementById('vaciar-carrito');
    this.botonPagar = document.getElementById('procesar-pago');
    this.carritoVacioMsg = document.querySelector('.carrito__vacio');
    
    // Cargar carrito desde localStorage si existe
    this.cargarCarrito();
    
    // Event listeners
    if (this.botonVaciar) {
      this.botonVaciar.addEventListener('click', () => this.vaciarCarrito());
    }
    
    if (this.botonPagar) {
      this.botonPagar.addEventListener('click', () => this.procesarPago());
    }
    
    // Cerrar carrito al hacer clic fuera de él
    document.addEventListener('click', (e) => {
      const carrito = document.getElementById('carrito');
      const botonCarrito = document.querySelector('.header__carrito-btn');
      const esClickDentroDelCarrito = carrito.contains(e.target);
      const esClickEnBotonCarrito = e.target === botonCarrito || botonCarrito.contains(e.target);
      
      if (!esClickDentroDelCarrito && !esClickEnBotonCarrito) {
        this.cerrarCarrito();
      }
    });
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.cerrarCarrito();
      }
    });
    
    // Cerrar con el botón de cerrar
    const botonCerrar = document.querySelector('.carrito__cerrar');
    if (botonCerrar) {
      botonCerrar.addEventListener('click', () => this.cerrarCarrito());
    }
  }
  
  // Alternar visibilidad del carrito
  toggleCarrito() {
    const carrito = document.getElementById('carrito');
    const botonCarrito = document.querySelector('.header__carrito-btn');
    const estaAbierto = carrito.classList.contains('carrito--activo');
    
    if (estaAbierto) {
      this.cerrarCarrito();
    } else {
      this.abrirCarrito();
    }
  }
  
  // Abrir el carrito
  abrirCarrito() {
    const carrito = document.getElementById('carrito');
    const botonCarrito = document.querySelector('.header__carrito-btn');
    
    carrito.classList.add('carrito--activo');
    botonCarrito.setAttribute('aria-expanded', 'true');
    
    // Enfocar el carrito para accesibilidad
    carrito.setAttribute('tabindex', '-1');
    carrito.focus();
  }
  
  // Cerrar el carrito
  cerrarCarrito() {
    const carrito = document.getElementById('carrito');
    const botonCarrito = document.querySelector('.header__carrito-btn');
    
    if (carrito.classList.contains('carrito--activo')) {
      carrito.classList.remove('carrito--activo');
      botonCarrito.setAttribute('aria-expanded', 'false');
      
      // Devolver el foco al botón del carrito
      botonCarrito.focus();
    }
  }
  
  // Agregar producto al carrito
  agregarProducto(producto) {
    const productoExistente = this.carrito.find(item => item.id === producto.id);
    
    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }
    
    this.guardarCarrito();
    this.actualizarVista();
    this.mostrarNotificacion('Producto agregado al carrito');
  }
  
  // Eliminar producto del carrito
  eliminarProducto(id) {
    this.carrito = this.carrito.filter(item => item.id !== id);
    this.guardarCarrito();
    this.actualizarVista();
  }
  
  // Actualizar cantidad de un producto
  actualizarCantidad(id, cantidad) {
    if (cantidad < 1) {
      this.eliminarProducto(id);
      return;
    }
    
    const producto = this.carrito.find(item => item.id === id);
    if (producto) {
      producto.cantidad = cantidad;
      this.guardarCarrito();
      this.actualizarVista();
    }
  }
  
  // Vaciar el carrito
  vaciarCarrito() {
    this.carrito = [];
    this.guardarCarrito();
    this.actualizarVista();
    this.cerrarCarrito();
  }
  
  // Procesar pago (simulado)
  procesarPago() {
    if (this.carrito.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    
    // Aquí iría la lógica de pago real
    alert('Redirigiendo al proceso de pago...');
    console.log('Procesando pago para:', this.carrito);
    // this.vaciarCarrito(); // Descomentar para vaciar el carrito después del pago
  }
  
  // Cerrar el carrito
  cerrarCarrito() {
    const carrito = document.getElementById('carrito');
    if (carrito) {
      carrito.classList.remove('carrito--activo');
    }
    const botonCarrito = document.querySelector('.header__carrito-btn');
    if (botonCarrito) {
      botonCarrito.setAttribute('aria-expanded', 'false');
    }
  }
  
  // Guardar carrito en localStorage
  guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
    this.actualizarContador();
  }
  
  // Cargar carrito desde localStorage
  cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.carrito = JSON.parse(carritoGuardado);
      this.actualizarVista();
    }
  }
  
  // Actualizar la vista del carrito
  actualizarVista() {
    if (!this.listaCarrito) return;
    
    // Limpiar lista
    this.listaCarrito.innerHTML = '';
    
    // Actualizar total
    this.actualizarTotal();
    
    // Mostrar mensaje si el carrito está vacío
    if (this.carrito.length === 0) {
      this.listaCarrito.innerHTML = '<p class="carrito__vacio">Tu carrito está vacío</p>';
      return;
    }
    
    // Mostrar productos en el carrito
    this.carrito.forEach(producto => {
      const productoElemento = document.createElement('div');
      productoElemento.className = 'carrito__item';
      productoElemento.innerHTML = `
        <div class="carrito__item-info">
          <h4 class="carrito__item-nombre">${producto.nombre}</h4>
          <p class="carrito__item-precio">$${producto.precio.toFixed(2)} c/u</p>
          <div class="carrito__item-cantidad">
            <button class="carrito__item-btn" data-accion="restar" data-id="${producto.id}">-</button>
            <span class="carrito__item-cantidad-num">${producto.cantidad}</span>
            <button class="carrito__item-btn" data-accion="sumar" data-id="${producto.id}">+</button>
          </div>
        </div>
        <div class="carrito__item-subtotal">
          <p>$${(producto.precio * producto.cantidad).toFixed(2)}</p>
          <button class="carrito__item-eliminar" data-id="${producto.id}" aria-label="Eliminar producto">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      
      this.listaCarrito.appendChild(productoElemento);
    });
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.carrito__item-btn').forEach(boton => {
      boton.addEventListener('click', (e) => {
        const id = boton.dataset.id;
        const accion = boton.dataset.accion;
        const producto = this.carrito.find(item => item.id === id);
        
        if (producto) {
          if (accion === 'sumar') {
            this.actualizarCantidad(id, producto.cantidad + 1);
          } else if (accion === 'restar') {
            this.actualizarCantidad(id, producto.cantidad - 1);
          }
        }
      });
    });
    
    // Agregar event listeners a los botones de eliminar
    document.querySelectorAll('.carrito__item-eliminar').forEach(boton => {
      boton.addEventListener('click', (e) => {
        const id = boton.dataset.id;
        this.eliminarProducto(id);
      });
    });
  }
  
  // Actualizar el total del carrito
  actualizarTotal() {
    this.total = this.carrito.reduce((total, producto) => {
      return total + (producto.precio * producto.cantidad);
    }, 0);
    
    if (this.totalElemento) {
      this.totalElemento.textContent = `$${this.total.toFixed(2)}`;
    }
    
    this.actualizarContador();
  }
  
  // Actualizar el contador del carrito
  actualizarContador() {
    if (this.contadorCarrito) {
      const totalItems = this.carrito.reduce((total, producto) => total + producto.cantidad, 0);
      this.contadorCarrito.textContent = totalItems;
      this.contadorCarrito.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  }
  
  // Mostrar notificación
  mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    // Animación de entrada
    setTimeout(() => {
      notificacion.classList.add('notificacion--activa');
    }, 10);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
      notificacion.classList.remove('notificacion--activa');
      setTimeout(() => {
        notificacion.remove();
      }, 300);
    }, 3000);
  }
}

// Inicializar el carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Crear estilos para la notificación
  const estilosNotificacion = document.createElement('style');
  estilosNotificacion.textContent = `
    .notificacion {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background-color: #4CAF50;
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      opacity: 0;
      transition: all 0.3s ease;
    }
    
    .notificacion--activa {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  `;
  document.head.appendChild(estilosNotificacion);
  
  // Inicializar el carrito
  window.carrito = new Carrito();
  
  // Cerrar carrito al hacer clic en el botón de cerrar
  const botonCerrarCarrito = document.querySelector('.carrito__cerrar');
  if (botonCerrarCarrito) {
    botonCerrarCarrito.addEventListener('click', () => {
      const carrito = document.getElementById('carrito');
      if (carrito) {
        carrito.classList.remove('carrito--activo');
      }
      const botonCarrito = document.querySelector('.header__carrito-btn');
      if (botonCarrito) {
        botonCarrito.setAttribute('aria-expanded', 'false');
      }
    });
  }
});
