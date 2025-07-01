import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  // Agrega más campos según sea necesario
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (accessToken) => set({ accessToken }),
      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false });
        // Opcional: Limpiar localStorage manualmente por si acaso
        localStorage.removeItem('auth-storage');
      },
      initialize: () => {
        // Esta función se puede usar para verificar el token al cargar la aplicación
        // Por ejemplo, podrías hacer una petición a /me para verificar el token
      },
    }),
    {
      name: 'auth-storage', // nombre para el almacenamiento persistente
    }
  )
);

// Función para obtener el token de autenticación
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return useAuthStore.getState().accessToken;
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return useAuthStore.getState().isAuthenticated;
};

// Función para obtener información del usuario actual
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  return useAuthStore.getState().user;
};
