const ReportSlideInfo = ({ slides }) => {
  return (
    <section>
      <h2>Slide Information</h2>

      {slides.length === 0 ? (
        <p>No slides found for this case.</p>
      ) : (
        slides.map((slide) => (
          <div key={slide._id}>
            <p>
              <strong>Slide ID:</strong> {slide.slideId}
            </p>

            <p>
              <strong>Slide Type:</strong> {slide.slideType}
            </p>

            <p>
              <strong>Staining Method:</strong>{" "}
              {slide.stainingMethod || "-"}
            </p>

            <p>
              <strong>Status:</strong> {slide.status}
            </p>

            <p>
              <strong>Notes:</strong> {slide.notes || "-"}
            </p>

            <hr />
          </div>
        ))
      )}
    </section>
  );
};

export default ReportSlideInfo;