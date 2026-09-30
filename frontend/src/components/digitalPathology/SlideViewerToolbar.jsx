import React from "react";

const SlideViewerToolbar = ({
  zoom = 100,
  onZoomIn,
  onZoomOut,
  onReset,
  onFullscreen,
}) => {
  return (
    <div className="slide-viewer-toolbar" aria-label="Slide viewer controls">
      <button type="button" onClick={onZoomOut}>
        −
      </button>

      <span>{zoom}%</span>

      <button type="button" onClick={onZoomIn}>
        +
      </button>

      <button type="button" onClick={onReset}>
        Reset
      </button>

      <button type="button" onClick={onFullscreen}>
        Fullscreen
      </button>
    </div>
  );
};

export default SlideViewerToolbar;