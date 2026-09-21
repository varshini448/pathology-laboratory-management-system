const ReportBlockInfo = ({ blocks }) => {
  return (
    <section>
      <h2>Block Information</h2>

      {blocks.length === 0 ? (
        <p>No blocks found for this case.</p>
      ) : (
        blocks.map((block) => (
          <div key={block._id}>
            <p>
              <strong>Block ID:</strong> {block.blockId}
            </p>

            <p>
              <strong>Block Type:</strong> {block.blockType}
            </p>

            <p>
              <strong>Tissue Description:</strong>{" "}
              {block.tissueDescription || "-"}
            </p>

            <p>
              <strong>Processing Status:</strong>{" "}
              {block.processingStatus}
            </p>

            <p>
              <strong>Notes:</strong> {block.notes || "-"}
            </p>

            <hr />
          </div>
        ))
      )}
    </section>
  );
};

export default ReportBlockInfo;