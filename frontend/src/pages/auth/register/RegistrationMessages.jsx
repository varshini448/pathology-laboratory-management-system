const RegistrationMessages = ({
  error,
  success,
}) => {
  return (
    <>
      {error && (
        <div className="registration-message error">
          {error}
        </div>
      )}

      {success && (
        <div className="registration-message success">
          {success}
        </div>
      )}
    </>
  );
};

export default RegistrationMessages;