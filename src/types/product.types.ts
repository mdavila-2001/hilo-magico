// Tipos relacionados con productos
export interface Producto {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  images: string[];
  category: string | null;
  store_id: string;
  created_at: string;
  updated_at: string;
  
  // Campos opcionales para compatibilidad
  nombre?: string;
  descripcion?: string;
  precio?: number;
  categoria?: string;
  talla?: string;
  color?: string;
  imagen?: string;
  tiendaId?: string;
  calificacion?: number;
  
  // Variantes
  sizes?: string[];
  colors?: string[];
  
  // Para compatibilidad con el carrito
  quantity?: number;
}

export interface ProductsResponse {
  products: Producto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
