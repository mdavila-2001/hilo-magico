// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Configuración del servidor de desarrollo
  server: {
    host: true, // Habilita el acceso desde la red local
    port: 4321,
    open: true // Abre automáticamente el navegador
  },
  
  // Configuración de compilación
  build: {
    assets: 'assets'
  },
  
  // Integraciones
  integrations: [],
  
  // Configuración de Vite
  vite: {
    build: {
      sourcemap: true // Habilita sourcemaps en desarrollo
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
