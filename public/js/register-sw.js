// Registrar el Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registrado con éxito:', registration.scope);
      })
      .catch(error => {
        console.error('Error al registrar el ServiceWorker:', error);
      });
  });
}

// Manejar eventos de conexión/desconexión
function updateOnlineStatus() {
  if (!navigator.onLine) {
    // Mostrar notificación de sin conexión
    const offlineNotification = document.createElement('div');
    offlineNotification.className = 'offline-notification';
    offlineNotification.innerHTML = `
      <div class="offline-content">
        <span>Estás sin conexión. Algunas funciones pueden no estar disponibles.</span>
      </div>
    `;
    
    // Estilos para la notificación
    const style = document.createElement('style');
    style.textContent = `
      .offline-notification {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background-color: #ffeb3b;
        color: #000;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
      }
      @keyframes slideIn {
        from { transform: translateY(100px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(offlineNotification);
    
    // Ocultar la notificación después de 5 segundos
    setTimeout(() => {
      offlineNotification.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => {
        document.body.removeChild(offlineNotification);
      }, 300);
    }, 5000);
  }
}

// Escuchar cambios en el estado de la conexión
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Verificar el estado inicial
updateOnlineStatus();
