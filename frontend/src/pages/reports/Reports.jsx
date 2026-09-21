import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReports } from "../../services/reportService";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await getReports();
        setReports(data);
      } catch (err) {
        setError(err.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  if (loading) {
    return <div>Loading reports...</div>;
  }

  return (
    <div>
      <h1>Pathology Reports</h1>

      <div>
        <Link to="/reports/create">Create New Report</Link>
      </div>

      {error && <p>Error: {error}</p>}

      {!error && reports.length === 0 && (
        <p>No reports found.</p>
      )}

      {!error && reports.length > 0 && (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Case</th>
              <th>Slide</th>
              <th>Diagnosis</th>
              <th>Status</th>
              <th>Prepared By</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td>{report.reportId}</td>

                <td>
                  {report.case?.caseId || "-"}
                </td>

                <td>
                  {report.slide?.slideId || "-"}
                </td>

                <td>
                  {report.diagnosis}
                </td>

                <td>
                  {report.reportStatus}
                </td>

                <td>
                  {report.preparedBy?.name || "-"}
                </td>

                <td>
                  {report.createdAt
                    ? new Date(report.createdAt).toLocaleString()
                    : "-"}
                </td>

                <td>
                  <Link to={`/reports/${report._id}`}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reports;