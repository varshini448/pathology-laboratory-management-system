import React from "react";
import ConsentStatusBadge from "../../components/consent/ConsentStatusBadge";

const SharedRecords = () => {
  const sharedRecords = [
    {
      id: "SHR001",
      patientId: "PAT001",
      patientName: "Rahul Kumar",
      recordType: "Pathology Report",
      sharedWith: "Dr. Priya Sharma",
      sharedOn: "30 Sep 2026",
      status: "ACTIVE",
    },
    {
      id: "SHR002",
      patientId: "PAT002",
      patientName: "Anita Rao",
      recordType: "Laboratory Results",
      sharedWith: "Pathology Laboratory",
      sharedOn: "29 Sep 2026",
      status: "ACTIVE",
    },
  ];

  return (
    <main className="consent-page">
      <header className="consent-page-header">
        <div>
          <p className="consent-eyebrow">RECORD SHARING</p>
          <h1>Shared Records</h1>
          <p>
            View pathology records that have been shared under approved
            consent.
          </p>
        </div>
      </header>

      <section className="shared-records-table-card">
        <div className="shared-records-table-wrapper">
          <table className="shared-records-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Record</th>
                <th>Shared With</th>
                <th>Shared On</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {sharedRecords.map((record) => (
                <tr key={record.id}>
                  <td>
                    <strong>{record.patientName}</strong>
                    <span>{record.patientId}</span>
                  </td>
                  <td>{record.recordType}</td>
                  <td>{record.sharedWith}</td>
                  <td>{record.sharedOn}</td>
                  <td>
                    <ConsentStatusBadge status={record.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default SharedRecords;
