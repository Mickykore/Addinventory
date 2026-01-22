import React, { useMemo } from "react";

export const SelectColumnFilter = ({ column: { filterValue, setFilter, preFilteredRows, id } }) => {
  const options = useMemo(() => {
    const opts = new Set();

    // Filter out rows with undefined/null original
    const validRows = preFilteredRows.filter(row => row?.original);

    validRows.forEach(row => {
      try {
        const value = id.split('.').reduce((obj, key) => obj?.[key], row.original);
        if (value !== undefined && value !== null && value !== '') {
          opts.add(value);
        }
      } catch (err) {
        console.warn(`Failed to access nested value for '${id}'`, err);
      }
    });

    return [...opts];
  }, [id, preFilteredRows]);

  return (
    <select
      style={{
        fontSize: '12px',
        padding: '4px 8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '100%',
      }}
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value || undefined)}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
