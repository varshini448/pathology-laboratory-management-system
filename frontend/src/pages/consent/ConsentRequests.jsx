import React from "react";
import ConsentUnavailable from "../../components/consent/ConsentUnavailable";

const ConsentRequests = () => {
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

      <ConsentUnavailable
        title="Consent requests are unavailable"
        description="The consent request service is not available in the current backend."
      />
    </main>
  );
};

export default ConsentRequests;
