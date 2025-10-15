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

type Homework = {
    homework_id: string;
    homework_name: string;
    homework_date: Date;
    class_name: string;
    subject_name: string;
    first_name: string;
    last_name: string;
};

export const columns: ColumnDef<Homework>[] = [
    {
        accessorKey: 'homework_date',
        header: 'Homework Date',
        cell: ({ row }) => {
            return moment(row.getValue('homework_date')).format('DD MMM YYYY');
        },
    },
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
        accessorKey: 'created_by',
        header: 'Created By',
        cell: ({ row }) => {
            const name = row.original;

            return `${name.last_name} ${name.first_name}`;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const homework = row.original;

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
                                        'homework.edit',
                                        homework.homework_id,
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

const Homeworks = () => {
    return (
        <AuthenticatedLayout>
            <Head title="Exams" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex items-center justify-between p-4 text-gray-900 dark:text-gray-100">
                        <div>
                            <span className="font-bold">Homeworks </span>
                            <span> | All Homeworks</span>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                variant={'primary'}
                                size={'sm'}
                                onClick={() =>
                                    router.visit(route('homework.create'))
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
                                    endpoint="/all_homeworks"
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

export default Homeworks;
