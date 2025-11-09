import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { CircleChevronLeft } from 'lucide-react';
import moment from 'moment';

const Invoice = ({ invoice }: { invoice: any }) => {
    return (
        <AuthenticatedLayout>
            <Head title="Students" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <CircleChevronLeft
                            color={'#F06F40'}
                            className="cursor-pointer"
                            onClick={() =>
                                router.visit(route('invoices.index'))
                            }
                        />
                        <div>
                            <span className="font-bold">Invoices </span>
                            <span>| View Invoice</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                Student Name: {invoice.student_name}
                            </div>
                            <div className="flex flex-col gap-2">
                                Invoice No: {invoice.invoice_no}
                            </div>
                            <div>
                                <div className="flex flex-col gap-2">
                                    Invoice Date:{' '}
                                    {moment(invoice.invoice_date).format(
                                        'DD MMM YYYY',
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                Invoice Amount (RM): {invoice.invoice_amount}
                            </div>
                        </div>
                        <div className="p-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="">Item</TableHead>
                                        <TableHead>QTY</TableHead>
                                        <TableHead>UOM</TableHead>
                                        <TableHead className="text-right">
                                            Amount
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoice.fees.map((f) => (
                                        <TableRow key={f.fee_id}>
                                            <TableCell className="font-medium">
                                                {f.fee_label}
                                            </TableCell>
                                            <TableCell>{1}</TableCell>
                                            <TableCell>{f.uom}</TableCell>
                                            <TableCell className="text-right">
                                                {f.amount}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="py-8">
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant={'primary'}
                                onClick={() =>
                                    router.visit(route('invoices.index'))
                                }
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Invoice;
