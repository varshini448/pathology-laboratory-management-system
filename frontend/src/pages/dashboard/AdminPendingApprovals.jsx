import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import {
  getPendingApprovals,
  approveUser,
  rejectUser,
} from "../../services/userService";

const AdminPendingApprovals = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadPendingApprovals = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPendingApprovals();
      setUsers(Array.isArray(response.users) ? response.users : []);
    } catch (err) {
      setError(err.message || "Unable to load pending approval requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingApprovals();
  }, []);

  const handleDecision = async (userId, action) => {
    try {
      setActionLoading(userId);
      setError("");
      setMessage("");

      const response =
        action === "approve"
          ? await approveUser(userId)
          : await rejectUser(userId);

      setUsers((current) => current.filter((user) => user._id !== userId));
      setMessage(
        response.message ||
          (action === "approve"
            ? "User approved successfully."
            : "User rejected successfully.")
      );
    } catch (err) {
      setError(
        err.message ||
          `Unable to ${action} this registration. Please try again.`
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="admin-approvals-content">
      {message && (
        <div className="admin-approval-feedback is-success" role="status">
          <CheckCircle2 size={17} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="admin-approval-feedback is-error" role="alert">
          <XCircle size={17} />
          <span>{error}</span>
          <button
            type="button"
            onClick={loadPendingApprovals}
            disabled={loading || actionLoading !== null}
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="admin-approval-state" aria-live="polite">
          <span className="admin-approval-state-icon">
            <RefreshCw size={20} />
          </span>
          <strong>Loading approval requests</strong>
          <p>Retrieving the latest staff registrations.</p>
        </div>
      ) : error ? null : users.length === 0 ? (
        <div className="admin-approval-state">
          <span className="admin-approval-state-icon is-complete">
            <CheckCircle2 size={22} />
          </span>
          <strong>You're all caught up</strong>
          <p>There are no staff registrations awaiting approval.</p>
          <button
            type="button"
            className="admin-approval-secondary-button"
            onClick={loadPendingApprovals}
            disabled={loading}
          >
            <RefreshCw size={14} />
            Refresh requests
          </button>
        </div>
      ) : (
        <div className="admin-approval-list">
          <div className="admin-approval-list-heading">
            <span>
              <Clock3 size={15} />
              {users.length} request{users.length === 1 ? "" : "s"} awaiting review
            </span>
          </div>

          {users.map((user) => (
            <article className="admin-approval-user" key={user._id}>
              <div className="admin-approval-user-avatar">
                <UserRound size={21} />
              </div>

              <div className="admin-approval-user-details">
                <div className="admin-approval-user-title">
                  <h3>{user.name || "Name not provided"}</h3>
                  <span className="admin-approval-pending">
                    <Clock3 size={12} />
                    Pending
                  </span>
                </div>

                <p className="admin-approval-user-email">
                  <Mail size={14} />
                  {user.email || "Email not provided"}
                </p>

                <div className="admin-approval-user-meta">
                  <span>
                    <strong>Role</strong>
                    {user.role || "Not specified"}
                  </span>
                  <span>
                    <strong>Department</strong>
                    {user.department || "Not provided"}
                  </span>
                  <span>
                    <strong>Employee ID</strong>
                    {user.profile?.employeeId || "Not provided"}
                  </span>
                  {user.profile?.medicalRegistrationId && (
                    <span>
                      <strong>Medical Registration ID</strong>
                      {user.profile.medicalRegistrationId}
                    </span>
                  )}
                </div>
              </div>

              <div className="admin-approval-user-actions">
                <button
                  type="button"
                  className="admin-approval-approve"
                  onClick={() => handleDecision(user._id, "approve")}
                  disabled={actionLoading !== null}
                >
                  <CheckCircle2 size={15} />
                  {actionLoading === user._id ? "Processing..." : "Approve"}
                </button>
                <button
                  type="button"
                  className="admin-approval-reject"
                  onClick={() => handleDecision(user._id, "reject")}
                  disabled={actionLoading !== null}
                >
                  <XCircle size={15} />
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="admin-approval-footer">
        <span>
          <ShieldCheck size={14} />
          Staff access changes take effect through the existing approval workflow.
        </span>
        <button
          type="button"
          className="admin-approval-refresh"
          onClick={loadPendingApprovals}
          disabled={loading || actionLoading !== null}
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>
    </div>
  );
};

export default AdminPendingApprovals;
