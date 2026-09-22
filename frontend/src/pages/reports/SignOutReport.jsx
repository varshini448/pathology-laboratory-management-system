import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getReportById,
  signOutReport,
} from "../../services/reportService";

const SignOutReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await getReportById(id);
        setReport(data);
      } catch (err) {
        setError(err.message || "Failed to load report.");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [id]);

  const handleSignOut = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to sign out this report? Final reports cannot be edited."
    );

    if (!confirmed) {
      return;
    }

    try {
      setSigningOut(true);
      setError("");
      setSuccess("");

      const updatedReport = await signOutReport(id);

      setReport(updatedReport);
      setSuccess("Report signed out successfully.");
    } catch (err) {
      setError(err.message || "Failed to sign out report.");
    } finally {
      setSigningOut(false);
    }
  };

  if (loading) {
    return <div>Loading report...</div>;
  }

  if (!report) {
    return (
      <div>
        <h1>Final Sign-out</h1>
        <p>{error || "Report not found."}</p>
        <Link to="/reports/sign-out">
          Back to Pending Sign-out
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Final Sign-out</h1>

      {error && <p>Error: {error}</p>}

      {success && <p>{success}</p>}

      <section>
        <h2>Report Information</h2>

        <p>
          <strong>Report ID:</strong> {report.reportId}
        </p>

        <p>
          <strong>Case:</strong> {report.case?.caseId || "-"}
        </p>

        <p>
          <strong>Patient:</strong>{" "}
          {report.case?.patient?.name || "-"}
        </p>

        <p>
          <strong>Slide:</strong> {report.slide?.slideId || "-"}
        </p>

        <p>
          <strong>Status:</strong> {report.reportStatus}
        </p>

        <p>
          <strong>Prepared By:</strong>{" "}
          {report.preparedBy?.name || "-"}
        </p>

        <p>
          <strong>Created At:</strong>{" "}
          {report.createdAt
            ? new Date(report.createdAt).toLocaleString()
            : "-"}
        </p>
      </section>

      <section>
        <h2>Pathology Findings</h2>

        <p>
          <strong>Diagnosis:</strong>
        </p>
        <p>{report.diagnosis || "-"}</p>

        <p>
          <strong>Microscopic Findings:</strong>
        </p>
        <p>{report.microscopicFindings || "-"}</p>

        <p>
          <strong>Gross Findings:</strong>
        </p>
        <p>{report.grossFindings || "-"}</p>

        <p>
          <strong>Interpretation:</strong>
        </p>
        <p>{report.interpretation || "-"}</p>

        <p>
          <strong>Recommendations:</strong>
        </p>
        <p>{report.recommendations || "-"}</p>
      </section>

      {report.reportStatus === "DRAFT" && (
        <section>
          <h2>Final Sign-out Action</h2>

          <p>
            Review the report carefully before final sign-out.
            Once signed out, the report cannot be edited.
          </p>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? "Signing Out..." : "Final Sign-out"}
          </button>
        </section>
      )}

      {report.reportStatus === "FINAL" && (
        <section>
          <h2>Report Signed Out</h2>

          <p>This report has already been finalized.</p>

          <p>
            <strong>Reviewed By:</strong>{" "}
            {report.reviewedBy?.name || "-"}
          </p>

          <p>
            <strong>Reviewed At:</strong>{" "}
            {report.reviewedAt
              ? new Date(report.reviewedAt).toLocaleString()
              : "-"}
          </p>
        </section>
      )}

      <p>
        <Link to="/reports/sign-out">
          Back to Pending Sign-out
        </Link>
        {" | "}
        <Link to={`/reports/${report._id}`}>
          View Full Report
        </Link>
        {" | "}
        <Link to="/pathologist-workspace">
          Pathologist Workspace
        </Link>
      </p>
    </div>
  );
};

export default SignOutReport;