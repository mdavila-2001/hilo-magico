// src/stores/cartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '../services/api';
import type { Cart, CartItem, CartItemProduct } from '../types/cart.types';

interface StoreState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (product: CartItemProduct, quantity: number, attributes?: Record<string, any>) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getSummary: () => {
    totalItems: number;
    subtotal: number;
    discount: number;
    total: number;
  };
}

export const useCartStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      error: null,

      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.get<Cart>('/cart');
          set({ cart: response.data });
        } catch (error) {
          console.error('Error fetching cart:', error);
          set({ error: 'Error al cargar el carrito' });
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (product: CartItemProduct, quantity = 1, attributes = {}): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
          const payload = {
            product_id: product.id,
            quantity
          };
          
          const response = await api.post<Cart>('/cart/items', payload);
          set({ cart: response.data });
          
          // Forzar una recarga del carrito para asegurar consistencia
          await get().fetchCart();
        } catch (error: any) {
          console.error('Error adding item to cart:', error);
          const errorMessage = error.response?.data?.detail || 
                             error.response?.data?.message || 
                             'Error al agregar el producto al carrito';
          console.error('Detalles del error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
          });
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (itemId: string) => {
        set({ isLoading: true, error: null });
        try {
          await api.delete(`/cart/items/${itemId}`);
          set(state => ({
            cart: state.cart ? {
              ...state.cart,
              items: state.cart.items.filter(item => item.id !== itemId)
            } : null
          }));
        } catch (error) {
          console.error('Error removing item from cart:', error);
          set({ error: 'Error al eliminar el producto del carrito' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (itemId: string, quantity: number) => {
        set({ isLoading: true, error: null });
        try {
          await api.put(`/cart/items/${itemId}`, { quantity });
          set(state => ({
            cart: state.cart ? {
              ...state.cart,
              items: state.cart.items.map(item =>
                item.id === itemId ? { ...item, quantity } : item
              )
            } : null
          }));
        } catch (error) {
          console.error('Error updating cart item quantity:', error);
          set({ error: 'Error al actualizar la cantidad' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null });
        try {
          await api.delete('/cart');
          set({ cart: null });
        } catch (error) {
          console.error('Error clearing cart:', error);
          set({ error: 'Error al vaciar el carrito' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      getSummary: () => {
        const state = get();
        if (!state.cart) return { totalItems: 0, subtotal: 0, discount: 0, total: 0 };
      
        const totalItems = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = state.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = state.cart.items.reduce((sum, item) => 
          item.product.compare_at_price ? sum + ((item.product.compare_at_price - item.price) * item.quantity) : sum, 0
        );
        const total = subtotal - discount;
      
        return { totalItems, subtotal, discount, total };
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        isLoading: state.isLoading,
        error: state.error
      })
    }
  )
);