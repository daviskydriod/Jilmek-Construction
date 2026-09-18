import { useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryPhoto } from "@/lib/gallery";

type Props = {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

/** Full-screen photo viewer with keyboard, button and swipe navigation (C7). */
export default function Lightbox({ photos, index, onClose, onIndexChange }: Props) {
  const touchStartX = useRef<number | null>(null);
  const photo = photos[index];

  const next = useCallback(
    () => onIndexChange((index + 1) % photos.length),
    [index, photos.length, onIndexChange],
  );
  const prev = useCallback(
    () => onIndexChange((index - 1 + photos.length) % photos.length),
    [index, photos.length, onIndexChange],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [next, prev, onClose]);

  if (!photo) return null;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      onClick={onClose}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const delta = event.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) (delta < 0 ? next : prev)();
        touchStartX.current = null;
      }}
    >
      <button className="lightbox-close" onClick={onClose} aria-label="Close viewer">
        <X size={22} />
      </button>

      {photos.length > 1 && (
        <button
          className="lightbox-nav prev"
          onClick={(event) => {
            event.stopPropagation();
            prev();
          }}
          aria-label="Previous photo"
        >
          <ChevronLeft size={26} />
        </button>
      )}

      <figure className="lightbox-figure" onClick={(event) => event.stopPropagation()}>
        <img src={photo.src} alt={photo.alt} />
        <figcaption>
          <span className="lightbox-category">{photo.category}</span>
          <p>{photo.alt}</p>
          {photos.length > 1 && (
            <small>
              {index + 1} of {photos.length}
            </small>
          )}
        </figcaption>
      </figure>

      {photos.length > 1 && (
        <button
          className="lightbox-nav next"
          onClick={(event) => {
            event.stopPropagation();
            next();
          }}
          aria-label="Next photo"
        >
          <ChevronRight size={26} />
        </button>
      )}
    </div>
  );
}
