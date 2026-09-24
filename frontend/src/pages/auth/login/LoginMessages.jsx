const LoginMessages = ({
  error,
}) => {
  if (!error) {
    return null;
  }

  return (
    <div className="login-message error">
      {error}
    </div>
  );
};

export default LoginMessages;