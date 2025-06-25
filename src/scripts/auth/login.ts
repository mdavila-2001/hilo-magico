// Tipos
type MessageType = 'error' | 'success';

// Función para mostrar mensajes
function showMessage(message: string, type: MessageType = 'error'): void {
  const messageEl = document.getElementById('message');
  const messageText = document.getElementById('message-text');
  
  if (messageEl && messageText) {
    // Limpiar clases existentes
    messageEl.className = 'message';
    
    // Añadir clase según el tipo
    messageEl.classList.add(type === 'error' ? 'message-error' : 'message-success');
    
    // Mostrar mensaje
    messageText.textContent = message;
    messageEl.classList.remove('hidden');
  }
}

// Inicialización del formulario de login
export function initLoginForm(apiUrl: string): void {
  // Toggle para mostrar/ocultar contraseña
  const togglePassword = document.getElementById('togglePassword');
  const password = document.getElementById('password') as HTMLInputElement | null;
  
  if (togglePassword && password) {
    togglePassword.addEventListener('click', () => {
      const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
      password.setAttribute('type', type);
      
      // Cambiar el ícono
      const icon = togglePassword.querySelector('i');
      if (icon) {
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
      }
      
      // Actualizar el texto de accesibilidad
      togglePassword.setAttribute('aria-label', type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña');
    });
  }
  
  // Manejar el envío del formulario
  const loginForm = document.getElementById('loginForm') as HTMLFormElement | null;
  if (loginForm) {
    loginForm.addEventListener('submit', async (e: Event) => {
      e.preventDefault();
      
      const emailInput = document.getElementById('email') as HTMLInputElement | null;
      const passwordInput = document.getElementById('password') as HTMLInputElement | null;
      const buttonText = document.getElementById('buttonText');
      const loginButton = document.getElementById('loginButton') as HTMLButtonElement | null;
      
      const email = emailInput?.value.trim();
      const password = passwordInput?.value;
      
      if (!email || !password) {
        showMessage('Por favor, completa todos los campos');
        return;
      }
      
      // Validación de formato de email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMessage('Por favor, ingresa un correo electrónico válido');
        return;
      }
      
      // Mostrar estado de carga
      if (buttonText && loginButton) {
        buttonText.textContent = 'Iniciando sesión...';
        loginButton.disabled = true;
      }
      
      try {
        const response = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Importante para manejar cookies de sesión
          body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Error al iniciar sesión');
        }
        
        // Redirigir al dashboard o página de inicio
        showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
        
      } catch (error: unknown) {
        console.error('Error al iniciar sesión:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error al conectar con el servidor. Inténtalo de nuevo.';
        showMessage(errorMessage);
        
        // Restaurar el botón
        if (buttonText && loginButton) {
          buttonText.textContent = 'Iniciar sesión';
          loginButton.disabled = false;
        }
      }
    });
  }
}
