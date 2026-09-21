const ReportCaseSelector = ({
  cases,
  selectedCase,
  onCaseChange,
  loading,
}) => {
  return (
    <section>
      <h2>Select Case</h2>

      {loading ? (
        <p>Loading cases...</p>
      ) : (
        <select value={selectedCase} onChange={onCaseChange}>
          <option value="">Select Case</option>

          {cases.map((caseItem) => (
            <option key={caseItem._id} value={caseItem._id}>
              {caseItem.caseId} - {caseItem.caseType}
            </option>
          ))}
        </select>
      )}
    </section>
  );
};

export default ReportCaseSelector;