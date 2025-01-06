import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, AlertCircle, X } from 'lucide-react';

interface AddToCartToastProps {
  show: boolean;
  onClose: () => void;
  message?: string;
  type?: 'success' | 'error';
}

export function AddToCartToast({ 
  show, 
  onClose, 
  message = 'Added to cart',
  type = 'success' 
}: AddToCartToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div
            className={`
              relative flex items-center gap-4 min-w-[320px] max-w-md
              bg-white rounded-lg shadow-lg p-4 border-l-4
              ${type === 'success' ? 'border-l-green-500' : 'border-l-red-500'}
            `}
          >
            <div 
              className={`
                rounded-full p-2 flex-shrink-0
                ${type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
              `}
            >
              {type === 'success' ? (
                <ShoppingCart className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`
                text-sm font-medium
                ${type === 'success' ? 'text-green-900' : 'text-red-900'}
              `}>
                {type === 'success' ? 'Success' : 'Error'}
              </p>
              <p className="text-sm text-gray-600 mt-1 break-words">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 3, ease: 'linear' }}
              className={`
                absolute bottom-0 left-0 h-1 rounded-b-lg
                ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}
              `}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 