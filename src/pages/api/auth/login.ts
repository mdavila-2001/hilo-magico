// src/pages/api/auth/login.ts
import type { APIRoute } from 'astro';
import { generateToken, setAuthTokenHeaders } from '@/lib/auth';

// Simulación de base de datos de usuarios
// En una aplicación real, esto vendría de una base de datos
const users = [
  {
    id: '1',
    email: 'usuario@ejemplo.com',
    // Contraseña: 'password123' (hasheada con bcrypt)
    password: '$2a$10$XFDq3wNxVigHmE5vJ4zP1e3J9ZQdKjz8XKJ1mYtN3vJQ7h8i9k0l1m2n3',
    name: 'Usuario de Prueba'
  }
];

export const post: APIRoute = async ({ request, cookies }) => {
  try {
    const data = await request.json();
    const { email, password } = data;

    // Validar que se proporcionen email y contraseña
    if (!email || !password) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email y contraseña son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Buscar usuario por email
    const user = users.find(u => u.email === email);
    
    // En una aplicación real, aquí verificarías la contraseña hasheada
    // Para este ejemplo, usamos una contraseña hardcodeada 'password123'
    const isValidPassword = password === 'password123';

    if (!user || !isValidPassword) {
      return new Response(
        JSON.stringify({ success: false, message: 'Credenciales inválidas' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generar token JWT
    const token = generateToken({ id: user.id, email: user.email });
    
    // Configurar la cookie de autenticación
    const headers = setAuthTokenHeaders(token);
    
    // Responder con éxito
    return new Response(
      JSON.stringify({ 
        success: true, 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name 
        },
        redirectTo: '/mi-cuenta'
      }),
      { 
        status: 200, 
        headers: {
          ...Object.fromEntries(headers),
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error en el servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
