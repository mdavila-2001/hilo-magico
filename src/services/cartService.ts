import { api } from './api';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images?: string[];
  };
}

export const cartService = {
  // Obtener los ítems del carrito
  async getCartItems(): Promise<CartItem[]> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return [];
      
      const response = await api.get('/cart/items', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      return response.data.items || [];
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      return [];
    }
  },

  // Agregar un producto al carrito
  async addToCart(productId: string, quantity: number = 1): Promise<boolean> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return false;
      
      await api.post('/cart/items', 
        { product_id: productId, quantity },
        { headers: { 'Authorization': `Bearer ${token}` }}
      );
      
      return true;
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      return false;
    }
  },

  // Eliminar un ítem del carrito
  async removeFromCart(itemId: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return false;
      
      await api.delete(`/cart/items/${itemId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      return true;
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      return false;
    }
  },

  // Actualizar la cantidad de un ítem en el carrito
  async updateCartItem(itemId: string, quantity: number): Promise<boolean> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return false;
      
      await api.put(
        `/cart/items/${itemId}`,
        { quantity },
        { headers: { 'Authorization': `Bearer ${token}` }}
      );
      
      return true;
    } catch (error) {
      console.error('Error al actualizar el carrito:', error);
      return false;
    }
  }
};
