// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly OPENROUTER_API_KEY: string;
  readonly OPENROUTER_API_URL: string;
  readonly MODEL_NAME: string;
  readonly TEMPERATURE: string;
  readonly MAX_TOKENS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.astro' {
  const Component: any;
  export default Component;
}

declare module '*.ts' {
  const content: any;
  export default content;
}

// Para que TypeScript reconozca las importaciones con @/
declare module '@/lib/*' {
  const value: any;
  export default value;
}

interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string;
  readonly API_TIMEOUT: string;
  readonly API_RETRY_ATTEMPTS: string;
  readonly JWT_SECRET: string;
  readonly JWT_EXPIRES_IN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '~/*' {
  const component: any;
  export default component;
}

// Extender la interfaz de Astro para incluir cookies
declare namespace App {
  interface Locals {
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }
}
