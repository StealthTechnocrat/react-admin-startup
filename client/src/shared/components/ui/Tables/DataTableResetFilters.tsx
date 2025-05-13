type DataTableResetFilterProps = {
  isFilterActive: boolean;
  onReset: () => void;
};

export function DataTableResetFilter({
  isFilterActive,
  onReset,
}: DataTableResetFilterProps) {
  return (
    <>
      {isFilterActive && (
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:bg-gray-100"
        >
          Reset Filters
        </button>
      )}
    </>
  );
}
