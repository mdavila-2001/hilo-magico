export interface User {
  id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
  // Alias para compatibilidad con name
  name?: string;
}

export interface UserProfile extends User {
  // Campos adicionales específicos del perfil
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
}
