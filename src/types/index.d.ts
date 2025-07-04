// src/types/index.d.ts

declare global {
  interface Producto {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    images: string[];
    categoria: string;
    talla?: string;
    color?: string;
  }
}

export {}; // Esto es necesario para que TypeScript trate este archivo como un módulo
