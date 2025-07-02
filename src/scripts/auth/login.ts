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
      redirectPath = '/';
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
      const spinner = document.createElement('div');
      spinner.className = 'form-loading-spinner';
      spinner.innerHTML = `
        <div class="spinner"></div>
        <p>Iniciando sesión...</p>
      `;
      
      // Agregar el spinner al formulario
      loginForm.appendChild(spinner);
      
      // Deshabilitar el botón y cambiar su texto
      if (buttonText && loginButton) {
        // Guardar el HTML original del botón para restaurarlo después
        const originalButtonHTML = loginButton.innerHTML;
        loginButton.setAttribute('data-original-html', originalButtonHTML);
        
        // Actualizar el botón
        buttonText.textContent = 'Procesando...';
        loginButton.disabled = true;
      }
      
      // Agregar clase de carga al formulario
      loginForm.classList.add('form-loading');
      
      // Obtener datos del formulario
      const formData = new FormData(loginForm);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      
      // Función para restaurar el estado del formulario
      const restoreForm = () => {
        // Restaurar el botón
        if (loginButton && buttonText) {
          const originalHTML = loginButton.getAttribute('data-original-html');
          if (originalHTML) {
            loginButton.innerHTML = originalHTML;
          } else {
            buttonText.textContent = 'Iniciar sesión';
          }
          loginButton.disabled = false;
        }
        
        // Remover la clase de carga y el spinner
        loginForm.classList.remove('form-loading');
        const spinner = loginForm.querySelector('.form-loading-spinner');
        if (spinner) {
          spinner.remove();
        }
      };
      
      // Validaciones básicas
      if (!isValidEmail(email)) {
        showMessage('Por favor ingresa un correo electrónico válido');
        restoreForm();
        return;
      }
      
      if (!password) {
        showMessage('Por favor ingresa tu contraseña');
        restoreForm();
        return;
      }
      
      try {
        // Verificar conexión a internet
        if (!navigator.onLine) {
          throw new Error('No hay conexión a internet. Verifica tu conexión e inténtalo de nuevo.');
        }
        
        // Actualizar el mensaje de carga
        const loadingText = spinner.querySelector('p');
        if (loadingText) {
          loadingText.textContent = 'Verificando credenciales...';
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
      } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        
        // Manejar errores de red o del servidor
        let errorMessage = 'Error en el inicio de sesión. Por favor, inténtalo de nuevo.';
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            errorMessage = 'La solicitud ha tardado demasiado. Por favor, verifica tu conexión e inténtalo de nuevo.';
          } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'No se pudo conectar con el servidor. Por favor, verifica tu conexión e inténtalo de nuevo.';
          } else {
            errorMessage = error.message || errorMessage;
          }
        }
        
        showMessage(errorMessage);
        
        // Restaurar el formulario
        restoreForm();
      }
    });
  }
}
