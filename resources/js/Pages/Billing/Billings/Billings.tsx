import { DataTable } from '@/components/Datatables/data-table';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import moment from 'moment';
import { toast } from 'sonner';

type Billing = {
    billing_id: string;
    billing_month: number;
    billing_year: number;
    billing_status: string;
    created_by: string;
    last_name: string;
    first_name: string;
    created_at: string;
};

const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
];

export const columns: ColumnDef<Billing>[] = [
    {
        accessorKey: 'billing_month',
        header: 'Month',
        cell: ({ row }) => {
            const m = moment(row.original.billing_month);
            return months.find((m) => m.value === row.original.billing_month)
                ?.label;
        },
    },
    {
        accessorKey: 'billing_year',
        header: 'Year',
        cell: ({ row }) => {
            return row.getValue('billing_year') as string;
        },
    },
    {
        accessorKey: 'created_by',
        header: 'Created By',
        cell: ({ row }) => {
            const name = `${row.original.first_name}, ${row.original.last_name}`;
            return name;
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Created',
        cell: ({ row }) => {
            const date = moment(row.original.created_at).format('DD MMM YYYY');
            return date;
        },
    },
    {
        accessorKey: 'billing_status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original;
            return `${status.billing_status.toUpperCase()}`;
        },
    },
    // {
    //     id: 'actions',
    //     cell: ({ row }) => {
    //         const billing = row.original;

    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger>
    //                     <MoreHorizontal />
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end">
    //                     <DropdownMenuItem
    //                         onClick={() =>
    //                             router.visit(
    //                                 route('billing.edit', billing.billing_id),
    //                             )
    //                         }
    //                     >
    //                         Edit
    //                     </DropdownMenuItem>
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         );
    //     },
    // },
];

const Billings = () => {
    const { data, setData, post, processing, errors } = useForm({
        billing_month: new Date().getMonth() + 1,
        billing_year: new Date().getFullYear(),
        billing_type: 'monthly',
    });
    const years = [new Date().getFullYear(), new Date().getFullYear() + 1];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('billings.store'), {
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Billing generated successfully!',
                });
            },
            onError: () => {
                toast.error('Error', {
                    description: 'Error while generating billing!',
                });
                console.log('error');
            },
        });
    };
    return (
        <AuthenticatedLayout>
            <Head title="Billings" />

            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex items-center justify-between p-4 text-gray-900 dark:text-gray-100">
                        <div>
                            <span className="font-bold">Billings </span>
                            <span> | All Billings</span>
                        </div>
                        <div className="flex justify-end">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant={'primary'}
                                        size={'sm'}
                                        type={'button'}
                                    >
                                        <Plus />
                                        Create
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Generate Billling
                                        </DialogTitle>
                                        <DialogDescription></DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="">
                                                <label
                                                    htmlFor="month"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Month{' '}
                                                    <span className="font-bold text-red-800">
                                                        *
                                                    </span>
                                                </label>
                                                <Select
                                                    value={data.billing_month.toString()}
                                                    onValueChange={(value) =>
                                                        setData(
                                                            'billing_month',
                                                            parseInt(value),
                                                        )
                                                    }
                                                    required
                                                >
                                                    <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                                        <SelectValue placeholder="Select Month" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {months?.map(
                                                                (m) => {
                                                                    return (
                                                                        <SelectItem
                                                                            key={
                                                                                m.value
                                                                            }
                                                                            value={m.value.toString()}
                                                                        >
                                                                            {
                                                                                m.label
                                                                            }
                                                                        </SelectItem>
                                                                    );
                                                                },
                                                            )}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="">
                                                <label
                                                    htmlFor="year"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Year{' '}
                                                    <span className="font-bold text-red-800">
                                                        *
                                                    </span>
                                                </label>
                                                <Select
                                                    value={data.billing_year.toString()}
                                                    onValueChange={(value) => {
                                                        setData(
                                                            'billing_year',
                                                            parseInt(value),
                                                        );
                                                    }}
                                                    required
                                                >
                                                    <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                                        <SelectValue placeholder="Select Year" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {years?.map((m) => {
                                                                return (
                                                                    <SelectItem
                                                                        key={m}
                                                                        value={m.toString()}
                                                                    >
                                                                        {m}
                                                                    </SelectItem>
                                                                );
                                                            })}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="">
                                                <label
                                                    htmlFor="Billing Type"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Billing Type{' '}
                                                    <span className="font-bold text-red-800">
                                                        *
                                                    </span>
                                                </label>
                                                <Select
                                                    value={data.billing_type}
                                                    onValueChange={(value) => {
                                                        setData(
                                                            'billing_type',
                                                            value,
                                                        );
                                                    }}
                                                    required
                                                >
                                                    <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                                        <SelectValue placeholder="Select Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem
                                                                key={'monthly'}
                                                                value={
                                                                    'monthly'
                                                                }
                                                            >
                                                                {'MONTHLY'}
                                                            </SelectItem>
                                                            <SelectItem
                                                                key={'annual'}
                                                                value={'annual'}
                                                            >
                                                                {'ANNUAL'}
                                                            </SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button
                                                    type="submit"
                                                    variant="primary"
                                                    size={'sm'}
                                                    disabled={processing}
                                                >
                                                    {processing
                                                        ? 'Processing...'
                                                        : 'Generate'}
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4 text-gray-900 dark:text-gray-100">
                            <div className="py-2">
                                <DataTable
                                    columns={columns}
                                    endpoint="/billings/showAll"
                                    options={{
                                        showSearch: true,
                                        showFilters: true,
                                        showPagination: true,
                                        defaultPageSize: 10,
                                    }}
                                    // filterConfig={filterConfig}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Billings;
