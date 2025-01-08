'use client';

import { useEffect } from 'react';
import { useToastStore } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function Toaster() {
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, 5000);

      return () => clearTimeout(timer);
    });
  }, [toasts, removeToast]);

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'bg-white rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out',
            'animate-enter',
            toast.variant === 'destructive' && 'bg-red-50'
          )}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className={cn(
                'font-medium',
                toast.variant === 'destructive' && 'text-red-800'
              )}>
                {toast.title}
              </h3>
              {toast.description && (
                <p className={cn(
                  'text-sm text-gray-500 mt-1',
                  toast.variant === 'destructive' && 'text-red-700'
                )}>
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 