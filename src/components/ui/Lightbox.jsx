import { useEffect, useRef } from 'react';
import { X, ZoomIn } from 'lucide-react';
import './Lightbox.css';

/**
 * Modal pratinjau gambar (lightbox).
 * Dapat ditutup dengan tombol X, tombol Escape, atau klik area latar.
 */
export default function Lightbox({ open, onClose, src, srcSet, alt, caption }) {
  const closeRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      if (previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={alt || 'Pratinjau gambar'}
      onClick={onClose}
    >
      <div className="lightbox__backdrop" aria-hidden="true" />

      <button
        type="button"
        className="lightbox__close"
        onClick={onClose}
        ref={closeRef}
        aria-label="Tutup pratinjau gambar"
      >
        <X size={22} aria-hidden="true" />
      </button>

      <figure className="lightbox__figure" onClick={(event) => event.stopPropagation()}>
        <img
          className="lightbox__img"
          src={src}
          srcSet={srcSet}
          alt={alt}
          decoding="async"
        />
        <figcaption className="lightbox__caption">
          <ZoomIn size={16} aria-hidden="true" />
          <span>{caption || alt}</span>
        </figcaption>
      </figure>
    </div>
  );
}
