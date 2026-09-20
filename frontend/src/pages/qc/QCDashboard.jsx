import { useEffect, useState } from "react";
import { getQCRecords } from "../../services/qcService";

const QCDashboard = () => {
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

  const passedCount = qcRecords.filter(
    (record) => record.overallStatus === "PASSED"
  ).length;

  const failedCount = qcRecords.filter(
    (record) => record.overallStatus === "FAILED"
  ).length;

  const needsReviewCount = qcRecords.filter(
    (record) => record.overallStatus === "NEEDS_REVIEW"
  ).length;

  if (loading) {
    return <div>Loading QC dashboard...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Quality Control Dashboard</h1>

      <div>
        <h2>Total QC Records</h2>
        <p>{qcRecords.length}</p>
      </div>

      <div>
        <h2>Passed</h2>
        <p>{passedCount}</p>
      </div>

      <div>
        <h2>Failed</h2>
        <p>{failedCount}</p>
      </div>

      <div>
        <h2>Needs Review</h2>
        <p>{needsReviewCount}</p>
      </div>
    </div>
  );
};

export default QCDashboard;