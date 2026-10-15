import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FilePlus2,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { getQCRecords } from "../../services/qcService";
import { getAuthUser } from "../../utils/authStorage";
import { getQCAnomalyInsights } from "./qcAnomalyInsights";
import "../../styles/qc-dashboard.css";

const STATUS_CONFIG = {
  PASSED: { label: "Passed", className: "passed", icon: CheckCircle2 },
  FAILED: { label: "Failed", className: "failed", icon: XCircle },
  NEEDS_REVIEW: {
    label: "Needs review",
    className: "review",
    icon: AlertTriangle,
  },
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const getReference = (value, key) => {
  if (!value) return "—";
  if (typeof value === "object") return value[key] || value._id || "—";
  return value;
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || {
    label: status || "Unknown",
    className: "unknown",
    icon: ClipboardCheck,
  };
  const StatusIcon = config.icon;

  return (
    <span className={`qc-status-badge qc-status-${config.className}`}>
      <StatusIcon size={14} aria-hidden="true" />
      {config.label}
    </span>
  );
};

const QCDashboard = () => {
  const authUser = getAuthUser();
  const role = authUser?.role || authUser?.userType;
  const canAddQC = ["ADMIN", "QUALITY_MANAGER", "PATHOLOGIST"].includes(role);
  const [qcRecords, setQcRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const loadQCRecords = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const records = await getQCRecords();
      setQcRecords(Array.isArray(records) ? records : []);
    } catch (err) {
      setError(err?.message || "Unable to load quality control records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQCRecords();
  }, [loadQCRecords, reloadKey]);

  const summary = useMemo(() => {
    const total = qcRecords.length;
    const passed = qcRecords.filter(
      (record) => record.overallStatus === "PASSED"
    ).length;
    const failed = qcRecords.filter(
      (record) => record.overallStatus === "FAILED"
    ).length;
    const needsReview = qcRecords.filter(
      (record) => record.overallStatus === "NEEDS_REVIEW"
    ).length;

    return {
      total,
      passed,
      failed,
      needsReview,
      passRate: total ? Math.round((passed / total) * 100) : 0,
    };
  }, [qcRecords]);

  const anomalyInsights = useMemo(
    () => getQCAnomalyInsights(qcRecords),
    [qcRecords]
  );

  const recentRecords = useMemo(
    () =>
      [...qcRecords]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
        .slice(0, 6),
    [qcRecords]
  );

  const exceptions = useMemo(
    () =>
      [...qcRecords]
        .filter(
          (record) =>
            record.overallStatus === "FAILED" ||
            record.overallStatus === "NEEDS_REVIEW"
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
        .slice(0, 4),
    [qcRecords]
  );

  const distribution = [
    {
      label: "Passed",
      count: summary.passed,
      className: "passed",
      percentage: summary.total
        ? (summary.passed / summary.total) * 100
        : 0,
    },
    {
      label: "Failed",
      count: summary.failed,
      className: "failed",
      percentage: summary.total
        ? (summary.failed / summary.total) * 100
        : 0,
    },
    {
      label: "Needs review",
      count: summary.needsReview,
      className: "review",
      percentage: summary.total
        ? (summary.needsReview / summary.total) * 100
        : 0,
    },
  ];

  if (loading) {
    return (
      <main className="qc-dashboard-page">
        <div className="qc-state-card" role="status">
          <RefreshCw className="qc-state-spinner" size={25} />
          <h2>Loading quality data</h2>
          <p>Retrieving quality control records from the laboratory.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="qc-dashboard-page">
        <div className="qc-state-card qc-error-card" role="alert">
          <AlertTriangle size={30} />
          <h2>Quality data unavailable</h2>
          <p>{error}</p>
          <button
            type="button"
            className="qc-button qc-button-primary"
            onClick={() => setReloadKey((key) => key + 1)}
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="qc-dashboard-page">
      <header className="qc-page-header">
        <div className="qc-heading-copy">
          <div className="qc-eyebrow">
            <ShieldCheck size={15} />
            QUALITY &amp; COMPLIANCE
          </div>
          <h1>Quality Assurance Center</h1>
          <p>
            Monitor laboratory quality checks, identify exceptions, and follow
            up on records that need attention.
          </p>
        </div>

        <div className="qc-header-actions">
          <button
            type="button"
            className="qc-button qc-button-secondary"
            onClick={() => setReloadKey((key) => key + 1)}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          {canAddQC && (
            <Link to="/qc/add" className="qc-button qc-button-primary">
              <FilePlus2 size={17} />
              Add QC record
            </Link>
          )}
        </div>
      </header>

      <section className="qc-kpi-grid" aria-label="Quality summary">
        <article className="qc-kpi-card">
          <div className="qc-kpi-top">
            <span className="qc-kpi-label">Total QC records</span>
            <span className="qc-kpi-icon qc-icon-blue">
              <ClipboardCheck size={20} />
            </span>
          </div>
          <strong className="qc-kpi-value">{summary.total}</strong>
          <span className="qc-kpi-caption">Records returned by the system</span>
        </article>

        <article className="qc-kpi-card">
          <div className="qc-kpi-top">
            <span className="qc-kpi-label">Passed checks</span>
            <span className="qc-kpi-icon qc-icon-green">
              <CheckCircle2 size={20} />
            </span>
          </div>
          <strong className="qc-kpi-value">{summary.passed}</strong>
          <span className="qc-kpi-caption">Marked as passed</span>
        </article>

        <article className="qc-kpi-card">
          <div className="qc-kpi-top">
            <span className="qc-kpi-label">Failed checks</span>
            <span className="qc-kpi-icon qc-icon-red">
              <XCircle size={20} />
            </span>
          </div>
          <strong className="qc-kpi-value">{summary.failed}</strong>
          <span className="qc-kpi-caption">Require corrective follow-up</span>
        </article>

        <article className="qc-kpi-card">
          <div className="qc-kpi-top">
            <span className="qc-kpi-label">Needs review</span>
            <span className="qc-kpi-icon qc-icon-amber">
              <Clock3 size={20} />
            </span>
          </div>
          <strong className="qc-kpi-value">{summary.needsReview}</strong>
          <span className="qc-kpi-caption">Awaiting quality assessment</span>
        </article>
      </section>

      <section className="qc-overview-grid">
        <article className="qc-panel qc-distribution-panel">
          <div className="qc-panel-heading">
            <div>
              <h2>Quality status distribution</h2>
              <p>Breakdown of recorded QC outcomes</p>
            </div>
            <span className="qc-panel-icon">
              <Activity size={19} />
            </span>
          </div>

          {summary.total === 0 ? (
            <div className="qc-inline-empty">
              No QC records are available to summarize yet.
            </div>
          ) : (
            <div className="qc-distribution-list">
              {distribution.map((item) => (
                <div className="qc-distribution-item" key={item.className}>
                  <div className="qc-distribution-label-row">
                    <span className="qc-distribution-label">
                      <span
                        className={`qc-legend-dot qc-dot-${item.className}`}
                      />
                      {item.label}
                    </span>
                    <strong>
                      {item.count}
                      <span>
                        {" "}
                        ({Math.round(item.percentage)}%)
                      </span>
                    </strong>
                  </div>
                  <div
                    className="qc-progress-track"
                    role="progressbar"
                    aria-label={`${item.label} records`}
                    aria-valuemin={0}
                    aria-valuemax={summary.total}
                    aria-valuenow={item.count}
                  >
                    <span
                      className={`qc-progress-fill qc-fill-${item.className}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="qc-pass-rate">
                <div>
                  <span>Recorded pass rate</span>
                  <strong>{summary.passRate}%</strong>
                </div>
                <span className="qc-pass-rate-note">
                  Based on all {summary.total} QC records
                </span>
              </div>
            </div>
          )}
        </article>

        <article className="qc-panel qc-exceptions-panel">
          <div className="qc-panel-heading">
            <div>
              <h2>Attention required</h2>
              <p>Failed records and outcomes needing review</p>
            </div>
            <span className="qc-panel-icon qc-panel-icon-warning">
              <AlertTriangle size={19} />
            </span>
          </div>

          {exceptions.length === 0 ? (
            <div className="qc-empty-state">
              <span className="qc-empty-icon">
                <CheckCircle2 size={22} />
              </span>
              <strong>No outstanding QC exceptions</strong>
              <p>
                No failed or needs-review records were found in the loaded data.
              </p>
            </div>
          ) : (
            <div className="qc-exception-list">
              {exceptions.map((record) => (
                <div className="qc-exception-item" key={record._id || record.qcId}>
                  <span
                    className={`qc-exception-indicator ${
                      record.overallStatus === "FAILED" ? "is-failed" : "is-review"
                    }`}
                  />
                  <div className="qc-exception-main">
                    <strong>{record.qcId || "QC record"}</strong>
                    <span>
                      Case {getReference(record.case, "caseId")}
                      {" · "}
                      Slide {getReference(record.slide, "slideId")}
                    </span>
                    <small>{formatDate(record.createdAt)}</small>
                  </div>
                  <StatusBadge status={record.overallStatus} />
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="qc-panel qc-anomaly-panel" aria-labelledby="qc-anomaly-title">
        <div className="qc-anomaly-content">
          <div className="qc-panel-heading">
            <div>
              <h2 id="qc-anomaly-title">QC Pattern &amp; Anomaly Insights</h2>
              <p>
                Rule-based operational flags calculated from the loaded QC records.
                These insights support review and do not establish a clinical diagnosis.
              </p>
            </div>
            <span className="qc-panel-icon qc-anomaly-icon">
              <Activity size={19} aria-hidden="true" />
            </span>
          </div>

          <div className="qc-anomaly-metrics" aria-label="Insight summary">
            <div className="qc-anomaly-metric">
              <span>Records analyzed</span>
              <strong>{anomalyInsights.recordsAnalyzed}</strong>
            </div>
            <div className="qc-anomaly-metric">
              <span>Records flagged</span>
              <strong>{anomalyInsights.flaggedRecordCount}</strong>
            </div>
            <div className="qc-anomaly-metric">
              <span>Repeated patterns</span>
              <strong>{anomalyInsights.patterns.length}</strong>
            </div>
          </div>

          {anomalyInsights.recordsAnalyzed === 0 ? (
            <div className="qc-inline-empty">
              Add QC records to generate rule-based insights.
            </div>
          ) : anomalyInsights.flaggedRecordCount === 0 ? (
            <div className="qc-anomaly-empty" role="status">
              <CheckCircle2 size={20} aria-hidden="true" />
              <div>
                <strong>No configured QC flags detected</strong>
                <p>
                  The loaded records did not match the current rules. This does
                  not replace the laboratory's normal quality review.
                </p>
              </div>
            </div>
          ) : (
            <div className="qc-anomaly-results">
              <div className="qc-anomaly-section-heading">
                <h3>Recommended follow-up</h3>
                <span>{anomalyInsights.flaggedRecordCount} records to review</span>
              </div>

              <ul className="qc-anomaly-list">
                {anomalyInsights.flaggedRecords.slice(0, 5).map(({ record, flags }) => (
                  <li className="qc-anomaly-item" key={record._id || record.qcId}>
                    <span className="qc-anomaly-indicator" aria-hidden="true" />
                    <div className="qc-anomaly-item-main">
                      <strong>{record.qcId || "QC record"}</strong>
                      <span>
                        Case {getReference(record.case, "caseId")}
                        {" · "}
                        Slide {getReference(record.slide, "slideId")}
                      </span>
                      <ul className="qc-anomaly-flags">
                        {flags.map((flag) => (
                          <li key={flag.code}>
                            <strong>{flag.title}:</strong> {flag.action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>

              {anomalyInsights.flaggedRecords.length > 5 && (
                <p className="qc-anomaly-more">
                  Showing 5 of {anomalyInsights.flaggedRecords.length} flagged records.
                  Review the QC records page for the remaining entries.
                </p>
              )}
            </div>
          )}

          {anomalyInsights.patterns.length > 0 && (
            <div className="qc-anomaly-patterns">
              <h3>Repeated patterns across records</h3>
              <ul>
                {anomalyInsights.patterns.map((pattern) => (
                  <li key={pattern.code}>
                    <span>
                      <strong>{pattern.title}</strong>
                      <small>{pattern.action}</small>
                    </span>
                    <span className="qc-anomaly-count">
                      {pattern.count} records
                    </span>
                  </li>
                ))}
              </ul>
              <p>
                Repetition means the same rule matched at least two records;
                it does not prove a common cause.
              </p>
            </div>
          )}

          <div className="qc-anomaly-footer">
            <span>Decision support only · Confirm findings with authorized laboratory staff.</span>
            <Link to="/qc/records" className="qc-text-link">
              Review QC records <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="qc-panel qc-recent-panel">
        <div className="qc-panel-heading qc-recent-heading">
          <div>
            <h2>Recent QC records</h2>
            <p>Latest quality control entries received from the system</p>
          </div>
          <Link to="/qc/records" className="qc-text-link">
            View all records <ArrowRight size={16} />
          </Link>
        </div>

        {recentRecords.length === 0 ? (
          <div className="qc-empty-state qc-table-empty">
            <span className="qc-empty-icon">
              <ClipboardCheck size={22} />
            </span>
            <strong>No quality records yet</strong>
            <p>Create a QC record to begin tracking laboratory quality checks.</p>
            {canAddQC && (
              <Link to="/qc/add" className="qc-button qc-button-primary">
                <FilePlus2 size={16} />
                Create first record
              </Link>
            )}
          </div>
        ) : (
          <div className="qc-table-wrap">
            <table className="qc-records-table">
              <thead>
                <tr>
                  <th>QC record</th>
                  <th>Case</th>
                  <th>Slide</th>
                  <th>Section quality</th>
                  <th>Staining quality</th>
                  <th>Outcome</th>
                  <th>Recorded on</th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.map((record) => (
                  <tr key={record._id || record.qcId}>
                    <td>
                      <span className="qc-record-id">
                        {record.qcId || "—"}
                      </span>
                    </td>
                    <td>{getReference(record.case, "caseId")}</td>
                    <td>{getReference(record.slide, "slideId")}</td>
                    <td>
                      <span className="qc-quality-value">
                        {record.sectionQuality || "—"}
                      </span>
                    </td>
                    <td>
                      <span className="qc-quality-value">
                        {record.stainingQuality || "—"}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={record.overallStatus} />
                    </td>
                    <td>{formatDate(record.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <footer className="qc-panel-footer">
          <span>
            Showing {recentRecords.length} of {summary.total} records
          </span>
          <Link to="/qc/records" className="qc-text-link">
            Open QC records <ArrowRight size={15} />
          </Link>
        </footer>
      </section>

      <div className="qc-dashboard-footnote">
        <ShieldCheck size={15} />
        Quality indicators reflect recorded QC outcomes and do not replace
        professional laboratory review.
      </div>
    </main>
  );
};

export default QCDashboard;
