import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatientById } from "../../services/patientService";

const PatientDetails = () => {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPatient = async () => {
      try {
        const data = await getPatientById(id);
        setPatient(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
  }, [id]);

  if (loading) {
    return <p>Loading patient...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!patient) {
    return <p>Patient not found.</p>;
  }

  return (
    <div>
      <h1>Patient Details</h1>

      <p>
        <strong>Patient ID:</strong> {patient.patientId}
      </p>

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

      <p>
        <strong>Email:</strong> {patient.email || "-"}
      </p>

      <p>
        <strong>Address:</strong> {patient.address || "-"}
      </p>

      <p>
        <strong>Medical History:</strong>{" "}
        {patient.medicalHistory || "-"}
      </p>
    </div>
  );
};

export default PatientDetails;
