import React from "react";

const SlideMetadataPanel = ({ slide = {} }) => {
  const metadata = [
    ["Slide ID", slide.slideId],
    ["Specimen ID", slide.specimenId],
    ["Block ID", slide.blockId],
    ["Stain", slide.stain],
    ["Magnification", slide.magnification],
    ["Status", slide.status],
  ];

  return (
    <aside className="slide-metadata-panel">
      <div className="slide-metadata-header">
        <p>SLIDE INFORMATION</p>
        <h3>{slide.slideId || "Slide Details"}</h3>
      </div>

      <div className="slide-metadata-list">
        {metadata.map(([label, value]) => (
          <div className="slide-metadata-row" key={label}>
            <span>{label}</span>
            <strong>{value || "-"}</strong>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SlideMetadataPanel;