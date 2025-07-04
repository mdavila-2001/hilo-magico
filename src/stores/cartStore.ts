// src/stores/cartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '../services/api';
import type { Cart, CartResponse } from '../types/cart.types';

interface StoreState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number, attributes?: Record<string, any>) => Promise<void>;
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
          console.log('Obteniendo carrito desde: /cart/items/');
          const response = await api.get<CartResponse>('/cart/items/');
          console.log('Respuesta del carrito:', response.data);
          set({ cart: response.data });
        } catch (error) {
          console.error('Error fetching cart:', error);
          set({ error: 'Error al cargar el carrito' });
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (productId: string, quantity = 1, attributes = {}): Promise<void> => {
        console.log('Agregando producto al carrito:', { productId, quantity, attributes });
        set({ isLoading: true, error: null });
        try {
          const payload = {
            product_id: productId,
            quantity,
            attributes
          };
          console.log('Enviando petición a /cart/items/ con:', payload);
          
          const response = await api.post<CartResponse>('/cart/items/', payload);
          console.log('Respuesta del servidor:', response.data);
          
          // Actualizar el carrito con la respuesta
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
        if (quantity < 1) {
          get().removeItem(itemId);
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const response = await api.put<CartResponse>(`/cart/items/${itemId}`, { quantity });
          set({ cart: response.data });
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
          await api.delete('/cart/items');
          set({ cart: { ...get().cart!, items: [] } });
        } catch (error) {
          console.error('Error clearing cart:', error);
          set({ error: 'Error al vaciar el carrito' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      getSummary: () => {
        const cart = get().cart;
        if (!cart) return { totalItems: 0, subtotal: 0, discount: 0, total: 0 };
        
        const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        // Aquí podrías agregar lógica de descuentos si es necesario
        const discount = 0;
        
        return {
          totalItems: cart.items.reduce((total, item) => total + item.quantity, 0),
          subtotal,
          discount,
          total: subtotal - discount
        };
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart })
    }
  )
);