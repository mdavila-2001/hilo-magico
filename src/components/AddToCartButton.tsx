// src/components/AddToCartButton.tsx
import { useState } from 'react';
import { useCartStore } from '../stores/cartStore';

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  talla?: string;
  color?: string;
}

export default function AddToCartButton({ producto }: { producto: Producto }) {
  const [isAdding, setIsAdding] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (producto.talla || producto.color) {
      setShowVariants(true);
    } else {
      addToCart({
        id: producto.id,
        name: producto.nombre,
        price: producto.precio,
        image: producto.imagen
      });
      setIsAdding(true);
      setTimeout(() => setIsAdding(false), 1000);
    }
  };

  const handleConfirmAdd = () => {
    if ((producto.talla && !selectedSize) || (producto.color && !selectedColor)) {
      return; // Validación básica
    }
    
    addToCart({
      id: producto.id,
      name: producto.nombre,
      price: producto.precio,
      image: producto.imagen,
      ...(producto.talla && { size: selectedSize }),
      ...(producto.color && { color: selectedColor })
    });
    
    setShowVariants(false);
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <>
      <button 
        className={`producto__carrito ${isAdding ? 'added' : ''}`}
        onClick={handleAddToCart}
        aria-label={isAdding ? '¡Agregado!' : 'Agregar al carrito'}
      >
        {isAdding ? '✓' : <i className="fas fa-shopping-cart"></i>}
      </button>

      {showVariants && (
        <div className="producto-variantes">
          <div className="producto-variantes__contenido">
            <h4>Selecciona las opciones</h4>
            
            {producto.talla && (
              <div className="producto-variante">
                <label>Talla:</label>
                <div className="producto-variante__opciones">
                  {['S', 'M', 'L', 'XL'].map((talla) => (
                    <button 
                      key={talla}
                      className={`producto-variante__opcion ${selectedSize === talla ? 'seleccionada' : ''}`}
                      onClick={() => setSelectedSize(talla)}
                    >
                      {talla}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {producto.color && (
              <div className="producto-variante">
                <label>Color:</label>
                <div className="producto-variante__opciones">
                  {['Rojo', 'Azul', 'Negro', 'Blanco'].map((color) => (
                    <button 
                      key={color}
                      className={`producto-variante__opcion ${selectedColor === color ? 'seleccionada' : ''}`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      onClick={() => setSelectedColor(color)}
                      aria-label={color}
                    ></button>
                  ))}
                </div>
              </div>
            )}

            <div className="producto-variantes__acciones">
              <button 
                className="producto-variantes__cancelar"
                onClick={() => setShowVariants(false)}
              >
                Cancelar
              </button>
              <button 
                className="producto-variantes__confirmar"
                onClick={handleConfirmAdd}
                disabled={!!(producto.talla && !selectedSize) || !!producto.color && !selectedColor}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
