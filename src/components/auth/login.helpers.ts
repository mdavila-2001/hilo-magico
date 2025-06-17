// Types
interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

interface LoginResponse {
  redirectTo?: string;
  message?: string;
}

// Constants
const ERROR_MESSAGES = {
  REQUIRED_FIELDS: 'Por favor, completa todos los campos',
  INVALID_EMAIL: 'Por favor, ingresa un correo electrónico válido',
  LOGIN_ERROR: 'Error al iniciar sesión. Por favor, inténtalo de nuevo.',
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión e inténtalo de nuevo.'
} as const;

// Utility functions
const showLoadingState = (button: HTMLButtonElement, isLoading: boolean) => {
  const buttonText = button.querySelector('.button-text');
  const buttonLoader = button.querySelector('.button-loader');
  
  if (isLoading) {
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    buttonText?.setAttribute('aria-hidden', 'true');
    buttonLoader?.removeAttribute('style');
  } else {
    button.disabled = false;
    button.removeAttribute('aria-busy');
    buttonText?.removeAttribute('aria-hidden');
    buttonLoader?.setAttribute('style', 'display: none;');
  }
};

export function initializeLoginForm() {
  const form = document.getElementById('login-form') as HTMLFormElement | null;
  const submitButton = document.getElementById('login-button') as HTMLButtonElement | null;
  const togglePassword = document.querySelector<HTMLButtonElement>('.toggle-password');
  const passwordInput = document.getElementById('password') as HTMLInputElement | null;
  const emailInput = document.getElementById('email') as HTMLInputElement | null;

  if (!form || !submitButton || !passwordInput || !emailInput) {
    console.error('Elementos del formulario no encontrados');
    return;
  }

  // Ensure form is accessible
  form.setAttribute('aria-label', 'Formulario de inicio de sesión');
  form.setAttribute('novalidate', 'true');
  
  // Set initial button state
  submitButton.style.opacity = '1';
  submitButton.style.visibility = 'visible';
  submitButton.setAttribute('aria-live', 'polite');

  // Toggle password visibility with keyboard support
  if (togglePassword && passwordInput) {
    const togglePasswordVisibility = () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      
      const icon = togglePassword.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
      }
      
      // Update ARIA attributes
      togglePassword.setAttribute('aria-pressed', String(!isPassword));
      togglePassword.setAttribute('aria-label', 
        isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
      );
    };
    
    togglePassword.addEventListener('click', togglePasswordVisibility);
    togglePassword.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePasswordVisibility();
      }
    });
    
    // Initialize ARIA attributes
    togglePassword.setAttribute('type', 'button');
    togglePassword.setAttribute('aria-label', 'Mostrar contraseña');
    togglePassword.setAttribute('aria-pressed', 'false');
  }

  // Form submission handler with debounce
  let isSubmitting = false;
  
  const handleFormSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    isSubmitting = true;
    
    try {
      // Clear previous errors
      clearErrors();
      
      // Show loading state
      showLoadingState(submitButton, true);
      
      const formData = new FormData(form);
      const email = formData.get('email')?.toString().trim() || '';
      const password = formData.get('password')?.toString() || '';
      const remember = formData.get('remember') === 'on';

      // Validate form
      const validationError = validateForm({ email, password, remember });
      if (validationError) {
        showError(validationError, emailInput);
        return;
      }
      
      // Submit login request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      try {
        const response = await submitLogin(
          { email, password, remember },
          controller.signal
        );
        
        // Handle successful login
        handleSuccessfulLogin(response);
      } catch (error) {
        handleLoginError(error);
      } finally {
        clearTimeout(timeoutId);
      }
      
    } catch (error) {
      console.error('Unexpected error:', error);
      showError(ERROR_MESSAGES.LOGIN_ERROR);
    } finally {
      isSubmitting = false;
      showLoadingState(submitButton, false);
    }
  };
  
  form.addEventListener('submit', handleFormSubmit);
  
  // Add input event listeners for real-time validation
  const validateField = (field: HTMLInputElement) => {
    if (field.validity.valid) {
      field.setAttribute('aria-invalid', 'false');
      const errorElement = document.getElementById(`${field.id}-error`);
      if (errorElement) {
        errorElement.textContent = '';
      }
    } else {
      field.setAttribute('aria-invalid', 'true');
    }
  };
  
  emailInput?.addEventListener('input', () => validateField(emailInput));
  passwordInput?.addEventListener('input', () => validateField(passwordInput));
  
  // Helper functions
  const handleSuccessfulLogin = (response: LoginResponse) => {
    const redirectUrl = response.redirectTo || '/dashboard';
    
    // Add a small delay to ensure loading state is visible
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 500);
  };
  
  const handleLoginError = (error: unknown) => {
    console.error('Login error:', error);
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      showError('La solicitud está tardando demasiado. Por favor, verifica tu conexión.');
    } else if (error instanceof Error) {
      showError(error.message || ERROR_MESSAGES.LOGIN_ERROR);
    } else {
      showError(ERROR_MESSAGES.LOGIN_ERROR);
    }
    
    // Focus on the first error field
    const firstErrorField = form.querySelector<HTMLInputElement>('[aria-invalid="true"]');
    firstErrorField?.focus();
  };

  function validateForm({ email, password }: LoginFormData): string | null {
    // Check required fields
    if (!email || !password) {
      return ERROR_MESSAGES.REQUIRED_FIELDS;
    }
    
    // Reset field states
    emailInput?.setAttribute('aria-invalid', 'false');
    passwordInput?.setAttribute('aria-invalid', 'false');
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      emailInput?.setAttribute('aria-invalid', 'true');
      emailInput?.focus();
      return ERROR_MESSAGES.INVALID_EMAIL;
    }
    
    // Validate password length (example: at least 6 characters)
    if (password.length < 6) {
      passwordInput?.setAttribute('aria-invalid', 'true');
      passwordInput?.focus();
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    
    return null;
  }

  async function submitLogin(
    { email, password, remember }: LoginFormData,
    signal?: AbortSignal
  ): Promise<LoginResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password, remember }),
        signal,
        credentials: 'include' // Important for cookies
      });
      
      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        const errorMessage = data.message || 
          (response.status === 401 
            ? 'Correo o contraseña incorrectos' 
            : 'Error al iniciar sesión');
        throw new Error(errorMessage);
      }
      
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }
      throw error;
    }
  }

  function showError(message: string, relatedField?: HTMLElement) {
    // Remove existing error messages
    clearErrors();
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.setAttribute('aria-live', 'assertive');
    errorDiv.innerHTML = `
      <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
      <span>${message}</span>
    `;
    
    // Insert error message in the DOM
    if (relatedField) {
      const fieldContainer = relatedField.closest('.form-group');
      if (fieldContainer) {
        fieldContainer.appendChild(errorDiv);
      } else {
        form?.prepend(errorDiv);
      }
      
      // Focus the field with error
      relatedField.focus();
    } else {
      form?.prepend(errorDiv);
    }
    
    // Announce error to screen readers
    const errorText = errorDiv.querySelector('span');
    if (errorText) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = `Error: ${message}`;
      document.body.appendChild(announcement);
      
      // Clean up after announcement
      setTimeout(() => {
        announcement.remove();
      }, 1000);
    }
  }
  
  function clearErrors() {
    // Remove all error messages
    const errorMessages = form?.querySelectorAll('.error-message');
    errorMessages?.forEach(error => error.remove());
    
    // Reset aria-invalid on all fields
    const fields = form?.querySelectorAll<HTMLInputElement>('input');
    fields?.forEach(field => field.setAttribute('aria-invalid', 'false'));
  }

  // Cleanup function
  return () => {
    form.removeEventListener('submit', handleFormSubmit);
    emailInput?.removeEventListener('input', () => validateField(emailInput));
    passwordInput?.removeEventListener('input', () => validateField(passwordInput));
    
    const togglePassword = document.querySelector<HTMLButtonElement>('.toggle-password');
    if (togglePassword) {
      togglePassword.replaceWith(togglePassword.cloneNode(true));
    }
  };
}
