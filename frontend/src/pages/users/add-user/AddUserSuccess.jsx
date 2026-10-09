import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ShieldCheck } from "lucide-react";

const AddUserSuccess = ({ success, onAddAnother }) => {
  const navigate = useNavigate();

  return (
    <main className="dashboard-page add-user-page">
      <section className="add-user-success">
        <div className="add-user-success-icon">
          <CheckCircle2 size={34} />
        </div>

        <p className="add-user-eyebrow">REGISTRATION SUBMITTED</p>
        <h1>Staff registration received</h1>
        <p className="add-user-success-description">{success.message}</p>

        <div className="add-user-pending-card">
          <ShieldCheck size={23} />
          <div>
            <strong>Pending administrator approval</strong>
            <p>
              The account has been submitted for review. Access is subject to
              administrator approval.
            </p>
          </div>
        </div>

        {success.user?.email && (
          <div className="add-user-success-detail">
            <span>Registered email</span>
            <strong>{success.user.email}</strong>
          </div>
        )}

        <div className="add-user-success-actions">
          <button
            type="button"
            className="add-user-button add-user-button-primary"
            onClick={() => navigate("/users")}
          >
            View staff directory
          </button>

          <button
            type="button"
            className="add-user-button add-user-button-secondary"
            onClick={onAddAnother}
          >
            Add another staff member
          </button>
        </div>
      </section>
    </main>
  );
};

export default AddUserSuccess;
