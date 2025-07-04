import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../config/api.config';
import type { Producto, ProductsResponse } from '../types/product.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

// Crear una instancia de axios para el catálogo
const catalogApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
});

// Servicio para manejar las operaciones del catálogo
export const catalogService = {
  // Obtener todos los productos
  /**
   * Obtiene todos los productos del catálogo
   * @param page Número de página (opcional)
   * @param limit Límite de productos por página (opcional)
   * @param search Término de búsqueda (opcional)
   */
  async getProducts(page: number = 1, limit: number = 12, search?: string): Promise<ProductsResponse> {
    try {
      console.log('Solicitando productos...');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search })
      });

      const response = await catalogApi.get(`/catalog/products`);
      
      // Verificar si la respuesta tiene el formato esperado
      if (response.data && typeof response.data === 'object') {
        // Si la respuesta ya tiene la estructura esperada
        if ('items' in response.data) {
          return {
            products: response.data.items || [],
            total: response.data.total || 0,
            page: response.data.page || 1,
            limit: response.data.limit || limit,
            totalPages: response.data.totalPages || response.data.total_pages || 1
          };
        }
        
        // Si la respuesta tiene un formato diferente
        if ('data' in response.data && Array.isArray(response.data.data)) {
          return {
            products: response.data.data as Producto[],
            total: response.data.meta?.total || response.data.total || response.data.data.length,
            page: response.data.meta?.current_page || page,
            limit: response.data.meta?.per_page || limit,
            totalPages: response.data.meta?.last_page || 1
          };
        }
      }
      
      console.error('Formato de respuesta inesperado:', response.data);
      throw new Error('Formato de respuesta inesperado de la API');
      
    } catch (error) {
      console.error('Error en catalogService.getProducts:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
      }
      throw error;
    }
  },

  // Obtener un producto por ID
  async getProductById(id: string): Promise<Producto | null> {
    try {
      const response = await catalogApi.get<ApiResponse<Producto>>(`/catalog/products/${id}`);
      if (response.data?.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error(`Error al obtener el producto con ID ${id}:`, error);
      return null;
    }
  },

  // Obtener productos destacados
  async getFeaturedProducts(limit: number = 4): Promise<Producto[]> {
    try {
      const response = await catalogApi.get<ApiResponse<{ items: Producto[] }>>('/catalog/products', {
        params: { is_featured: true, limit }
      });
      
      if (response.data?.success) {
        return response.data.data.items;
      }
      return [];
    } catch (error) {
      console.error('Error al obtener productos destacados:', error);
      return [];
    }
  }
};

export default catalogService;
