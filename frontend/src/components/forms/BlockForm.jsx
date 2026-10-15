import { useEffect, useState } from "react";
import { getCases } from "../../services/caseService";
import { getSpecimens } from "../../services/specimenService";

const initialFormData = {
  blockId: "",
  specimen: "",
  case: "",
  blockType: "",
  tissueDescription: "",
  notes: "",
};

const relationId = (value) =>
  typeof value === "object" && value !== null ? value._id : value;

const BlockForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [cases, setCases] = useState([]);
  const [specimens, setSpecimens] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([getCases(), getSpecimens()])
      .then(([caseData, specimenData]) => {
        if (!active) return;
        setCases(Array.isArray(caseData) ? caseData : []);
        setSpecimens(Array.isArray(specimenData) ? specimenData : []);
      })
      .catch((error) => {
        if (active) setLoadError(error.message || "Unable to load cases and specimens.");
      })
      .finally(() => {
        if (active) setRecordsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const availableSpecimens = specimens.filter(
    (item) => relationId(item.case) === formData.case
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "case" ? { specimen: "" } : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const submitted = await onSubmit(formData);
    if (submitted === false) return;

    setFormData(initialFormData);
  };

  return (
    <form className="workflow-entry-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="blockId">Block ID</label>
        <input id="blockId" name="blockId" value={formData.blockId}
          onChange={handleChange} placeholder="e.g. BLOCK002" required />
      </div>

      <div>
        <label htmlFor="blockCase">Case</label>
        <select id="blockCase" name="case" value={formData.case}
          onChange={handleChange} required disabled={recordsLoading || cases.length === 0}>
          <option value="">{recordsLoading ? "Loading cases..." : "Select a case"}</option>
          {cases.map((item) => (
            <option key={item._id} value={item._id}>
              {item.caseId} — {item.caseType}
              {item.patient?.name ? ` — ${item.patient.name}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="specimen">Specimen</label>
        <select id="specimen" name="specimen" value={formData.specimen}
          onChange={handleChange} required
          disabled={recordsLoading || !formData.case || availableSpecimens.length === 0}>
          <option value="">
            {recordsLoading ? "Loading specimens..." :
              !formData.case ? "Select a case first" :
              availableSpecimens.length === 0 ? "No specimens for this case" : "Select a specimen"}
          </option>
          {availableSpecimens.map((item) => (
            <option key={item._id} value={item._id}>
              {item.specimenId} — {item.specimenType}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="blockType">Block Type</label>
        <input id="blockType" name="blockType" value={formData.blockType}
          onChange={handleChange} placeholder="e.g. PARAFFIN" required />
      </div>

      <div>
        <label htmlFor="tissueDescription">Tissue Description</label>
        <textarea name="tissueDescription" id="tissueDescription"
          value={formData.tissueDescription} onChange={handleChange}
          placeholder="Describe the tissue" />
      </div>

      <div>
        <label htmlFor="blockNotes">Notes</label>
        <textarea name="notes" id="blockNotes" value={formData.notes}
          onChange={handleChange} placeholder="Block notes" />
      </div>

      {loadError && <p className="workflow-form-error" role="alert">{loadError}</p>}
      {!recordsLoading && cases.length === 0 && (
        <p role="status">No cases available. Create a case first.</p>
      )}
      {!recordsLoading && formData.case && availableSpecimens.length === 0 && (
        <p role="status">No specimens are linked to this case. Register a specimen first.</p>
      )}

      <button type="submit" disabled={loading || recordsLoading ||
        cases.length === 0 || availableSpecimens.length === 0}>
        {loading ? "Creating..." : "Create Block"}
      </button>
    </form>
  );
};

export default BlockForm;
