import React from "react";
import ConsentCard from "../../components/consent/ConsentCard";
import ConsentStatusBadge from "../../components/consent/ConsentStatusBadge";

const ConsentRequests = () => {
  const requests = [
    {
      id: "CR001",
      patientName: "Rahul Kumar",
      patientId: "PAT001",
      requestedBy: "Dr. Priya Sharma",
      purpose: "Diagnostic pathology testing",
      requestedOn: "30 Sep 2026",
      status: "PENDING",
    },
    {
      id: "CR002",
      patientName: "Anita Rao",
      patientId: "PAT002",
      requestedBy: "Pathology Laboratory",
      purpose: "Laboratory report access",
      requestedOn: "29 Sep 2026",
      status: "APPROVED",
    },
  ];

  return (
    <main className="consent-page">
      <header className="consent-page-header">
        <div>
          <p className="consent-eyebrow">ACCESS CONTROL</p>
          <h1>Consent Requests</h1>
          <p>
            Review patient consent requests before records are shared or
            accessed.
          </p>
        </div>
      </header>

      <section className="consent-request-list">
        {requests.map((request) => (
          <article className="consent-request-card" key={request.id}>
            <div className="consent-request-header">
              <div>
                <h2>{request.patientName}</h2>
                <p>{request.patientId}</p>
              </div>
              <ConsentStatusBadge status={request.status} />
            </div>

            <ConsentCard
              title={request.purpose}
              description={`Requested by ${request.requestedBy} on ${request.requestedOn}.`}
              status={request.status}
            />
          </article>
        ))}
      </section>
    </main>
  );
};

export default ConsentRequests;
