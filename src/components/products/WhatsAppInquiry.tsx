'use client'

import { FaWhatsapp } from 'react-icons/fa'
import { generateWhatsAppInquiryLink } from '@/lib/utils'
import { useCallback } from 'react'

interface WhatsAppInquiryProps {
  productName: string;
  productUrl: string;
  productId: string;
  className?: string;
}

export function WhatsAppInquiry({ productName, productUrl, productId, className = '' }: WhatsAppInquiryProps) {
  const trackWhatsAppClick = useCallback(async () => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'whatsapp_inquiry_click',
          properties: {
            productName,
            productUrl,
            productId,
            timestamp: new Date().toISOString(),
          },
        }),
      });
    } catch (error) {
      // 静默处理错误，不影响用户体验
      console.error('Failed to track WhatsApp click:', error);
    }
  }, [productName, productUrl, productId]);

  const handleWhatsAppClick = useCallback(() => {
    // 先触发追踪
    trackWhatsAppClick();
    
    // 然后打开 WhatsApp
    const whatsappLink = generateWhatsAppInquiryLink(productName, productUrl, productId);
    window.open(whatsappLink, '_blank');
  }, [productName, productUrl, productId, trackWhatsAppClick]);

  return (
    <button
      onClick={handleWhatsAppClick}
      className={`flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 
                 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 
                 hover:scale-[1.02] active:scale-[0.98] transform ${className}`}
    >
      <FaWhatsapp className="text-xl" />
      <span>Inquire via WhatsApp</span>
    </button>
  );
} 