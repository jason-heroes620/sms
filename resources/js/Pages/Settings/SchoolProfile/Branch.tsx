import { DataTable } from '@/components/Datatables/data-table';

import EditSheet from '@/components/EditSheet';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BranchType } from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import BranchForm from './BranchForm';

export const columns: ColumnDef<BranchType>[] = [
    {
        accessorKey: 'branch_name',
        header: 'Branch Name',
        cell: ({ row }) => {
            return row.getValue('branch_name') as string;
        },
    },
    {
        accessorKey: 'branch_status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original;

            return (
                <div className="flex items-center">
                    {status.branch_status === 'active' ? (
                        <div className="rounded-md bg-green-600 px-2">
                            <span className="text-xs font-bold text-white">
                                Active
                            </span>
                        </div>
                    ) : (
                        <div className="rounded-md bg-red-600 px-2">
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
            const branch = row.original;
            const [id, setId] = useState('');
            const [isSheetOpen, setIsSheetOpen] = useState(false);
            const [isDropdownOpen, setIsDropdownOpen] = useState(false);
            const editable = [''];
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
                                    handleEditClick(branch.branch_id);
                                }}
                            >
                                Edit
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <EditSheet
                        isSheetOpen={isSheetOpen}
                        setIsSheetOpen={setIsSheetOpen}
                    >
                        <BranchForm id={id} editable={editable} />
                    </EditSheet>
                </div>
            );
        },
    },
];

const Branch = () => {
    return (
        <AuthenticatedLayout>
            <Head title="Branches" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <div>
                            <span className="font-bold">Settings </span>
                            <span>| Branches </span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white p-4 shadow-sm sm:rounded-lg">
                        <div className="flex flex-col gap-6 md:grid md:grid-cols-3">
                            <div className="gap-4 md:col-span-1 md:grid">
                                <div className="rounded-md border px-4 py-4 shadow-md">
                                    <div className="py-2">
                                        <span className="text-md font-semibold text-gray-900 italic dark:text-gray-100">
                                            New Branch
                                        </span>
                                        <hr />
                                        <BranchForm />
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <DataTable
                                    columns={columns}
                                    endpoint="/branches/showAll"
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

export default Branch;
