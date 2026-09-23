import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Trash2, X } from 'lucide-react';
import { MAX_COMMENT_LENGTH, MAX_NAME_LENGTH, usePhotoEngagement } from '../../hooks/useEngagement';
import LikeButton from './LikeButton';

function formatTimestamp(at) {
  if (!at) return '';

  const diff = Date.now() - at;
  if (diff < 0) return 'just now';

  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;

  return new Date(at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

function initialsFor(name) {
  const trimmed = (name || '').trim();
  if (!trimmed) return '?';
  return trimmed
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function CommentPanel({ photoKey, onClose }) {
  const {
    likes,
    liked,
    comments,
    commentCount,
    toggleLike,
    addComment,
    removeComment,
    visitorName,
    setVisitorName,
  } = usePhotoEngagement(photoKey);

  const [text, setText] = useState('');
  const [justPosted, setJustPosted] = useState(false);
  const listEndRef = useRef(null);

  // Drafts are per photo, so clear the box when the visitor navigates.
  useEffect(() => {
    setText('');
    setJustPosted(false);
  }, [photoKey]);

  // Keep the newest comment in view after posting.
  useEffect(() => {
    if (justPosted) {
      listEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [justPosted, commentCount]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!text.trim()) return;

    const created = addComment({ name: visitorName, text });
    if (created) {
      setText('');
      setJustPosted(true);
    }
  };

  const remaining = MAX_COMMENT_LENGTH - text.length;

  return (
    <motion.aside
      // Slides up as a sheet on small screens, in from the right on desktop.
      initial={{ opacity: 0, y: 40, x: 0 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      // Clicks inside the panel must not bubble up to the lightbox backdrop,
      // which closes on click.
      onClick={(event) => event.stopPropagation()}
      // Let this list scroll natively instead of driving Lenis smooth scroll.
      data-lenis-prevent="true"
      aria-label="Likes and comments"
      className="w-full lg:w-96 lg:shrink-0 flex flex-col max-h-[45vh] lg:max-h-[85vh] bg-dark-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
    >
      {/* Header */}
      <header className="flex items-center justify-between gap-4 px-5 py-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-5">
          <LikeButton liked={liked} count={likes} onToggle={toggleLike} size={20} />
          <span className="inline-flex items-center gap-2 text-white/60 text-sm font-light">
            <MessageCircle size={18} />
            <span className="tabular-nums">{commentCount}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close comments"
          className="text-white/50 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </header>

      {/* Comment list */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 min-h-0">
        {comments.length === 0 ? (
          <p className="text-white/35 text-sm font-light italic py-6 text-center">
            No comments on this photo yet. Be the first.
          </p>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="flex gap-3 group/comment">
              <div
                aria-hidden="true"
                className="w-9 h-9 shrink-0 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-xs font-medium"
              >
                {initialsFor(comment.name)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white/90 text-sm font-medium truncate">{comment.name}</span>
                  <span className="text-white/30 text-xs shrink-0">{formatTimestamp(comment.at)}</span>

                  {comment.isOwn && (
                    <button
                      type="button"
                      onClick={() => removeComment(comment.id)}
                      aria-label="Delete your comment"
                      className="ml-auto shrink-0 text-white/25 hover:text-rose-400 opacity-0 group-hover/comment:opacity-100 focus-visible:opacity-100 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* whitespace-pre-line keeps the visitor's line breaks. */}
                <p className="text-white/60 text-sm font-light leading-relaxed break-words whitespace-pre-line">
                  {comment.text}
                </p>
              </div>
            </article>
          ))
        )}
        <div ref={listEndRef} />
      </div>

      {/* Composer */}
      <form onSubmit={handleSubmit} className="shrink-0 border-t border-white/10 p-4 space-y-3">
        <label className="sr-only" htmlFor="comment-name">
          Your name
        </label>
        <input
          id="comment-name"
          type="text"
          value={visitorName}
          onChange={(event) => setVisitorName(event.target.value)}
          maxLength={MAX_NAME_LENGTH}
          placeholder="Your name (optional)"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-light placeholder-white/25 focus:outline-none focus:border-gold/60 transition-colors"
        />

        <label className="sr-only" htmlFor="comment-text">
          Your comment
        </label>
        <textarea
          id="comment-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={MAX_COMMENT_LENGTH}
          rows={3}
          placeholder="Leave a comment on this photo..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-light placeholder-white/25 focus:outline-none focus:border-gold/60 transition-colors resize-none"
        />

        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-white/30 font-light">
            {remaining < 80 ? `${remaining} characters left` : 'Saved in this browser'}
          </span>

          <button
            type="submit"
            disabled={!text.trim()}
            className="inline-flex items-center gap-2 bg-white text-dark hover:bg-gold disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white px-4 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            <Send size={14} />
            Post
          </button>
        </div>
      </form>
    </motion.aside>
  );
}
