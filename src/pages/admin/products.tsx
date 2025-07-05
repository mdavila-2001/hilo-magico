import { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/Button';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  image: string;
}

export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const products: Product[] = [
    {
      id: 1,
      name: 'Vestido de encaje',
      price: 129.99,
      stock: 25,
      status: 'active',
      image: '/img/products/vestido-encaje.jpg'
    },
    {
      id: 2,
      name: 'Blusa bordada',
      price: 89.99,
      stock: 15,
      status: 'inactive',
      image: '/img/products/blusa-bordada.jpg'
    }
  ];

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    // Implementar lógica de eliminación
    console.log('Eliminar producto:', id);
  };

  return (
    <AdminLayout>
      <div className="admin-products">
        <div className="admin-products-header">
          <h1>Productos</h1>
          <Button 
            variant="primary" 
            onClick={() => setIsEditing(true)}
          >
            Nuevo Producto
          </Button>
        </div>

        <div className="admin-products-table">
          <table>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="admin-products-image"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span 
                      className={`admin-products-status ${product.status === 'active' ? 'active' : 'inactive'}`}
                    >
                      {product.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-products-actions">
                      <button 
                        className="admin-products-action-btn edit"
                        onClick={() => handleEdit(product)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="admin-products-action-btn delete"
                        onClick={() => handleDelete(product.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de edición */}
        {isEditing && (
          <div className="admin-products-modal">
            <div className="admin-products-modal-content">
              <h2>{selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <form className="admin-products-form">
                <div className="admin-products-form-group">
                  <label htmlFor="name">Nombre</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name" 
                    defaultValue={selectedProduct?.name}
                  />
                </div>
                <div className="admin-products-form-group">
                  <label htmlFor="price">Precio</label>
                  <input 
                    type="number" 
                    id="price"
                    name="price" 
                    defaultValue={selectedProduct?.price}
                  />
                </div>
                <div className="admin-products-form-group">
                  <label htmlFor="stock">Stock</label>
                  <input 
                    type="number" 
                    id="stock"
                    name="stock" 
                    defaultValue={selectedProduct?.stock}
                  />
                </div>
                <div className="admin-products-form-group">
                  <label htmlFor="status">Estado</label>
                  <select 
                    id="status"
                    name="status" 
                    defaultValue={selectedProduct?.status}
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
                <div className="admin-products-form-group">
                  <label htmlFor="image">Imagen</label>
                  <input 
                    type="file" 
                    id="image"
                    name="image" 
                  />
                </div>
                <div className="admin-products-form-actions">
                  <Button 
                    variant="primary"
                    type="submit"
                  >
                    {selectedProduct ? 'Actualizar' : 'Crear'}
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedProduct(null);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
