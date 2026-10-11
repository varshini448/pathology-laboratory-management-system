import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getBlockById } from "../../services/blockService";
import RecordDetailsPage, { RecordField } from "../../components/layout/RecordDetailsPage";

const BlockDetails = () => {
  const { id } = useParams();

  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlock = async () => {
      try {
        const data = await getBlockById(id);
        setBlock(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBlock();
  }, [id]);

  return (
    <RecordDetailsPage title="Block details" description="Traceability and processing information for this block." backTo="/blocks" loading={loading} error={error} notFound={!block}>
      <RecordField label="Block ID">{block?.blockId}</RecordField>
      <RecordField label="Block type">{block?.blockType}</RecordField>
      <RecordField label="Processing status">{block?.processingStatus}</RecordField>
      <RecordField label="Specimen">{block?.specimen?.specimenId || block?.specimen}</RecordField>
      <RecordField label="Case">{block?.case?.caseId || block?.case}</RecordField>
      <RecordField label="Tissue description">{block?.tissueDescription}</RecordField>
      <RecordField label="Notes">{block?.notes}</RecordField>
      <RecordField label="Created by">{block?.createdBy && `${block.createdBy.name} (${block.createdBy.role})`}</RecordField>
    </RecordDetailsPage>
  );
};

export default BlockDetails;
