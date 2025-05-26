// Clase para manejar el carrito de compras
class Carrito {
  constructor() {
    try {
      console.log('Inicializando carrito...');
      this.carrito = [];
      this.total = 0;
      
      // Obtener referencias a los elementos del DOM
      this.listaCarrito = document.getElementById('lista-carrito');
      this.contadorCarrito = document.getElementById('contador-carrito');
      this.totalElemento = document.getElementById('total');
      this.botonVaciar = document.getElementById('vaciar-carrito');
      this.botonPagar = document.getElementById('procesar-pago');
      this.carritoVacioMsg = document.querySelector('.carrito__vacio');
      
      console.log('Elementos del DOM cargados:', {
        listaCarrito: !!this.listaCarrito,
        contadorCarrito: !!this.contadorCarrito,
        totalElemento: !!this.totalElemento,
        botonVaciar: !!this.botonVaciar,
        botonPagar: !!this.botonPagar,
        carritoVacioMsg: !!this.carritoVacioMsg
      });
      
      // Cargar carrito desde localStorage si existe
      this.cargarCarrito();
    } catch (error) {
      console.error('Error en el constructor de Carrito:', error);
      // Asegurarse de que las propiedades básicas estén definidas
      this.carrito = [];
      this.total = 0;
    }
    
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
    try {
      console.log('Alternando visibilidad del carrito...');
      const carrito = document.getElementById('carrito');
      const botonCarrito = document.querySelector('.header__carrito-btn');
      
      if (!carrito || !botonCarrito) {
        console.error('No se pudo encontrar el carrito o el botón del carrito');
        return;
      }
      
      const estaAbierto = carrito.classList.contains('carrito--activo');
      console.log('Estado actual del carrito (antes de alternar):', estaAbierto ? 'abierto' : 'cerrado');
      
      if (estaAbierto) {
        this.cerrarCarrito();
      } else {
        this.abrirCarrito();
      }
    } catch (error) {
      console.error('Error en toggleCarrito:', error);
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
    try {
      console.log('Cerrando carrito...');
      const carrito = document.getElementById('carrito');
      const botonCarrito = document.querySelector('.header__carrito-btn');
      
      if (!carrito) {
        console.error('No se pudo encontrar el elemento del carrito');
        return;
      }
      
      console.log('Estado actual del carrito (antes de cerrar):', carrito.classList.toString());
      
      if (carrito.classList.contains('carrito--activo')) {
        carrito.classList.remove('carrito--activo');
        console.log('Clase carrito--activo eliminada');
        
        if (botonCarrito) {
          botonCarrito.setAttribute('aria-expanded', 'false');
          // Devolver el foco al botón del carrito después de un pequeño retraso
          setTimeout(() => {
            try {
              botonCarrito.focus();
              console.log('Foco devuelto al botón del carrito');
            } catch (focusError) {
              console.error('Error al devolver el foco:', focusError);
            }
          }, 50);
        }
      } else {
        console.log('El carrito ya está cerrado');
      }
    } catch (error) {
      console.error('Error en cerrarCarrito:', error);
    }
  }
  
  // Agregar producto al carrito
  agregarProducto(producto) {
    try {
      if (!producto || typeof producto !== 'object' || !producto.id) {
        console.error('Producto inválido:', producto);
        this.mostrarNotificacion('Error: Producto inválido');
        return false;
      }
      
      console.log('Agregando producto al carrito:', producto);
      
      const productoExistente = this.carrito.find(item => item.id === producto.id);
      
      if (productoExistente) {
        productoExistente.cantidad += 1;
        console.log('Cantidad actualizada para el producto:', productoExistente);
      } else {
        // Asegurarse de que el producto tenga todas las propiedades necesarias
        const nuevoProducto = {
          id: producto.id,
          nombre: producto.nombre || 'Producto sin nombre',
          precio: Number(producto.precio) || 0,
          imagen: producto.imagen || '',
          cantidad: 1
        };
        this.carrito.push(nuevoProducto);
        console.log('Nuevo producto agregado:', nuevoProducto);
      }
      
      this.guardarCarrito();
      this.actualizarVista();
      this.mostrarNotificacion('Producto agregado al carrito');
      
      return true;
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      this.mostrarNotificacion('Error al agregar el producto');
      return false;
    }
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
    console.log('Intentando cargar el carrito desde localStorage...');
    try {
      const carritoGuardado = localStorage.getItem('carrito');
      
      if (!carritoGuardado) {
        console.log('No se encontró carrito guardado. Inicializando uno vacío.');
        this.carrito = [];
        this.guardarCarrito();
        return;
      }
      
      console.log('Carrito guardado encontrado:', carritoGuardado);
      
      // Verificar que el carrito sea un JSON válido
      let carritoParseado;
      try {
        carritoParseado = JSON.parse(carritoGuardado);
      } catch (parseError) {
        console.error('Error al analizar el carrito guardado:', parseError);
        console.warn('El carrito guardado no es un JSON válido. Creando uno nuevo.');
        this.carrito = [];
        this.guardarCarrito();
        return;
      }
      
      // Verificar que el carrito sea un array
      if (!Array.isArray(carritoParseado)) {
        console.warn('El carrito guardado no es un array. Creando uno nuevo.');
        this.carrito = [];
        this.guardarCarrito();
        return;
      }
      
      // Validar cada elemento del carrito
      const carritoValidado = carritoParseado.filter(item => {
        const isValid = item && 
                      typeof item === 'object' &&
                      'id' in item &&
                      'nombre' in item &&
                      'precio' in item &&
                      'cantidad' in item;
        
        if (!isValid) {
          console.warn('Elemento inválido encontrado en el carrito:', item);
        }
        
        return isValid;
      });
      
      console.log('Carrito cargado exitosamente con', carritoValidado.length, 'productos');
      this.carrito = carritoValidado;
      this.actualizarVista();
      
    } catch (error) {
      console.error('Error inesperado al cargar el carrito:', error);
      console.error('Stack trace:', error.stack);
      
      // En caso de error, inicializar un carrito vacío
      this.carrito = [];
      this.guardarCarrito();
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

// Función para inicializar los event listeners del carrito
function initCartEventListeners() {
  try {
    console.log('Inicializando event listeners del carrito...');
    
    // Inicializar el carrito si no existe
    if (!window.carrito) {
      console.log('Creando nueva instancia de Carrito...');
      window.carrito = new Carrito();
      console.log('Carrito inicializado correctamente');
    } else {
      console.log('El carrito ya está inicializado');
    }
    
    // Función para manejar el clic en botones de agregar al carrito
    function manejarClickAgregarCarrito(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const boton = e.currentTarget;
      const productoCard = boton.closest('.producto');
      
      if (!productoCard) {
        console.error('No se pudo encontrar la tarjeta del producto');
        return;
      }
      
      // Obtener el precio del texto formateado
      const precioTexto = productoCard.querySelector('.producto__precio')?.textContent || '0';
      const precioNumerico = parseFloat(precioTexto.replace(/[^0-9.]/g, '')) || 0;
      
      const producto = {
        id: boton.dataset.id || Date.now().toString(),
        nombre: productoCard.querySelector('.producto__nombre')?.textContent || 'Producto sin nombre',
        precio: precioNumerico,
        imagen: productoCard.querySelector('.producto__imagen')?.src || '',
        cantidad: 1
      };
      
      console.log('Agregando producto al carrito desde el evento:', producto);
      
      if (window.carrito && typeof window.carrito.agregarProducto === 'function') {
        const resultado = window.carrito.agregarProducto(producto);
        console.log('Resultado de agregar producto:', resultado ? 'éxito' : 'fallo');
      } else {
        console.error('El carrito no está inicializado correctamente');
      }
    }
    
    // Agregar event listeners a los botones de agregar al carrito
    document.querySelectorAll('.producto__carrito').forEach(boton => {
      // Eliminar cualquier listener anterior para evitar duplicados
      boton.removeEventListener('click', manejarClickAgregarCarrito);
      boton.addEventListener('click', manejarClickAgregarCarrito);
      console.log('Event listener agregado al botón:', boton);
    });
    
    // Cerrar carrito al hacer clic en el botón de cerrar
    const botonCerrarCarrito = document.querySelector('.carrito__cerrar');
    if (botonCerrarCarrito) {
      botonCerrarCarrito.removeEventListener('click', manejarCerrarCarrito);
      botonCerrarCarrito.addEventListener('click', manejarCerrarCarrito);
    }
    
    // Inicializar botón del carrito en el header
    const botonCarrito = document.querySelector('.header__carrito-btn');
    if (botonCarrito) {
      botonCarrito.removeEventListener('click', window.toggleCarrito);
      botonCarrito.addEventListener('click', window.toggleCarrito);
    }
    
    console.log('Event listeners del carrito inicializados correctamente');
    
  } catch (error) {
    console.error('Error al inicializar los event listeners del carrito:', error);
  }
  
  // Funciones auxiliares
  function manejarCerrarCarrito(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const carrito = document.getElementById('carrito');
    if (carrito) {
      carrito.classList.remove('carrito--activo');
    }
    
    const botonCarrito = document.querySelector('.header__carrito-btn');
    if (botonCarrito) {
      botonCarrito.setAttribute('aria-expanded', 'false');
    }
  }
  
  // Mover la función toggleCarrito al ámbito global para que sea accesible desde el HTML
  window.toggleCarrito = function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.carrito && typeof window.carrito.toggleCarrito === 'function') {
      window.carrito.toggleCarrito();
    } else {
      console.error('No se pudo alternar el carrito: función no disponible');
    }
  }
}

// Hacer las funciones disponibles globalmente
window.Carrito = Carrito;
window.initCartEventListeners = initCartEventListeners;

// Crear estilos para la notificación
const estilosNotificacion = document.createElement('style');
estilosNotificacion.id = 'estilos-notificacion';
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

// Inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('DOM cargado, inicializando carrito...');
    
    // Inicializar el carrito
    console.log('Creando nueva instancia de Carrito...');
    window.carrito = new Carrito();
    console.log('Carrito inicializado correctamente');
    
    // Inicializar los event listeners
    console.log('Inicializando event listeners...');
    initCartEventListeners();
    
    console.log('Inicialización completada');
  } catch (error) {
    console.error('Error durante la inicialización:', error);
  }
});

// Exportar la clase Carrito
export { Carrito };
