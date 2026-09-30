import React from "react";

const ExportButton = ({
  onExport,
  label = "Export",
  format = "CSV",
  loading = false,
}) => {
  const handleExport = () => {
    onExport?.(format);
  };

  return (
    <button
      type="button"
      className="ui-export-button"
      onClick={handleExport}
      disabled={loading}
    >
      {loading ? "Exporting..." : `${label} ${format}`}
    </button>
  );
};

export default ExportButton;