import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  FilePlus2,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";
import { getQCRecords } from "../../services/qcService";
import "../../styles/qc-records.css";

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
    hour: "2-digit",
    minute: "2-digit",
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
    <span className={`qcr-status-badge qcr-status-${config.className}`}>
      <StatusIcon size={14} aria-hidden="true" />
      {config.label}
    </span>
  );
};

const QCRecords = () => {
  const [qcRecords, setQcRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
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

    return { total, passed, failed, needsReview };
  }, [qcRecords]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...qcRecords]
      .filter((record) => {
        const matchesStatus =
          statusFilter === "ALL" || record.overallStatus === statusFilter;

        const searchableValues = [
          record.qcId,
          getReference(record.case, "caseId"),
          getReference(record.slide, "slideId"),
          getReference(record.reviewedBy, "name"),
          record.sectionQuality,
          record.stainingQuality,
          record.labelingCheck,
          record.documentationCheck,
          record.overallStatus,
        ];

        const matchesSearch =
          !query ||
          searchableValues.some((value) =>
            String(value ?? "").toLowerCase().includes(query)
          );

        return matchesStatus && matchesSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
  }, [qcRecords, search, statusFilter]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  const hasFilters = search.trim() !== "" || statusFilter !== "ALL";

  if (loading) {
    return (
      <main className="qcr-page">
        <div className="qcr-state-card" role="status">
          <RefreshCw className="qcr-spinner" size={25} />
          <h2>Loading QC records</h2>
          <p>Retrieving laboratory quality control records.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="qcr-page">
        <div className="qcr-state-card qcr-error-card" role="alert">
          <AlertTriangle size={30} />
          <h2>Records unavailable</h2>
          <p>{error}</p>
          <button
            type="button"
            className="qcr-button qcr-button-primary"
            onClick={() => setReloadKey((key) => key + 1)}
          >
            <RefreshCw size={16} />
            Try again
          </button>
          <Link to="/qc" className="qcr-secondary-link">
            Back to QC Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="qcr-page">
      <header className="qcr-header">
        <div className="qcr-header-copy">
          <Link to="/qc" className="qcr-back-link">
            <span aria-hidden="true">←</span> Quality Assurance Center
          </Link>

          <div className="qcr-eyebrow">
            <ShieldCheck size={15} />
            QUALITY &amp; COMPLIANCE
          </div>

          <h1>QC Records</h1>
          <p>
            Review laboratory quality checks, inspect recorded outcomes, and
            find records that require follow-up.
          </p>
        </div>

        <div className="qcr-header-actions">
          <button
            type="button"
            className="qcr-button qcr-button-secondary"
            onClick={() => setReloadKey((key) => key + 1)}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <Link to="/qc/add" className="qcr-button qcr-button-primary">
            <FilePlus2 size={17} />
            Add QC record
          </Link>
        </div>
      </header>

      <section className="qcr-summary-grid" aria-label="QC record summary">
        <article className="qcr-summary-card">
          <div className="qcr-summary-top">
            <span>Total records</span>
            <span className="qcr-summary-icon qcr-blue">
              <ClipboardCheck size={20} />
            </span>
          </div>
          <strong>{summary.total}</strong>
          <small>All loaded QC entries</small>
        </article>

        <article className="qcr-summary-card">
          <div className="qcr-summary-top">
            <span>Passed</span>
            <span className="qcr-summary-icon qcr-green">
              <CheckCircle2 size={20} />
            </span>
          </div>
          <strong>{summary.passed}</strong>
          <small>Recorded as passed</small>
        </article>

        <article className="qcr-summary-card">
          <div className="qcr-summary-top">
            <span>Failed</span>
            <span className="qcr-summary-icon qcr-red">
              <XCircle size={20} />
            </span>
          </div>
          <strong>{summary.failed}</strong>
          <small>Require follow-up</small>
        </article>

        <article className="qcr-summary-card">
          <div className="qcr-summary-top">
            <span>Needs review</span>
            <span className="qcr-summary-icon qcr-amber">
              <Activity size={20} />
            </span>
          </div>
          <strong>{summary.needsReview}</strong>
          <small>Need quality assessment</small>
        </article>
      </section>

      <section className="qcr-records-panel">
        <div className="qcr-panel-heading">
          <div>
            <h2>All quality records</h2>
            <p>Search and filter the recorded QC outcomes.</p>
          </div>
          <span className="qcr-record-count">
            {filteredRecords.length} result
            {filteredRecords.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="qcr-toolbar">
          <label className="qcr-search">
            <Search size={18} aria-hidden="true" />
            <span className="qcr-visually-hidden">Search QC records</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search QC ID, case, slide, reviewer..."
            />
            {search && (
              <button
                type="button"
                className="qcr-clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </label>

          <label className="qcr-status-filter">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="ALL">All statuses</option>
              <option value="PASSED">Passed</option>
              <option value="FAILED">Failed</option>
              <option value="NEEDS_REVIEW">Needs review</option>
            </select>
          </label>

          {hasFilters && (
            <button
              type="button"
              className="qcr-reset-button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredRecords.length === 0 ? (
          <div className="qcr-empty-state">
            <span className="qcr-empty-icon">
              {hasFilters ? <Search size={23} /> : <ClipboardCheck size={23} />}
            </span>
            <h3>
              {hasFilters ? "No matching records" : "No QC records yet"}
            </h3>
            <p>
              {hasFilters
                ? "Try a different search term or clear the selected filters."
                : "Create a QC record to start tracking laboratory quality checks."}
            </p>
            {hasFilters ? (
              <button
                type="button"
                className="qcr-button qcr-button-secondary"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            ) : (
              <Link to="/qc/add" className="qcr-button qcr-button-primary">
                <FilePlus2 size={16} />
                Create first record
              </Link>
            )}
          </div>
        ) : (
          <div className="qcr-table-wrap">
            <table className="qcr-table">
              <thead>
                <tr>
                  <th>QC record</th>
                  <th>Case / slide</th>
                  <th>Section quality</th>
                  <th>Staining quality</th>
                  <th>Labeling</th>
                  <th>Documentation</th>
                  <th>Overall status</th>
                  <th>Reviewed by</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record._id || record.qcId}>
                    <td>
                      <span className="qcr-id">
                        {record.qcId || "—"}
                      </span>
                    </td>
                    <td>
                      <div className="qcr-case-cell">
                        <strong>
                          {getReference(record.case, "caseId")}
                        </strong>
                        <span>
                          Slide {getReference(record.slide, "slideId")}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="qcr-quality-value">
                        {record.sectionQuality || "—"}
                      </span>
                    </td>
                    <td>
                      <span className="qcr-quality-value">
                        {record.stainingQuality || "—"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`qcr-check-value ${
                          record.labelingCheck === "PASS"
                            ? "qcr-check-pass"
                            : record.labelingCheck === "FAIL"
                              ? "qcr-check-fail"
                              : ""
                        }`}
                      >
                        {record.labelingCheck || "—"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`qcr-check-value ${
                          record.documentationCheck === "PASS"
                            ? "qcr-check-pass"
                            : record.documentationCheck === "FAIL"
                              ? "qcr-check-fail"
                              : ""
                        }`}
                      >
                        {record.documentationCheck || "—"}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={record.overallStatus} />
                    </td>
                    <td>
                      {getReference(record.reviewedBy, "name")}
                    </td>
                    <td className="qcr-date-cell">
                      {formatDate(record.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <footer className="qcr-table-footer">
          <span>
            Showing {filteredRecords.length} of {qcRecords.length} records
          </span>
          <span className="qcr-footer-note">
            <ShieldCheck size={14} />
            Quality records for professional review
          </span>
        </footer>
      </section>
    </main>
  );
};

export default QCRecords;
