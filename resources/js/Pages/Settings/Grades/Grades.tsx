import { DataTable } from '@/components/Datatables/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';

type Grade = {
    grade_id: string;
    grade_name: string;
    grade_remark: string;
    min_mark: number;
    max_mark: number;
    grade_order: number;
};

export const columns: ColumnDef<Grade>[] = [
    {
        accessorKey: 'grade_name',
        header: 'Grade Name',
        cell: ({ row }) => {
            return row.getValue('grade_name') as string;
        },
    },

    {
        accessorKey: 'mark',
        header: 'Mark',
        cell: ({ row }) => {
            const marks = row.original;
            return marks.min_mark + ' - ' + marks.max_mark;
        },
    },
    {
        accessorKey: 'grade_remark',
        header: 'Remark',
        cell: ({ row }) => {
            return row.getValue('grade_remark') as string;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const grade = row.original;

            return (
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger className="cursor-pointer">
                            <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                className="h-[16px] w-[20px]"
                                onClick={() =>
                                    toast.info(
                                        `Edit functionality for ${grade.grade_name} is not implemented yet.`,
                                    )
                                }
                            >
                                <Pencil color={'#F06F40'} size={2} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger className="cursor-pointer">
                            <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                className="h-[16px] w-[20px]"
                                onClick={() =>
                                    toast.error(
                                        `Delete functionality for ${grade.grade_name} is not implemented yet.`,
                                    )
                                }
                            >
                                <Trash color={'red'} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                </div>
            );
        },
    },
];

const Grades = () => {
    const { data, setData, post, errors, processing } = useForm({
        gradeName: '',
        gradeRemark: '',
        minMark: 0,
        maxMark: 0,
        gradeOrder: 1,
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        post(route('grade.store'), {
            onSuccess: () => {
                setData({
                    gradeName: '',
                    gradeRemark: '',
                    minMark: 0,
                    maxMark: 0,
                    gradeOrder: 1,
                });
                // Handle success, e.g., show a success message or redirect
                toast.success('Grade added successfully!', {
                    description: 'The grade has been added to the system.',
                });
            },
            onError: (errors) => {
                // Handle errors, e.g., show an error message
                toast.error('Failed to add grade.', {
                    description: 'Please check the form for errors.',
                });
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Grades" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <div>
                            <span className="font-bold">Settings </span>
                            <span>| Grades </span>
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
                                            Add New Grade
                                        </span>
                                        <hr />
                                    </div>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="py-4"
                                    >
                                        <div className="mb-4">
                                            <label
                                                htmlFor="gradeName"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Grade Name{' '}
                                                <span className="text-red-800">
                                                    *
                                                </span>
                                            </label>
                                            <Input
                                                type="text"
                                                id="gradeName"
                                                name="gradeName"
                                                value={data.gradeName}
                                                onChange={(e) =>
                                                    setData(
                                                        'gradeName',
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                                required
                                            />
                                            {errors.gradeName && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors.gradeName}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <label
                                                htmlFor="minMark"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Minimum Mark{' '}
                                                <span className="text-red-800">
                                                    *
                                                </span>
                                            </label>
                                            <Input
                                                type="number"
                                                id="minMark"
                                                name="minMark"
                                                value={data.minMark}
                                                min={0}
                                                max={100}
                                                onChange={(e) =>
                                                    setData(
                                                        'minMark',
                                                        parseInt(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                                required
                                            />
                                            {errors.minMark && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors.minMark}
                                                </p>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                htmlFor="maxMark"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Maximum Mark{' '}
                                                <span className="text-red-800">
                                                    *
                                                </span>
                                            </label>
                                            <Input
                                                type="number"
                                                id="maxMark"
                                                name="maxMark"
                                                value={data.maxMark}
                                                min={0}
                                                max={100}
                                                onChange={(e) =>
                                                    setData(
                                                        'maxMark',
                                                        parseInt(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                                required
                                            />
                                            {errors.maxMark && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors.maxMark}
                                                </p>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                htmlFor="gradeRemark"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Grade Remark{' '}
                                                <span className="text-red-800">
                                                    *
                                                </span>
                                            </label>
                                            <Input
                                                type="text"
                                                id="gradeRemark"
                                                name="gradeRemark"
                                                value={data.gradeRemark}
                                                onChange={(e) =>
                                                    setData(
                                                        'gradeRemark',
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                                required
                                            />
                                            {errors.gradeRemark && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors.gradeRemark}
                                                </p>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                htmlFor="gradeOrder"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Grade Order{' '}
                                                <span className="text-red-800">
                                                    *
                                                </span>
                                            </label>
                                            <Input
                                                type="number"
                                                id="gradeOrder"
                                                name="gradeOrder"
                                                value={data.gradeOrder}
                                                min={1}
                                                max={100}
                                                onChange={(e) =>
                                                    setData(
                                                        'gradeOrder',
                                                        parseInt(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                                required
                                            />
                                            {errors.gradeOrder && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors.gradeOrder}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex justify-end py-4">
                                            <Button
                                                type="submit"
                                                size={'sm'}
                                                variant={'primary'}
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Saving ...'
                                                    : 'Add'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <DataTable
                                    columns={columns}
                                    endpoint="/grades/showAll"
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

export default Grades;
