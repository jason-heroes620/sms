import { DataTable } from '@/components/Datatables/data-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus } from 'lucide-react';
import moment from 'moment';

type Assessment = {
    assessment_id: string;
    student_first_name: string;
    student_last_name: string;
    comments: string;
    last_name: string;
    first_name: string;
    created_at: Date;
};

export const columns: ColumnDef<Assessment>[] = [
    {
        accessorKey: 'student_name',
        header: 'Student Name',
        cell: ({ row }) => {
            const name = row.original;
            return name.student_last_name + ' ' + name.student_first_name;
        },
    },
    {
        accessorKey: 'comments',
        header: 'Comments',
        cell: ({ row }) => {
            const comment = row.original;
            return <p className="max-w-[150px] truncate">{comment.comments}</p>;
        },
    },
    {
        accessorKey: 'created_by',
        header: 'Assessed By',
        cell: ({ row }) => {
            const name = row.original;
            // return name.last_name + ' ' + name.first_name;
            return `${name.last_name} ${name.first_name}`;
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Date',
        cell: ({ row }) => {
            return moment(row.getValue('created_at')).format('DD MMM YYYY');
        },
    },
    {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() =>
                                router.visit(
                                    route(
                                        'assessment.edit',
                                        row.original.assessment_id,
                                    ),
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

const Assessments = () => {
    return (
        <AuthenticatedLayout>
            <Head title="Assessments" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex items-center justify-between p-4 text-gray-900 dark:text-gray-100">
                        <div>
                            <span className="font-bold">Assessments </span>
                            <span> | All Assessments</span>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                variant={'primary'}
                                size={'sm'}
                                onClick={() =>
                                    router.visit(route('assessment.create'))
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
                                    endpoint="/all_assessments"
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

export default Assessments;
