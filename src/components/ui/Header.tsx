import { useState, useEffect, useRef } from 'react';
import type { User } from '../../utils/auth';
import { isAdmin, isOwner, isCustomer, getCurrentUser, getUserMenu, logout } from '../../utils/auth';

interface NavLink {
  texto: string;
  url: string;
}

// Tipos para las props del modal
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

// Componente de Modal de Confirmación
const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirmar', 
  cancelText = 'Cancelar' 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            {cancelText}
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    setIsClient(true);
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogoutClick = (e: React.MouseEvent, url: string, isLogout: boolean = false) => {
    if (isLogout) {
      e.preventDefault();
      setShowLogoutModal(true);
      setIsUserMenuOpen(false); // Close user menu when logout is clicked
    }
  };

  const confirmLogout = async () => {
    try {
      setShowLogoutModal(false);
      await logout(); // Wait for logout to complete
      // The redirect is now handled in the logout function
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, we'll still redirect to home
      window.location.href = '/';
    }
  };
  
  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Navegación principal
  const enlaces: NavLink[] = [
    { texto: 'Inicio', url: '/' },
    { texto: 'Catálogo', url: '/catalog' },
    { texto: 'Servicios', url: '/services' },
    { texto: 'Galería', url: '/gallery' },
    { texto: 'Contacto', url: '/contact' },
  ];

  // Efecto para manejar la hidratación
  useEffect(() => {
    setIsClient(true);
    // Obtener usuario del localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error('Error al parsear usuario:', error);
      }
    }
  }, []);

  // Función para obtener el nombre completo del usuario
  const getNombreCompleto = (user: User | null): string => {
    if (!user) return 'Usuario';
    const { first_name, middle_name, last_name, mother_last_name } = user;
    return [first_name, middle_name, last_name, mother_last_name]
      .filter(Boolean)
      .join(' ');
  };

  // Manejar cierre de sesión
  const handleLogout = async () => {
    try {
      const response = await fetch('/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Si no estamos en el cliente, renderizar solo el HTML básico
  if (!isClient) {
    return (
      <header className="header">
        <div className="contenedor header__contenedor">
          {/* Contenido estático para SSR */}
          <button className="header__menu-btn" aria-label="Menú" aria-expanded="false">
            <span className="header__menu-icon"></span>
          </button>
          <a href="/" className="header__logo" aria-label="Hilo Mágico - Inicio">
            <img 
              src="/img/hilo-magico-header.png" 
              alt="Hilo Mágico" 
              width="200" 
              height="100" 
            />
          </a>
          <nav className="header__nav" aria-label="Navegación principal">
            <ul className="header__menu">
              {enlaces.map((enlace, index) => (
                <li key={index} className="header__menu-item">
                  <a href={enlace.url} className="header__enlace">{enlace.texto}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    );
  }

  // Renderizado completo en el cliente
  return (
    <header className="header">
      <div className="contenedor header__contenedor">
        {/* Botón del menú móvil */}
        <button 
          className="header__menu-btn" 
          aria-label="Menú" 
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="header__menu-icon"></span>
        </button>

        {/* Logo */}
        <a href="/" className="header__logo" aria-label="Hilo Mágico - Inicio">
          <img 
            src="/img/hilo-magico-header.png" 
            alt="Hilo Mágico" 
            width="200" 
            height="100" 
          />
        </a>

        {/* Navegación principal */}
        <nav 
          className={`header__nav ${isMenuOpen ? 'active' : ''}`} 
          aria-label="Navegación principal"
        >
          <ul className="header__menu">
            {enlaces.map((enlace, index) => (
              <li key={index} className="header__menu-item">
                <a 
                  href={enlace.url} 
                  className="header__enlace"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {enlace.texto}
                </a>
              </li>
            ))}
            
            {/* Mostrar enlaces de administrador si el usuario es admin */}
            {user && isAdmin(user)}
          </ul>
        </nav>

        <div className="header__acciones">
            
          {/* Botones de autenticación */}
          <div className="header__auth">
            {isClient && user ? (
              <div className="header__user" ref={userMenuRef}>
                <button 
                  className="header__user-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-expanded={isUserMenuOpen}
                  aria-label="Menú de usuario"
                >
                  <i className="fas fa-user-circle"></i>
                </button>
                {isUserMenuOpen && (
                  <div className="header__user-menu">
                    <div className="header__user-info">
                      <p className="header__user-name">
                        {user.first_name || 'Usuario'}
                        {isAdmin(user) && ' (Admin)'}
                        {isOwner(user) && ' (Dueño)'}
                        {isCustomer(user) && ' (Cliente)'}
                      </p>
                      <p className="header__user-email">{user.email}</p>
                    </div>
                    <nav className="header__user-nav">
                      {getUserMenu(user.role).map((item, index) => (
                        <a 
                          key={index}
                          href={item.url}
                          className={`header__user-link ${item.isLogout ? 'header__user-link--logout' : ''}`}
                          onClick={(e) => handleLogoutClick(e, item.url, item.isLogout)}
                        >
                          <i className={`fas fa-${item.icon}`}></i> {item.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}
              </div>
            ) : (
              <a href="/auth/login" className="header__auth-link header__auth-link--login">
                Iniciar sesión
              </a>
            )}
          </div>

          {/* Botón del carrito */}
          <button 
            className="header__carrito-btn" 
            id="carrito-btn"
            aria-label="Carrito de compras"
            aria-expanded="false"
            aria-controls="carrito"
          >
            <i className="fas fa-shopping-cart" aria-hidden="true"></i>
            <span className="header__carrito-contador" id="contador-carrito">0</span>
            <span className="sr-only">Ver carrito</span>
          </button>
        </div>
      </div>
      
      {/* Modal de confirmación de cierre de sesión */}
      <ConfirmModal 
        isOpen={showLogoutModal}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
        title="Cerrar sesión"
        message="¿Estás seguro de que deseas cerrar la sesión?"
        confirmText="Sí, cerrar sesión"
        cancelText="Cancelar"
      />
      
      {/* Overlay para menú móvil */}
      <div 
        className={`header__overlay ${isMenuOpen ? 'active' : ''}`} 
        onClick={() => setIsMenuOpen(false)}
      ></div>
    </header>
  );
}
