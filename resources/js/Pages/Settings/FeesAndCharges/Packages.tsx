import { DataTable } from '@/components/Datatables/data-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formattedNumber } from '@/utils/formatNumber';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus } from 'lucide-react';
import moment from 'moment';

type Package = {
    package_id: string;
    package_name: string;
    package_description: string;
    package_price: number;
    effective_start_date: Date;
    effective_end_date: Date;
    package_status: string;
    recurring: boolean;
    frequency: string;
};

export const columns: ColumnDef<Package>[] = [
    {
        accessorKey: 'package_name',
        header: 'Package',
        cell: ({ row }) => {
            return row.getValue('package_name') as string;
        },
    },
    {
        accessorKey: 'package_price',
        header: 'Package Price',
        cell: ({ row }) => {
            return formattedNumber(row.getValue('package_price'));
        },
    },
    {
        accessorKey: 'effective_date',
        header: 'Effective Date',
        cell: ({ row }) => {
            const packages = row.original;
            const start_date = moment(packages.effective_start_date).format(
                'DD MMM YYYY',
            );
            const end_date = packages.effective_end_date
                ? moment(packages.effective_end_date).format('DD MMM YYYY')
                : '';
            return start_date + ' - ' + end_date;
        },
    },
    {
        accessorKey: 'recurring',
        header: 'Recurring',
        cell: ({ row }) => {
            const recurring = row.original;
            return recurring.recurring === true ? 'Yes' : 'No';
        },
    },
    {
        accessorKey: 'frequency',
        header: 'Frequency',
        cell: ({ row }) => {
            const packages = row.original;
            return packages.frequency ? packages.frequency.toUpperCase() : '';
        },
    },
    {
        accessorKey: 'package_status',
        header: 'Status',
        cell: ({ row }) => {
            const packages = row.original;
            return (
                <div className="flex items-center">
                    {packages.package_status === 'active' ? (
                        <div className="py rounded-md bg-green-600 px-2">
                            <span className="text-xs font-bold text-white">
                                Active
                            </span>
                        </div>
                    ) : (
                        <div className="py rounded-md bg-red-600 px-2">
                            <span className="text-xs font-bold text-white">
                                Inactive
                            </span>
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const packages = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() =>
                                router.visit(
                                    route('package.edit', packages.package_id),
                                )
                            }
                        >
                            Edit
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const Packages = () => {
    return (
        <AuthenticatedLayout>
            <Head title="Classes" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex items-center justify-between p-4 text-gray-900 dark:text-gray-100">
                        <div>
                            <span className="font-bold">Settings </span>
                            <span> | All Packages</span>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                variant={'primary'}
                                size={'sm'}
                                onClick={() =>
                                    router.visit(route('package.create'))
                                }
                            >
                                <Plus />
                                Create
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4 text-gray-900 dark:text-gray-100">
                            <div className="py-2">
                                <DataTable
                                    columns={columns}
                                    endpoint="/all_packages"
                                    options={{
                                        showSearch: true,
                                        showFilters: false,
                                        showPagination: true,
                                        defaultPageSize: 10,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Packages;
