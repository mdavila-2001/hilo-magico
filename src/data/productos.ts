// src/data/productos.ts

export interface Tienda {
  id: string;
  nombre: string;
  logo: string;
  descripcion?: string;
  categorias: string[];
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
  tiendaId: string; // Referencia a la tienda
  stock: number;
  calificacion?: number;
}

export const tiendas: Tienda[] = [
  {
    id: 'hilo-magico',
    nombre: 'Hilo Mágico',
    logo: '/images/logo.png',
    descripcion: 'Ropa y accesorios únicos y personalizados',
    categorias: ['ropa', 'accesorios', 'personalizado']
  },
  {
    id: 'moda-express',
    nombre: 'Moda Express',
    logo: 'https://via.placeholder.com/100',
    descripcion: 'Las últimas tendencias de moda',
    categorias: ['ropa', 'moda', 'tendencias']
  },
  {
    id: 'estilo-propio',
    nombre: 'Estilo Propio',
    logo: 'https://via.placeholder.com/100',
    descripcion: 'Diseños exclusivos y personalizados',
    categorias: ['accesorios', 'joyeria', 'regalos']
  },
  {
    id: 'diseños-unicos',
    nombre: 'Diseños Únicos',
    logo: 'https://via.placeholder.com/100',
    descripcion: 'Diseños únicos para tu hogar',
    categorias: ['decoracion', 'hogar', 'personalizado']
  },
  {
    id: 'arte-manual',
    nombre: 'Arte Manual',
    logo: 'https://via.placeholder.com/100',
    descripcion: 'Arte y manualidades hechas a mano',
    categorias: ['manualidades', 'arte', 'regalos']
  },
  {
    id: 'diseños-unicos',
    nombre: 'Diseños Únicos',
    logo: 'https://via.placeholder.com/100',
    descripcion: 'Diseños exclusivos y personalizados',
    categorias: ['decoracion', 'hogar', 'personalizado']
  }
];

export const productos: Producto[] = [
  // Productos de Hilo Mágico
  {
    id: '1',
    nombre: 'Vestido Floral',
    descripcion: 'Hermoso vestido con estampado floral, perfecto para cualquier ocasión especial.',
    precio: 599.99,
    imagen: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    categoria: 'Vestidos',
    tiendaId: 'hilo-magico',
    stock: 15,
    calificacion: 4.8
  },
  {
    id: '2',
    nombre: 'Blusa Elegante',
    descripcion: 'Blusa de seda con detalles en encaje, ideal para lucir elegante en cualquier momento.',
    precio: 349.99,
    imagen: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    categoria: 'Blusas',
    tiendaId: 'hilo-magico',
    stock: 20,
    calificacion: 4.7
  },
  
  // Productos de Moda Express
  {
    id: '3',
    nombre: 'Pantalón de Mezclilla',
    descripcion: 'Pantalón de mezclilla ajustado, cómodo y a la moda para cualquier ocasión casual.',
    precio: 449.99,
    imagen: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    categoria: 'Pantalones',
    tiendaId: 'moda-express',
    stock: 12,
    calificacion: 4.5
  },
  {
    id: '4',
    nombre: 'Chaleco Acolchado',
    descripcion: 'Chaleco acolchado ligero, perfecto para las temporadas de primavera y otoño.',
    precio: 529.99,
    imagen: 'https://th.bing.com/th/id/OIP.HHWmdruO4Xk1gAZAy-GrLgHaLG?rs=1&pid=ImgDetMain',
    categoria: 'Abrigos',
    tiendaId: 'moda-express',
    stock: 8,
    calificacion: 4.6
  },
  
  // Productos de Estilo Propio
  {
    id: '5',
    nombre: 'Falda Plisada',
    descripcion: 'Falda plisada de alta calidad, ideal para combinar con blusas o blazers.',
    precio: 399.99,
    imagen: 'https://images.unsplash.com/photo-1591195853824-944a5b1c3984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    categoria: 'Faldas',
    tiendaId: 'estilo-propio',
    stock: 10,
    calificacion: 4.9
  },
  {
    id: '6',
    nombre: 'Saco de Lino',
    descripcion: 'Saco ligero de lino, perfecto para los días cálidos de verano.',
    precio: 479.99,
    imagen: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    categoria: 'Abrigos',
    tiendaId: 'estilo-propio',
    stock: 5,
    calificacion: 4.7
  }
];
