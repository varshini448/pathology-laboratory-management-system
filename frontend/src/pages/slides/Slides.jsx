import { useEffect, useState } from "react";
import { getSlides } from "../../services/slideService";
import SlideTable from "../../components/tables/SlideTable";

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
    <div>
      <h1>Slide Management</h1>

      <SlideTable slides={slides} />
    </div>
  );
};

export default Slides;