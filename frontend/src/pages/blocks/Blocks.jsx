import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecordListPage from "../../components/layout/RecordListPage";
import { getBlocks } from "../../services/blockService";

const Blocks = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBlocks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setBlocks(await getBlocks());
    } catch (requestError) {
      setError(requestError.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBlocks(); }, [loadBlocks]);

  const columns = [
    { key: "blockId", label: "Block", render: (record) => <Link className="record-list-link" to={`/blocks/${record._id}`}>{record.blockId}</Link> },
    { key: "blockType", label: "Type" },
    { key: "specimen", label: "Specimen", render: (record) => record.specimen?.specimenId || record.specimen || "—" },
    { key: "case", label: "Case", render: (record) => record.case?.caseId || record.case || "—" },
    { key: "processingStatus", label: "Processing status" },
  ];

  return (
    <RecordListPage
      title="Blocks"
      description="Review tissue blocks and their specimen and case traceability."
      actionTo="/blocks/add"
      actionLabel="Add block"
      columns={columns}
      records={blocks}
      loading={loading}
      error={error}
      onRetry={loadBlocks}
      emptyTitle="No blocks recorded"
      emptyMessage="Blocks created from registered specimens will appear here."
    />
  );
};

export default Blocks;
