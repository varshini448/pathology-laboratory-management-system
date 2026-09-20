import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getBlockById } from "../../services/blockService";

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

  if (loading) {
    return <p>Loading block...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!block) {
    return <p>Block not found.</p>;
  }

  return (
    <div>
      <h1>Block Details</h1>

      <p>
        <strong>Block ID:</strong> {block.blockId}
      </p>

      <p>
        <strong>Block Type:</strong> {block.blockType}
      </p>

      <p>
        <strong>Processing Status:</strong>{" "}
        {block.processingStatus}
      </p>

      <p>
        <strong>Specimen:</strong>{" "}
        {block.specimen?.specimenId || block.specimen}
      </p>

      <p>
        <strong>Case:</strong>{" "}
        {block.case?.caseId || block.case}
      </p>

      <p>
        <strong>Tissue Description:</strong>{" "}
        {block.tissueDescription || "-"}
      </p>

      <p>
        <strong>Notes:</strong> {block.notes || "-"}
      </p>

      {block.createdBy && (
        <p>
          <strong>Created By:</strong>{" "}
          {block.createdBy.name} ({block.createdBy.role})
        </p>
      )}
    </div>
  );
};

export default BlockDetails;
