// src/data/productos.ts

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
}

export const productos: Producto[] = [
  {
    id: '1',
    nombre: 'Vestido Floral',
    descripcion: 'Hermoso vestido con estampado floral, perfecto para cualquier ocasión especial.',
    precio: 599.99,
    imagen: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    categoria: 'Vestidos'
  },
  {
    id: '2',
    nombre: 'Blusa Elegante',
    descripcion: 'Blusa de seda con detalles en encaje, ideal para lucir elegante en cualquier momento.',
    precio: 349.99,
    imagen: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    categoria: 'Blusas'
  },
  {
    id: '3',
    nombre: 'Pantalón de Mezclilla',
    descripcion: 'Pantalón de mezclilla ajustado, cómodo y a la moda para cualquier ocasión casual.',
    precio: 449.99,
    imagen: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    categoria: 'Pantalones'
  },
  {
    id: '4',
    nombre: 'Chaleco Acolchado',
    descripcion: 'Chaleco acolchado ligero, perfecto para las temporadas de primavera y otoño.',
    precio: 529.99,
    imagen: 'https://images.unsplash.com/photo-1601924638867-4c6b5c8a2a1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    categoria: 'Abrigos'
  },
  {
    id: '5',
    nombre: 'Falda Plisada',
    descripcion: 'Falda plisada de alta calidad, ideal para combinar con blusas o blazers.',
    precio: 399.99,
    imagen: 'https://images.unsplash.com/photo-1591195853824-944a5b1c3984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    categoria: 'Faldas'
  },
  {
    id: '6',
    nombre: 'Suéter de Lana',
    descripcion: 'Suéter de lana suave y abrigado, perfecto para los días más fríos del año.',
    precio: 479.99,
    imagen: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    categoria: 'Sweaters'
  }
];
