const ReportCaseSelector = ({
  cases,
  selectedCase,
  onCaseChange,
  loading,
}) => {
  return (
    <section className="report-info-panel report-case-selector">
      <h2>Select Case</h2>

      {loading ? (
        <p>Loading cases...</p>
      ) : (
        <>
          <label className="report-select-label" htmlFor="report-case-select">Case record</label>
          <select id="report-case-select" value={selectedCase} onChange={onCaseChange}>
            <option value="">Select Case</option>

            {cases.map((caseItem) => (
              <option key={caseItem._id} value={caseItem._id}>
                {caseItem.caseId} - {caseItem.caseType}
              </option>
            ))}
          </select>
        </>
      )}
    </section>
  );
};

export default ReportCaseSelector;
