import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecordListPage from "../../components/layout/RecordListPage";

import { getReports } from "../../services/reportService";

const DraftReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDraftReports = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getReports();
      setReports((data || []).filter((report) => report.reportStatus === "DRAFT"));
    } catch (err) {
      setError(err.message || "Failed to load draft reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDraftReports(); }, [loadDraftReports]);

  return (
    <RecordListPage
      title="Draft reports"
      description="Review pathology reports that are currently being prepared."
      actionTo="/pathologist-workspace"
      actionLabel="Pathologist workspace"
      columns={[
        { key: "reportId", label: "Report", render: (report) => <Link className="record-list-link" to={`/reports/${report._id}`}>{report.reportId}</Link> },
        { key: "case", label: "Case", render: (report) => report.case?.caseId || "—" },
        { key: "patient", label: "Patient", render: (report) => report.case?.patient?.name || "—" },
        { key: "slide", label: "Slide", render: (report) => report.slide?.slideId || "—" },
        { key: "preparedBy", label: "Prepared by", render: (report) => report.preparedBy?.name || "—" },
        { key: "createdAt", label: "Created", render: (report) => report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "—" },
      ]}
      records={reports}
      loading={loading}
      error={error}
      onRetry={loadDraftReports}
      emptyTitle="No draft reports"
      emptyMessage="Reports still in preparation will appear here."
    />
  );
};

export default DraftReports;
