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

type Role = {
    id: number;
    name: string;
    role_status: string;
    created_by: string;
};

export const columns: ColumnDef<Role>[] = [
    {
        accessorKey: 'name',
        header: 'Role',
        cell: ({ row }) => {
            return (row.getValue('name') as string).toUpperCase();
        },
    },
    {
        accessorKey: 'created_by',
        header: 'Created By',
        cell: ({ row }) => {
            return row.getValue('created_by') as string;
        },
    },
    {
        accessorKey: 'role_status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original;
            return (
                <div className="flex items-center">
                    {status.role_status === 'active' ? (
                        <div className="rounded-md bg-green-600 px-2">
                            <span className="text-xs font-bold text-white">
                                Active
                            </span>
                        </div>
                    ) : (
                        <div className="rounded-md bg-red-600 px-2">
                            <span className="text-xs font-bold text-white">
                                Inactive
                            </span>
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const role = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            disabled={
                                role.created_by === 'system' ? true : false
                            }
                        >
                            Edit
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const Roles = () => {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('roles.store'), {
            onSuccess: () => {
                toast.success('Role added successfully');
            },
            onError: () => {
                toast.error('Failed to add role.');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Roles" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <div>
                            <span className="font-bold">Settings </span>
                            <span>| Role </span>
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
                                            Add New Role
                                        </span>
                                        <hr />
                                    </div>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="py-4"
                                    >
                                        <div className="mb-4">
                                            <label
                                                htmlFor="role_name"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Role{' '}
                                                <span className="text-red-800">
                                                    *
                                                </span>
                                            </label>
                                            <Input
                                                type="text"
                                                id="role_name"
                                                name="role_name"
                                                value={data.name.toUpperCase()}
                                                onChange={(e) =>
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                                required
                                            />
                                            {errors.name && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex justify-end py-4">
                                            <Button
                                                type="submit"
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
                                    endpoint="/roles/showAll"
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

export default Roles;
