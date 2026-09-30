const CaseTable = ({ cases = [] }) => {
  if (cases.length === 0) {
    return <p>No cases found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Case ID</th>
          <th>Patient</th>
          <th>Doctor</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Created At</th>
        </tr>
      </thead>

      <tbody>
        {cases.map((caseItem) => (
          <tr key={caseItem._id}>
            <td>{caseItem.caseId}</td>
            <td>
              {caseItem.patient?.patientId || caseItem.patient || "-"}
            </td>
            <td>
              {caseItem.doctor?.doctorId || caseItem.doctor || "-"}
            </td>
            <td>{caseItem.priority || "-"}</td>
            <td>{caseItem.status || "-"}</td>
            <td>
              {caseItem.createdAt
                ? new Date(caseItem.createdAt).toLocaleDateString("en-IN")
                : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CaseTable;