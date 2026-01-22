import React, { useState, useMemo } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';

const EnhancedFilterTable = () => {
  // Sample inventory data
  const [data] = useState([
    { id: 1, name: 'Laptop', category: 'Electronics', status: 'In Stock', supplier: 'TechCorp', quantity: 25 },
    { id: 2, name: 'Mouse', category: 'Electronics', status: 'Low Stock', supplier: 'TechCorp', quantity: 5 },
    { id: 3, name: 'Desk Chair', category: 'Furniture', status: 'In Stock', supplier: 'FurniCo', quantity: 12 },
    { id: 4, name: 'Monitor', category: 'Electronics', status: 'Out of Stock', supplier: 'DisplayInc', quantity: 0 },
    { id: 5, name: 'Keyboard', category: 'Electronics', status: 'In Stock', supplier: 'TechCorp', quantity: 18 },
    { id: 6, name: 'Bookshelf', category: 'Furniture', status: 'In Stock', supplier: 'FurniCo', quantity: 8 },
    { id: 7, name: 'Tablet', category: 'Electronics', status: 'Low Stock', supplier: 'MobileTech', quantity: 3 },
    { id: 8, name: 'Desk Lamp', category: 'Furniture', status: 'In Stock', supplier: 'LightCorp', quantity: 15 }
  ]);

  // Filter states for each column
  const [filters, setFilters] = useState({
    category: { include: [], exclude: [] },
    status: { include: [], exclude: [] },
    supplier: { include: [], exclude: [] }
  });

  // Dropdown open states
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Get unique values for each filterable column
  const getUniqueValues = (column) => {
    return [...new Set(data.map(item => item[column]))].sort();
  };

  // Apply filters to data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Check each filter
      for (const [column, filter] of Object.entries(filters)) {
        const value = item[column];
        
        // If exclude filter has values and current value is in exclude list, filter out
        if (filter.exclude.length > 0 && filter.exclude.includes(value)) {
          return false;
        }
        
        // If include filter has values and current value is not in include list, filter out
        if (filter.include.length > 0 && !filter.include.includes(value)) {
          return false;
        }
      }
      return true;
    });
  }, [data, filters]);

  // Handle filter change
  const handleFilterChange = (column, value, type, checked) => {
    setFilters(prev => ({
      ...prev,
      [column]: {
        ...prev[column],
        [type]: checked 
          ? [...prev[column][type], value]
          : prev[column][type].filter(item => item !== value)
      }
    }));
  };

  // Clear all filters for a column
  const clearColumnFilters = (column) => {
    setFilters(prev => ({
      ...prev,
      [column]: { include: [], exclude: [] }
    }));
  };

  // Toggle dropdown
  const toggleDropdown = (column) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  // Close dropdown when clicking outside
  const closeDropdown = (column) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [column]: false
    }));
  };

  // Filter dropdown component
  const FilterDropdown = ({ column, title }) => {
    const uniqueValues = getUniqueValues(column);
    const isOpen = openDropdowns[column];
    const hasFilters = filters[column].include.length > 0 || filters[column].exclude.length > 0;

    return (
      <div className="relative">
        <button
          onClick={() => toggleDropdown(column)}
          className={`flex items-center space-x-1 px-2 py-1 text-sm border rounded hover:bg-gray-50 ${
            hasFilters ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-300'
          }`}
        >
          <Filter size={14} />
          <span>{title}</span>
          <ChevronDown size={14} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            <div className="p-3">
              {/* Header with clear button */}
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-gray-700">Filter {title}</span>
                {hasFilters && (
                  <button
                    onClick={() => clearColumnFilters(column)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Include Section */}
              <div className="mb-4">
                <div className="text-sm font-medium text-green-700 mb-2">Include:</div>
                <div className="max-h-32 overflow-y-auto">
                  {uniqueValues.map(value => (
                    <label key={`include-${value}`} className="flex items-center space-x-2 mb-1">
                      <input
                        type="checkbox"
                        checked={filters[column].include.includes(value)}
                        onChange={(e) => handleFilterChange(column, value, 'include', e.target.checked)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{value}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Exclude Section */}
              <div>
                <div className="text-sm font-medium text-red-700 mb-2">Exclude:</div>
                <div className="max-h-32 overflow-y-auto">
                  {uniqueValues.map(value => (
                    <label key={`exclude-${value}`} className="flex items-center space-x-2 mb-1">
                      <input
                        type="checkbox"
                        checked={filters[column].exclude.includes(value)}
                        onChange={(e) => handleFilterChange(column, value, 'exclude', e.target.checked)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">{value}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Inventory Management - Enhanced Filtering</h1>
      
      {/* Filter Summary */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          Showing {filteredData.length} of {data.length} items
        </div>
        {Object.entries(filters).some(([, filter]) => filter.include.length > 0 || filter.exclude.length > 0) && (
          <div className="mt-2 space-y-1">
            {Object.entries(filters).map(([column, filter]) => (
              (filter.include.length > 0 || filter.exclude.length > 0) && (
                <div key={column} className="text-xs">
                  <span className="font-medium capitalize">{column}:</span>
                  {filter.include.length > 0 && (
                    <span className="text-green-600 ml-1">
                      Include: {filter.include.join(', ')}
                    </span>
                  )}
                  {filter.exclude.length > 0 && (
                    <span className="text-red-600 ml-1">
                      Exclude: {filter.exclude.join(', ')}
                    </span>
                  )}
                </div>
              )
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <div className="flex items-center space-x-2">
                  <span>Category</span>
                  <FilterDropdown column="category" title="Category" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <div className="flex items-center space-x-2">
                  <span>Status</span>
                  <FilterDropdown column="status" title="Status" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <div className="flex items-center space-x-2">
                  <span>Supplier</span>
                  <FilterDropdown column="supplier" title="Supplier" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                    item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.supplier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Click outside to close dropdowns */}
      {Object.values(openDropdowns).some(Boolean) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setOpenDropdowns({})}
        />
      )}
    </div>
  );
};

export default EnhancedFilterTable;