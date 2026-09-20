import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSpecimenById } from "../../services/specimenService";

const SpecimenDetails = () => {
  const { id } = useParams();

  const [specimen, setSpecimen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSpecimen = async () => {
      try {
        const data = await getSpecimenById(id);
        setSpecimen(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSpecimen();
  }, [id]);

  if (loading) {
    return <p>Loading specimen...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!specimen) {
    return <p>Specimen not found.</p>;
  }

  return (
    <div>
      <h1>Specimen Details</h1>

      <p>
        <strong>Specimen ID:</strong> {specimen.specimenId}
      </p>

      <p>
        <strong>Specimen Type:</strong> {specimen.specimenType}
      </p>

      <p>
        <strong>Collection Site:</strong>{" "}
        {specimen.collectionSite || "-"}
      </p>

      <p>
        <strong>Collection Date:</strong>{" "}
        {specimen.collectionDate
          ? new Date(specimen.collectionDate).toLocaleDateString()
          : "-"}
      </p>

      <p>
        <strong>Received Date:</strong>{" "}
        {specimen.receivedDate
          ? new Date(specimen.receivedDate).toLocaleDateString()
          : "-"}
      </p>

      <p>
        <strong>Condition:</strong> {specimen.condition}
      </p>

      <p>
        <strong>Status:</strong> {specimen.status}
      </p>

      <p>
        <strong>Case:</strong>{" "}
        {specimen.case?.caseId || specimen.case || "-"}
      </p>

      <p>
        <strong>Notes:</strong> {specimen.notes || "-"}
      </p>

      {specimen.collectedBy && (
        <p>
          <strong>Collected By:</strong>{" "}
          {specimen.collectedBy.name} ({specimen.collectedBy.role})
        </p>
      )}
    </div>
  );
};

export default SpecimenDetails;
