const ReportWorkflowInfo = ({ workflowEvents }) => {
  return (
    <section>
      <h2>Workflow Progress</h2>

      {workflowEvents.length === 0 ? (
        <p>No workflow events found for this case.</p>
      ) : (
        workflowEvents.map((event) => (
          <div key={event._id}>
            <p>
              <strong>Stage:</strong> {event.stage}
            </p>

            <p>
              <strong>Status:</strong> {event.status}
            </p>

            <p>
              <strong>Performed By:</strong>{" "}
              {event.performedBy?.name || "-"}
            </p>

            <p>
              <strong>Notes:</strong> {event.notes || "-"}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {event.createdAt
                ? new Date(event.createdAt).toLocaleString()
                : "-"}
            </p>

            <hr />
          </div>
        ))
      )}
    </section>
  );
};

export default ReportWorkflowInfo;