import React, { useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'search';
  options?: FilterOption[];
  min?: number;
  max?: number;
  value?: any;
}

interface SmartFiltersProps {
  filters: FilterGroup[];
  onFilterChange: (filterId: string, value: any) => void;
  onReset?: () => void;
}

const SmartFilters: React.FC<SmartFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: any }>({});

  const handleFilterChange = (filterId: string, value: any) => {
    const newFilters = { ...activeFilters, [filterId]: value };
    setActiveFilters(newFilters);
    onFilterChange(filterId, value);
  };

  const handleReset = () => {
    setActiveFilters({});
    if (onReset) {
      onReset();
    }
  };

  const activeFilterCount = Object.keys(activeFilters).filter(
    key => activeFilters[key] !== null && activeFilters[key] !== undefined && activeFilters[key] !== ''
  ).length;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden py-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <FiFilter className="h-5 w-5" />
            <span className="font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-green-600 text-white text-xs rounded-full px-2 py-1">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:block py-4`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter Products</h3>
            {activeFilterCount > 0 && (
              <button
                onClick={handleReset}
                className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
              >
                <FiX className="h-4 w-4" />
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {filters.map((filter) => (
              <div key={filter.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {filter.label}
                </label>

                {filter.type === 'checkbox' && filter.options && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {filter.options.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={activeFilters[filter.id]?.includes(option.id) || false}
                          onChange={(e) => {
                            const current = activeFilters[filter.id] || [];
                            const newValue = e.target.checked
                              ? [...current, option.id]
                              : current.filter((id: string) => id !== option.id);
                            handleFilterChange(filter.id, newValue);
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">
                          {option.label}
                          {option.count !== undefined && (
                            <span className="text-gray-400 ml-1">({option.count})</span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {filter.type === 'radio' && filter.options && (
                  <div className="space-y-2">
                    {filter.options.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={filter.id}
                          checked={activeFilters[filter.id] === option.id}
                          onChange={() => handleFilterChange(filter.id, option.id)}
                          className="border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}

                {filter.type === 'range' && filter.min !== undefined && filter.max !== undefined && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={filter.min}
                        max={filter.max}
                        placeholder="Min"
                        value={activeFilters[filter.id]?.min || ''}
                        onChange={(e) => {
                          handleFilterChange(filter.id, {
                            ...activeFilters[filter.id],
                            min: e.target.value ? Number(e.target.value) : undefined,
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        min={filter.min}
                        max={filter.max}
                        placeholder="Max"
                        value={activeFilters[filter.id]?.max || ''}
                        onChange={(e) => {
                          handleFilterChange(filter.id, {
                            ...activeFilters[filter.id],
                            max: e.target.value ? Number(e.target.value) : undefined,
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      Range: ₹{filter.min} - ₹{filter.max}
                    </div>
                  </div>
                )}

                {filter.type === 'search' && (
                  <input
                    type="text"
                    placeholder={`Search ${filter.label.toLowerCase()}...`}
                    value={activeFilters[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartFilters;
