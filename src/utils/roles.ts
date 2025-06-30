// Tipos de roles
export type UserRole = 'admin' | 'user' | 'owner' | 'seller' | 'customer';

// Interfaz para el usuario
export interface User {
  id?: string;
  email?: string;
  role: UserRole;
  [key: string]: any; // Para propiedades adicionales
}

// Rol por defecto
const DEFAULT_ROLE: UserRole = 'user';

// Obtener el rol del usuario actual
export function getCurrentRole(): UserRole {
  if (typeof window === 'undefined') return DEFAULT_ROLE;
  
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return DEFAULT_ROLE;
    
    const user = JSON.parse(userData);
    return user?.role || DEFAULT_ROLE;
  } catch (error) {
    console.error('Error al obtener el rol del usuario:', error);
    return DEFAULT_ROLE;
  }
}

// Verificar si el usuario tiene un rol específico
export function hasRole(role: UserRole): boolean {
  const currentRole = getCurrentRole();
  
  // Si el rol es admin, tiene acceso a todo
  if (currentRole === 'admin') return true;
  
  // Verificar el rol solicitado
  return currentRole === role;
}

// Verificar si el usuario tiene alguno de los roles especificados
export function hasAnyRole(roles: UserRole[]): boolean {
  return roles.some(role => hasRole(role));
}

// Verificar si el usuario es administrador
export const isAdmin = (): boolean => hasRole('admin');

// Verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
  return getCurrentRole() !== 'user';
};

// Establecer el rol del usuario
export function setUserRole(role: UserRole, userData?: Partial<User>): void {
  if (typeof window === 'undefined') return;
  
  const user: User = {
    ...userData,
    role: role || 'user',
  };
  
  localStorage.setItem('user', JSON.stringify(user));
}

// Cerrar sesión
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

// Obtener información del usuario actual
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
    return null;
  }
}
