import React from "react";

const DigitalSignatureBox = ({
  signer,
  signedAt,
  signed = false,
}) => {
  return (
    <div className={`digital-signature-box ${signed ? "signed" : ""}`}>
      <div className="signature-header">
        <span>Digital Sign-out</span>
        <strong>{signed ? "SIGNED" : "PENDING"}</strong>
      </div>

      {signed ? (
        <div className="signature-details">
          <span>Signed by</span>
          <strong>{signer || "Pathologist"}</strong>

          {signedAt && (
            <>
              <span>Signed at</span>
              <strong>{signedAt}</strong>
            </>
          )}
        </div>
      ) : (
        <p>This report is awaiting pathologist sign-out.</p>
      )}
    </div>
  );
};

export default DigitalSignatureBox;