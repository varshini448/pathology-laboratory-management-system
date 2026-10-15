import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecordListPage from "../../components/layout/RecordListPage";
import { getReports } from "../../services/reportService";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setReports((await getReports()) || []);
    } catch (err) {
      setError(err.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadReports(); }, [loadReports]);

  return (
    <RecordListPage
      title="Pathology reports"
      description="Review report drafts and finalized case reports."
      actionTo="/reports/create"
      actionLabel="Create Report"
      columns={[
        { key: "reportId", label: "Report", render: (report) => <Link className="record-list-link" to={`/reports/${report._id}`}>{report.reportId}</Link> },
        { key: "case", label: "Case", render: (report) => report.case?.caseId || "—" },
        { key: "patient", label: "Patient", render: (report) => report.case?.patient?.name || "—" },
        { key: "slide", label: "Slide", render: (report) => report.slide?.slideId || "—" },
        { key: "reportStatus", label: "Status" },
        { key: "preparedBy", label: "Prepared by", render: (report) => report.preparedBy?.name || "—" },
        { key: "createdAt", label: "Created", render: (report) => report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "—" },
      ]}
      records={reports}
      loading={loading}
      error={error}
      onRetry={loadReports}
      emptyTitle="No reports available"
      emptyMessage="Reports will appear here when they are created for a case."
    />
  );
};

export default Reports;
