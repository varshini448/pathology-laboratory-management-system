import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import DashboardEmptyState from "../dashboard/components/DashboardEmptyState";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import DashboardSection from "../dashboard/components/DashboardSection";
import { getWorkflowBottlenecks } from "../../services/workflowService";
import "../dashboard/dashboard.css";
import "./workflow-bottlenecks.css";
import { getWorkflowBottleneckRecommendation } from "./workflowBottleneckRecommendations";

const formatStage = (stage) => stage
  .toLowerCase()
  .split("_")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

const formatElapsed = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours < 24) return remainingMinutes ? `${hours} hr ${remainingMinutes} min` : `${hours} hr`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours ? `${days} day ${remainingHours} hr` : `${days} day`;
};

const isNetworkUnavailable = (error) =>
  error?.name === "TypeError" || /network|unavailable|failed to fetch/i.test(error?.message || "");

const WorkflowBottlenecks = () => {
  const [result, setResult] = useState(null);
  const [state, setState] = useState("loading");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setState("loading");

    getWorkflowBottlenecks()
      .then((data) => {
        if (!active) return;
        if (!data || !Array.isArray(data.stages)) {
          setResult(null);
          setState("error");
          return;
        }
        setResult(data);
        setState(data.available === false ? "unavailable" : "ready");
      })
      .catch((error) => {
        if (!active) return;
        setResult(null);
        setState(isNetworkUnavailable(error) ? "unavailable" : "error");
      });

    return () => { active = false; };
  }, [reloadKey]);

  const retry = () => setReloadKey((current) => current + 1);

  return (
    <main className="dashboard-page workflow-bottleneck-page">
      <DashboardHeader
        title="Workflow Bottleneck Review"
        subtitle="Review active workflow stages whose recorded elapsed time exceeds the configured operational threshold."
        actions={(
          <button className="workflow-bottleneck-refresh" type="button" onClick={retry} disabled={state === "loading"}>
            <RefreshCw size={15} aria-hidden="true" />
            {state === "loading" ? "Refreshing…" : "Refresh"}
          </button>
        )}
      />

      <p className="workflow-bottleneck-method">
        Rules-based monitoring only. Elapsed time is measured from each case’s latest recorded STARTED event to the analysis time; thresholds are project configuration values, not clinical standards or machine-learning predictions. No case or workflow records are changed.
      </p>

      {state === "loading" && (
        <p className="workflow-bottleneck-state" role="status">Loading workflow stage data…</p>
      )}

      {state === "unavailable" && (
        <div className="workflow-bottleneck-message" role="status">
          <h2>Detection service unavailable</h2>
          <p>Workflow bottleneck data could not be reached. Check the connection and try again.</p>
          <button type="button" onClick={retry}>Try again</button>
        </div>
      )}

      {state === "error" && (
        <div className="workflow-bottleneck-message" role="alert">
          <h2>Unable to evaluate workflow stages</h2>
          <p>The stored workflow data could not be evaluated. Please try again.</p>
          <button type="button" onClick={retry}>Try again</button>
        </div>
      )}

      {state === "ready" && result && (
        <>
          <div className="workflow-bottleneck-summary" aria-label="Workflow bottleneck summary">
            <div><span>Delayed cases</span><strong>{result.delayedCaseCount}</strong></div>
            <div><span>Stages flagged</span><strong>{result.stages.length}</strong></div>
            <div><span>Unmeasurable cases</span><strong>{result.unmeasurableCaseCount}</strong></div>
          </div>

          {result.unmeasurableCaseCount > 0 && (
            <p className="workflow-bottleneck-data-note" role="status">
              {result.unmeasurableCaseCount} open case{result.unmeasurableCaseCount === 1 ? " has" : "s have"} missing or inconsistent workflow timestamps and were not evaluated or flagged.
            </p>
          )}

          <DashboardSection
            title="Delayed workflow stages"
            subtitle={result.generatedAt ? `Measured through ${new Date(result.generatedAt).toLocaleString()}` : "Measured from stored workflow timestamps."}
            className="workflow-bottleneck-section"
          >
            {result.stages.length === 0 ? (
              <DashboardEmptyState
                title="No delayed stages detected"
                message={result.unmeasurableCaseCount > 0
                  ? "No measurable active stage exceeded its configured threshold. Cases with incomplete timestamps are listed above."
                  : "No active workflow stage currently exceeds its configured threshold."}
              />
            ) : (
              <div className="workflow-bottleneck-stage-list">
                {result.stages.map((stage) => (
                  <section className="workflow-bottleneck-stage" key={stage.stage}>
                    <header>
                      <div>
                        <h3>{formatStage(stage.stage)}</h3>
                        <p>{stage.delayedCaseCount} delayed case{stage.delayedCaseCount === 1 ? "" : "s"}</p>
                      </div>
                      <span className="workflow-bottleneck-threshold">Threshold: {formatElapsed(stage.thresholdMinutes)}</span>
                    </header>
                    <div className="workflow-bottleneck-recommendation">
                      <strong>Recommended operational action</strong>
                      <p>{getWorkflowBottleneckRecommendation(stage.stage).action}</p>
                      <small>{getWorkflowBottleneckRecommendation(stage.stage).rationale}</small>
                    </div>
                    <ul>
                      {stage.delayedCases.map((item) => (
                        <li key={`${stage.stage}-${item.caseId}`}>
                          <div className="workflow-bottleneck-case">
                            <Link to={`/cases/${encodeURIComponent(item.caseId)}`}>{item.caseId}</Link>
                            <span>{item.caseStatus || "Status unavailable"}{item.priority ? ` · ${item.priority}` : ""}</span>
                          </div>
                          <div className="workflow-bottleneck-measurements">
                            <span><small>Elapsed</small><strong>{formatElapsed(item.elapsedMinutes)}</strong></span>
                            <span><small>Threshold</small><strong>{formatElapsed(item.thresholdMinutes)}</strong></span>
                          </div>
                          <p>{item.reason}</p>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </DashboardSection>
        </>
      )}
    </main>
  );
};

export default WorkflowBottlenecks;
