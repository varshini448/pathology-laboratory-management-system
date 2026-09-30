import React from "react";

const SpecimenMismatchAlert = ({
  expectedSpecimen,
  scannedSpecimen,
  onDismiss,
}) => {
  const expected =
    expectedSpecimen?.specimenId ||
    expectedSpecimen ||
    "Expected specimen";

  const scanned =
    scannedSpecimen?.specimenId ||
    scannedSpecimen ||
    "Scanned specimen";

  return (
    <div
      className="workflow-mismatch-alert"
      role="alert"
    >
      <div className="workflow-mismatch-icon" aria-hidden="true">
        !
      </div>

      <div className="workflow-mismatch-content">
        <h3>Specimen Mismatch Detected</h3>

        <p>
          The scanned specimen does not match the specimen expected
          at this workflow station.
        </p>

        <div className="workflow-mismatch-details">
          <div>
            <span>Expected</span>
            <strong>{expected}</strong>
          </div>

          <div>
            <span>Scanned</span>
            <strong>{scanned}</strong>
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};

export default SpecimenMismatchAlert;