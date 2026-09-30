const DoctorTable = ({ doctors = [] }) => {
  if (doctors.length === 0) {
    return <p>No doctors found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Doctor ID</th>
          <th>Name</th>
          <th>Specialization</th>
          <th>Department</th>
          <th>Phone</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {doctors.map((doctor) => (
          <tr key={doctor._id}>
            <td>{doctor.doctorId}</td>
            <td>
              {doctor.firstName} {doctor.lastName}
            </td>
            <td>{doctor.specialization || "-"}</td>
            <td>{doctor.department || "-"}</td>
            <td>{doctor.phone || "-"}</td>
            <td>{doctor.status || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DoctorTable;