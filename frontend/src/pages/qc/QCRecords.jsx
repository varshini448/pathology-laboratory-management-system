import { useEffect, useState } from "react";
import { getQCRecords } from "../../services/qcService";

const QCRecords = () => {
  const [qcRecords, setQCRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadQCRecords = async () => {
      try {
        const records = await getQCRecords();
        setQCRecords(records);
      } catch (err) {
        setError(err.message || "Failed to load QC records");
      } finally {
        setLoading(false);
      }
    };

    loadQCRecords();
  }, []);

  if (loading) {
    return <div>Loading QC records...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>QC Records</h1>

      {qcRecords.length === 0 ? (
        <p>No QC records found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>QC ID</th>
              <th>Case</th>
              <th>Slide</th>
              <th>Section Quality</th>
              <th>Staining Quality</th>
              <th>Labeling</th>
              <th>Documentation</th>
              <th>Overall Status</th>
              <th>Reviewed By</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {qcRecords.map((record) => (
              <tr key={record._id}>
                <td>{record.qcId}</td>
                <td>{record.case?.caseId || "-"}</td>
                <td>{record.slide?.slideId || "-"}</td>
                <td>{record.sectionQuality}</td>
                <td>{record.stainingQuality}</td>
                <td>{record.labelingCheck}</td>
                <td>{record.documentationCheck}</td>
                <td>{record.overallStatus}</td>
                <td>{record.reviewedBy?.name || "-"}</td>
                <td>
                  {record.createdAt
                    ? new Date(record.createdAt).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QCRecords;