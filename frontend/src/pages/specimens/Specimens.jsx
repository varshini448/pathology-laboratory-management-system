import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSpecimens } from "../../services/specimenService";

const Specimens = () => {
  const [specimens, setSpecimens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSpecimens = async () => {
      try {
        const data = await getSpecimens();
        setSpecimens(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSpecimens();
  }, []);

  if (loading) {
    return <p>Loading specimens...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Specimens</h1>

      <Link to="/specimens/add">Add Specimen</Link>

      {specimens.length === 0 ? (
        <p>No specimens found.</p>
      ) : (
        <div>
          {specimens.map((specimen) => (
            <div key={specimen._id}>
              <h3>
                <Link to={`/specimens/${specimen._id}`}>
                  {specimen.specimenId}
                </Link>
              </h3>

              <p>
                <strong>Specimen Type:</strong>{" "}
                {specimen.specimenType}
              </p>

              <p>
                <strong>Condition:</strong>{" "}
                {specimen.condition}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {specimen.status}
              </p>

              <p>
                <strong>Case:</strong>{" "}
                {specimen.case?.caseId || specimen.case || "-"}
              </p>

              <p>
                <strong>Collection Site:</strong>{" "}
                {specimen.collectionSite || "-"}
              </p>

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Specimens;
