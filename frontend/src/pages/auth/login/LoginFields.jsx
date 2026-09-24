const LoginFields = ({
  identifier,
  password,
  handleChange,
}) => {
  return (
    <>
      <div className="form-group">
        <label htmlFor="identifier">
          Email or Employee/Medical ID
        </label>

        <input
          id="identifier"
          type="text"
          name="identifier"
          value={identifier}
          onChange={handleChange}
          placeholder="Enter email, employee ID, or medical registration ID"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">
          Password
        </label>

        <input
          id="password"
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />
      </div>
    </>
  );
};

export default LoginFields;