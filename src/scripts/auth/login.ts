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

// Función para guardar los datos del usuario en localStorage
function saveUserData(userData: any, token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  }
}

// Función para redirigir según el rol del usuario
function redirectByRole(role: string): void {
  let redirectPath = '/';
  
  switch(role) {
    case 'admin':
      redirectPath = '/admin';
      break;
    case 'user':
    case 'customer':
      redirectPath = '/';
      break;
    default:
      redirectPath = '/';
  }
  
  window.location.href = redirectPath;
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
      
      // Mostrar estado de carga
      if (buttonText && loginButton) {
        buttonText.textContent = 'Iniciando sesión...';
        loginButton.disabled = true;
      }
      
      // Obtener datos del formulario
      const formData = new FormData(loginForm);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      
      // Validaciones básicas
      if (!isValidEmail(email)) {
        showMessage('Por favor ingresa un correo electrónico válido');
        if (buttonText && loginButton) {
          buttonText.textContent = 'Iniciar sesión';
          loginButton.disabled = false;
        }
        return;
      }
      
      if (!password) {
        showMessage('Por favor ingresa tu contraseña');
        if (buttonText && loginButton) {
          buttonText.textContent = 'Iniciar sesión';
          loginButton.disabled = false;
        }
        return;
      }
      
      try {
        // Verificar conexión a internet
        if (!navigator.onLine) {
          throw new Error('No hay conexión a internet. Verifica tu conexión e inténtalo de nuevo.');
        }
        
        console.log('Enviando solicitud a:', `${apiUrl}/auth/login`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10 segundos
        
        const response = await fetch(`${apiUrl}/auth/login`, {
          signal: controller.signal,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });
        
        console.log('Respuesta recibida. Estado:', response.status);
        const responseText = await response.text();
        console.log('Contenido de la respuesta (texto):', responseText);
        
        let data;
        try {
          data = responseText ? JSON.parse(responseText) : {};
          console.log('Datos parseados:', data);
        } catch (parseError) {
          console.error('Error al analizar la respuesta JSON:', parseError);
          throw new Error('Error en el formato de la respuesta del servidor');
        }
        
        if (!response.ok) {
          console.error('Error en la respuesta:', {
            status: response.status,
            statusText: response.statusText,
            data
          });
          throw new Error(data.message || `Error al iniciar sesión: ${response.status} ${response.statusText}`);
        }
        
        // Guardar datos del usuario y token
        if (data.data && data.data.user && data.data.access_token) {
          saveUserData(data.data.user, data.data.access_token);
          redirectByRole(data.data.user.role);
        } else {
          throw new Error('Datos de usuario no válidos');
        }
      } catch (error: any) {
        console.error('=== Error detallado en login ===');
        console.error('Tipo de error:', typeof error);
        console.error('Mensaje:', error.message);
        console.error('Stack:', error.stack);
        console.error('Respuesta del servidor (si existe):', error.response);
        console.error('URL del servidor:', apiUrl);
        console.error('==============================');
        
        let errorMessage = 'Error al conectar con el servidor. Inténtalo de nuevo.';
        
        if (error.name === 'AbortError') {
          errorMessage = 'La solicitud está tardando demasiado. Verifica tu conexión a internet.';
        } else if (!navigator.onLine) {
          errorMessage = 'No hay conexión a internet. Verifica tu conexión.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'No se pudo conectar con el servidor. Verifica que la URL sea correcta y que el servidor esté en ejecución.';
        } else if (error instanceof Error) {
          errorMessage = error.message || errorMessage;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
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
