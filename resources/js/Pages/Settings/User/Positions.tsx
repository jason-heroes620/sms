import { DataTable } from '@/components/Datatables/data-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { FormEvent } from 'react';
import { toast } from 'sonner';

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

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => console.log(position.position_id)}
                        >
                            Edit
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const Positions = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        position: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        post(route('position.store'), {
            onSuccess: () => {
                toast.success('Position added successfully');
            },
            onError: (error) => {
                toast.error('Failed to add position.' + error);
            },
            onFinish: () => reset('position'),
        });
    };
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
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4 flex flex-col">
                                        <label
                                            htmlFor="position"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Position{' '}
                                            <span className="text-red-800">
                                                *
                                            </span>
                                        </label>
                                        <Input
                                            className="mt-1"
                                            maxLength={50}
                                            value={data.position}
                                            onChange={(e) =>
                                                setData(
                                                    'position',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        {errors.position && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.position}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-end py-4">
                                        <Button
                                            type="submit"
                                            variant={'primary'}
                                            size={'sm'}
                                            disabled={processing}
                                        >
                                            {processing ? 'Saving ...' : 'Add'}
                                        </Button>
                                    </div>
                                </form>
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
