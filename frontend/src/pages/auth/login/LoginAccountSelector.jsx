const LoginAccountSelector = ({
  accountType,
  externalUserType,
  onAccountTypeChange,
  onExternalUserTypeChange,
}) => {
  return (
    <>
      <div className="login-type-selector">
        <button
          type="button"
          className={
            accountType === "internal"
              ? "login-type-button active"
              : "login-type-button"
          }
          onClick={() => onAccountTypeChange("internal")}
        >
          Internal Staff
        </button>

        <button
          type="button"
          className={
            accountType === "external"
              ? "login-type-button active"
              : "login-type-button"
          }
          onClick={() => onAccountTypeChange("external")}
        >
          Patient / Doctor
        </button>
      </div>

      {accountType === "external" && (
        <div className="external-type-selector">
          <button
            type="button"
            className={
              externalUserType === "patient"
                ? "external-type-button active"
                : "external-type-button"
            }
            onClick={() => onExternalUserTypeChange("patient")}
          >
            Patient
          </button>

          <button
            type="button"
            className={
              externalUserType === "doctor"
                ? "external-type-button active"
                : "external-type-button"
            }
            onClick={() => onExternalUserTypeChange("doctor")}
          >
            Doctor
          </button>
        </div>
      )}
    </>
  );
};

export default LoginAccountSelector;
