import { useEffect, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { getCases } from "../../services/caseService";
import CasesHeader from "./components/CasesHeader";
import CasesSummary from "./components/CasesSummary";
import CasesTable from "./components/CasesTable";
import "../../styles/cases.css";

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCases = async () => {
      try {
        setError("");

        const data = await getCases();
        setCases(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, []);

  if (loading) {
    return (
      <div className="cases-page">
        <div className="cases-state">
          <div className="cases-spinner" />
          <p>Loading cases...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cases-page">
        <div className="cases-state cases-error-state">
          <AlertCircle size={30} strokeWidth={1.8} />

          <h2>Unable to load cases</h2>

          <p>{error}</p>

          <button
            type="button"
            className="cases-retry-button"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cases-page">
      <CasesHeader />
      <CasesSummary cases={cases} />
      <CasesTable cases={cases} />
    </div>
  );
};

export default Cases;
