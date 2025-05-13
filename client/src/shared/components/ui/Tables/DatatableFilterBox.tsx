import React, { useState } from 'react';
import { CheckIcon, PlusCircle } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBoxProps {
  filterKey: string;
  title: string;
  options: FilterOption[];
  setFilterValue: (value: string | null) => void;
  filterValue: string;
}

export function DataTableFilterBox({
  title,
  options,
  setFilterValue,
  filterValue,
}: FilterBoxProps) {
  const [open, setOpen] = useState(false);

  const selectedValuesSet = React.useMemo(() => {
    if (!filterValue) return new Set<string>();
    const values = filterValue.split('.');
    return new Set(values.filter((value) => value !== ''));
  }, [filterValue]);

  const handleSelect = (value: string) => {
    const newSet = new Set(selectedValuesSet);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setFilterValue(Array.from(newSet).join('.') || null);
  };

  const resetFilter = () => setFilterValue(null);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center px-3 py-2 border rounded-md border-dashed space-x-2 hover:bg-gray-100"
      >
        <PlusCircle className="h-4 w-4" />
        <span>{title}</span>
        {selectedValuesSet.size > 0 && (
          <div className="ml-2 flex items-center space-x-1">
            <span className="text-sm text-gray-500">
              {selectedValuesSet.size > 2
                ? `${selectedValuesSet.size} selected`
                : ''}
            </span>
          </div>
        )}
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <input
            type="text"
            placeholder={title}
            className="w-full p-2 mb-2 border rounded-md text-sm text-gray-700"
          />
          <div>
            {options.length === 0 ? (
              <div className="text-center text-gray-500">No results found.</div>
            ) : (
              <ul className="space-y-1">
                {options.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                  >
                    <div
                      className={`mr-2 h-4 w-4 flex items-center justify-center rounded-sm border ${
                        selectedValuesSet.has(option.value)
                          ? 'bg-blue-500 '
                          : 'border-gray-300'
                      }`}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-gray-800">
                      {option.label}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {selectedValuesSet.size > 0 && (
              <div className="mt-2 text-center">
                <button
                  onClick={resetFilter}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
