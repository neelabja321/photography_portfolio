import { useCallback, useEffect, useRef, useState } from 'react';
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
  ImageOff,
} from 'lucide-react';
import { usePhotoEngagement } from '../../hooks/useEngagement';
import LikeButton from '../Engagement/LikeButton';
import CommentPanel from '../Engagement/CommentPanel';
import { cn } from '../../utils/cn';

const SLIDESHOW_INTERVAL = 4000;

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
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'
  const lightboxRef = useRef(null);

  const isOpen = currentIndex !== null && photos.length > 0;
  const currentPhoto = isOpen ? photos[currentIndex] : null;

  const { likes, liked, commentCount, toggleLike } = usePhotoEngagement(currentPhoto);

  // --- Navigation -----------------------------------------------------------

  const goPrev = useCallback(() => {
    setIsPlaying(false);
    if (currentIndex !== null) {
      onChangeIndex((currentIndex - 1 + photos.length) % photos.length);
    }
  }, [currentIndex, photos.length, onChangeIndex]);

  const goNext = useCallback(() => {
    setIsPlaying(false);
    if (currentIndex !== null) {
      onChangeIndex((currentIndex + 1) % photos.length);
    }
  }, [currentIndex, photos.length, onChangeIndex]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      lightboxRef.current?.requestFullscreen?.().catch((err) => {
        console.error('Could not enter fullscreen:', err);
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((playing) => {
      const next = !playing;
      // Starting a slideshow goes fullscreen for the cinematic view.
      if (next && !document.fullscreenElement) {
        lightboxRef.current?.requestFullscreen?.().catch(() => {});
      }
      return next;
    });
  }, []);

  const toggleComments = useCallback(() => {
    onToggleComments?.(!showComments);
  }, [onToggleComments, showComments]);

  // --- Reset load status when the shown photo changes -----------------------

  useEffect(() => {
    if (!currentPhoto) return;
    setStatus('loading');

    // If the browser already has it cached, onLoad may not fire again, so
    // resolve status from a probe image.
    const probe = new Image();
    probe.src = currentPhoto;
    if (probe.complete && probe.naturalWidth > 0) {
      setStatus('loaded');
    }
  }, [currentPhoto]);

  // --- Preload neighbours so navigation and slideshow feel instant ----------

  useEffect(() => {
    if (currentIndex === null || photos.length < 2) return;
    const neighbours = [
      photos[(currentIndex + 1) % photos.length],
      photos[(currentIndex - 1 + photos.length) % photos.length],
    ];
    neighbours.forEach((src) => {
      if (src) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [currentIndex, photos]);

  // --- Keyboard shortcuts ---------------------------------------------------

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      // While writing a comment, keys must type normally.
      if (isTypingTarget(e.target)) {
        if (e.key === 'Escape') e.target.blur();
        return;
      }

      switch (e.key) {
        case 'Escape':
          // Step back one layer at a time: comments, then the lightbox.
          if (showComments) onToggleComments?.(false);
          else onClose();
          break;
        case 'ArrowLeft':
          goPrev();
          break;
        case 'ArrowRight':
          goNext();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'c':
          toggleComments();
          break;
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    showComments,
    onClose,
    onToggleComments,
    goPrev,
    goNext,
    toggleFullscreen,
    toggleComments,
    togglePlay,
  ]);

  // --- Slideshow ------------------------------------------------------------

  useEffect(() => {
    if (!isPlaying || currentIndex === null || photos.length < 2) return undefined;
    const interval = setInterval(() => {
      onChangeIndex((prev) => (prev + 1) % photos.length);
    }, SLIDESHOW_INTERVAL);
    return () => clearInterval(interval);
  }, [isPlaying, photos.length, onChangeIndex, currentIndex]);

  // Reading or writing comments shouldn't race an advancing slideshow.
  useEffect(() => {
    if (showComments) setIsPlaying(false);
  }, [showComments]);

  // --- Fullscreen sync ------------------------------------------------------

  useEffect(() => {
    const onFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull) setIsPlaying(false);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Leave fullscreen if the lightbox unmounts while still fullscreen.
  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  const stop = (e) => e.stopPropagation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={lightboxRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-dark/95 backdrop-blur-xl"
          onClick={onClose}
          data-lenis-prevent="true"
        >
          {/* Top-right control cluster */}
          <div
            className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-4 md:gap-6 z-50 bg-dark/40 p-2.5 md:p-3 rounded-full backdrop-blur-md border border-white/5"
            onClick={stop}
          >
            {photos.length > 1 && (
              <button
                onClick={togglePlay}
                className="text-white/60 hover:text-white transition-colors hover:scale-110"
                title={isPlaying ? 'Pause slideshow (space)' : 'Play slideshow (space)'}
                aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              >
                {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6" /> : <Play className="w-5 h-5 md:w-6 md:h-6" />}
              </button>
            )}
            <button
              onClick={toggleFullscreen}
              className="text-white/60 hover:text-white transition-colors hover:scale-110"
              title="Toggle fullscreen (f)"
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize className="w-5 h-5 md:w-6 md:h-6" /> : <Maximize className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
            <div className="w-px h-6 bg-white/20" />
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors hover:scale-110"
              title="Close (esc)"
              aria-label="Close gallery"
            >
              <X className="w-6 h-6 md:w-7 md:h-7" />
            </button>
          </div>

          {/* Prev / Next */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { stop(e); goPrev(); }}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 z-50 transition-colors hover:scale-110 bg-dark/30 rounded-full backdrop-blur-sm"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
              </button>
              <button
                onClick={(e) => { stop(e); goNext(); }}
                className={cn(
                  'absolute top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 z-50 transition-all hover:scale-110 bg-dark/30 rounded-full backdrop-blur-sm',
                  showComments ? 'right-2 md:right-6 lg:right-[26.5rem]' : 'right-2 md:right-6'
                )}
                aria-label="Next photo"
              >
                <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
              </button>
            </>
          )}

          {/* Stage: image + engagement bar, with the comment panel beside it.
              Uses a centered layout with explicit viewport-based image sizing so
              the frame can never collapse to zero height. */}
          <div
            className="absolute inset-0 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 px-4 pt-20 pb-6 md:px-16 lg:pl-20 lg:pr-8"
            onClick={onClose}
          >
            <div className="flex flex-col items-center justify-center gap-4 min-w-0">
              <div
                className="relative flex items-center justify-center"
                onClick={stop}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPhoto}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.01 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center justify-center"
                  >
                    {status === 'error' ? (
                      <div
                        className={cn(
                          'flex flex-col items-center justify-center gap-3 text-white/40 border border-white/10 rounded-lg bg-dark-card/50',
                          showComments ? 'w-[75vw] max-w-2xl h-[45vh]' : 'w-[80vw] max-w-3xl h-[55vh]'
                        )}
                      >
                        <ImageOff className="w-10 h-10" />
                        <p className="text-sm font-light">This image could not be loaded.</p>
                      </div>
                    ) : (
                      <>
                        {status === 'loading' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 border-2 border-white/20 border-t-gold rounded-full animate-spin" />
                          </div>
                        )}
                        <img
                          src={currentPhoto}
                          alt={`Gallery photo ${currentIndex + 1} of ${photos.length}`}
                          onLoad={() => setStatus('loaded')}
                          onError={() => setStatus('error')}
                          className={cn(
                            'w-auto object-contain shadow-2xl rounded-sm select-none transition-opacity duration-300',
                            // Viewport-based caps guarantee a visible box.
                            showComments
                              ? 'max-h-[55vh] lg:max-h-[80vh] max-w-full'
                              : 'max-h-[72vh] md:max-h-[82vh] max-w-full',
                            status === 'loaded' ? 'opacity-100' : 'opacity-0'
                          )}
                          style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
                          draggable={false}
                        />
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Likes / comments / position */}
              <div
                onClick={stop}
                className={cn(
                  'shrink-0 flex items-center gap-5 bg-dark/50 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5',
                  showComments && 'hidden lg:flex'
                )}
              >
                <LikeButton liked={liked} count={likes} onToggle={toggleLike} size={19} />

                <button
                  type="button"
                  onClick={toggleComments}
                  aria-expanded={showComments}
                  aria-label={showComments ? 'Hide comments' : `Show ${commentCount} comments`}
                  className={cn(
                    'inline-flex items-center gap-2 transition-colors',
                    showComments ? 'text-gold' : 'text-white/70 hover:text-gold'
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
