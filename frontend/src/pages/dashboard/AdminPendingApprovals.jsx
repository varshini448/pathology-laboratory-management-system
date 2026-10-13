
import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserRound,
  XCircle,
  Stethoscope,
} from "lucide-react";

import {
  getPendingApprovals,
  approveUser,
  rejectUser,
} from "../../services/userService";

import {
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
} from "../../services/doctorService";

const AdminPendingApprovals = () => {
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadPendingApprovals = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([
        getPendingApprovals(),
        getPendingDoctors(),
      ]);

      const [usersResult, doctorsResult] = results;

      if (
        usersResult.status === "rejected" &&
        doctorsResult.status === "rejected"
      ) {
        throw new Error("Unable to load staff or doctor approval requests.");
      }

      if (usersResult.status === "fulfilled") {
        const response = usersResult.value;
        setUsers(Array.isArray(response.users) ? response.users : []);
      } else {
        setUsers([]);
      }

      if (doctorsResult.status === "fulfilled") {
        setDoctors(Array.isArray(doctorsResult.value) ? doctorsResult.value : []);
      } else {
        setDoctors([]);
      }

      const failedSources = [];

      if (usersResult.status === "rejected") {
        failedSources.push("staff");
      }

      if (doctorsResult.status === "rejected") {
        failedSources.push("doctor");
      }

      if (failedSources.length > 0) {
        setError(
          `Could not load ${failedSources.join(" and ")} approvals. The other list may still be available. Check your admin access and retry.`
        );
      }
    } catch (err) {
      setError(err.message || "Unable to load approval requests.");
      setUsers([]);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPendingApprovals();
  }, [loadPendingApprovals]);

  const handleDecision = async (recordId, type, action) => {
    const loadingKey = `${type}-${recordId}`;

    try {
      setActionLoading(loadingKey);
      setError("");
      setMessage("");

      let response;

      if (type === "doctor") {
        response =
          action === "approve"
            ? await approveDoctor(recordId)
            : await rejectDoctor(recordId);

        setDoctors((current) =>
          current.filter((doctor) => doctor._id !== recordId)
        );
      } else {
        response =
          action === "approve"
            ? await approveUser(recordId)
            : await rejectUser(recordId);

        setUsers((current) =>
          current.filter((user) => user._id !== recordId)
        );
      }

      setMessage(
        response.message ||
          `${type === "doctor" ? "Doctor" : "Staff account"} ${
            action === "approve" ? "approved" : "rejected"
          } successfully.`
      );
    } catch (err) {
      setError(
        err.message ||
          `Unable to ${action} this ${type} registration. Please try again.`
      );
    } finally {
      setActionLoading(null);
    }
  };

  const totalRequests = users.length + doctors.length;

  const renderActions = (record, type) => {
    const key = `${type}-${record._id}`;

    return (
      <div className="admin-approval-user-actions">
        <button
          type="button"
          className="admin-approval-approve"
          onClick={() => handleDecision(record._id, type, "approve")}
          disabled={actionLoading !== null}
        >
          <CheckCircle2 size={15} />
          {actionLoading === key ? "Processing..." : "Approve"}
        </button>

        <button
          type="button"
          className="admin-approval-reject"
          onClick={() => handleDecision(record._id, type, "reject")}
          disabled={actionLoading !== null}
        >
          <XCircle size={15} />
          Reject
        </button>
      </div>
    );
  };

  const renderPendingUser = (user) => (
    <article className="admin-approval-user" key={`staff-${user._id}`}>
      <div className="admin-approval-user-avatar">
        <UserRound size={21} />
      </div>

      <div className="admin-approval-user-details">
        <div className="admin-approval-user-title">
          <h3>{user.name || "Name not provided"}</h3>
          <span className="admin-approval-pending">
            <Clock3 size={12} />
            Pending staff approval
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

      {renderActions(user, "staff")}
    </article>
  );

  const renderPendingDoctor = (doctor) => (
    <article className="admin-approval-user" key={`doctor-${doctor._id}`}>
      <div className="admin-approval-user-avatar">
        <Stethoscope size={21} />
      </div>

      <div className="admin-approval-user-details">
        <div className="admin-approval-user-title">
          <h3>{doctor.name || "Name not provided"}</h3>
          <span className="admin-approval-pending">
            <Clock3 size={12} />
            Pending verification
          </span>
        </div>

        <p className="admin-approval-user-email">
          <Mail size={14} />
          {doctor.email || "Email not provided"}
        </p>

        <div className="admin-approval-user-meta">
          <span>
            <strong>Doctor ID</strong>
            {doctor.doctorId || "Not provided"}
          </span>
          <span>
            <strong>Specialization</strong>
            {doctor.specialization || "Not provided"}
          </span>
          <span>
            <strong>Qualification</strong>
            {doctor.qualification || "Not provided"}
          </span>
          <span>
            <strong>Medical Registration ID</strong>
            {doctor.medicalRegistrationId || "Not provided"}
          </span>
          <span>
            <strong>Registration Authority</strong>
            {doctor.registrationAuthority || "Not provided"}
          </span>
          <span>
            <strong>Phone</strong>
            {doctor.phone || "Not provided"}
          </span>
        </div>
      </div>

      {renderActions(doctor, "doctor")}
    </article>
  );

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
          <p>Retrieving staff registrations and doctor verifications.</p>
        </div>
      ) : (
        <>
          {totalRequests === 0 && !error ? (
            <div className="admin-approval-state">
              <span className="admin-approval-state-icon is-complete">
                <CheckCircle2 size={22} />
              </span>
              <strong>You're all caught up</strong>
              <p>
                There are no staff registrations or doctor verifications
                awaiting review.
              </p>
            </div>
          ) : (
            <>
              <div className="admin-approval-list-heading">
                <span>
                  <Clock3 size={15} />
                  {totalRequests} request{totalRequests === 1 ? "" : "s"}{" "}
                  awaiting review
                </span>
              </div>

              {users.length > 0 && (
                <section aria-labelledby="pending-staff-heading">
                  <h3 id="pending-staff-heading">Staff Access Requests</h3>
                  <div className="admin-approval-list">
                    {users.map(renderPendingUser)}
                  </div>
                </section>
              )}

              {doctors.length > 0 && (
                <section aria-labelledby="pending-doctors-heading">
                  <h3 id="pending-doctors-heading">
                    Doctor Registrations
                  </h3>
                  <div className="admin-approval-list">
                    {doctors.map(renderPendingDoctor)}
                  </div>
                </section>
              )}
            </>
          )}

          <button
            type="button"
            className="admin-approval-secondary-button"
            onClick={loadPendingApprovals}
            disabled={loading || actionLoading !== null}
          >
            <RefreshCw size={14} />
            Refresh requests
          </button>
        </>
      )}

      <div className="admin-approval-footer">
        <span>
          <ShieldCheck size={14} />
          Staff approvals and doctor verification use their respective
          authorization workflows.
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