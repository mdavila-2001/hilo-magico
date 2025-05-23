import React from 'react';
import CartIcon from './CartIcon';

// Simple User Icon SVG component
const UserIcon = ({ className = '' }) => (
  <svg 
    className={className}
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    width="24"
    height="24"
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

// Get the current path from the URL
const getCurrentPath = () => {
  // Return a default path during SSR
  if (typeof window === 'undefined') {
    return '/';
  }
  return window.location.pathname;
};

interface MenuItem {
  texto: string;
  url: string;
}

const HeaderReact: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [currentPath, setCurrentPath] = React.useState(getCurrentPath());

  // Update current path when it changes
  React.useEffect(() => {
    // Skip this effect during SSR
    if (typeof window === 'undefined') return;
    
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
    };
    
    // Set initial path
    setCurrentPath(window.location.pathname);
    
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const menuItems: MenuItem[] = [
    { texto: 'Inicio', url: '/' },
    { texto: 'Productos', url: '/productos' },
    { texto: 'Servicios', url: '/servicios' },
    { texto: 'Contacto', url: '/contacto' },
    { texto: 'Mi Cuenta', url: '/cuenta' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header__content">
        {/* Logo */}
        <div className="header__logo">
          <a href="/" aria-label="Inicio - Hilo Mágico">
            <img 
              src="/logo-hilo-magico.png" 
              alt="Hilo Mágico - Tienda de manualidades" 
              width="180" 
              height="48"
              loading="lazy"
              className="header__logo-img"
            />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          id="menuToggle"
          className="header__menu-toggle"
          aria-label="Menú"
          aria-expanded={isMenuOpen}
          aria-controls="mainNav"
          onClick={toggleMenu}
        >
          <span className="menu-icon"></span>
        </button>

        {/* Desktop Navigation */}
        <nav id="mainNav" className="header__nav" aria-label="Navegación principal">
          <ul className="nav__list">
            {menuItems.map((item) => (
              <li key={item.url} className="nav__item">
                <a
                  href={item.url}
                  className={`nav__link ${
                    currentPath === item.url ? 'nav__link--active' : ''
                  }`}
                >
                  {item.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="header__actions">
          <a
            href="/cuenta"
            className="header__account"
            aria-label="Mi cuenta"
          >
            <UserIcon className="h-6 w-6" />
          </a>
          <div className="relative">
            <CartIcon />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} py-4`} 
        id="mobileMenu"
      >
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={`mobile-${item.url}`}>
              <a
                href={item.url}
                className={`block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md ${
                  currentPath === item.url ? 'bg-indigo-50 text-indigo-700' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.texto}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default HeaderReact;
