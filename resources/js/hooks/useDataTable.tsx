import {
    ColumnDef,
    OnChangeFn,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

type UseDataTableProps<TData extends object> = {
    data: TData[];
    columns: ColumnDef<TData, any>[];
    initialVisibility?: VisibilityState;
    initialPageSize?: number;
    onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
};

export function useDataTable<TData extends object>({
    data,
    columns,
    initialVisibility = {},
    initialPageSize = 10,
    onColumnVisibilityChange,
}: UseDataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>(initialVisibility);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const table = useReactTable<TData>({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
        },
        onSortingChange: setSorting,
        onColumnVisibilityChange:
            onColumnVisibilityChange ?? setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return {
        table,
        sorting,
        setSorting,
        columnVisibility,
        setColumnVisibility,
        pageSize,
        setPageSize,
    };
}
