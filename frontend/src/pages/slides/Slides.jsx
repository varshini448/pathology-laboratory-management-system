import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSlides } from "../../services/slideService";
import RecordListPage from "../../components/layout/RecordListPage";

const Slides = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSlides = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSlides();
      setSlides(data);
    } catch (err) {
      setError("Failed to load slides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  if (loading) {
    return <p>Loading slides...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <RecordListPage
      title="Slides"
      description="Review slide preparation, staining, and scanning status for each case."
      actionTo="/slides/add"
      actionLabel="Add slide"
      columns={[
        { key: "slideId", label: "Slide", render: (record) => <Link className="record-list-link" to={`/slides/${record._id}`}>{record.slideId}</Link> },
        { key: "block", label: "Block", render: (record) => record.block?.blockId || record.block || "—" },
        { key: "case", label: "Case", render: (record) => record.case?.caseId || record.case || "—" },
        { key: "slideType", label: "Type" },
        { key: "stainingMethod", label: "Staining" },
        { key: "status", label: "Status" },
      ]}
      records={slides}
      loading={loading}
      error={error}
      onRetry={loadSlides}
      emptyTitle="No slides recorded"
      emptyMessage="Slides added to laboratory cases will appear here."
    />
  );
};

export default Slides;
