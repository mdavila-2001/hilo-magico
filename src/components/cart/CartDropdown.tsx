// src/components/cart/CartDropdown.tsx
import { useCartStore } from '../../stores/cartStore';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiX, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';

export default function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCartStore();
  
  // Cerrar el carrito al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.cart-dropdown') && !target.closest('.cart-button')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative">
      <button 
        className="cart-button relative p-2 text-gray-700 hover:text-violet-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Carrito de compras"
      >
        <FiShoppingCart className="w-6 h-6" />
        {totalItems() > 0 && (
          <span className="absolute -top-1 -right-1 bg-violet-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems()}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="cart-dropdown absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Tu Carrito</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Cerrar carrito"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <FiShoppingCart className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p>Tu carrito está vacío</p>
              </div>
            ) : (
              <>
                <div className="max-h-96 overflow-y-auto p-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center py-3 border-b border-gray-100 last:border-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          {item.size && `Talla: ${item.size} `}
                          {item.color && `• Color: ${item.color}`}
                        </p>
                        <p className="font-semibold text-violet-700">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-gray-500 hover:text-violet-700 p-1"
                          aria-label="Reducir cantidad"
                        >
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-500 hover:text-violet-700 p-1"
                          aria-label="Aumentar cantidad"
                        >
                          <FiPlus className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-1 ml-1"
                          aria-label="Eliminar producto"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="flex justify-between mb-4 font-semibold">
                    <span>Total:</span>
                    <span>${totalPrice().toFixed(2)}</span>
                  </div>
                  <button 
                    className="w-full bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-violet-700 transition-colors"
                    onClick={() => {
                      // Navegar al checkout
                      window.location.href = '/checkout';
                    }}
                  >
                    Proceder al pago
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}