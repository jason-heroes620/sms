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

type Exam = {
    exam_id: string;
    exam_name: string;
    exam_description: string;
    class_name: string;
    subject_name: string;
    start_date: string;
    end_date: string;
};

export const columns: ColumnDef<Exam>[] = [
    {
        accessorKey: 'exam_name',
        header: 'Exam Name',
        cell: ({ row }) => {
            return row.getValue('exam_name') as string;
        },
    },
    // {
    //     accessorKey: 'exam_description',
    //     header: 'Exam Description',
    //     cell: ({ row }) => {
    //         return row.getValue('exam_description') as string;
    //     },
    // },
    {
        accessorKey: 'class_name',
        header: 'Class',
        cell: ({ row }) => {
            return row.getValue('class_name') as string;
        },
    },
    {
        accessorKey: 'subject_name',
        header: 'Subject',
        cell: ({ row }) => {
            return row.getValue('subject_name') as string;
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
        id: 'actions',
        cell: ({ row }) => {
            const exam = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() =>
                                router.visit(route('exam.edit', exam.exam_id))
                            }
                        >
                            View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                router.visit(
                                    route('exam.results', exam.exam_id),
                                )
                            }
                        >
                            Results
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const Exams = () => {
    return (
        <AuthenticatedLayout>
            <Head title="Exams" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex items-center justify-between p-4 text-gray-900 dark:text-gray-100">
                        <div>
                            <span className="font-bold">Exams </span>
                            <span> | All Exams</span>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                variant={'primary'}
                                size={'sm'}
                                onClick={() =>
                                    router.visit(route('exam.create'))
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
                                    endpoint="/all_exams"
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

export default Exams;
