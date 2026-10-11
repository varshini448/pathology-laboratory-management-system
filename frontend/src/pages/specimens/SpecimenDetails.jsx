import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSpecimenById } from "../../services/specimenService";
import RecordDetailsPage, { RecordField } from "../../components/layout/RecordDetailsPage";

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

  return (
    <RecordDetailsPage title="Specimen details" description="Collection, condition, and case information for this specimen." backTo="/specimens" loading={loading} error={error} notFound={!specimen}>
      <RecordField label="Specimen ID">{specimen?.specimenId}</RecordField>
      <RecordField label="Specimen type">{specimen?.specimenType}</RecordField>
      <RecordField label="Collection site">{specimen?.collectionSite}</RecordField>
      <RecordField label="Collection date">{specimen?.collectionDate && new Date(specimen.collectionDate).toLocaleDateString()}</RecordField>
      <RecordField label="Received date">{specimen?.receivedDate && new Date(specimen.receivedDate).toLocaleDateString()}</RecordField>
      <RecordField label="Condition">{specimen?.condition}</RecordField>
      <RecordField label="Status">{specimen?.status}</RecordField>
      <RecordField label="Case">{specimen?.case?.caseId || specimen?.case}</RecordField>
      <RecordField label="Notes">{specimen?.notes}</RecordField>
      <RecordField label="Collected by">{specimen?.collectedBy && `${specimen.collectedBy.name} (${specimen.collectedBy.role})`}</RecordField>
    </RecordDetailsPage>
  );
};

export default SpecimenDetails;
