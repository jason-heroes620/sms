import { DataTable } from '@/components/Datatables/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import moment from 'moment';

type Branch = {
    branch_id: string;
    branch_name: string;
};

type Invoices = {
    invoice_id: string;
    class_name: string;
    invoice_no: string;
    student_name: string;
    invoice_date: string;
    invoice_amount: number;
    invoice_status: string;
};

export const columns: ColumnDef<Invoices>[] = [
    {
        accessorKey: 'class_name',
        header: 'Class Name',
        cell: ({ row }) => {
            return row.getValue('class_name') as string;
        },
    },
    {
        accessorKey: 'invoice_no',
        header: 'Invoice No',
        cell: ({ row }) => {
            return row.getValue('invoice_no') as string;
        },
    },
    {
        accessorKey: 'invoice_date',
        header: 'Invoice Date',
        cell: ({ row }) => {
            const invoice = row.original;
            return moment(invoice.invoice_date).format('MMM');
        },
    },
    {
        accessorKey: 'student_name',
        header: 'Student Name',
        cell: ({ row }) => {
            return row.getValue('student_name') as string;
        },
    },
    {
        accessorKey: 'invoice_amount',
        header: 'Amount',
        cell: ({ row }) => {
            return row.getValue('invoice_amount') as number;
        },
    },
    {
        accessorKey: 'invoice_status',
        header: 'Status',
        cell: ({ row }) => {
            const invoice = row.original;
            return (
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        invoice.invoice_status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}
                >
                    {invoice.invoice_status.toUpperCase()}
                </span>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const invoice = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() =>
                                router.visit(
                                    route('invoices.edit', invoice.invoice_id),
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

const Invoices = ({ branches }: { branches: Branch[] }) => {
    const filterConfig = [
        {
            key: 'branch_id',
            label: 'Branch',
            options: branches,
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Invoices" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex items-center justify-between p-4 text-gray-900 dark:text-gray-100">
                        <div>
                            <span className="font-bold">Invoices </span>
                            <span> | All Invoices</span>
                        </div>
                        {/* <div className="flex justify-end">
                            <Button
                                variant={'primary'}
                                size={'sm'}
                                onClick={() =>
                                    router.visit(route('invoices.create'))
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
                            <div className="py-2">
                                <DataTable
                                    columns={columns}
                                    endpoint="/all_invoices"
                                    options={{
                                        showSearch: true,
                                        showFilters: false,
                                        showPagination: true,
                                        defaultPageSize: 10,
                                    }}
                                    filterConfig={filterConfig}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Invoices;
