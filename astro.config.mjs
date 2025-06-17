// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

// Cargar variables de entorno
const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  // Configuración del sitio
  site: 'https://hilo-magico.com',
  // Habilitar integración de React si es necesario
  // integrations: [react()],
  
  // Configuración del servidor de desarrollo
  server: {
    port: 4322,
    host: true, // Escuchar en todas las interfaces
  },
  
  // Configuración de Vite
  vite: {
    define: {
      // Hacer que las variables de entorno estén disponibles en el cliente
      'import.meta.env.PUBLIC_API_URL': JSON.stringify(process.env.PUBLIC_API_URL || 'http://localhost:8000/api/v1'),
      'import.meta.env.API_TIMEOUT': JSON.stringify(process.env.API_TIMEOUT || '10000'),
      'import.meta.env.API_RETRY_ATTEMPTS': JSON.stringify(process.env.API_RETRY_ATTEMPTS || '3'),
      'import.meta.env.JWT_SECRET': JSON.stringify(process.env.JWT_SECRET || 'hilo-magico-secret-key-dev'),
      'import.meta.env.JWT_EXPIRES_IN': JSON.stringify(process.env.JWT_EXPIRES_IN || '7d'),
    },
    build: {
      sourcemap: true // Habilita sourcemaps en desarrollo
    },
    // Configuración de alias para importaciones
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    // Configuración del servidor de desarrollo
    server: {
      proxy: {
        // Redirigir las solicitudes a la API al backend
        '/api': {
          target: process.env.PUBLIC_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Incluye las variables globalmente
          additionalData: `@use "./src/styles/variables" as *; @use "./src/styles/mixins" as *;`
        }
      }
    }
  }
});
