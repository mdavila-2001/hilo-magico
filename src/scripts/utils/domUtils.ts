// Utilidades para manipulación del DOM

export const createElement = <T extends HTMLElement>(
  tag: string, 
  attributes: Record<string, string> = {},
  ...children: (Node | string)[]
): T => {
  const element = document.createElement(tag) as T;
  
  // Establecer atributos
  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      element.setAttribute(key, value);
    }
  });
  
  // Añadir hijos
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child) {
      element.appendChild(child);
    }
  });
  
  return element;
};

export const sanitizeHTML = (str: string): string => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

export const showNotification = (message: string, duration = 3000): void => {
  console.log('Mostrando notificación:', message);
  
  const notification = createElement<HTMLDivElement>(
    'div', 
    { 
      class: 'notificacion',
    },
    message
  );
  
  console.log('Añadiendo notificación al DOM');
  document.body.appendChild(notification);
  
  // Forzar reflow
  const rect = notification.getBoundingClientRect();
  console.log('Dimensiones de la notificación:', rect);
  
  // Mostrar notificación
  console.log('Añadiendo clase notificacion--visible');
  notification.classList.add('notificacion--visible');
  
  // Verificar estilos después de la animación
  setTimeout(() => {
    const styles = window.getComputedStyle(notification);
    console.log('Estilos después de mostrar:', {
      opacity: styles.opacity,
      transform: styles.transform,
      display: styles.display,
      visibility: styles.visibility
    });
  }, 100);
  
  // Ocultar después de la duración especificada
  setTimeout(() => {
    console.log('Ocultando notificación');
    notification.classList.remove('notificacion--visible');
    notification.classList.add('notificacion--ocultando');
    
    // Eliminar después de la animación
    setTimeout(() => {
      console.log('Eliminando notificación del DOM');
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, duration);
};
