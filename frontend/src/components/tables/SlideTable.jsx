const SlideTable = ({ slides = [] }) => {
  if (slides.length === 0) {
    return <p>No slides found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Slide ID</th>
          <th>Block</th>
          <th>Case</th>
          <th>Slide Type</th>
          <th>Staining</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {slides.map((slide) => (
          <tr key={slide._id}>
            <td>{slide.slideId}</td>
            <td>{slide.block?.blockId || slide.block}</td>
            <td>{slide.case?.caseId || slide.case}</td>
            <td>{slide.slideType}</td>
            <td>{slide.stainingMethod || "-"}</td>
            <td>{slide.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SlideTable;