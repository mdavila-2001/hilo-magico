// src/lib/env.ts

// Cargar variables de entorno
const loadEnv = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || process.env[key] || defaultValue;
  
  if (value === undefined) {
    throw new Error(`La variable de entorno ${key} no está definida`);
  }
  
  return value;
};

// Configuración de autenticación
export const JWT_CONFIG = {
  SECRET: loadEnv('JWT_SECRET', 'hilo-magico-secret-key-dev'),
  EXPIRES_IN: loadEnv('JWT_EXPIRES_IN', '7d'),
  COOKIE_NAME: 'user_token',
};

// Configuración de la API
export const API_CONFIG = {
  BASE_URL: loadEnv('PUBLIC_API_URL', ''),
  TIMEOUT: 10000, // 10 segundos
};

// Configuración de la aplicación
export const APP_CONFIG = {
  ENV: loadEnv('MODE', 'development'),
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
};
