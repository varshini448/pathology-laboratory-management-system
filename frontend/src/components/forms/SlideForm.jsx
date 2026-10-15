import { useEffect, useState } from "react";
import { getCases } from "../../services/caseService";
import { getBlocks } from "../../services/blockService";

const initialFormData = {
  slideId: "",
  block: "",
  case: "",
  slideType: "",
  stainingMethod: "",
  notes: "",
};

const relationId = (value) =>
  typeof value === "object" && value !== null ? value._id : value;

const SlideForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [cases, setCases] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([getCases(), getBlocks()])
      .then(([caseData, blockData]) => {
        if (!active) return;
        setCases(Array.isArray(caseData) ? caseData : []);
        setBlocks(Array.isArray(blockData) ? blockData : []);
      })
      .catch((error) => {
        if (active) setLoadError(error.message || "Unable to load cases and blocks.");
      })
      .finally(() => {
        if (active) setRecordsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const availableBlocks = blocks.filter(
    (item) => relationId(item.case) === formData.case
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "case" ? { block: "" } : {}),
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
        <label htmlFor="slideId">Slide ID</label>
        <input id="slideId" name="slideId" value={formData.slideId}
          onChange={handleChange} placeholder="e.g. SLIDE002" required />
      </div>

      <div>
        <label htmlFor="slideCase">Case</label>
        <select id="slideCase" name="case" value={formData.case}
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
        <label htmlFor="block">Block</label>
        <select id="block" name="block" value={formData.block}
          onChange={handleChange} required
          disabled={recordsLoading || !formData.case || availableBlocks.length === 0}>
          <option value="">
            {recordsLoading ? "Loading blocks..." :
              !formData.case ? "Select a case first" :
              availableBlocks.length === 0 ? "No blocks for this case" : "Select a block"}
          </option>
          {availableBlocks.map((item) => (
            <option key={item._id} value={item._id}>
              {item.blockId} — {item.blockType}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="slideType">Slide Type</label>
        <input id="slideType" name="slideType" value={formData.slideType}
          onChange={handleChange} placeholder="e.g. HISTOLOGY" required />
      </div>

      <div>
        <label htmlFor="stainingMethod">Staining Method</label>
        <input type="text" name="stainingMethod" id="stainingMethod"
          value={formData.stainingMethod} onChange={handleChange} placeholder="e.g. H&E" />
      </div>

      <div>
        <label htmlFor="slideNotes">Notes</label>
        <textarea name="notes" id="slideNotes" value={formData.notes}
          onChange={handleChange} placeholder="Slide notes" />
      </div>

      {loadError && <p className="workflow-form-error" role="alert">{loadError}</p>}
      {!recordsLoading && cases.length === 0 && (
        <p role="status">No cases available. Create a case first.</p>
      )}
      {!recordsLoading && formData.case && availableBlocks.length === 0 && (
        <p role="status">No blocks are linked to this case. Create a block first.</p>
      )}

      <button type="submit" disabled={loading || recordsLoading ||
        cases.length === 0 || availableBlocks.length === 0}>
        {loading ? "Creating..." : "Create Slide"}
      </button>
    </form>
  );
};

export default SlideForm;
