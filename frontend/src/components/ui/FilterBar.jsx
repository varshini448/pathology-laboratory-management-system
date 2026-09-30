import React from "react";

const FilterBar = ({
  searchValue = "",
  onSearch,
  searchPlaceholder = "Search...",
  children,
  onReset,
}) => {
  return (
    <div className="ui-filter-bar">
      <div className="ui-filter-search">
        <label htmlFor="ui-filter-search-input">
          Search
        </label>

        <input
          id="ui-filter-search-input"
          type="search"
          value={searchValue}
          onChange={(event) => onSearch?.(event.target.value)}
          placeholder={searchPlaceholder}
        />
      </div>

      <div className="ui-filter-controls">
        {children}
      </div>

      {onReset && (
        <button
          type="button"
          className="ui-filter-reset"
          onClick={onReset}
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default FilterBar;