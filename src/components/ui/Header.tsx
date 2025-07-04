import { useState, useEffect, useRef, useCallback } from 'react';
import { FiMenu, FiX, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { FaShoppingBag } from 'react-icons/fa';
import { FiPlus, FiMinus, FiTrash2, FiCreditCard } from 'react-icons/fi';
import type { User } from '../../utils/auth';
import { isAdmin, isOwner, isCustomer, getCurrentUser, getUserMenu, logout } from '../../utils/auth';
import LoadingSpinner from './LoadingSpinner';
import CartDropdown from '../cart/CartDropdown';
import { useCartStore } from '../../stores/cartStore';

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
  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
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
  // Declaración única al inicio del componente
  // Refs
  const cartMenuRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // State
  const { cart, removeItem, updateQuantity, clearCart, getSummary } = useCartStore();
  const summary = getSummary();
  const cartCount = summary.totalItems;
  const items = cart?.items || [];

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Efecto para cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartMenuRef.current && !cartMenuRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
      setIsLoading(true);
      setShowLogoutModal(false);
      await logout(); // Wait for logout to complete
      // The redirect is now handled in the logout function
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, we'll still redirect to home
      window.location.href = '/';
    } finally {
      setIsLoading(false);
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
      <header className="header fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <button className="header__menu-btn" aria-label="Menú" aria-expanded="false">
            <span className="header__menu-icon"></span>
          </button>
          <a href="/" className="header__logo" aria-label="Hilo Mágico - Inicio">
            <img 
              src="/img/hilo-magico-header.png" 
              alt="Hilo Mágico" 
              width="150" 
              height="75" 
              className="h-12 w-auto"
            />
          </a>
          <nav className="header__nav" aria-label="Navegación principal">
            <ul className="header__menu">
              {enlaces.map((enlace) => (
                <li key={enlace.url} className="header__menu-item">
                  <a href={enlace.url} className="header__enlace">{enlace.texto}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <a href="/auth/login" className="text-gray-600 hover:text-violet-600">Iniciar sesión</a>
            <button 
              className="relative p-2 text-gray-600 hover:text-violet-600"
              onClick={(e) => {
                e.preventDefault();
                setIsCartOpen(true);
              }}
            >
              <FaShoppingBag className="w-6 h-6" />
              <span className="sr-only">Carrito</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Renderizado completo en el cliente
  return (
    <>
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
            <div className="header__carrito">
              <button 
                className="header__carrito-btn"
                id="carrito-btn"
                aria-label="Carrito de compras"
                aria-expanded={isCartOpen}
                aria-controls="carrito-menu"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <FaShoppingBag className="header__carrito-icono" />
                {cartCount > 0 && (
                  <span className="header__carrito-contador">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
                <span className="sr-only">Ver carrito</span>
              </button>
              
              {/* Menú desplegable del carrito */}
              {isCartOpen && (
                <div className="header__carrito-menu" ref={cartMenuRef}>
                  <div className="header__carrito-header">
                    <h4>Carrito de compras</h4>
                  </div>
                  {cartCount > 0 ? (
                    <div className="header__carrito-contenido">
                      <div className="header__carrito-lista">
                        {items.slice(0, 3).map((item) => (
                          <div key={`${item.id}-${item.attributes?.size || ''}-${item.attributes?.color || ''}`} className="header__carrito-item">
                            <div className="header__carrito-item-imagen">
                              <img src={item.product.images[0] || ''} alt={item.product.name} />
                            </div>
                            <div className="header__carrito-item-detalle">
                              <h5 className="header__carrito-item-nombre">{item.product.name}</h5>
                              <div className="header__carrito-item-cantidad">
                                <button 
                                  className="header__carrito-item-quantity-btn"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <FiMinus className="header__carrito-item-quantity-icon" />
                                </button>
                                <span className="header__carrito-item-quantity">{item.quantity}</span>
                                <button 
                                  className="header__carrito-item-quantity-btn"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <FiPlus className="header__carrito-item-quantity-icon" />
                                </button>
                              </div>
                              <div className="header__carrito-item-precio">
                                ${item.product.price.toFixed(2)}
                              </div>
                              {item.attributes?.size && (
                                <div className="header__carrito-item-talla">
                                  Talla: {item.attributes?.size}
                                </div>
                              )}
                              {item.attributes?.color && (
                                <div className="header__carrito-item-color">
                                  Color: {item.attributes?.color}
                                </div>
                              )}
                            </div>
                            <button 
                              className="header__carrito-item-eliminar"
                              onClick={() => removeItem(item.id)}
                              aria-label={`Eliminar ${item.product.name} del carrito`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="carrito-vacio">
                      <p>No hay productos en el carrito</p>
                    </div>
                  )}
                  <div className="carrito__footer">
                    <div className="carrito__total">
                      <span>Total:</span>
                      <span>${summary.total.toFixed(2)}</span>
                    </div>
                    <div className="carrito__actions">
                      <div className="carrito__actions">
                        <button 
                          className="carrito-action-btn carrito-action-btn--clear"
                          onClick={() => clearCart()}
                        >
                          <FiTrash2 className="carrito-action-icon" />
                          <span className="carrito-action-text">Vaciar carrito</span>
                        </button>
                        <a 
                          href="/checkout"
                          className="carrito-action-btn carrito-action-btn--checkout"
                        >
                          <FiCreditCard className="carrito-action-icon" />
                          <span className="carrito-action-text">Proceder al checkout</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Espacio para el contenido debajo del header fijo */}
      <div className="h-16"></div>
      
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
      
      {/* Overlay de carga */}
      {isLoading && (
        <div className="loading-overlay">
          <LoadingSpinner size="large" className="loading-overlay__spinner" />
          <p className="loading-overlay__text">Cerrando sesión...</p>
        </div>
      )}
    </>
  );
}
