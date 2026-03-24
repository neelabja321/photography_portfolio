import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Lightbox({ photos, currentIndex, onClose, onChangeIndex }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, photos]);

  const handlePrev = (e) => {
    if(e) e.stopPropagation();
    onChangeIndex((currentIndex - 1 + photos.length) % photos.length);
  };

  const handleNext = (e) => {
    if(e) e.stopPropagation();
    onChangeIndex((currentIndex + 1) % photos.length);
  };

  if (currentIndex === null || !photos.length) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-dark/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
        onClick={onClose}
        data-lenis-prevent="true"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white z-50 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        <button 
          onClick={handlePrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 z-50 transition-colors hover:scale-110"
        >
          <ChevronLeft className="w-10 h-10" />
        </button>
        
        <button 
          onClick={handleNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 z-50 transition-colors hover:scale-110"
        >
          <ChevronRight className="w-10 h-10" />
        </button>

        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative max-w-full max-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <img 
            src={photos[currentIndex]} 
            alt={`Gallery shot ${currentIndex}`} 
            className="w-auto h-auto max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm"
          />
          <div className="absolute bottom-[-40px] left-0 text-white/50 text-sm tracking-widest font-mono">
            {currentIndex + 1} / {photos.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
