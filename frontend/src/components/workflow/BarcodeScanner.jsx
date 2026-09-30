import React, { useState } from "react";

const BarcodeScanner = ({
  onScan,
  placeholder = "Enter or scan barcode",
}) => {
  const [barcode, setBarcode] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const value = barcode.trim();

    if (!value) {
      return;
    }

    onScan?.(value);
    setBarcode("");
  };

  return (
    <form className="workflow-barcode-scanner" onSubmit={handleSubmit}>
      <label htmlFor="workflow-barcode-input">
        Barcode / Specimen ID
      </label>

      <div className="workflow-barcode-input-group">
        <input
          id="workflow-barcode-input"
          type="text"
          value={barcode}
          onChange={(event) => setBarcode(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />

        <button type="submit" disabled={!barcode.trim()}>
          Scan
        </button>
      </div>
    </form>
  );
};

export default BarcodeScanner;