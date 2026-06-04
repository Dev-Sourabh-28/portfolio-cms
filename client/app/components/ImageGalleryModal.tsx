"use client";

import { useEffect } from "react";

type ImageGalleryModalProps = {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function ImageGalleryModal({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: ImageGalleryModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowLeft") {
        onPrev();
      }
      if (event.key === "ArrowRight") {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-5xl rounded-3xl overflow-hidden bg-black shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20"
        >
          ✕
        </button>

        <div className="relative flex items-center justify-center bg-black">
          <img
            src={images[currentIndex]}
            alt={`Preview ${currentIndex + 1}`}
            className="max-h-[80vh] w-full object-contain"
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onPrev();
                }}
                className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-white hover:bg-white/20"
              >
                ←
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onNext();
                }}
                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-white hover:bg-white/20"
              >
                →
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="bg-black/80 px-4 py-3 text-center text-white">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}
