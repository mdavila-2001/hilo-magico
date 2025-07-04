import { useEffect } from 'react';
import { useCartStore } from '../stores/cartStore';
import { formatCurrency } from '../utils/format';

export default function Cart() {
  const { 
    cart, 
    isLoading, 
    error, 
    fetchCart, 
    removeItem, 
    updateQuantity,
    getSummary 
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(itemId, newQuantity);
  };

  if (isLoading && !cart) {
    return <div className="p-4 text-center">Cargando carrito...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  if (!cart || cart.items.length === 0) {
    return <div className="p-4 text-center">Tu carrito está vacío</div>;
  }

  const { subtotal, discount, total, totalItems } = getSummary();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tu Carrito ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row border-b pb-4">
              <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                {item.product.images?.[0] ? (
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sin imagen
                  </div>
                )}
              </div>
              
              <div className="flex-1 mt-4 sm:mt-0 sm:ml-6">
                <h3 className="text-lg font-medium">{item.product.name}</h3>
                <p className="text-gray-600">{item.product.description}</p>
                
                {Object.entries(item.attributes || {}).map(([key, value]) => (
                  <div key={key} className="text-sm text-gray-500 mt-1">
                    {key}: {String(value)}
                  </div>
                ))}
                
                <div className="mt-2 font-medium">
                  {formatCurrency(item.price)}
                </div>
                
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="px-2 py-1 border rounded-l hover:bg-gray-100"
                    disabled={isLoading}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-t border-b">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="px-2 py-1 border rounded-r hover:bg-gray-100"
                    disabled={isLoading}
                  >
                    +
                  </button>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-4 text-red-600 text-sm hover:underline"
                    disabled={isLoading}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-medium mb-4">Resumen del pedido</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              
              <div className="border-t border-gray-200 my-3"></div>
              
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            
            <button 
              className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              Proceder al pago
            </button>
            
            <p className="text-sm text-gray-500 mt-4 text-center">
              O <a href="/catalog" className="text-blue-600 hover:underline">seguir comprando</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
