import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

/**
 * Engagement store (likes + comments) for individual photos.
 *
 * There is no database in this project, so engagement is stored in two layers
 * that get merged for display:
 *
 *   1. SEED  — `public/engagement.json`, committed to the repo. Every visitor
 *              sees these numbers and comments. This is the shared baseline
 *              you curate by hand.
 *   2. LOCAL — `localStorage`, private to each visitor's browser. Holds the
 *              likes they've given and the comments they've written.
 *
 * Displayed value = seed + that visitor's own activity. A visitor's like or
 * comment never reaches other visitors, because there is no server to relay
 * it through. To promote a comment so everyone sees it, copy it into the
 * seed file.
 *
 * Photos are keyed by their manifest path (e.g. "/photos/pair.jpg") rather
 * than by array index, so engagement survives adding or removing images.
 */

const STORAGE_KEY = 'nature-unscripted:engagement:v1';
const NAME_STORAGE_KEY = 'nature-unscripted:visitor-name:v1';
const SEED_URL = '/engagement.json';

export const MAX_NAME_LENGTH = 40;
export const MAX_COMMENT_LENGTH = 500;

const EngagementContext = createContext(null);

const EMPTY_STATS = Object.freeze({
  likes: 0,
  liked: false,
  comments: Object.freeze([]),
  commentCount: 0,
});

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function safeReadJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return fallback;
    return parsed;
  } catch {
    // Private browsing, disabled storage, or corrupt JSON. Start clean.
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    window.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn('[engagement] could not persist to localStorage:', err);
    return false;
  }
}

/** Coerce the committed seed file into a predictable shape. */
function normalizeSeed(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};

  const normalized = {};

  for (const [key, value] of Object.entries(raw)) {
    // Allow "_" prefixed keys in the JSON file as documentation/notes.
    if (key.startsWith('_') || !value || typeof value !== 'object') continue;

    const likes = Number.isFinite(value.likes) && value.likes > 0 ? Math.floor(value.likes) : 0;

    const comments = Array.isArray(value.comments)
      ? value.comments
          .filter((comment) => comment && typeof comment.text === 'string' && comment.text.trim())
          .map((comment, index) => {
            const at = Number.isFinite(comment.at) ? comment.at : Date.parse(comment.at) || 0;
            return {
              id: typeof comment.id === 'string' && comment.id ? comment.id : `seed:${key}:${index}`,
              name: (typeof comment.name === 'string' && comment.name.trim()) || 'Visitor',
              text: comment.text.trim(),
              at,
              isOwn: false,
            };
          })
      : [];

    normalized[key] = { likes, comments };
  }

  return normalized;
}

export function EngagementProvider({ children }) {
  const [seed, setSeed] = useState({});
  const [local, setLocal] = useState(() => safeReadJSON(STORAGE_KEY, {}));
  const [visitorName, setVisitorNameState] = useState(() => {
    try {
      return window.localStorage.getItem(NAME_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [isReady, setIsReady] = useState(false);
  const hasHydrated = useRef(false);

  // Load the committed baseline.
  useEffect(() => {
    let cancelled = false;

    fetch(SEED_URL)
      .then((response) => (response.ok ? response.json() : {}))
      .then((data) => {
        if (!cancelled) setSeed(normalizeSeed(data));
      })
      .catch(() => {
        // No seed file is a valid setup: everything simply starts at zero.
      })
      .finally(() => {
        if (!cancelled) setIsReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Persist visitor activity.
  useEffect(() => {
    if (!hasHydrated.current) {
      hasHydrated.current = true;
      return;
    }
    safeWrite(STORAGE_KEY, local);
  }, [local]);

  // Keep multiple open tabs in sync.
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY) {
        setLocal(safeReadJSON(STORAGE_KEY, {}));
      }
      if (event.key === NAME_STORAGE_KEY) {
        setVisitorNameState(event.newValue || '');
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setVisitorName = useCallback((name) => {
    const clean = String(name ?? '').slice(0, MAX_NAME_LENGTH);
    setVisitorNameState(clean);
    safeWrite(NAME_STORAGE_KEY, clean);
  }, []);

  const getStats = useCallback(
    (photoKey) => {
      if (!photoKey) return EMPTY_STATS;

      const seedEntry = seed[photoKey];
      const localEntry = local[photoKey];

      const liked = Boolean(localEntry?.liked);
      const seedLikes = seedEntry?.likes ?? 0;

      const seedComments = seedEntry?.comments ?? [];
      const localComments = Array.isArray(localEntry?.comments)
        ? localEntry.comments.map((comment) => ({ ...comment, isOwn: true }))
        : [];

      const comments =
        localComments.length === 0
          ? seedComments
          : [...seedComments, ...localComments].sort((a, b) => (a.at || 0) - (b.at || 0));

      return {
        likes: seedLikes + (liked ? 1 : 0),
        liked,
        comments,
        commentCount: comments.length,
      };
    },
    [seed, local]
  );

  const toggleLike = useCallback((photoKey) => {
    if (!photoKey) return;
    setLocal((previous) => {
      const entry = previous[photoKey] || {};
      return { ...previous, [photoKey]: { ...entry, liked: !entry.liked } };
    });
  }, []);

  const addComment = useCallback((photoKey, { name, text } = {}) => {
    const cleanText = String(text ?? '')
      .trim()
      .slice(0, MAX_COMMENT_LENGTH);

    if (!photoKey || !cleanText) return null;

    const cleanName =
      String(name ?? '')
        .trim()
        .slice(0, MAX_NAME_LENGTH) || 'Anonymous';

    const comment = { id: createId(), name: cleanName, text: cleanText, at: Date.now() };

    setLocal((previous) => {
      const entry = previous[photoKey] || {};
      const existing = Array.isArray(entry.comments) ? entry.comments : [];
      return { ...previous, [photoKey]: { ...entry, comments: [...existing, comment] } };
    });

    return comment;
  }, []);

  /** Visitors can only remove comments they wrote themselves. */
  const removeComment = useCallback((photoKey, commentId) => {
    setLocal((previous) => {
      const entry = previous[photoKey];
      if (!entry || !Array.isArray(entry.comments)) return previous;

      const comments = entry.comments.filter((comment) => comment.id !== commentId);
      if (comments.length === entry.comments.length) return previous;

      return { ...previous, [photoKey]: { ...entry, comments } };
    });
  }, []);

  const value = useMemo(
    () => ({
      isReady,
      getStats,
      toggleLike,
      addComment,
      removeComment,
      visitorName,
      setVisitorName,
    }),
    [isReady, getStats, toggleLike, addComment, removeComment, visitorName, setVisitorName]
  );

  return <EngagementContext.Provider value={value}>{children}</EngagementContext.Provider>;
}

export function useEngagement() {
  const context = useContext(EngagementContext);
  if (!context) {
    throw new Error('useEngagement must be used inside an <EngagementProvider>');
  }
  return context;
}

/** Convenience hook scoped to a single photo path. */
export function usePhotoEngagement(photoKey) {
  const { getStats, toggleLike, addComment, removeComment, isReady, visitorName, setVisitorName } =
    useEngagement();

  const stats = useMemo(() => getStats(photoKey), [getStats, photoKey]);

  const toggle = useCallback(() => toggleLike(photoKey), [toggleLike, photoKey]);
  const add = useCallback((payload) => addComment(photoKey, payload), [addComment, photoKey]);
  const remove = useCallback((id) => removeComment(photoKey, id), [removeComment, photoKey]);

  return {
    ...stats,
    isReady,
    visitorName,
    setVisitorName,
    toggleLike: toggle,
    addComment: add,
    removeComment: remove,
  };
}
