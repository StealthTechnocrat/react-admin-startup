import React from 'react';
import { useAdminTableFilters } from './UseAdminTableFilters';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

type DataTableSearchProps = {
  searchKey: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setPage: (page: string) => void;
};

const DataTableSearch: React.FC<DataTableSearchProps> = ({
  searchKey,
  searchQuery,
  setSearchQuery,
  setPage,
}) => (
  <Input
    type="text"
    placeholder={`Search by ${searchKey}`}
    value={searchQuery}
    onChange={(e) => {
      setSearchQuery(e.target.value);
      setPage('1'); // Reset to page 1 when a new search is initiated
    }}
    className="border rounded-md p-2"
  />
);

type DataTableResetFilterProps = {
  isFilterActive: boolean;
  onReset: () => void;
};

const DataTableResetFilter: React.FC<DataTableResetFilterProps> = ({
  isFilterActive,
  onReset,
}) => (
  <Button
    onClick={onReset}
    disabled={!isFilterActive}
    className={`p-2 rounded-md `}
  >
    Reset Filters
  </Button>
);

export default function AdminTableAction() {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useAdminTableFilters();

  return (
    <div className="flex items-center gap-4">
      {/* Search Input */}
      <DataTableSearch
        searchKey="name"
        searchQuery={searchQuery || ''}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />

      {/* Reset Filters Button */}
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
