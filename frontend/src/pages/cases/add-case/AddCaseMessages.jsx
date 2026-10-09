const AddCaseMessages = ({ error, success }) => {
  return (
    <>
      {error && (
        <div className="add-case-message add-case-message-error">
          {error}
        </div>
      )}

      {success && (
        <div className="add-case-message add-case-message-success">
          {success}
        </div>
      )}
    </>
  );
};

export default AddCaseMessages;
