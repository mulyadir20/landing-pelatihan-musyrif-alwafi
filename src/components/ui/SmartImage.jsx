import { useState } from 'react';
import './SmartImage.css';

/**
 * Komponen gambar generik dengan fallback yang rapi bila file tidak ditemukan.
 *
 * Props:
 *  - src       : path gambar (disarankan dari src/config/siteConfig.js)
 *  - alt       : teks alternatif (wajib)
 *  - objectFit : 'contain' | 'cover' (default 'cover')
 *  - srcSet, sizes, width, height : efisiensi loading
 *  - onClick   : opsional, untuk membuka lightbox
 */
export default function SmartImage({
  src,
  alt,
  objectFit = 'cover',
  srcSet,
  sizes,
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
  className = '',
  imgClassName = '',
  ratio,
  onClick,
  fallbackLabel = 'Gambar tidak tersedia',
}) {
  const [failed, setFailed] = useState(false);
  const isClickable = typeof onClick === 'function';

  const style = ratio ? { aspectRatio: ratio } : undefined;

  if (failed) {
    return (
      <div
        className={`smart-image smart-image--fallback ${className}`}
        style={style}
        role={isClickable ? 'button' : 'img'}
        tabIndex={isClickable ? 0 : undefined}
        aria-label={isClickable ? alt : undefined}
        onClick={onClick}
        onKeyDown={
          isClickable
            ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onClick(event);
                }
              }
            : undefined
        }
      >
        <span>{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <div className={`smart-image ${className}`} style={style}>
      <img
        className={`smart-image__img ${imgClassName}`}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        style={{ objectFit }}
        onClick={onClick}
        onKeyDown={
          isClickable
            ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onClick(event);
                }
              }
            : undefined
        }
        tabIndex={isClickable ? 0 : undefined}
        role={isClickable ? 'button' : undefined}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
