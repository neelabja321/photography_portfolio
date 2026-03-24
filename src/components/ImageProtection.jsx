import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const WhatsAppIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export default function ImageProtection() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleContextMenu = (e) => {
      // Check if target is an image or inside an image container (like lightbox)
      if (e.target.tagName.toLowerCase() === 'img') {
        e.preventDefault();
        setShow(true);
      }
    };
    
    const handleDragStart = (e) => {
      if (e.target.tagName.toLowerCase() === 'img') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm"
          onClick={() => setShow(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-dark-surface border border-white/10 p-8 rounded-2xl max-w-md w-full text-center relative shadow-2xl"
          >
            <button 
              onClick={() => setShow(false)} 
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <WhatsAppIcon className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-white mb-4">
              Protecting Wildlife Art
            </h3>
            <p className="text-white/70 font-light mb-8 leading-relaxed">
              If you wish to download or use this image in high resolution, please contact me directly over WhatsApp to purchase the rights.
            </p>
            <a 
              href="https://wa.me/917044144581" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-full font-medium transition-colors w-full"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span>WhatsApp: 7044144581</span>
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
