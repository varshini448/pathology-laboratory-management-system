import {
  formatDateTime,
  formatDuration,
  formatStageName,
} from "../tatDetailsUtils";

const TATStageTable = ({ stageTAT }) => {
  return (
    <div className="tat-card">
      <div className="tat-card-header">
        <div>
          <h2>Stage-wise Turnaround Time</h2>
          <p>Processing duration recorded for each workflow stage.</p>
        </div>
      </div>

      {stageTAT.length === 0 ? (
        <div className="tat-empty">
          <h3>No workflow stage data</h3>
          <p>Workflow events will appear here as the case progresses.</p>
        </div>
      ) : (
        <div className="tat-table-wrapper">
          <table className="tat-table tat-stage-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Workflow Stage</th>
                <th>Started</th>
                <th>Completed</th>
                <th>Duration</th>
              </tr>
            </thead>

            <tbody>
              {stageTAT.map((stage, index) => (
                <tr key={stage.stage}>
                  <td className="tat-stage-number">
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  <td>
                    <strong>{formatStageName(stage.stage)}</strong>
                  </td>

                  <td>{formatDateTime(stage.startedAt)}</td>

                  <td>{formatDateTime(stage.completedAt)}</td>

                  <td>
                    <strong>{formatDuration(stage.durationMinutes)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TATStageTable;
