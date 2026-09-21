const ReportPatientInfo = ({ patient }) => {
  if (!patient) {
    return (
      <section>
        <h2>Patient Information</h2>
        <p>Patient information is not available.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Patient Information</h2>

      <p>
        <strong>Patient ID:</strong>{" "}
        {patient.patientId || "-"}
      </p>

      <p>
        <strong>Name:</strong>{" "}
        {patient.name || "-"}
      </p>

      <p>
        <strong>Gender:</strong>{" "}
        {patient.gender || "-"}
      </p>

      <p>
        <strong>Date of Birth:</strong>{" "}
        {patient.dateOfBirth
          ? new Date(patient.dateOfBirth).toLocaleDateString()
          : "-"}
      </p>
    </section>
  );
};

export default ReportPatientInfo;