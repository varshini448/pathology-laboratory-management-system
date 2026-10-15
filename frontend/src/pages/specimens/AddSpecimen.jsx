import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createSpecimen } from "../../services/specimenService";
import { getCases } from "../../services/caseService";
import PageHeader from "../../components/layout/PageHeader";

const initialFormData = {
  specimenId: "",
  case: "",
  specimenType: "",
  collectionSite: "",
  collectionDate: "",
  receivedDate: "",
  condition: "GOOD",
  notes: "",
};

const AddSpecimen = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [casesLoading, setCasesLoading] = useState(true);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadCases = async () => {
      try {
        const data = await getCases();
        if (active) setCases(Array.isArray(data) ? data : []);
      } catch (err) {
        if (active) setError(err.message || "Unable to load cases.");
      } finally {
        if (active) setCasesLoading(false);
      }
    };

    loadCases();
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);
      await createSpecimen({
        ...formData,
        collectionDate: formData.collectionDate || undefined,
        receivedDate: formData.receivedDate || undefined,
        collectionSite: formData.collectionSite.trim(),
        notes: formData.notes.trim(),
      });
      navigate("/specimens");
    } catch (err) {
      setError(err.message || "Failed to create specimen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="workflow-form-page">
      <PageHeader
        eyebrow="LABORATORY WORKFLOW"
        title="Add specimen"
        description="Register a specimen and select the receiving case."
      />

      <form className="workflow-entry-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="specimenId">Specimen ID</label>
          <input
            type="text"
            id="specimenId"
            name="specimenId"
            value={formData.specimenId}
            onChange={handleChange}
            placeholder="Enter a unique specimen ID"
            required
          />
        </div>

        <div>
          <label htmlFor="specimenCase">Case</label>
          <select
            id="specimenCase"
            name="case"
            value={formData.case}
            onChange={handleChange}
            required
            disabled={casesLoading || cases.length === 0}
          >
            <option value="">
              {casesLoading ? "Loading cases..." : "Select a case"}
            </option>
            {cases.map((caseItem) => (
              <option key={caseItem._id} value={caseItem._id}>
                {caseItem.caseId} - {caseItem.caseType}
                {caseItem.patient?.name ? ` - ${caseItem.patient.name}` : ""}
              </option>
            ))}
          </select>
          {!casesLoading && cases.length === 0 && (
            <p role="status">No cases available. Create a case first.</p>
          )}
        </div>

        <div>
          <label htmlFor="specimenType">Specimen Type</label>
          <input
            type="text"
            id="specimenType"
            name="specimenType"
            value={formData.specimenType}
            onChange={handleChange}
            placeholder="Enter specimen type"
            required
          />
        </div>

        <div>
          <label htmlFor="collectionSite">Collection Site</label>
          <input
            type="text"
            id="collectionSite"
            name="collectionSite"
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
            id="condition"
            name="condition"
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
            id="specimenNotes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            maxLength={5000}
          />
        </div>

        {error && (
          <p className="workflow-form-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || casesLoading || cases.length === 0}
        >
          {loading ? "Saving..." : "Create Specimen"}
        </button>
      </form>
    </main>
  );
};

export default AddSpecimen;
