import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, History, RefreshCw } from "lucide-react";
import { api } from "../../services/api";

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const AdminRecentActivity = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadActivity = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/audit?limit=5&page=1");
      setLogs(Array.isArray(response.logs) ? response.logs : []);
    } catch (err) {
      setError(err.message || "Unable to load recent audit activity.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivity();
  }, []);

  return (
    <section className="admin-dashboard-panel admin-recent-activity">
      <div className="admin-panel-header">
        <div>
          <span>SECURITY & ACCOUNTABILITY</span>
          <h2>Recent Audit Activity</h2>
        </div>

        <Link to="/audit-logs">
          View audit logs <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className="admin-activity-content">
        {loading ? (
          <p className="admin-activity-message">
            Loading recent activity...
          </p>
        ) : error ? (
          <div className="admin-activity-message admin-activity-error">
            <p>{error}</p>
            <button type="button" onClick={loadActivity}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        ) : logs.length === 0 ? (
          <p className="admin-activity-message">
            No audit activity is available yet.
          </p>
        ) : (
          <ul className="admin-activity-list">
            {logs.map((log) => {
              const actor =
                log.performedBy?.name ||
                log.performedBy?.email ||
                "Unknown user";

              return (
                <li key={log._id}>
                  <span className="admin-activity-icon">
                    <History size={17} />
                  </span>

                  <div className="admin-activity-details">
                    <strong>{log.description || "Activity recorded"}</strong>
                    <span>
                      {actor} · {log.action || "OTHER"} ·{" "}
                      {log.module || "General"}
                    </span>
                    <time dateTime={log.createdAt || undefined}>
                      {formatDate(log.createdAt)}
                    </time>
                  </div>

                  <span
                    className={`admin-activity-status ${
                      log.status === "FAILED"
                        ? "is-failed"
                        : "is-success"
                    }`}
                  >
                    {log.status || "RECORDED"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};

export default AdminRecentActivity;
