import { useEffect, useState } from "react";
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
      setUsers(response.users || []);
    } catch (err) {
      setError(err.message || "Failed to load pending approvals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingApprovals();
  }, []);

  const handleApprove = async (userId) => {
    try {
      setActionLoading(userId);
      setError("");
      setMessage("");

      const response = await approveUser(userId);

      setMessage(response.message || "User approved successfully");

      setUsers((currentUsers) =>
        currentUsers.filter((user) => user._id !== userId)
      );
    } catch (err) {
      setError(err.message || "Failed to approve user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId) => {
    try {
      setActionLoading(userId);
      setError("");
      setMessage("");

      const response = await rejectUser(userId);

      setMessage(response.message || "User rejected successfully");

      setUsers((currentUsers) =>
        currentUsers.filter((user) => user._id !== userId)
      );
    } catch (err) {
      setError(err.message || "Failed to reject user");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <section>
        <h2>Pending User Approvals</h2>
        <p>Loading pending approvals...</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Pending User Approvals</h2>

      {message && <p>{message}</p>}

      {error && <p>{error}</p>}

      {users.length === 0 ? (
        <p>No internal users are currently waiting for approval.</p>
      ) : (
        <div>
          {users.map((user) => (
            <div key={user._id}>
              <h3>{user.name}</h3>

              <p>
                <strong>Role:</strong> {user.role}
              </p>

              <p>
                <strong>Department:</strong>{" "}
                {user.department || "Not provided"}
              </p>

              <p>
                <strong>Email:</strong> {user.email}
              </p>

              <p>
                <strong>Employee ID:</strong>{" "}
                {user.profile?.employeeId || "Not provided"}
              </p>

              <p>
                <strong>Medical Registration ID:</strong>{" "}
                {user.profile?.medicalRegistrationId || "Not provided"}
              </p>

              <button
                type="button"
                onClick={() => handleApprove(user._id)}
                disabled={actionLoading === user._id}
              >
                {actionLoading === user._id ? "Processing..." : "Approve"}
              </button>

              {" "}

              <button
                type="button"
                onClick={() => handleReject(user._id)}
                disabled={actionLoading === user._id}
              >
                {actionLoading === user._id ? "Processing..." : "Reject"}
              </button>
            </div>
          ))}
        </div>
      )}

      <button type="button" onClick={loadPendingApprovals}>
        Refresh
      </button>
    </section>
  );
};

export default AdminPendingApprovals;
