const SpecimenTable = ({ specimens = [] }) => {
  if (specimens.length === 0) {
    return <p>No specimens found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Specimen ID</th>
          <th>Case</th>
          <th>Specimen Type</th>
          <th>Collection Site</th>
          <th>Quality</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {specimens.map((specimen) => (
          <tr key={specimen._id}>
            <td>{specimen.specimenId}</td>
            <td>
              {specimen.case?.caseId || specimen.case || "-"}
            </td>
            <td>{specimen.specimenType || "-"}</td>
            <td>{specimen.collectionSite || "-"}</td>
            <td>{specimen.quality || "-"}</td>
            <td>{specimen.status || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SpecimenTable;