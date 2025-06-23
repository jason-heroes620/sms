// import AcademicYearTable from '@/components/Tables/AcademicYearTable';
import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { MoreHorizontal, Plus } from 'lucide-react';

import { DataTable } from '@/components/Datatables/data-table';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import moment from 'moment';

type AcademicYear = {
    id: string;
    academic_year: string;
    start_date: Date;
    end_date: Date;
    is_current: boolean;
};

export const columns: ColumnDef<AcademicYear>[] = [
    // {
    //     id: 'select',
    //     header: ({ table }) => (
    //         <Checkbox
    //             checked={
    //                 table.getIsAllPageRowsSelected() ||
    //                 (table.getIsSomePageRowsSelected() && 'indeterminate')
    //             }
    //             onCheckedChange={(value) =>
    //                 table.toggleAllPageRowsSelected(!!value)
    //             }
    //             aria-label="Select all"
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <Checkbox
    //             checked={row.getIsSelected()}
    //             onCheckedChange={(value) => row.toggleSelected(!!value)}
    //             aria-label="Select row"
    //         />
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    // },
    {
        id: 'id',
    },
    {
        accessorKey: 'academic_year',
        header: 'Academic Year',
        cell: ({ row }) => {
            return row.getValue('academic_year') as string;
        },
    },
    {
        accessorKey: 'start_date',
        header: 'Start Date',
        cell: ({ row }) => {
            return moment(row.getValue('start_date') as string).format(
                'DD MMM YYYY',
            );
        },
    },
    {
        accessorKey: 'end_date',
        header: 'End Date',
        cell: ({ row }) => {
            return moment(row.getValue('end_date') as string).format(
                'DD MMM YYYY',
            );
        },
    },
    {
        accessorKey: 'is_current',
        header: 'Current',
        cell: ({ row }) => {
            const is_current = row.getValue('is_current') as string;
            return is_current === 'true' ? (
                <Badge variant="default">Current</Badge>
            ) : (
                ''
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const academic_year = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(academic_year.id)
                            }
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>
                            View payment details
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const AcademicYears = () => {
    return (
        <AuthenticatedLayout>
            <Head title="Academic Years" />

            <div className="px-4 py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4 text-gray-900 dark:text-gray-100">
                            <span className="font-bold">Academic Years</span>
                        </div>
                    </div>
                    <div className="flex justify-end py-4">
                        <Button variant={'primary'} size={'sm'}>
                            <Plus />
                            Create
                        </Button>
                    </div>
                    <div className="py-2">
                        {/* <AcademicYearTable academicYears={academicYears} /> */}
                        <DataTable
                            columns={columns}
                            endpoint="/settings/academic_years"
                            options={{
                                showSearch: true,
                                showFilters: true,
                                showPagination: true,
                                defaultPageSize: 2,
                            }}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AcademicYears;
