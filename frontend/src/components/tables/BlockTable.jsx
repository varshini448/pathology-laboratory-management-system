const BlockTable = ({ blocks = [] }) => {
  if (blocks.length === 0) {
    return <p>No blocks found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Block ID</th>
          <th>Specimen</th>
          <th>Case</th>
          <th>Block Type</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {blocks.map((block) => (
          <tr key={block._id}>
            <td>{block.blockId}</td>
            <td>
              {block.specimen?.specimenId || block.specimen || "-"}
            </td>
            <td>
              {block.case?.caseId || block.case || "-"}
            </td>
            <td>{block.blockType || "-"}</td>
            <td>{block.status || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BlockTable;