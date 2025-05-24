// src/utils/filters.ts
import type { Tienda, Producto } from '../data/productos';

export interface TiendaConProductos extends Tienda {
  productos: Producto[];
  visible: boolean;
}

export function filtrarTiendas(
  tiendas: TiendaConProductos[], 
  searchTerm: string, 
  categoriasSeleccionadas: string[]
): TiendaConProductos[] {
  return tiendas.map(tienda => {
    // Filtrar productos basados en el término de búsqueda
    const productosFiltrados = tienda.productos.filter(producto => {
      const productoCoincide = !searchTerm || 
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      
      const categoriaCoincide = categoriasSeleccionadas.length === 0 || 
        categoriasSeleccionadas.includes(producto.categoria);
      
      return productoCoincide && categoriaCoincide;
    });
    
    // Verificar si la tienda coincide con la búsqueda
    const tiendaCoincide = !searchTerm || 
      tienda.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tienda.descripcion?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      productosFiltrados.length > 0;
    
    const visible = tiendaCoincide && 
      (categoriasSeleccionadas.length === 0 || productosFiltrados.length > 0);
    
    return {
      ...tienda,
      productos: productosFiltrados,
      visible
    };
  });
}

export function getUniqueCategories(productos: Producto[]): string[] {
  const categorias = new Set<string>();
  productos.forEach(producto => {
    if (producto.categoria) {
      categorias.add(producto.categoria);
    }
  });
  return Array.from(categorias).sort();
}

export function groupProductsByStore(tiendas: Tienda[], productos: Producto[]): TiendaConProductos[] {
  return tiendas.map(tienda => ({
    ...tienda,
    productos: productos.filter(p => p.tiendaId === tienda.id),
    visible: true
  }));
}
