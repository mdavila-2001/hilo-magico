// src/components/cart/CartDropdown.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus, FiTrash2, FiChevronRight } from 'react-icons/fi';
import { FaShoppingBag, FaSpinner } from 'react-icons/fa';
import type { CartItem } from '../../services/cartService';
import { cartService } from '../../services/cartService';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  // Calcular totales
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Cargar los ítems del carrito
  const loadCartItems = async () => {
    try {
      setIsLoading(true);
      const cartItems = await cartService.getCartItems();
      setItems(cartItems);
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Escuchar eventos de actualización del carrito
  useEffect(() => {
    if (isOpen) {
      loadCartItems();
    }

    const handleCartUpdate = () => loadCartItems();
    window.addEventListener('cart-updated', handleCartUpdate);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await cartService.updateCartItem(itemId, newQuantity);
      await loadCartItems();
    } catch (error) {
      console.error('Error al actualizar la cantidad:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await cartService.removeFromCart(itemId);
      await loadCartItems();
    } catch (error) {
      console.error('Error al eliminar el ítem:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(price);
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
            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Tu carrito ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
              </h2>

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <FaSpinner className="animate-spin h-8 w-8 text-rosa-pastel" />
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-12">
                  <FaShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Tu carrito está vacío</h3>
                  <p className="mt-1 text-gray-500">Comienza a agregar productos a tu carrito</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start py-4 border-b border-gray-100">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <img
                          src={item.product.images?.[0] || '/placeholder-product.jpg'}
                          alt={item.product.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex-1">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.product.name}</h3>
                          <p className="ml-4">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.product.price)} c/u
                        </p>

                        <div className="mt-2 flex items-center">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="text-gray-400 hover:text-gray-500 p-1"
                            aria-label="Disminuir cantidad"
                          >
                            <FiMinus className="h-4 w-4" />
                          </button>
                          <span className="mx-2 text-gray-700">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-400 hover:text-gray-500 p-1"
                            aria-label="Aumentar cantidad"
                          >
                            <FiPlus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="ml-4 p-1 text-gray-400 hover:text-red-500"
                        aria-label="Eliminar producto"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}