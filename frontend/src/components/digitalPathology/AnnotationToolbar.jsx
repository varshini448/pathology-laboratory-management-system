import React from "react";

const AnnotationToolbar = ({
  activeTool = "pointer",
  onToolChange,
}) => {
  const tools = [
    { id: "pointer", label: "Pointer" },
    { id: "pen", label: "Pen" },
    { id: "rectangle", label: "Rectangle" },
    { id: "circle", label: "Circle" },
    { id: "measurement", label: "Measure" },
  ];

  return (
    <div className="annotation-toolbar" aria-label="Annotation tools">
      {tools.map((tool) => (
        <button
          key={tool.id}
          type="button"
          className={activeTool === tool.id ? "active" : ""}
          onClick={() => onToolChange?.(tool.id)}
          aria-pressed={activeTool === tool.id}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
};

export default AnnotationToolbar;