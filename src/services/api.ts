import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { API_CONFIG } from '../config/api.config';

// Get token from localStorage (client-side only)
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

// Configuración por defecto usando la configuración centralizada
const DEFAULT_CONFIG: AxiosRequestConfig = {
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  withCredentials: true,
};

class ApiService {
  private static instance: ApiService;
  private api: AxiosInstance;
  private retryAttempts: number;
  private maxRetryAttempts: number;

  private constructor() {
    this.api = axios.create(DEFAULT_CONFIG);
    this.retryAttempts = 0;
    this.maxRetryAttempts = API_CONFIG.MAX_RETRY_ATTEMPTS;
    
    // Interceptor para agregar el token de autenticación
    this.api.interceptors.request.use(
      (config) => {
        // Solo en el cliente, obtener el token
        if (typeof window !== 'undefined') {
          const token = getAuthToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar respuestas
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;
        
        // Si el error es 401 y no es una solicitud de autenticación
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.retryAttempts >= this.maxRetryAttempts) {
            // Redirigir al login si se agotaron los intentos
            if (typeof window !== 'undefined') {
              window.location.href = '/login?error=session_expired';
            }
            return Promise.reject(error);
          }

          originalRequest._retry = true;
          this.retryAttempts++;

          try {
            // Aquí podrías implementar la lógica para refrescar el token
            // const newToken = await refreshToken();
            // if (newToken) {
            //   originalRequest.headers.Authorization = `Bearer ${newToken}`;
            //   return this.api(originalRequest);
            // }
          } catch (refreshError) {
            console.error('Error al refrescar el token:', refreshError);
            if (typeof window !== 'undefined') {
              window.location.href = '/login?error=session_expired';
            }
          }
        }

        // Manejo de otros errores
        if (error.response) {
          // El servidor respondió con un estado de error
          const responseData = error.response.data as { message?: string };
          const apiError: ApiResponse = {
            success: false,
            error: responseData?.message || 'Error en la solicitud',
            statusCode: error.response.status,
          };
          return Promise.reject(apiError);
        } else if (error.request) {
          // La solicitud fue hecha pero no se recibió respuesta
          const apiError: ApiResponse = {
            success: false,
            error: API_CONFIG.ERROR_MESSAGES.NETWORK,
          };
          return Promise.reject(apiError);
        } else {
          // Algo más causó el error
          const apiError: ApiResponse = {
            success: false,
            error: error.message || API_CONFIG.ERROR_MESSAGES.DEFAULT,
          };
          return Promise.reject(apiError);
        }
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Métodos HTTP
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.get<T>(url, config);
      return { success: true, data: response.data };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post<T>(url, data, config);
      return { success: true, data: response.data };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.put<T>(url, data, config);
      return { success: true, data: response.data };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.delete<T>(url, config);
      return { success: true, data: response.data };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): ApiResponse {
    // Si el error ya es un ApiResponse, lo devolvemos tal cual
    if (error && typeof error === 'object' && 'success' in error && 'error' in error) {
      return error;
    }
    
    // Manejo de errores de Axios
    if (error?.response) {
      // El servidor respondió con un estado de error
      return {
        success: false,
        error: error.response.data?.message || 'Error en la solicitud',
        statusCode: error.response.status,
      };
    } else if (error?.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      return {
        success: false,
        error: 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.',
      };
    } else {
      // Algo más causó el error
      return {
        success: false,
        error: error?.message || 'Error desconocido al procesar la solicitud',
      };
    }
  }
}

export const api = ApiService.getInstance();
