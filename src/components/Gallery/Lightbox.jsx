import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize, Minimize, Play, Pause } from 'lucide-react';

export default function Lightbox({ photos, currentIndex, onClose, onChangeIndex }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lightboxRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'f') toggleFullscreen();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, photos, isPlaying, isFullscreen]);

  // Slideshow logic
  useEffect(() => {
    let interval;
    if (isPlaying && currentIndex !== null) {
      interval = setInterval(() => {
        onChangeIndex(prev => (prev + 1) % photos.length);
      }, 4000); 
    }
    return () => clearInterval(interval);
  }, [isPlaying, photos.length, onChangeIndex, currentIndex]);

  // Fullscreen event listener
  useEffect(() => {
    const onFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull) {
        setIsPlaying(false);
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Cleanup fullscreen on unmount
  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  const handlePrev = (e) => {
    if(e) { e.stopPropagation(); setIsPlaying(false); }
    if(currentIndex !== null) {
      onChangeIndex((currentIndex - 1 + photos.length) % photos.length);
    }
  };

  const handleNext = (e) => {
    if(e) { e.stopPropagation(); setIsPlaying(false); }
    if(currentIndex !== null) {
      onChangeIndex((currentIndex + 1) % photos.length);
    }
  };

  const toggleFullscreen = (e) => {
    if (e) e.stopPropagation();
    if (!document.fullscreenElement) {
      lightboxRef.current?.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen mode:", err);
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    setIsPlaying(!isPlaying);
    if (!isPlaying && !document.fullscreenElement) {
      lightboxRef.current?.requestFullscreen().catch(() => {});
    }
  };

  return (
    <AnimatePresence>
      {currentIndex !== null && photos.length > 0 && (
        <motion.div 
          ref={lightboxRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-dark/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
          onClick={onClose}
          data-lenis-prevent="true"
        >
          <div 
            className="absolute top-6 right-6 flex items-center gap-6 z-50 bg-dark/40 p-3 rounded-full backdrop-blur-md border border-white/5"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={togglePlay} 
              className="text-white/60 hover:text-white transition-colors hover:scale-110"
              title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button 
              onClick={toggleFullscreen} 
              className="text-white/60 hover:text-white transition-colors hover:scale-110"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
            </button>
            <div className="w-px h-6 bg-white/20"></div>
            <button 
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors hover:scale-110"
              title="Close Gallery"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          <button 
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 z-50 transition-colors hover:scale-110 bg-dark/20 rounded-full backdrop-blur-sm"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 z-50 transition-colors hover:scale-110 bg-dark/20 rounded-full backdrop-blur-sm"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-full max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={photos[currentIndex]} 
                alt={`Gallery shot ${currentIndex}`} 
                className="w-auto h-auto max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm select-none"
                style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
              />
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-sm tracking-[0.3em] font-mono bg-dark/40 px-4 py-1 rounded-full backdrop-blur-sm border border-white/5">
                {currentIndex + 1} / {photos.length}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
