// Configuración centralizada para la API
export const API_CONFIG = {
  // URL base de la API
  BASE_URL: import.meta.env.PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  
  // Tiempo máximo de espera para las peticiones (en milisegundos)
  TIMEOUT: parseInt(import.meta.env.API_TIMEOUT || '10000', 10),
  
  // Número máximo de reintentos para peticiones fallidas
  MAX_RETRY_ATTEMPTS: parseInt(import.meta.env.API_RETRY_ATTEMPTS || '3', 10),
  
  // Configuración de cabeceras por defecto
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Rutas de la API (opcional, para mantenerlas centralizadas)
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      ME: '/auth/me',
    },
    // Agregar más endpoints según sea necesario
  },
  
  // Configuración de errores
  ERROR_MESSAGES: {
    NETWORK: 'No se pudo conectar con el servidor',
    DEFAULT: 'Ha ocurrido un error inesperado',
    UNAUTHORIZED: 'No autorizado. Por favor, inicia sesión nuevamente.',
  },
} as const;

// Tipos derivados de la configuración
export type ApiEndpoint = keyof typeof API_CONFIG.ENDPOINTS;
export type ApiErrorKey = keyof typeof API_CONFIG.ERROR_MESSAGES;
