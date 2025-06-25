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
    messageEl.classList.add('message-error'); // Siempre usamos error para simplificar
    
    // Mostrar mensaje
    messageText.textContent = message;
    messageEl.classList.remove('hidden');
  }
}

// Función para validar email
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Función para mostrar errores en los campos
function showFieldError(input: HTMLInputElement, message: string): void {
  const formGroup = input.closest('.form-group');
  if (!formGroup) return;
  
  // Remover errores previos
  const existingError = formGroup.querySelector('.field-error');
  if (existingError) existingError.remove();
  
  // Añadir clase de error al input
  input.classList.add('input-error');
  
  // Crear y mostrar mensaje de error
  const errorEl = document.createElement('div');
  errorEl.className = 'field-error';
  errorEl.textContent = message;
  formGroup.appendChild(errorEl);
}

// Función para limpiar errores de un campo
function clearFieldError(input: HTMLInputElement): void {
  const formGroup = input.closest('.form-group');
  if (!formGroup) return;
  
  // Remover mensajes de error
  const error = formGroup.querySelector('.field-error');
  if (error) error.remove();
  
  // Remover clase de error
  input.classList.remove('input-error');
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
    // Limpiar errores al cambiar los campos
    const emailInput = document.getElementById('email') as HTMLInputElement | null;
    const passwordInput = document.getElementById('password') as HTMLInputElement | null;
    
    emailInput?.addEventListener('input', () => clearFieldError(emailInput));
    passwordInput?.addEventListener('input', () => passwordInput && clearFieldError(passwordInput));
    
    loginForm.addEventListener('submit', async (e: Event) => {
      e.preventDefault();
      
      // Ocultar mensaje general si existe
      const messageEl = document.getElementById('message');
      if (messageEl) messageEl.classList.add('hidden');
      
      const buttonText = document.getElementById('buttonText');
      const loginButton = document.getElementById('loginButton') as HTMLButtonElement | null;
      
      const email = emailInput?.value.trim() || '';
      const password = passwordInput?.value || '';
      
      // Validaciones
      let isValid = true;
      
      // Validar email
      if (!email) {
        if (emailInput) showFieldError(emailInput, 'El correo electrónico es requerido');
        isValid = false;
      } else if (!isValidEmail(email)) {
        if (emailInput) showFieldError(emailInput, 'Por favor, ingresa un correo electrónico válido');
        isValid = false;
      }
      
      // Validar contraseña
      if (!password) {
        if (passwordInput) showFieldError(passwordInput, 'La contraseña es requerida');
        isValid = false;
      }
      
      if (!isValid) return;
      
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
        window.location.href = '/';
        
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
