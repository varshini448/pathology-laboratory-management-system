import React from "react";

const ReportDownloadButton = ({
  reportId,
  onDownload,
  loading = false,
}) => {
  const handleDownload = () => {
    onDownload?.(reportId);
  };

  return (
    <button
      type="button"
      className="report-download-button"
      onClick={handleDownload}
      disabled={loading}
    >
      {loading ? "Preparing..." : "Download Report"}
    </button>
  );
};

export default ReportDownloadButton;