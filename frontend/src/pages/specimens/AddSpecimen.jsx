import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createSpecimen } from "../../services/specimenService";
import PageHeader from "../../components/layout/PageHeader";

const AddSpecimen = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    specimenId: "",
    case: "",
    specimenType: "",
    collectionSite: "",
    collectionDate: "",
    receivedDate: "",
    condition: "GOOD",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await createSpecimen(formData);

      navigate("/specimens");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="workflow-form-page">
      <PageHeader eyebrow="LABORATORY WORKFLOW" title="Add specimen" description="Register a specimen and link it to the receiving case." />

      <form className="workflow-entry-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="specimenId">Specimen ID</label>

          <input
            type="text"
            id="specimenId"
            name="specimenId"
            value={formData.specimenId}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="specimenCase">Case ID</label>

          <input
            type="text"
            id="specimenCase"
            name="case"
            value={formData.case}
            onChange={handleChange}
            placeholder="Enter Case MongoDB ID"
            required
          />
        </div>

        <div>
          <label htmlFor="specimenType">Specimen Type</label>

          <input
            type="text"
            id="specimenType"
            name="specimenType"
            value={formData.specimenType}
            onChange={handleChange}
            placeholder="Example: Tissue Biopsy"
            required
          />
        </div>

        <div>
          <label htmlFor="collectionSite">Collection Site</label>

          <input
            type="text"
            name="collectionSite"
            id="collectionSite"
            value={formData.collectionSite}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="collectionDate">Collection Date</label>

          <input
            type="date"
            id="collectionDate"
            name="collectionDate"
            value={formData.collectionDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="receivedDate">Received Date</label>

          <input
            type="date"
            id="receivedDate"
            name="receivedDate"
            value={formData.receivedDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="condition">Condition</label>

          <select
            name="condition"
            id="condition"
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="GOOD">Good</option>
            <option value="DAMAGED">Damaged</option>
            <option value="INADEQUATE">Inadequate</option>
          </select>
        </div>

        <div>
          <label htmlFor="specimenNotes">Notes</label>

          <textarea
            name="notes"
            id="specimenNotes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        {error && <p className="workflow-form-error" role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Specimen"}
        </button>
      </form>
    </main>
  );
};

export default AddSpecimen;
