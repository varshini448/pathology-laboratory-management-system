import React from "react";

const DateRangePicker = ({
  startDate = "",
  endDate = "",
  onChange,
}) => {
  const handleChange = (field, value) => {
    onChange?.({
      startDate,
      endDate,
      [field]: value,
    });
  };

  return (
    <div className="ui-date-range-picker">
      <label>
        From
        <input
          type="date"
          value={startDate}
          onChange={(event) =>
            handleChange("startDate", event.target.value)
          }
        />
      </label>

      <label>
        To
        <input
          type="date"
          value={endDate}
          onChange={(event) =>
            handleChange("endDate", event.target.value)
          }
        />
      </label>
    </div>
  );
};

export default DateRangePicker;