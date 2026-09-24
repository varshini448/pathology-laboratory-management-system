import { Link } from "react-router-dom";

const LoginOptions = ({
  rememberMe,
  handleRememberMe,
}) => {
  return (
    <div className="login-options">
      <label className="remember-me">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={handleRememberMe}
        />

        <span>Remember me</span>
      </label>

      <Link
        to="/forgot-password"
        className="forgot-password"
      >
        Forgot password?
      </Link>
    </div>
  );
};

export default LoginOptions;