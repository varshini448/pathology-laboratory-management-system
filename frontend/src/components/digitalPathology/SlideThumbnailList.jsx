import React from "react";

const SlideThumbnailList = ({
  slides = [],
  selectedSlideId,
  onSelect,
}) => {
  if (!slides.length) {
    return (
      <div className="slide-thumbnail-empty">
        No slides available.
      </div>
    );
  }

  return (
    <div className="slide-thumbnail-list" aria-label="Slide list">
      {slides.map((slide) => (
        <button
          key={slide.slideId || slide.id}
          type="button"
          className={
            selectedSlideId === (slide.slideId || slide.id)
              ? "slide-thumbnail active"
              : "slide-thumbnail"
          }
          onClick={() => onSelect?.(slide)}
        >
          <div className="slide-thumbnail-preview">
            <span>SLIDE</span>
          </div>

          <div className="slide-thumbnail-info">
            <strong>{slide.slideId || slide.id}</strong>
            <span>{slide.stain || "Unspecified stain"}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default SlideThumbnailList;