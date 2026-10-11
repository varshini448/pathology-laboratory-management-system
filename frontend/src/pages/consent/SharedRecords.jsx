import React from "react";
import ConsentUnavailable from "../../components/consent/ConsentUnavailable";

const SharedRecords = () => {
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

      <ConsentUnavailable
        title="Shared records are unavailable"
        description="Record sharing is not connected to the current backend."
      />
    </main>
  );
};

export default SharedRecords;
