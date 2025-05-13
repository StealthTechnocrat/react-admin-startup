import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '../button';

interface DataTableProps<TData, TValue> {
  loading: boolean;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
  pageSizeOptions?: number[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalItems,
  pageSizeOptions = [10, 20, 30, 40, 50],
  loading,
}: DataTableProps<TData, TValue>) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial page and page size from query string or default values
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialPageSize = parseInt(
    searchParams.get('limit') || pageSizeOptions[0].toString(),
    10,
  );

  const [currentPage, _setCurrentPage] = useState(initialPage);
  const [pageSize, _setPageSize] = useState(initialPageSize);

  const paginationState: PaginationState = {
    pageIndex: parseInt(searchParams.get('page') || '1', 10) - 1,
    pageSize: parseInt(
      searchParams.get('limit') || pageSizeOptions[0].toString(),
      10,
    ),
  };

  const pageCount = Math.ceil(totalItems / pageSize);

  // Sync state with the query string
  useEffect(() => {
    const updatedParams = Object.fromEntries(searchParams.entries());

    setSearchParams({
      ...updatedParams,
      // page: currentPage.toString(),
      // limit: pageSize.toString(),
    });
  }, [currentPage, searchParams, pageSize, setSearchParams]);

  const handlePaginationChange = (
    updaterOrValue:
      | PaginationState
      | ((old: PaginationState) => PaginationState),
  ) => {
    const pagination =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(paginationState)
        : updaterOrValue;

    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page: (pagination.pageIndex + 1).toString(),
      limit: pagination.pageSize.toString(),
    });
  };

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      pagination: paginationState,
    },
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true,
  });

  return (
    <div className="space-y-2">
      <div className="w-full overflow-x-auto rounded-md">
        <table className="min-w-full table-auto text-sm md:text-base">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className=" text-center ">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="py-2 px-2 font-medium  dark: xl:pl-5"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <>
                {' '}
                {Array.from({ length: table.getRowModel().rows.length }).map(
                  (_, i) => (
                    <tr key={i} className="my-2">
                      {Array.from({ length: columns.length }).map((_, i) => (
                        <td
                          key={i}
                          className="h-10 bg-gray-300 animate-pulse text-left px-4 py-2 rounded-md"
                        />
                      ))}
                    </tr>
                  ),
                )}
              </>
            ) : (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="border-b border-[#eee] py-3 px-4 pl-9 dark:border-strokedark xl:pl-11"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="h-24 text-center text-gray-500"
                    >
                      No results.
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-2">
        <div className="text-sm text-muted-foreground text-center md:text-left">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="text-sm text-muted-foreground text-center md:text-left">
          {totalItems > 0 ? (
            <>
              Showing {paginationState.pageIndex * paginationState.pageSize + 1}{' '}
              to{' '}
              {Math.min(
                (paginationState.pageIndex + 1) * paginationState.pageSize,
                totalItems,
              )}{' '}
              of {totalItems} entries
            </>
          ) : (
            'No entries found'
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0 hidden sm:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 hidden sm:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
