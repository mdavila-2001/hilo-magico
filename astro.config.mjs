// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), icon()],
  output: 'server', // Necesario para funcionalidades de servidor como autenticación
  scopedStyleStrategy: 'class',
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "sass:color";
          `
        }
      }
    }
  }
});