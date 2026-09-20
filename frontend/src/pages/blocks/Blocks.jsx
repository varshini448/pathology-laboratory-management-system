import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getBlocks } from "../../services/blockService";

const Blocks = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlocks = async () => {
      try {
        const data = await getBlocks();
        setBlocks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBlocks();
  }, []);

  if (loading) {
    return <p>Loading blocks...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Blocks</h1>

      <Link to="/blocks/add">Add Block</Link>

      {blocks.length === 0 ? (
        <p>No blocks found.</p>
      ) : (
        <div>
          {blocks.map((block) => (
            <div key={block._id}>
              <h3>
                <Link to={`/blocks/${block._id}`}>
                  {block.blockId}
                </Link>
              </h3>

              <p>
                <strong>Block Type:</strong>{" "}
                {block.blockType}
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

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blocks;
