import React, { useMemo, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export const SelectColumnFilter = ({ 
  column: { filterValue, setFilter, preFilteredRows, id } 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("include"); // "include" or "exclude"
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0, width: 200 });

  const options = useMemo(() => {
    const opts = new Set();
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

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option => 
      option.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const currentFilter = useMemo(() => {
    if (!filterValue || typeof filterValue !== 'object') {
      return { mode: 'include', values: [] };
    }
    return filterValue;
  }, [filterValue]);

  const handleCheckboxChange = (option, checked) => {
    const newValues = checked
      ? [...currentFilter.values, option]
      : currentFilter.values.filter(v => v !== option);

    const newFilter = {
      mode: filterMode,
      values: newValues
    };
    setFilter(newValues.length > 0 ? newFilter : undefined);
  };

  const handleModeChange = (newMode) => {
    setFilterMode(newMode);
    const newFilter = {
      mode: newMode,
      values: currentFilter.values
    };
    setFilter(currentFilter.values.length > 0 ? newFilter : undefined);
  };

  const handleSelectAll = () => {
    const newFilter = {
      mode: filterMode,
      values: filteredOptions
    };
    setFilter(newFilter);
  };

  const handleSelectNone = () => {
    setFilter(undefined);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

  const selectedCount = currentFilter.values.length;
  const displayText = selectedCount > 0 
    ? `${currentFilter.mode === 'include' ? 'Include' : 'Exclude'} (${selectedCount})`
    : 'All';

  return (
    <>
      <div ref={buttonRef} style={{width: '100%' }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            fontSize: '12px',
            padding: '4px 8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '100%',
            backgroundColor: selectedCount > 0 ? '#e3f2fd' : 'white',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{displayText}</span>
          <span style={{ fontSize: '10px' }}>▼</span>
        </button>
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: dropdownStyle.top,
              left: dropdownStyle.left,
              width: dropdownStyle.width,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 1000,
              maxHeight: '450px',
              minWidth: 150,
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '8px',
              borderBottom: '1px solid #eee',
              backgroundColor: '#f5f5f5'
            }}>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                  Filter Mode:
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name={`mode-${id}`}
                      value="include"
                      checked={filterMode === 'include'}
                      onChange={() => handleModeChange('include')}
                      style={{ marginRight: '4px' }}
                    />
                    Include
                  </label>
                  <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name={`mode-${id}`}
                      value="exclude"
                      checked={filterMode === 'exclude'}
                      onChange={() => handleModeChange('exclude')}
                      style={{ marginRight: '4px' }}
                    />
                    Exclude
                  </label>
                </div>
              </div>

              <input
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '4px 6px',
                  fontSize: '11px',
                  border: '1px solid #ddd',
                  borderRadius: '3px',
                  marginBottom: '6px'
                }}
              />

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    border: '1px solid #007bff',
                    borderRadius: '3px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={handleSelectNone}
                  style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    border: '1px solid #6c757d',
                    borderRadius: '3px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Options */}
            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              padding: '4px'
            }}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, i) => (
                  <label
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px 6px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      borderRadius: '2px'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <input
                      type="checkbox"
                      checked={currentFilter.values.includes(option)}
                      onChange={(e) => handleCheckboxChange(option, e.target.checked)}
                      style={{ marginRight: '6px' }}
                    />
                    <span>{option}</span>
                  </label>
                ))
              ) : (
                <div style={{ 
                  padding: '8px', 
                  fontSize: '11px', 
                  color: '#666', 
                  textAlign: 'center' 
                }}>
                  No options found
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

// Custom filter function
export const multiSelectFilter = (rows, id, filterValue) => {
  const { values, mode } = filterValue || { values: [], mode: "include" };
  if (!values || values.length === 0) return rows;

  return rows.filter(row => {
    const cellValue = row.values[id];
    if (cellValue == null) return false;
    const stringValue = String(cellValue);
    return mode === 'include'
      ? values.map(String).includes(stringValue)
      : !values.map(String).includes(stringValue);
  });
};
