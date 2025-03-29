'use client'

import { FaWhatsapp } from 'react-icons/fa'
import { generateWhatsAppLink } from '@/lib/utils'

interface WhatsAppButtonProps {
  productName: string;
  productId: string;
  className?: string;
}

export function WhatsAppButton({ productName, productId, className = '' }: WhatsAppButtonProps) {
  const handleClick = () => {
    const whatsappLink = generateWhatsAppLink(productName, productId);
    window.open(whatsappLink, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center gap-2 
        bg-green-500 hover:bg-green-600 active:bg-green-700
        text-white font-medium px-6 py-3 rounded-lg
        transition-all duration-200 ease-in-out
        hover:shadow-lg transform hover:-translate-y-0.5
        ${className}
      `}
      aria-label="Contact via WhatsApp"
    >
      <FaWhatsapp className="text-xl" />
      <span>Contact via WhatsApp</span>
    </button>
  );
} 