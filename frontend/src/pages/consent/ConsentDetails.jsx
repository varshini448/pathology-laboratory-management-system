import React from "react";
import ConsentStatusBadge from "../../components/consent/ConsentStatusBadge";
import ConsentExpiryNotice from "../../components/consent/ConsentExpiryNotice";

const ConsentDetails = () => {
  const consent = {
    patientId: "PAT001",
    patientName: "Rahul Kumar",
    consentType: "Diagnostic Testing",
    status: "ACTIVE",
    grantedOn: "30 Sep 2026",
    expiresOn: "30 Sep 2027",
    sharedWith: "Pathology Laboratory",
  };

  return (
    <main className="consent-page">
      <header className="consent-page-header">
        <div>
          <p className="consent-eyebrow">PATIENT CONSENT</p>
          <h1>Consent Details</h1>
          <p>Review the consent status and sharing permissions for a patient.</p>
        </div>
        <ConsentStatusBadge status={consent.status} />
      </header>

      <section className="consent-details-card">
        <div className="consent-detail-row">
          <span>Patient ID</span>
          <strong>{consent.patientId}</strong>
        </div>

        <div className="consent-detail-row">
          <span>Patient Name</span>
          <strong>{consent.patientName}</strong>
        </div>

        <div className="consent-detail-row">
          <span>Consent Type</span>
          <strong>{consent.consentType}</strong>
        </div>

        <div className="consent-detail-row">
          <span>Granted On</span>
          <strong>{consent.grantedOn}</strong>
        </div>

        <div className="consent-detail-row">
          <span>Expires On</span>
          <strong>{consent.expiresOn}</strong>
        </div>

        <div className="consent-detail-row">
          <span>Shared With</span>
          <strong>{consent.sharedWith}</strong>
        </div>
      </section>

      <ConsentExpiryNotice expiresOn={consent.expiresOn} />
    </main>
  );
};

export default ConsentDetails;
