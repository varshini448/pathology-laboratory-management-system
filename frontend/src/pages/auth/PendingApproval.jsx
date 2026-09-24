import { Link } from "react-router-dom";

const PendingApproval = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="approval-icon">
          ⏳
        </div>

        <h1>Account Pending Approval</h1>

        <p>
          Your registration has been submitted successfully.
        </p>

        <p>
          Your account is currently waiting for administrator
          approval. You will be able to log in after your account
          has been approved.
        </p>

        <div className="approval-status">
          <strong>Status:</strong> Pending Approval
        </div>

        <div className="auth-actions">
          <Link to="/login" className="auth-button">
            Back to Login
          </Link>

          <Link to="/" className="auth-button secondary">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;