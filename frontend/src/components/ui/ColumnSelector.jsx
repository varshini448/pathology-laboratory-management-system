import React from "react";

const ColumnSelector = ({
  columns = [],
  visibleColumns = [],
  onChange,
}) => {
  const handleToggle = (key) => {
    const nextColumns = visibleColumns.includes(key)
      ? visibleColumns.filter((column) => column !== key)
      : [...visibleColumns, key];

    onChange?.(nextColumns);
  };

  return (
    <div className="ui-column-selector">
      <span className="ui-column-selector-title">
        Columns
      </span>

      <div className="ui-column-selector-list">
        {columns.map((column) => (
          <label key={column.key}>
            <input
              type="checkbox"
              checked={visibleColumns.includes(column.key)}
              onChange={() => handleToggle(column.key)}
            />
            <span>{column.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ColumnSelector;