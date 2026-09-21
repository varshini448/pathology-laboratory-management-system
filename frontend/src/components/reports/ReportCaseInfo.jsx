const ReportCaseInfo = ({ caseData }) => {
  if (!caseData) {
    return (
      <section>
        <h2>Case Information</h2>
        <p>Case information is not available.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Case Information</h2>

      <p>
        <strong>Case ID:</strong>{" "}
        {caseData.caseId || "-"}
      </p>

      <p>
        <strong>Case Type:</strong>{" "}
        {caseData.caseType || "-"}
      </p>

      <p>
        <strong>Priority:</strong>{" "}
        {caseData.priority || "-"}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {caseData.status || "-"}
      </p>

      <p>
        <strong>Clinical History:</strong>{" "}
        {caseData.clinicalHistory || "-"}
      </p>

      <p>
        <strong>Doctor:</strong>{" "}
        {caseData.doctor?.name || "-"}
      </p>
    </section>
  );
};

export default ReportCaseInfo;