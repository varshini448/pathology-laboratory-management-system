const ReportTable = ({ reports = [] }) => {
  if (reports.length === 0) {
    return <p>No reports found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Report ID</th>
          <th>Case</th>
          <th>Patient</th>
          <th>Diagnosis</th>
          <th>Status</th>
          <th>Prepared By</th>
        </tr>
      </thead>

      <tbody>
        {reports.map((report) => (
          <tr key={report._id}>
            <td>{report.reportId}</td>
            <td>
              {report.case?.caseId || report.case || "-"}
            </td>
            <td>
              {report.case?.patient?.patientId ||
                report.patient?.patientId ||
                report.patient ||
                "-"}
            </td>
            <td>{report.diagnosis || "-"}</td>
            <td>{report.reportStatus || "-"}</td>
            <td>
              {report.preparedBy?.name ||
                report.preparedBy?.username ||
                report.preparedBy ||
                "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReportTable;