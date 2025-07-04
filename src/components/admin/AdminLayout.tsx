import type { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  currentPage?: string;
}

export function AdminLayout({ children, title = 'Panel de administración', currentPage = '' }: AdminLayoutProps) {
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: 'fas fa-home', current: currentPage === 'dashboard' },
    { name: 'Pedidos', href: '/admin/orders', icon: 'fas fa-box', current: currentPage === 'orders' },
    { name: 'Productos', href: '/admin/products', icon: 'fas fa-tshirt', current: currentPage === 'products' },
    { name: 'Clientes', href: '/admin/clients', icon: 'fas fa-users', current: currentPage === 'clients' },
    { name: 'Configuración', href: '/admin/settings', icon: 'fas fa-cog', current: currentPage === 'settings' },
  ];

  return (
    <div className="admin-layout">
      {/* Barra lateral */}
      <nav className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Hilo Mágico</h2>
        </div>
        <div className="admin-sidebar-menu">
          {navigation.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              className={`admin-sidebar-item ${item.current ? 'active' : ''}`}
            >
              <i className={item.icon}></i>
              <span>{item.name}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="admin-content">
        <header className="admin-header">
          <h1>{title}</h1>
        </header>
        <div className="admin-main-content">
          {children}
        </div>
      </main>
    </div>
  );
}
