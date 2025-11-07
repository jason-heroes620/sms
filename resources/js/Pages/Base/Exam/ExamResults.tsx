import { DataTable } from '@/components/Datatables/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import moment from 'moment';
import { FormEvent } from 'react';
import { toast } from 'sonner';

type Students = {
    student_id: string;
    student_name: string;
    class_name: string;
    section_name: string;
    marks: number;
    grade: string;
    comments: string;
};

export function PopoverDemo({ student_id, marks, comments }: any) {
    const parseIdFromPath = (path: any) => {
        const parts = path.split('/');
        return parts[parts.length - 1];
    };

    // In your Vue/React component:
    const pageId = parseIdFromPath(window.location.pathname);

    const { data, setData, put, processing, errors } = useForm({
        exam_id: pageId,
        marks: marks,
        comments: comments,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        axios
            .put(route('exam_results.update', student_id), data)
            .then((response) => {
                if (response.status === 200) {
                    toast.success('Comments updated.');
                    router.reload();
                } else {
                    toast.error('Error updating comments.');
                }
            });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size={'sm'}>
                    Comment
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-100">
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="leading-none font-medium">
                                Comment
                            </h4>
                        </div>
                        <div className="grid gap-2">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="width">Marks</Label>
                                <Input
                                    id="marks"
                                    defaultValue={marks}
                                    className="col-span-2 h-8"
                                    onChange={(e) =>
                                        setData('marks', e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="maxWidth">Comments</Label>
                                <Textarea
                                    id="maxWidth"
                                    defaultValue={comments}
                                    className="col-span-2 h-8"
                                    onChange={(e) =>
                                        setData('comments', e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                variant={'primary'}
                                size={'sm'}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
    );
}

const columns: ColumnDef<Students>[] = [
    {
        accessorKey: 'student_name',
        header: 'Student Name',
        cell: ({ row }) => {
            return row.getValue('student_name') as string;
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
        accessorKey: 'marks',
        header: 'Marks',
        cell: ({ row }) => {
            return row.getValue('marks') as number;
        },
    },
    {
        accessorKey: 'grade',
        header: 'Grade',
        cell: ({ row }) => {
            return row.getValue('grade') as string;
        },
    },
    {
        accessorKey: 'comments',
        header: 'Comments',
        cell: ({ row }) => {
            return row.getValue('comments') as string;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const results = row.original;

            return (
                <div>
                    <PopoverDemo
                        student_id={results.student_id}
                        marks={results.marks}
                        comments={results.comments}
                    />
                </div>
            );
        },
    },
];

const ExamResults = ({ exam }: { exam: any }) => {
    return (
        <AuthenticatedLayout>
            <Head title="ExamResults" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex items-center justify-between p-4 text-gray-900 dark:text-gray-100">
                        <div>
                            <span className="font-bold">Exam Results </span>
                            <span> | {exam.exam_name}</span>
                        </div>
                        <div className="flex justify-end">
                            {/* <Button
                                variant={'primary'}
                                size={'sm'}
                                onClick={() =>
                                    router.visit(route('exam_result.create'))
                                }
                            >
                                <Plus />
                                Create
                            </Button> */}
                        </div>
                    </div>
                </div>
                <div className="py-4">
                    <div className="mb-4 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4">
                            <div className="grid grid-cols-1 text-gray-900 md:grid-cols-3 md:gap-4 dark:text-gray-100">
                                <div className="py-2">
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Branch
                                        </Label>
                                        <Input
                                            defaultValue={exam.branch_name}
                                            disabled
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="py-2">
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Class
                                        </Label>
                                        <Input
                                            defaultValue={exam.class_name}
                                            disabled
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="py-2">
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Subject
                                        </Label>
                                        <Input
                                            defaultValue={exam.subject_name}
                                            disabled
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 text-gray-900 md:grid-cols-3 md:gap-4 dark:text-gray-100">
                                <div className="py-2">
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Start Date
                                        </Label>
                                        <Input
                                            defaultValue={moment(
                                                exam.start_date,
                                            ).format('DD MMM YYYY')}
                                            disabled
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="py-2">
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            End Date
                                        </Label>
                                        <Input
                                            defaultValue={moment(
                                                exam.end_date,
                                            ).format('DD MMM YYYY')}
                                            disabled
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4 text-gray-900 dark:text-gray-100">
                            <div className="py-2">
                                <DataTable
                                    columns={columns}
                                    endpoint={`/exam_results/${exam.exam_id}`}
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

export default ExamResults;
