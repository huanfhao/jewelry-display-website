'use client'

import { FaBoxOpen } from 'react-icons/fa'
import { generateSampleInquiryLink } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface SampleOrderButtonProps {
  productName: string;
  productId: string;
  samplePrice: number;
  className?: string;
}

export function SampleOrderButton({ productName, productId, samplePrice, className = '' }: SampleOrderButtonProps) {
  const isProductCreated = Boolean(productId && productId.trim() !== '');
  
  const handleClick = () => {
    if (!isProductCreated) return;
    
    const whatsappLink = generateSampleInquiryLink(productName, samplePrice, productId);
    window.open(whatsappLink, '_blank');
  };

  const buttonClasses = `
    inline-flex items-center justify-center gap-2 
    ${isProductCreated 
      ? 'bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white' 
      : 'bg-purple-300 text-white cursor-not-allowed'}
    font-medium px-6 py-3 rounded-lg
    transition-all duration-200 ease-in-out
    ${isProductCreated ? 'hover:shadow-lg transform hover:-translate-y-0.5' : ''}
    ${className}
  `;

  if (!isProductCreated) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={buttonClasses}
              disabled={true}
              aria-label="Order Sample - Not Available"
            >
              <FaBoxOpen className="text-xl" />
              <span>Order Sample</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sample ordering is available after product creation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={buttonClasses}
      aria-label="Order Sample"
    >
      <FaBoxOpen className="text-xl" />
      <span>Order Sample</span>
    </button>
  );
} 