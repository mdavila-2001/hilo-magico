// src/components/AddToCartButton.tsx
import { useState, useCallback } from 'react';
import { cartService } from '../services/cartService';

interface AddToCartButtonProps {
  productId: string;
  className?: string;
  variant?: 'icon' | 'button';
  onAddToCart?: () => void;
}

export default function AddToCartButton({ 
  productId,
  className = '',
  variant = 'icon',
  onAddToCart
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = useCallback(async () => {
    console.log('Iniciando agregar al carrito, producto ID:', productId);
    setIsLoading(true);
    setError(null);
    
    try {
      // Usar el servicio del carrito
      const success = await cartService.addToCart(productId, 1);
      
      if (success) {
        console.log('Producto agregado exitosamente');
        // Disparar evento personalizado para notificar a otros componentes
        const event = new CustomEvent('cart-updated', { 
          detail: { productId } 
        });
        window.dispatchEvent(event);
        
        // Llamar al callback si existe
        onAddToCart?.();
      } else {
        throw new Error('No se pudo agregar el producto al carrito');
      }
    } catch (error: any) {
      console.error('Error al agregar al carrito:', error);
      setError(error.message || 'Error al agregar el producto al carrito');
    } finally {
      setIsLoading(false);
    }
  }, [productId, onAddToCart]);

  // Estilos base para el botón
  const baseStyles = 'flex items-center justify-center rounded-full transition-colors';
  
  // Estilos específicos según la variante
  const variantStyles = variant === 'icon' 
    ? 'w-10 h-10 bg-primary-500 hover:bg-primary-600 text-white'
    : 'px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white';

  // Contenido del botón
  const buttonContent = variant === 'icon' ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ) : (
    'Agregar al carrito'
  );

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isLoading}
        className={`${baseStyles} ${variantStyles} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Agregar al carrito"
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : buttonContent}
      </button>
      
      {error && (
        <div className="mt-2 text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
