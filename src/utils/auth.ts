// Tipos de autenticación
export interface User {
  id: string;
  email: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  mother_last_name: string | null;
  role: string;
  is_active: boolean;
}

export interface AuthResponse {
  data: {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_at: string;
    user: User;
  };
  success: boolean;
  message: string;
  debug_querys: any | null;
  status_code: number;
}

// Obtener el usuario actual desde localStorage
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  // Verificar si hay un token de acceso válido
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) return null;
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    const user = JSON.parse(userStr) as User;
    return user;
  } catch (error) {
    console.error('Error al analizar los datos del usuario:', error);
    return null;
  }
}

// Verificar si el usuario está autenticado
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Verificar si el usuario tiene un rol específico
export function hasRole(role: string): boolean {
  const user = getCurrentUser();
  return user?.role === role;
}

// Verificar si el usuario es administrador
export function isAdmin(): boolean {
  return hasRole('admin');
}

// Cerrar sesión
export function logout(): void {
  localStorage.removeItem('user');
  // Redirigir a la página de inicio de sesión
  //window.location.href = '/auth/login';
}

// Redirigir si no está autenticado
export function requireAuth(requiredRole?: string): boolean {
  const user = getCurrentUser();
  
  if (!user) {
    // No hay usuario autenticado
    window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    return false;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    // Usuario no tiene el rol requerido
    window.location.href = '/';
    return false;
  }
  
  return true;
}
