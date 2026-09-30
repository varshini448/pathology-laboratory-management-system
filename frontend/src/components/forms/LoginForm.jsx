import React, { useState } from "react";

const LoginForm = ({
  onSubmit,
  loading = false,
  error = "",
}) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setValues((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(values);
  };

  return (
    <form className="common-form login-form" onSubmit={handleSubmit}>
      <div className="form-section-title">
        <p className="form-eyebrow">PATHOLOGY LABORATORY</p>
        <h1>Sign In</h1>
        <p>Sign in to access the laboratory management system.</p>
      </div>

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      <label>
        Email
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          placeholder="Enter your email"
          autoComplete="email"
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
};

export default LoginForm;