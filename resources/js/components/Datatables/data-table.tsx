// components/LaravelReactTable.tsx
import { useTable } from '@/hooks/useTable';
import { TableOptions } from '@/types';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

interface DataTableProps<T> {
    columns: ColumnDef<T>[];
    endpoint: string;
    options?: TableOptions;
}

export function DataTable<T>({
    columns,
    endpoint,
    options = {},
}: DataTableProps<T>) {
    const {
        columns: tableColumns,
        data,
        meta,
        loading,
        error,
        search,
        setSearch,
        filters,
        setFilters,
        sorting,
        setSorting,
        pagination,
        setPagination,
        showSearch,
        showFilters,
        showPagination,
        fetchData,
    } = useTable<T>(columns, endpoint, options);

    const table = useReactTable({
        data,
        columns: tableColumns,
        pageCount: meta?.last_page ?? -1,
        state: {
            sorting,
            pagination,
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    });

    return (
        <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-4">
                {showSearch && (
                    <div className="w-full md:w-auto">
                        <label htmlFor="search" className="sr-only">
                            Search
                        </label>
                        <input
                            type="text"
                            id="search"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="rounded-md border px-4 py-2"
                        />
                    </div>
                )}

                {showFilters && (
                    <div className="flex flex-wrap gap-2">
                        {/* Example filter - customize based on your needs */}
                        <select
                            value={filters.status || ''}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    status: e.target.value || undefined,
                                })
                            }
                            className="rounded-md border px-4 py-2"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex cursor-pointer items-center">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                            {{
                                                asc: ' ↑',
                                                desc: ' ↓',
                                            }[
                                                header.column.getIsSorted() as string
                                            ] ?? null}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-4 text-center"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-4 text-center text-red-500"
                                >
                                    {error}
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-6 py-4 whitespace-nowrap"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {showPagination && meta && (
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">{meta.from}</span>{' '}
                        to <span className="font-medium">{meta.to}</span> of{' '}
                        <span className="font-medium">{meta.total}</span>{' '}
                        results
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="rounded-md border px-4 py-2 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="rounded-md border px-4 py-2 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>

                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                        className="rounded-md border px-4 py-2"
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}
