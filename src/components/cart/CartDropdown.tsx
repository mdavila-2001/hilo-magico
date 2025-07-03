// src/components/cart/CartDropdown.tsx
import { useCartStore } from '../../stores/cartStore';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiX, FiPlus, FiMinus, FiTrash2, FiChevronRight } from 'react-icons/fi';
import { FaShoppingBag } from 'react-icons/fa';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCartStore();
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={handleClose}
            aria-hidden="true"
            style={{ pointerEvents: 'auto' }}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            style={{ boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.1)' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="carrito-titulo"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <button 
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 mr-2"
                  aria-label="Cerrar carrito"
                >
                  <FiChevronRight className="w-6 h-6" />
                </button>
                <h3 className="font-semibold text-lg">Carrito de compras</h3>
              </div>
              <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                <FaShoppingBag className="text-gray-600" />
              </div>
            </div>
            
            {/* Lista de productos */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FiShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center p-3 border-b border-gray-100">
                        <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
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
                  
                  {/* Resumen y botón de pago */}
                  <div className="border-t border-gray-200 p-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium text-gray-700">Total:</span>
                      <span className="font-bold text-lg text-violet-700">${totalPrice().toFixed(2)}</span>
                    </div>
                    <button 
                      className="w-full bg-violet-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-violet-700 transition-colors flex items-center justify-center"
                      onClick={() => {
                        handleClose();
                        window.location.href = '/checkout';
                      }}
                    >
                      Proceder al pago
                      <FiChevronRight className="ml-2" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}