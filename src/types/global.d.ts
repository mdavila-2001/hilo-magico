// src/types/global.d.ts

// Extender la interfaz Window para incluir el carrito
declare global {
  interface Window {
    carrito?: {
      agregarProducto: (producto: {
        id: string;
        nombre: string;
        precio: number;
        imagen: string;
        cantidad: number;
      }) => void;
      // Agregar más métodos del carrito según sea necesario
    };
  }
}

export {}; // Este archivo debe ser un módulo
