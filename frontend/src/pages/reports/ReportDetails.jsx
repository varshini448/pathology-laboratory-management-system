import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getReportById } from "../../services/reportService";

const ReportDetails = () => {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await getReportById(id);
        setReport(data);
      } catch (err) {
        setError(err.message || "Failed to load report");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [id]);

  if (loading) {
    return <div>Loading report...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Report Details</h1>
        <p>Error: {error}</p>
        <Link to="/reports">Back to Reports</Link>
      </div>
    );
  }

  if (!report) {
    return (
      <div>
        <h1>Report Details</h1>
        <p>Report not found.</p>
        <Link to="/reports">Back to Reports</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Report Details</h1>

      <p>
        <strong>Report ID:</strong> {report.reportId}
      </p>

      <p>
        <strong>Case:</strong> {report.case?.caseId || "-"}
      </p>

      <p>
        <strong>Slide:</strong> {report.slide?.slideId || "-"}
      </p>

      <p>
        <strong>Diagnosis:</strong> {report.diagnosis}
      </p>

      <p>
        <strong>Microscopic Findings:</strong>{" "}
        {report.microscopicFindings || "-"}
      </p>

      <p>
        <strong>Gross Findings:</strong> {report.grossFindings || "-"}
      </p>

      <p>
        <strong>Interpretation:</strong> {report.interpretation || "-"}
      </p>

      <p>
        <strong>Recommendations:</strong> {report.recommendations || "-"}
      </p>

      <p>
        <strong>Status:</strong> {report.reportStatus}
      </p>

      <p>
        <strong>Prepared By:</strong>{" "}
        {report.preparedBy?.name || "-"}
      </p>

      <p>
        <strong>Reviewed By:</strong>{" "}
        {report.reviewedBy?.name || "-"}
      </p>

      <p>
        <strong>Created At:</strong>{" "}
        {report.createdAt
          ? new Date(report.createdAt).toLocaleString()
          : "-"}
      </p>

      {report.reviewedAt && (
        <p>
          <strong>Reviewed At:</strong>{" "}
          {new Date(report.reviewedAt).toLocaleString()}
        </p>
      )}

      <div>
        <Link to="/reports">Back to Reports</Link>
        {" | "}
        <Link to={`/reports/${report._id}/sign-out`}>
          Final Sign-out
        </Link>
      </div>
    </div>
  );
};

export default ReportDetails;