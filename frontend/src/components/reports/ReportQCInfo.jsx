const ReportQCInfo = ({ qcRecords }) => {
  return (
    <section>
      <h2>QA / QC Information</h2>

      {qcRecords.length === 0 ? (
        <p>No QA/QC records found for this case.</p>
      ) : (
        qcRecords.map((qc) => (
          <div key={qc._id}>
            <p>
              <strong>QC ID:</strong> {qc.qcId}
            </p>

            <p>
              <strong>Section Quality:</strong>{" "}
              {qc.sectionQuality}
            </p>

            <p>
              <strong>Staining Quality:</strong>{" "}
              {qc.stainingQuality}
            </p>

            <p>
              <strong>Labeling Check:</strong>{" "}
              {qc.labelingCheck}
            </p>

            <p>
              <strong>Documentation Check:</strong>{" "}
              {qc.documentationCheck}
            </p>

            <p>
              <strong>Overall Status:</strong>{" "}
              {qc.overallStatus}
            </p>

            <p>
              <strong>Findings:</strong>{" "}
              {qc.findings || "-"}
            </p>

            <p>
              <strong>Corrective Action:</strong>{" "}
              {qc.correctiveAction || "-"}
            </p>

            <p>
              <strong>Reviewed By:</strong>{" "}
              {qc.reviewedBy?.name || "-"}
            </p>

            <hr />
          </div>
        ))
      )}
    </section>
  );
};

export default ReportQCInfo;