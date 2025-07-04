// src/components/AddToCartButton.tsx
import { useState } from 'react';
import { useCartStore } from '../stores/cartStore';
import type { Producto } from '../types/product.types';
import type { CartItemProduct } from '../types/cart.types';

interface Props {
  producto: Producto;
  onAddToCart?: () => void;
}

export default function AddToCartButton({ producto, onAddToCart }: Props) {
  const [showVariants, setShowVariants] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const { addItem } = useCartStore();

  const handleConfirmAdd = async () => {
    setIsLoading(true);
    try {
      const cartItemProduct: CartItemProduct = {
        id: producto.id,
        name: producto.name,
        description: producto.description,
        price: producto.price,
        compare_at_price: producto.compare_at_price,
        cost_price: null,
        stock: producto.stock,
        stock_minimo: 0,
        weight: null,
        is_active: producto.is_active,
        is_featured: producto.is_featured,
        has_variants: Boolean((producto.sizes || []).length > 0 || (producto.colors || []).length > 0),
        images: producto.images,
        sku: producto.id,
        store_id: producto.store_id,
        category_id: producto.category,
        created_at: producto.created_at,
        updated_at: producto.updated_at,
        deleted_at: null,
        category: null
      };

      await addItem(cartItemProduct, 1/* , {
        size: selectedSize,
        color: selectedColor
      } */);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
      onAddToCart?.();
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    } finally {
      setIsLoading(false);
      setShowVariants(false);
    }
  };

  const hasVariants = (producto.sizes && producto.sizes.length > 0) || (producto.colors && producto.colors.length > 0);

  return (
    <>
      <button 
        className={`producto__acciones ${isAdded ? 'agregado' : ''}`}
        onClick={handleConfirmAdd}
        disabled={isLoading || !producto.is_active}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
        ) : (
          <i className="fas fa-shopping-cart"></i>
        )}
      </button>
    </>
  );
}
