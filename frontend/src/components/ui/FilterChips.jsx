import React from "react";

const FilterChips = ({
  filters = [],
  onRemove,
  onClear,
}) => {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="ui-filter-chips">
      <div className="ui-filter-chip-list">
        {filters.map((filter, index) => (
          <span
            className="ui-filter-chip"
            key={filter.id || filter.key || index}
          >
            <span>
              {filter.label || filter.name || "Filter"}
              {filter.value ? `: ${filter.value}` : ""}
            </span>

            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(filter)}
                aria-label={`Remove ${filter.label || "filter"}`}
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>

      {onClear && (
        <button
          type="button"
          className="ui-filter-clear"
          onClick={onClear}
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default FilterChips;