import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPendingSignOutReports } from "../../services/reportService";
import RecordListPage from "../../components/layout/RecordListPage";

const SignOutReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPendingReports = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setReports((await getPendingSignOutReports()) || []);
    } catch (requestError) {
      setError(requestError.message || "Failed to load reports pending sign-out.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPendingReports(); }, [loadPendingReports]);

  return (
    <RecordListPage
      title="Pending final sign-out"
      description="Review report drafts that are ready for pathologist sign-out."
      actionTo="/pathologist-workspace"
      actionLabel="Pathologist workspace"
      columns={[
        { key: "reportId", label: "Report", render: (report) => <Link className="record-list-link" to={`/reports/${report._id}/sign-out`}>{report.reportId}</Link> },
        { key: "case", label: "Case", render: (report) => report.case?.caseId || "—" },
        { key: "patient", label: "Patient", render: (report) => report.case?.patient?.name || "—" },
        { key: "slide", label: "Slide", render: (report) => report.slide?.slideId || "—" },
        { key: "preparedBy", label: "Prepared by", render: (report) => report.preparedBy?.name || "—" },
        { key: "createdAt", label: "Created", render: (report) => report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "—" },
      ]}
      records={reports}
      loading={loading}
      error={error}
      onRetry={loadPendingReports}
      emptyTitle="No reports awaiting sign-out"
      emptyMessage="Reports ready for final review will appear here."
    />
  );
};

export default SignOutReports;
