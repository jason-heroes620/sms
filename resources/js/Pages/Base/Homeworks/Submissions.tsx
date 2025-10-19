import { DataTable } from '@/components/Datatables/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import moment from 'moment';

type Homework = {
    homework_id: string;
    homework_date: string;
    class_name: string;
    section_name: string;
    subject_name: string;
};

type Submission = {
    submission_id: string;
    homework_id: string;
    homework_description: string;
    homework_date: string;
    class_name: string;
    section_name: string;
    subject_name: string;
    submissions: string;
    last_name: string;
    first_name: string;
};

export const columns: ColumnDef<Submission>[] = [
    {
        accessorKey: 'student',
        header: 'Student',
        cell: ({ row }) => {
            const homework = row.original;
            return `${homework.class_name} - ${homework.section_name}`;
        },
    },
    {
        accessorKey: 'submission_date',
        header: 'Submission Date',
        cell: ({ row }) => {
            return row.getValue('subject_name') as string;
        },
    },
    {
        accessorKey: 'comments',
        header: 'Comments',
        cell: ({ row }) => {
            return moment(row.getValue('homework_date') as string).format('LL');
        },
    },
    {
        accessorKey: 'marks',
        header: 'Marks',
        cell: ({ row }) => {
            const name = row.original;

            return `${name.last_name} ${name.first_name}`;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const submission = row.original;

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
                                        'submissions.edit',
                                        submission.submission_id,
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

const Submissions = ({ homework }: { homework: Homework }) => {
    return (
        <AuthenticatedLayout>
            <Head title="Submissions" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex items-center justify-between p-4 text-gray-900 dark:text-gray-100">
                        <div>
                            <span className="font-bold">Submissions </span>
                            <span></span>
                        </div>
                        {/* <div className="flex justify-end">
                            <Button
                                variant={'primary'}
                                size={'sm'}
                                onClick={() =>
                                    router.visit(route('homeworks.index'))
                                }
                            >
                                <Plus />
                                Create
                            </Button>
                        </div> */}
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4 text-gray-900 dark:text-gray-100">
                            <div className="py-4">
                                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Homework Date
                                        </Label>
                                        <Input
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={moment(
                                                homework.homework_date,
                                            ).format('LL')}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Class
                                        </Label>
                                        <Input
                                            value={homework.class_name}
                                            disabled
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        ></Input>
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Section
                                        </Label>
                                        <Input
                                            value={homework.section_name}
                                            disabled
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        ></Input>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Subject
                                        </Label>
                                        <Input
                                            value={homework.subject_name}
                                            disabled
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        ></Input>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <hr />
                            </div>
                            <div className="py-4">
                                <DataTable
                                    columns={columns}
                                    endpoint={`/homework-submissions/showAll/${homework.homework_id}`}
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

export default Submissions;
