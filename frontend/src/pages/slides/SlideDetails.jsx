import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api";

const SlideDetails = () => {
  const { id } = useParams();

  const [slide, setSlide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSlide = async () => {
      try {
        const response = await api.get(`/slides/${id}`);
        setSlide(response.slide);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSlide();
  }, [id]);

  if (loading) {
    return <p>Loading slide...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!slide) {
    return <p>Slide not found.</p>;
  }

  return (
    <div>
      <h1>Slide Details</h1>

      <p>
        <strong>Slide ID:</strong> {slide.slideId}
      </p>

      <p>
        <strong>Slide Type:</strong> {slide.slideType}
      </p>

      <p>
        <strong>Staining Method:</strong>{" "}
        {slide.stainingMethod || "-"}
      </p>

      <p>
        <strong>Status:</strong> {slide.status}
      </p>

      <p>
        <strong>Block:</strong>{" "}
        {slide.block?.blockId || slide.block}
      </p>

      <p>
        <strong>Case:</strong>{" "}
        {slide.case?.caseId || slide.case}
      </p>

      <p>
        <strong>Notes:</strong> {slide.notes || "-"}
      </p>
    </div>
  );
};

export default SlideDetails;