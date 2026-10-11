import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { verifyEmailToken } from "../../services/authService";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid or missing email verification token.");
        return;
      }

      try {
        const response = await verifyEmailToken(token);
        setStatus("success");
        setMessage(response.message || "Email verification completed.");
      } catch (error) {
        setStatus("error");
        setMessage(
          error.message || "Email verification failed."
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-header">
          <h1>Email Verification</h1>
        </div>

        {status === "verifying" && (
          <div className="login-message">
            Verifying your email address...
          </div>
        )}

        {status === "success" && (
          <>
            <div className="login-message success">
              {message}
            </div>

            <div className="auth-footer">
              <Link to="/login">
                Continue to Login
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="login-message error">
              {message}
            </div>

            <div className="auth-footer">
              <Link to="/login">
                ← Back to Login
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;
