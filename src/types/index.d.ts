// src/types/index.d.ts
export interface Producto {
  id: string;
  name: string;
  slug: string | null;
  description: string;
  price: number;
  compare_at_price: number | null;
  cost_price: number | null;
  stock: number;
  stock_minimo: number;
  weight: number | null;
  is_active: boolean;
  is_featured: boolean;
  has_variants: boolean;
  images: string[];
  category_id: string | null;
  store_id: string;
  sku: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  category: any | null;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  attributes: any | null;
  cart_id: string;
  price: number;
  created_at: string;
  updated_at: string;
  product: Producto;
}

export interface Cart {
  user_id: string;
  session_id: string | null;
  id: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
  items: CartItem[];
}

// Tipos para el store
export interface StoreState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addItem: (product: Producto, quantity: number, attributes?: any) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  loadCart: () => void;
}