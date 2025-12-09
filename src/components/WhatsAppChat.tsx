import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

export function WhatsAppChat() {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get WhatsApp number and message from environment variables
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';
  const defaultMessage = import.meta.env.VITE_WHATSAPP_MESSAGE || 'Hello! I would like to inquire about Big Partner services.';
  
  const handleWhatsAppClick = () => {
    // Format WhatsApp URL with pre-filled message
    const encodedMessage = encodeURIComponent(defaultMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-lg transition-all duration-300 group"
      aria-label="Chat on WhatsApp"
    >
      {/* Icon Container */}
      <div className="flex items-center justify-center w-14 h-14 rounded-full">
        <MessageCircle className="w-6 h-6" />
      </div>
      
      {/* Text Label (appears on hover) */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isHovered ? 'max-w-xs pr-4' : 'max-w-0'
        }`}
      >
        <span className="whitespace-nowrap font-medium">
          Chat with us
        </span>
      </div>
    </button>
  );
}
