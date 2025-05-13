export function DataTableSkeleton({
  columnCount = 1,
  rowCount = 10,
  searchableColumnCount = 0,
  filterableColumnCount = 0,
  showViewOptions = false,
}) {
  return (
    <div className="w-full space-y-3 overflow-auto">
      {searchableColumnCount > 0 || filterableColumnCount > 0 ? (
        <div className="flex w-full items-center justify-between space-x-2 overflow-auto p-1">
          <div className="flex flex-1 items-center space-x-2 space-y-4">
            {searchableColumnCount > 0
              ? Array.from({ length: searchableColumnCount }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-[150px] lg:w-[250px] bg-gray-300 animate-pulse rounded-md"
                  />
                ))
              : null}
            {filterableColumnCount > 0
              ? Array.from({ length: filterableColumnCount }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-[70px] border-dashed bg-gray-300 animate-pulse rounded-md"
                  />
                ))
              : null}
          </div>
          {showViewOptions ? (
            <div className="ml-auto hidden h-7 w-[70px] bg-gray-300 animate-pulse rounded-md lg:flex" />
          ) : null}
        </div>
      ) : null}

      <div className="rounded-md border">
        <div className="h-[calc(80vh-220px)] md:h-[calc(90dvh-220px)] overflow-auto">
          <table className="w-full table-auto">
            <thead>
              <tr>
                {Array.from({ length: columnCount }).map((_, i) => (
                  <th
                    key={i}
                    className="h-8 bg-gray-300 animate-pulse text-left px-4 py-2 rounded-md"
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rowCount }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: columnCount }).map((_, i) => (
                    <td
                      key={i}
                      className="h-8 bg-gray-300 animate-pulse text-left px-4 py-2 rounded-md"
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-between gap-4 overflow-auto px-2 py-1 sm:flex-row sm:gap-8">
        <div className="flex-1">
          <div className="h-8 w-40 bg-gray-300 animate-pulse rounded-md" />
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-24 bg-gray-300 animate-pulse rounded-md" />
            <div className="h-8 w-[70px] bg-gray-300 animate-pulse rounded-md" />
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            <div className="h-8 w-20 bg-gray-300 animate-pulse rounded-md" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gray-300 animate-pulse rounded-full" />
            <div className="h-8 w-8 bg-gray-300 animate-pulse rounded-full" />
            <div className="h-8 w-8 bg-gray-300 animate-pulse rounded-full" />
            <div className="h-8 w-8 bg-gray-300 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
