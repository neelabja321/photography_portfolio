import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Play,
  Pause,
  MessageCircle,
} from 'lucide-react';
import { usePhotoEngagement } from '../../hooks/useEngagement';
import LikeButton from '../Engagement/LikeButton';
import CommentPanel from '../Engagement/CommentPanel';
import { cn } from '../../utils/cn';

/** True when a keystroke belongs to a text field, so shortcuts should stand down. */
function isTypingTarget(target) {
  if (!target) return false;
  const tag = target.tagName?.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable;
}

export default function Lightbox({
  photos,
  currentIndex,
  onClose,
  onChangeIndex,
  showComments = false,
  onToggleComments,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lightboxRef = useRef(null);

  const isOpen = currentIndex !== null && photos.length > 0;
  const currentPhoto = isOpen ? photos[currentIndex] : null;

  const { likes, liked, commentCount, toggleLike } = usePhotoEngagement(currentPhoto);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // While the visitor is writing a comment, space/f/arrows must type
      // normally instead of driving the slideshow.
      if (isTypingTarget(e.target)) {
        if (e.key === 'Escape') e.target.blur();
        return;
      }

      if (e.key === 'Escape') {
        // Step back one layer at a time: comments first, then the lightbox.
        if (showComments) onToggleComments?.(false);
        else onClose();
        return;
      }

      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'f') toggleFullscreen();
      if (e.key === 'c') handleToggleComments();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, photos, isPlaying, isFullscreen, showComments, onToggleComments]);

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

  // Reading or writing comments shouldn't race against an advancing slideshow.
  useEffect(() => {
    if (showComments) setIsPlaying(false);
  }, [showComments]);

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

  const handleToggleComments = (e) => {
    if (e) e.stopPropagation();
    onToggleComments?.(!showComments);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          ref={lightboxRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed inset-0 z-[100] bg-dark/95 backdrop-blur-xl flex items-center justify-center",
            showComments ? "p-3 md:p-6" : "p-4 md:p-12"
          )}
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
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 z-50 transition-colors hover:scale-110 bg-dark/20 rounded-full backdrop-blur-sm"
          >
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          
          <button 
            onClick={handleNext}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 z-50 transition-all hover:scale-110 bg-dark/20 rounded-full backdrop-blur-sm",
              // Shift clear of the comment panel on desktop.
              showComments ? "right-2 md:right-6 lg:right-[26.5rem]" : "right-2 md:right-6"
            )}
          >
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 pt-16 pb-4 lg:py-16">
            {/* Image column: photo on top, engagement bar beneath it. */}
            <div className="flex-1 min-h-0 min-w-0 w-full flex flex-col items-center justify-center gap-4">
              <div className="relative flex-1 min-h-0 w-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img 
                      src={photos[currentIndex]} 
                      alt={`Gallery shot ${currentIndex}`} 
                      className="w-auto h-auto max-w-full max-h-full object-contain shadow-2xl rounded-sm select-none"
                      style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Likes, comments and position counter */}
              <div 
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "shrink-0 flex items-center gap-5 bg-dark/50 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5",
                  // On mobile the comment sheet takes over the lower half, and
                  // the panel header carries its own like button.
                  showComments && "hidden lg:flex"
                )}
              >
                <LikeButton liked={liked} count={likes} onToggle={toggleLike} size={19} />

                <button
                  type="button"
                  onClick={handleToggleComments}
                  aria-expanded={showComments}
                  aria-label={showComments ? 'Hide comments' : `Show ${commentCount} comments`}
                  className={cn(
                    "inline-flex items-center gap-2 transition-colors",
                    showComments ? "text-gold" : "text-white/70 hover:text-gold"
                  )}
                >
                  <MessageCircle size={19} />
                  <span className="text-sm font-light tabular-nums leading-none">{commentCount}</span>
                </button>

                <div className="w-px h-5 bg-white/15" />

                <span className="text-white/40 text-xs tracking-[0.2em] font-mono tabular-nums">
                  {currentIndex + 1} / {photos.length}
                </span>
              </div>
            </div>

            <AnimatePresence>
              {showComments && currentPhoto && (
                <CommentPanel
                  key={currentPhoto}
                  photoKey={currentPhoto}
                  onClose={() => onToggleComments?.(false)}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
