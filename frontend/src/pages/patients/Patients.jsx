import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPatients } from "../../services/patientService";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  if (loading) {
    return <p>Loading patients...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Patients</h1>

      <Link to="/patients/add">Add Patient</Link>

      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <div>
          {patients.map((patient) => (
            <div key={patient._id}>
              <h3>
                <Link to={`/patients/${patient._id}`}>
                  {patient.patientId}
                </Link>
              </h3>

              <p>
                <strong>Name:</strong> {patient.name}
              </p>

              <p>
                <strong>Age:</strong> {patient.age}
              </p>

              <p>
                <strong>Gender:</strong> {patient.gender}
              </p>

              <p>
                <strong>Phone:</strong> {patient.phone || "-"}
              </p>

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Patients;
