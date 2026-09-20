import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCases } from "../../services/caseService";

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCases = async () => {
      try {
        const data = await getCases();
        setCases(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, []);

  if (loading) {
    return <p>Loading cases...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Cases</h1>

      <Link to="/cases/add">Add Case</Link>

      {cases.length === 0 ? (
        <p>No cases found.</p>
      ) : (
        <div>
          {cases.map((caseData) => (
            <div key={caseData._id}>
              <h3>
                <Link to={`/cases/${caseData._id}`}>
                  {caseData.caseId}
                </Link>
              </h3>

              <p>
                <strong>Case Type:</strong>{" "}
                {caseData.caseType}
              </p>

              <p>
                <strong>Priority:</strong>{" "}
                {caseData.priority}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {caseData.status}
              </p>

              <p>
                <strong>Patient:</strong>{" "}
                {caseData.patient?.name || caseData.patient}
              </p>

              <p>
                <strong>Doctor:</strong>{" "}
                {caseData.doctor?.name || caseData.doctor}
              </p>

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cases;
