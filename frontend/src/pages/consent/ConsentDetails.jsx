import React from "react";
import ConsentUnavailable from "../../components/consent/ConsentUnavailable";

const ConsentDetails = () => {
  return (
    <main className="consent-page">
      <header className="consent-page-header">
        <div>
          <p className="consent-eyebrow">PATIENT CONSENT</p>
          <h1>Consent Details</h1>
          <p>Review the consent status and sharing permissions for a patient.</p>
        </div>
      </header>

      <ConsentUnavailable
        title="Consent record is unavailable"
        description="This record cannot be loaded because the consent service is not connected."
      />
    </main>
  );
};

export default ConsentDetails;
