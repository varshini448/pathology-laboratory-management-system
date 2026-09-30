const PatientTable = ({ patients = [] }) => {
  if (patients.length === 0) {
    return <p>No patients found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Patient ID</th>
          <th>Name</th>
          <th>Age</th>
          <th>Gender</th>
          <th>Phone</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {patients.map((patient) => (
          <tr key={patient._id}>
            <td>{patient.patientId}</td>
            <td>
              {patient.firstName} {patient.lastName}
            </td>
            <td>{patient.age || "-"}</td>
            <td>{patient.gender || "-"}</td>
            <td>{patient.phone || "-"}</td>
            <td>{patient.status || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PatientTable;