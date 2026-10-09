import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getCaseTAT, getStageTAT } from "../../services/tatService";
import TATCaseSummary from "./components/TATCaseSummary";
import TATStageTable from "./components/TATStageTable";
import "../../styles/tat/tat.css";

const TATDetails = () => {
  const { caseId } = useParams();

  const [caseTAT, setCaseTAT] = useState(null);
  const [stageTAT, setStageTAT] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTATDetails = async () => {
      try {
        setLoading(true);

        const [caseData, stageData] = await Promise.all([
          getCaseTAT(caseId),
          getStageTAT(caseId),
        ]);

        setCaseTAT(caseData);
        setStageTAT(stageData);
        setError("");
      } catch (err) {
        console.error("Failed to load TAT details:", err);
        setError(err.message || "Failed to load TAT details");
      } finally {
        setLoading(false);
      }
    };

    loadTATDetails();
  }, [caseId]);

  if (loading) {
    return (
      <div className="tat-page">
        <div className="tat-loading">
          <div className="tat-spinner"></div>
          <p>Loading TAT details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tat-page">
        <div className="tat-error">
          <h2>Unable to load TAT details</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!caseTAT) {
    return (
      <div className="tat-page">
        <div className="tat-empty">
          <h2>No TAT information found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="tat-page">
      <div className="tat-page-header tat-details-header">
        <div>
          <Link to="/tat" className="tat-back-link">
            ← Back to TAT Dashboard
          </Link>

          <p className="tat-eyebrow">CASE TURNAROUND MONITORING</p>

          <h1>
            TAT Details
            <span className="tat-header-case-id">{caseTAT.caseId}</span>
          </h1>

          <p className="tat-page-description">
            Case turnaround time and stage-wise processing duration.
          </p>
        </div>
      </div>

      <TATCaseSummary caseTAT={caseTAT} />
      <TATStageTable stageTAT={stageTAT} />
    </div>
  );
};

export default TATDetails;
