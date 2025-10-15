import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DataTable } from '@/components/Datatables/data-table';
import EditSheet from '@/components/EditSheet';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Fee } from '@/types';
import { formattedNumber } from '@/utils/formatNumber';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import FeeEditForm from './FeeForm';

export const columns: ColumnDef<Fee>[] = [
    {
        accessorKey: 'fee_label',
        header: 'Fee Label',
        cell: ({ row }) => {
            return row.getValue('fee_label') as string;
        },
    },
    {
        accessorKey: 'fee_code',
        header: 'Fee Code',
        cell: ({ row }) => {
            return row.getValue('fee_code') as string;
        },
    },
    {
        accessorKey: 'fee_type',
        header: 'Fee type',
        cell: ({ row }) => {
            const fee = row.original;
            return fee.fee_type.toUpperCase().replace('_', ' ');
        },
    },
    {
        accessorKey: 'uom',
        header: 'UOM',
        cell: ({ row }) => {
            return row.getValue('uom') as string;
        },
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => {
            const fee = row.original;
            return formattedNumber(fee.amount);
        },
    },
    {
        accessorKey: 'tax_rate',
        header: 'Tax (%)',
        cell: ({ row }) => {
            const fee = row.original;
            return fee.tax_code ? `${fee.tax_code} (${fee.tax_rate}%)` : '';
        },
    },
    {
        accessorKey: 'fee_status',
        header: 'Status',
        cell: ({ row }) => {
            const fee = row.original;

            return (
                <div className="flex items-center">
                    {fee.fee_status === 'active' ? (
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
        header: 'Action',
        cell: ({ row }) => {
            const fee = row.original;
            const [id, setId] = useState('');
            const [isSheetOpen, setIsSheetOpen] = useState(false);
            const [isDropdownOpen, setIsDropdownOpen] = useState(false);
            const editable = ['fee_code'];
            const handleEditClick = (id: string) => {
                setIsDropdownOpen(false);
                setIsSheetOpen(true);
                setId(id);
            };

            return (
                <div>
                    <DropdownMenu
                        open={isDropdownOpen}
                        onOpenChange={setIsDropdownOpen}
                    >
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault();
                                    handleEditClick(fee.fee_id);
                                }}
                            >
                                Edit
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem
                                onClick={() => console.log(fee.fee_id)}
                            >
                                Set Inactive
                            </DropdownMenuItem> */}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <EditSheet
                        isSheetOpen={isSheetOpen}
                        setIsSheetOpen={setIsSheetOpen}
                    >
                        <FeeEditForm id={id} editable={editable} />
                    </EditSheet>
                </div>
            );
        },
    },
];

const Fees = () => {
    return (
        <AuthenticatedLayout>
            <Head title="Fees" />

            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex justify-between gap-4 p-4">
                        <div>
                            <span className="font-bold">Settings </span>
                            <span>| Fees</span>
                        </div>
                    </div>
                </div>

                <div className="py-8">
                    <div className="overflow-hidden bg-white p-4 shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="flex flex-col gap-6 md:grid md:grid-cols-3">
                            <div className="rounded-md border p-4 shadow-md">
                                <FeeEditForm />
                            </div>
                            <div className="col-span-2">
                                <DataTable
                                    columns={columns}
                                    endpoint="/all_fees"
                                    options={{
                                        showSearch: true,
                                        showFilters: true,
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

export default Fees;
