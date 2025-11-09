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
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import PositionForm from './PositionForm';

type Position = {
    position_id: string;
    position: string;
};

export const columns: ColumnDef<Position>[] = [
    {
        accessorKey: 'position',
        header: 'Position',
        cell: ({ row }) => {
            return row.getValue('position') as string;
        },
    },

    {
        id: 'actions',
        cell: ({ row }) => {
            const position = row.original;

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
                                    handleEditClick(position.position_id);
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
                        <PositionForm id={id} />
                    </EditSheet>
                </div>
            );
        },
    },
];

const Positions = () => {
    return (
        <AuthenticatedLayout>
            <Head title="Positions" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex justify-between gap-4 p-4">
                        <div>
                            <span className="font-bold">Settings </span>
                            <span>| Positions</span>
                        </div>
                    </div>
                </div>

                <div className="py-8">
                    <div className="overflow-hidden bg-white p-4 shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="flex flex-col gap-6 md:grid md:grid-cols-3">
                            <div className="rounded-md border p-4 shadow-md">
                                <PositionForm />
                            </div>
                            <div className="col-span-2">
                                <DataTable
                                    columns={columns}
                                    endpoint="/positions/showAll"
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

export default Positions;
