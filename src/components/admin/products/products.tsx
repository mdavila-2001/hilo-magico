import { useState, useEffect } from 'react';
import { AdminLayout } from '../AdminLayout';
import { Button } from '../../ui/Button';
import { isAdmin } from '../../../lib/auth';
import { ProductForm } from './ProductForm';

// Función para normalizar strings con caracteres especiales
function normalizeText(text: string): string {
  return text.normalize('NFC');
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  image: string;
}

interface ProductFormData {
  name: string;
  price: string;
  stock: string;
  status: string;
  image?: File;
}

export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
        if (!isAdmin(JSON.parse(userStr))) {
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        window.location.href = '/';
      }
    } else {
      window.location.href = '/';
    }
  }, []);

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

  const handleEdit = (product?: Product) => {
    setSelectedProduct(product);
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    // Implementar lógica de eliminación
    console.log('Eliminar producto:', id);
  };

  const handleCloseForm = () => {
    setIsEditing(false);
    setSelectedProduct(undefined);
  };

  const handleSubmitForm = (formData: FormData) => {
    // Convertir los valores del formulario a los tipos correctos
    const productData: ProductFormData = {
      name: formData.get('name') as string,
      price: formData.get('price') as string,
      stock: formData.get('stock') as string,
      status: formData.get('status') as string,
      image: formData.get('image') as File
    };

    // Implementar lógica de envío del formulario
    console.log('Formulario enviado:', productData);
    handleCloseForm();
  };

  return (
    <AdminLayout>
      <div className="products-page">
        <div className="products-header">
          <h2>{normalizeText('Gestión de Productos')}</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder={normalizeText('Buscar productos...')}
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>
          <button className="add-product-btn" onClick={() => handleEdit(undefined)}>
            {normalizeText('Agregar Producto')}
          </button>
        </div>
        <div className="products-table">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left">{normalizeText('Imagen')}</th>
                <th className="px-6 py-3 text-left">{normalizeText('Nombre')}</th>
                <th className="px-6 py-3 text-left">{normalizeText('Precio')}</th>
                <th className="px-6 py-3 text-left">{normalizeText('Stock')}</th>
                <th className="px-6 py-3 text-left">{normalizeText('Estado')}</th>
                <th className="px-6 py-3 text-left">{normalizeText('Acciones')}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img
                      src={product.image}
                      alt={normalizeText(product.name)}
                      className="w-20 h-20 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">{normalizeText(product.name)}</td>
                  <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {normalizeText(product.status === 'active' ? 'Activo' : 'Inactivo')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="edit-btn" onClick={() => handleEdit(product)}>
                      <i className="fas fa-edit"></i>
                      {normalizeText('Editar')}
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                      <i className="fas fa-trash"></i>
                      {normalizeText('Eliminar')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isEditing && (
          <ProductForm
            product={selectedProduct}
            onClose={handleCloseForm}
            onSubmit={handleSubmitForm}
          />
        )}
      </div>
    </AdminLayout>
  );
}
              