import { serialize, parse } from 'cookie';
import jwt from 'jsonwebtoken';
import type { APIContext } from 'astro';

// Tipos
export interface JwtPayload {
  userId: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

// Configuración
export const AUTH_COOKIE = 'auth_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: import.meta.env.PROD, // Usar secure solo en producción
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 días por defecto
};

// Función auxiliar para parsear tiempos como '7d' a segundos
function parseTimeToSeconds(timeStr: string): number {
  const time = parseInt(timeStr, 10);
  if (isNaN(time)) return 60 * 60 * 24 * 7; // Valor por defecto: 7 días en segundos
  
  if (timeStr.endsWith('s')) return time;
  if (timeStr.endsWith('m')) return time * 60;
  if (timeStr.endsWith('h')) return time * 60 * 60;
  if (timeStr.endsWith('d')) return time * 60 * 60 * 24;
  if (timeStr.endsWith('w')) return time * 60 * 60 * 24 * 7;
  if (timeStr.endsWith('y')) return time * 60 * 60 * 24 * 365;
  
  // Si no tiene sufijo, asumimos que está en segundos
  return time;
}

// Configuración de JWT
export const JWT_CONFIG = {
  secret: import.meta.env.JWT_SECRET || 'hilo-magico-secret-key-dev',
  expiresIn: import.meta.env.JWT_EXPIRES_IN || '7d',
  expiresInSeconds: parseTimeToSeconds(import.meta.env.JWT_EXPIRES_IN || '7d'),
};

// Función para generar un token JWT
export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>, expiresIn: string = JWT_CONFIG.expiresIn): string {
  return jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn,
  });
}

// Función para verificar un token JWT
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_CONFIG.secret) as JwtPayload;
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return null;
  }
}

// Función para establecer la cookie de autenticación
export function setAuthCookie(context: APIContext, token: string, rememberMe: boolean = false): void {
  const options = { ...COOKIE_OPTIONS };
  
  if (rememberMe) {
    options.maxAge = 60 * 60 * 24 * 30; // 30 días para "recordar sesión"
  }
  
  context.cookies.set(AUTH_COOKIE, token, options);
}
