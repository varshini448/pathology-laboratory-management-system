import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getPendingSignOutReports } from "../../services/reportService";

const SignOutReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPendingReports = async () => {
      try {
        const data = await getPendingSignOutReports();
        setReports(data || []);
      } catch (err) {
        setError(
          err.message || "Failed to load reports pending sign-out."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPendingReports();
  }, []);

  if (loading) {
    return <div>Loading reports pending sign-out...</div>;
  }

  return (
    <div>
      <h1>Pending Final Sign-out</h1>

      <p>
        Review pathology report drafts that are ready for final
        pathologist sign-out.
      </p>

      {error && <p>Error: {error}</p>}

      {!error && reports.length === 0 && (
        <p>No reports are currently pending final sign-out.</p>
      )}

      {!error && reports.length > 0 && (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Case</th>
              <th>Patient</th>
              <th>Slide</th>
              <th>Prepared By</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td>{report.reportId}</td>

                <td>{report.case?.caseId || "-"}</td>

                <td>{report.case?.patient?.name || "-"}</td>

                <td>{report.slide?.slideId || "-"}</td>

                <td>{report.preparedBy?.name || "-"}</td>

                <td>
                  {report.createdAt
                    ? new Date(report.createdAt).toLocaleString()
                    : "-"}
                </td>

                <td>
                  <Link to={`/reports/${report._id}/sign-out`}>
                    Review for Sign-out
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p>
        <Link to="/pathologist-workspace">
          Back to Pathologist Workspace
        </Link>
      </p>
    </div>
  );
};

export default SignOutReports;