import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

import { DataTable } from '@/components/Datatables/data-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus } from 'lucide-react';

type Student = {
    student_id: string;
    last_name: string;
    first_name: string;
    gender: string;
    class_name: string;
    section_name: string;
};

type Class = {
    class_id: string;
    class_name: string;
};

export const columns: ColumnDef<Student>[] = [
    {
        accessorKey: 'last_name',
        header: 'Last Name',
        cell: ({ row }) => {
            return row.getValue('last_name') as string;
        },
    },
    {
        accessorKey: 'first_name',
        header: 'First Name',
        cell: ({ row }) => {
            return row.getValue('first_name') as string;
        },
    },
    {
        accessorKey: 'gender',
        header: 'Gender',
        cell: ({ row }) => {
            return row.getValue('gender') as string;
        },
    },
    {
        accessorKey: 'class_name',
        header: 'Class',
        cell: ({ row }) => {
            const classSection = row.original;
            return `${classSection.class_name} - ${classSection.section_name}`;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const student = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() =>
                                router.visit(
                                    route('student.edit', student.student_id),
                                )
                            }
                        >
                            Edit
                        </DropdownMenuItem>
                        {/* <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
                        </DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const Students = ({ classes }: { classes: Class[] }) => {
    const filterConfig = [
        {
            key: 'class_id',
            label: 'Class',
            options: classes,
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Students" />

            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex items-center justify-between p-4 text-gray-900 dark:text-gray-100">
                        <div>
                            <span className="font-bold">Students </span>
                            <span> | All Students</span>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                variant={'primary'}
                                size={'sm'}
                                onClick={() =>
                                    router.visit(route('student.create'))
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
                                    endpoint="/all_students"
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
            </div>
        </AuthenticatedLayout>
    );
};

export default Students;
