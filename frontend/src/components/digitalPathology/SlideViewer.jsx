const SlideViewer = ({
  slide,
  zoom = 100,
  onZoomChange,
  imageUrl,
}) => {
  if (!slide) {
    return (
      <section className="slide-viewer" aria-label="Digital pathology slide viewer">
        <p>No slide selected.</p>
      </section>
    );
  }

  return (
    <section className="slide-viewer" aria-label="Digital pathology slide viewer">
      <div className="slide-viewer-canvas">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Digital pathology slide ${slide.slideId || ""}`}
            className="slide-viewer-image"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "center center",
            }}
          />
        ) : (
          <div className="slide-image-placeholder">
            <div className="slide-image-grid">
              <span>Digital Slide</span>
              <strong>{slide.slideId || "SLIDE"}</strong>
            </div>
          </div>
        )}
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
