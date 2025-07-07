import { useState, useEffect } from 'react';

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

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

export function ProductForm({ product, onClose, onSubmit }: ProductFormProps) {
  const [formData, setFormData] = useState(new FormData());

  useEffect(() => {
    if (product) {
      setFormData(new FormData());
      Object.entries(product).forEach(([key, value]) => {
        if (key !== 'id') {
          formData.append(key, value.toString());
        }
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="product-form">
      <h3>{product ? 'Editar Producto' : 'Nuevo Producto'}</h3>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input 
            type="text" 
            id="name"
            name="name" 
            defaultValue={product?.name}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Precio</label>
          <input 
            type="number" 
            id="price"
            name="price" 
            defaultValue={product?.price}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input 
            type="number" 
            id="stock"
            name="stock" 
            defaultValue={product?.stock}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Estado</label>
          <select 
            id="status"
            name="status" 
            defaultValue={product?.status}
            className="form-input"
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="image">Imagen</label>
          <input 
            type="file" 
            id="image"
            name="image" 
            className="form-input"
          />
          {product?.image && (
            <img 
              src={product.image} 
              alt={product.name} 
              className="product-image-preview"
            />
          )}
        </div>
        <div className="form-actions">
          <button 
            type="submit"
            className="submit-btn"
          >
            <i className="fas fa-save"></i>
            {product ? 'Actualizar' : 'Crear'}
          </button>
          <button 
            type="button"
            onClick={onClose}
            className="cancel-btn"
          >
            <i className="fas fa-times"></i>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
