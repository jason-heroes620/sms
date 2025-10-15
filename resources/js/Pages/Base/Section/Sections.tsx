import { DataTable } from '@/components/Datatables/data-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BranchType } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus } from 'lucide-react';

type Section = {
    section_id: string;
    class_name: string;
    section_name: string;
    capacity: number;
};

type Class = {
    class_id: string;
    class_name: string;
    branch_id: string;
};

export const columns: ColumnDef<Section>[] = [
    {
        accessorKey: 'class_name',
        header: 'Class Name',
        cell: ({ row }) => {
            return row.getValue('class_name') as string;
        },
    },
    {
        accessorKey: 'section_name',
        header: 'Section',
        cell: ({ row }) => {
            return row.getValue('section_name') as string;
        },
    },
    {
        accessorKey: 'name',
        header: 'Teacher In Charge',
        cell: ({ row }) => {
            return row.getValue('name') as string;
        },
    },
    {
        accessorKey: 'capacity',
        header: 'Capacity',
        cell: ({ row }) => {
            return row.getValue('capacity') as string;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const sections = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() =>
                                router.visit(
                                    route('section.edit', sections.section_id),
                                )
                            }
                        >
                            View
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const Sections = ({ filterBranches }: { filterBranches: BranchType[] }) => {
    const filterConfig = [
        {
            key: 'branch',
            label: 'Branch',
            options: filterBranches,
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Sections" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex items-center justify-between p-4 text-gray-900 dark:text-gray-100">
                        <div>
                            <span className="font-bold">Sections </span>
                            <span> | All Sections</span>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                variant={'primary'}
                                size={'sm'}
                                onClick={() =>
                                    router.visit(route('section.create'))
                                }
                            >
                                <Plus />
                                Create
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white p-4 shadow-sm sm:rounded-lg">
                        <div className="flex flex-col">
                            <DataTable
                                columns={columns}
                                endpoint="/sections/showAll"
                                options={{
                                    showSearch: true,
                                    showFilters: true,
                                    showPagination: true,
                                    defaultPageSize: 10,
                                }}
                                filterConfig={filterConfig}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Sections;
