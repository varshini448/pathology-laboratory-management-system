import React from "react";

const DashboardTable = ({
  columns = [],
  data = [],
  emptyMessage = "No records found.",
  rowKey = "_id",
}) => {
  if (data.length === 0) {
    return (
      <div className="dashboard-table-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-table-wrapper">
      <table className="dashboard-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr key={row[rowKey] || index}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render
                    ? column.render(row)
                    : row[column.key] ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
