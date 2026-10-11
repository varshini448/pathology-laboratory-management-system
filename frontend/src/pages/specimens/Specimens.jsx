import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecordListPage from "../../components/layout/RecordListPage";
import { getSpecimens } from "../../services/specimenService";

const Specimens = () => {
  const [specimens, setSpecimens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSpecimens = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setSpecimens(await getSpecimens());
    } catch (requestError) {
      setError(requestError.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSpecimens(); }, [loadSpecimens]);

  const columns = [
    { key: "specimenId", label: "Specimen", render: (record) => <Link className="record-list-link" to={`/specimens/${record._id}`}>{record.specimenId}</Link> },
    { key: "specimenType", label: "Type" },
    { key: "case", label: "Case", render: (record) => record.case?.caseId || record.case || "—" },
    { key: "collectionSite", label: "Collection site" },
    { key: "condition", label: "Condition" },
    { key: "status", label: "Status" },
  ];

  return (
    <RecordListPage
      title="Specimens"
      description="Review specimen identity, condition, and case association across the laboratory."
      actionTo="/specimens/add"
      actionLabel="Add specimen"
      columns={columns}
      records={specimens}
      loading={loading}
      error={error}
      onRetry={loadSpecimens}
      emptyTitle="No specimens recorded"
      emptyMessage="New specimen records will appear here after they are registered."
    />
  );
};

export default Specimens;
