export interface CartItemProduct {
  id: string;
  name: string;
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
  sku: string;
  store_id: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  category: null | {
    id: string;
    name: string;
    // Agrega más propiedades si es necesario
  };
}

export interface CartItem {
  id: string;
  product_id: string;
  cart_id: string;
  quantity: number;
  price: number;
  attributes: Record<string, any>;
  created_at: string;
  updated_at: string;
  product: CartItemProduct;
}

export interface Cart {
  id: string;
  user_id: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
  expires_at: string;
  items: CartItem[];
}

// La respuesta de la API es directamente el carrito
export type CartResponse = Cart;

export interface CartSummary {
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
}

export interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number, attributes?: Record<string, any>) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getSummary: () => CartSummary;
}
