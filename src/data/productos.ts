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
    imagen: 'data:image/jpeg;base64,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',
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
