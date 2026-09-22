import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getReports } from "../../services/reportService";

const DraftReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDraftReports = async () => {
      try {
        const data = await getReports();

        const draftReports = (data || []).filter(
          (report) => report.reportStatus === "DRAFT"
        );

        setReports(draftReports);
      } catch (err) {
        setError(err.message || "Failed to load draft reports.");
      } finally {
        setLoading(false);
      }
    };

    loadDraftReports();
  }, []);

  if (loading) {
    return <div>Loading draft reports...</div>;
  }

  return (
    <div>
      <h1>Draft Reports</h1>

      <p>
        Review pathology reports that are currently being prepared by
        pathologists.
      </p>

      {error && <p>Error: {error}</p>}

      {!error && reports.length === 0 && (
        <p>No draft reports found.</p>
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
                  <Link to={`/reports/${report._id}`}>
                    Open Draft
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

export default DraftReports;