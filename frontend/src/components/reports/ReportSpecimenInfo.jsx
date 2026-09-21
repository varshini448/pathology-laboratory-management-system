const ReportSpecimenInfo = ({ specimens }) => {
  return (
    <section>
      <h2>Specimen Information</h2>

      {specimens.length === 0 ? (
        <p>No specimens found for this case.</p>
      ) : (
        specimens.map((specimen) => (
          <div key={specimen._id}>
            <p>
              <strong>Specimen ID:</strong> {specimen.specimenId}
            </p>

            <p>
              <strong>Type:</strong> {specimen.specimenType}
            </p>

            <p>
              <strong>Collection Site:</strong>{" "}
              {specimen.collectionSite || "-"}
            </p>

            <p>
              <strong>Collection Date:</strong>{" "}
              {specimen.collectionDate
                ? new Date(specimen.collectionDate).toLocaleDateString()
                : "-"}
            </p>

            <p>
              <strong>Received Date:</strong>{" "}
              {specimen.receivedDate
                ? new Date(specimen.receivedDate).toLocaleDateString()
                : "-"}
            </p>

            <p>
              <strong>Condition:</strong> {specimen.condition || "-"}
            </p>

            <p>
              <strong>Status:</strong> {specimen.status || "-"}
            </p>

            <p>
              <strong>Notes:</strong> {specimen.notes || "-"}
            </p>

            <hr />
          </div>
        ))
      )}
    </section>
  );
};

export default ReportSpecimenInfo;