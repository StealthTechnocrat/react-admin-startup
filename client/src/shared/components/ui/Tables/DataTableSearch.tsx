import React, { useState, useEffect, useTransition } from 'react';

interface DataTableSearchProps {
  searchKey: string;
  searchQuery: string;
  setSearchQuery: (value: string | null) => void; // Removed dependency on Options
  setPage: (value: string | null) => void; // Removed dependency on Options
}

export function DataTableSearch({
  searchKey,
  searchQuery,
  setSearchQuery,
  setPage,
}: DataTableSearchProps) {
  const [isLoading, startTransition] = useTransition();
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Debounce the search input
  const handleSearchChange = (value: string) => {
    setDebouncedSearch(value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      // Use a transition for smoother UI updates
      startTransition(() => {
        setSearchQuery(debouncedSearch);
        setPage('1'); // Reset page to 1 when search changes
      });
    }, 500); // Adjust debounce delay as needed

    return () => {
      clearTimeout(handler); // Clear previous timeout to avoid unnecessary calls
    };
  }, [debouncedSearch, setSearchQuery, setPage]);

  return (
    <input
      placeholder={`Search ${searchKey}...`}
      value={debouncedSearch}
      onChange={(e) => handleSearchChange(e.target.value)}
      className={`w-full md:max-w-sm ${isLoading ? 'animate-pulse' : ''}`}
    />
  );
}
