import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Heart toggle with a live count.
 *
 * Rendered in two places: over each gallery card, and inside the lightbox.
 * Both read the same store, so a like registers instantly in both spots.
 */
export default function LikeButton({
  liked,
  count,
  onToggle,
  size = 18,
  className,
  showCount = true,
}) {
  const handleClick = (event) => {
    // Gallery cards open the lightbox on click; a like must not do that too.
    event.stopPropagation();
    onToggle?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={liked}
      aria-label={liked ? `Unlike this photo (${count} likes)` : `Like this photo (${count} likes)`}
      className={cn(
        'group/like inline-flex items-center gap-2 rounded-full transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark',
        liked ? 'text-rose-400' : 'text-white/70 hover:text-rose-300',
        className
      )}
    >
      <motion.span
        // A small pop each time the liked state flips.
        key={liked ? 'liked' : 'unliked'}
        initial={{ scale: 1 }}
        animate={liked ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
        className="inline-flex"
      >
        <Heart
          size={size}
          strokeWidth={2}
          className={cn('transition-all', liked && 'fill-rose-400 drop-shadow-[0_0_6px_rgba(251,113,133,0.5)]')}
        />
      </motion.span>

      {showCount && (
        <span className="text-sm font-light tabular-nums leading-none">{count}</span>
      )}
    </button>
  );
}
