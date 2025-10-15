import { DataTable } from '@/components/Datatables/data-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { formattedNumber } from '@/utils/formatNumber';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { MoreHorizontal } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

type Package = {
    student_package_id: string;
    package_id: string;
    package_name: string;
    package_price: number;
    frequency: string;
    status: string;
};

export const columns: ColumnDef<Package>[] = [
    {
        accessorKey: 'package_name',
        header: 'Package Name',
        cell: ({ row }) => {
            return row.getValue('package_name') as string;
        },
    },
    {
        accessorKey: 'package_price',
        header: 'Package Price',
        cell: ({ row }) => {
            const price = formattedNumber(row.getValue('package_price'));
            return price;
        },
    },
    {
        accessorKey: 'frequency',
        header: 'Frequency',
        cell: ({ row }) => {
            const frequency = row.getValue('frequency') as string;
            return frequency.toUpperCase();
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return status.toUpperCase();
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
                            disabled={student.status === 'inactive'}
                            onClick={() =>
                                axios
                                    .put(
                                        route(
                                            'student.packages.update',
                                            student.student_package_id,
                                        ),
                                        {
                                            status: 'inactive',
                                        },
                                    )
                                    .then((resp) => {
                                        if (resp.status === 200) {
                                            toast.success('Successful', {
                                                description: resp.data.success,
                                            });
                                            router.reload();
                                        } else {
                                            toast.error('Error', {
                                                description: resp.data.error,
                                            });
                                        }
                                    })
                            }
                        >
                            Set Inactive
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const PackageForm = ({ student_id }: { student_id: string }) => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

    useEffect(() => {
        axios.get(route('student.packages.index', student_id)).then((res) => {
            setPackages(res.data.packages);
        });
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        axios
            .post(route('student.packages.store'), {
                student_id: student_id,
                package_id: selectedPackage,
            })
            .then((res) => {
                if (res.status === 200) {
                    toast.success('Package added successfully');
                    setSelectedPackage(null);
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message);
            });
    };

    return (
        <div className="py-4">
            <div className="mb-4 rounded-md border px-4 py-4">
                <div className="mb-4">
                    <label
                        htmlFor="first_name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Packages{' '}
                        <span className="font-bold text-red-800">*</span>
                    </label>
                    <Select
                        onValueChange={(value) => {
                            setSelectedPackage(value);
                        }}
                        required
                    >
                        <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                            <SelectValue placeholder="Select Package" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {packages?.map((p: Package) => {
                                    return (
                                        <SelectItem
                                            key={`${p.package_id}`}
                                            value={`${p.package_id}`}
                                        >
                                            {`${p.package_name}`}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        variant={'primary'}
                    >
                        Add Package
                    </Button>
                </div>
            </div>
            <div className="flex w-full flex-col rounded-md border px-4 py-4">
                <h2 className="text-lg font-bold">Subscribed Packages</h2>

                <div className="flex w-full flex-col gap-4 overflow-auto">
                    <DataTable
                        columns={columns}
                        endpoint={`/student_packages/${student_id}`}
                        options={{
                            showSearch: false,
                            showFilters: true,
                            showPagination: true,
                            defaultPageSize: 10,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PackageForm;
