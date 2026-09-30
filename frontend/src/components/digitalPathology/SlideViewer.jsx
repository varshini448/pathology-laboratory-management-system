import React from "react";

const SlideViewer = ({
  slide,
  zoom = 100,
  onZoomChange,
}) => {
  if (!slide) {
    return (
      <div className="slide-viewer-empty">
        <h3>No slide selected</h3>
        <p>Select a slide to open the digital pathology viewer.</p>
      </div>
    );
  }

  return (
    <section className="slide-viewer" aria-label="Digital pathology slide viewer">
      <div className="slide-viewer-canvas">
        <div className="slide-image-placeholder">
          <div className="slide-image-grid">
            <span>Digital Slide</span>
            <strong>{slide.slideId || "SLIDE"}</strong>
          </div>
        </div>
      </div>

      <div className="slide-viewer-footer">
        <span>
          Zoom: <strong>{zoom}%</strong>
        </span>

        {onZoomChange && (
          <input
            type="range"
            min="25"
            max="400"
            step="25"
            value={zoom}
            onChange={(event) => onZoomChange(Number(event.target.value))}
            aria-label="Slide zoom"
          />
        )}
      </div>
    </section>
  );
};

export default SlideViewer;