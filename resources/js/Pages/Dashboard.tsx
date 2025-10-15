import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { User } from 'lucide-react';
import moment from 'moment';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Label,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface RawDataEntry {
    total: string;
    month: string;
    label: 'paid' | 'unpaid';
}

// 2. Define the interface for the merged (transformed) data array
interface ChartDataEntry {
    month: string;
    paid_total: number;
    unpaid_total: number;
    partial_total: number;
}

export default function Dashboard({
    students,
    teachers,
    unpaidInvoices,
    paidInvoices,
    partialInvoices,
    income,
    birthdays,
}: {
    students: number;
    teachers: number;
    unpaidInvoices: any;
    paidInvoices: any;
    partialInvoices: any;
    income: any;
    birthdays: any;
}) {
    const transformData = (data: RawDataEntry[]): ChartDataEntry[] => {
        // Use a Map to group entries by month
        const groupedData = data.reduce((acc, item) => {
            // 1. Get the current or create a new entry for the month
            let entry = acc.get(item.month) || {
                month: item.month,
                paid_total: 0,
                unpaid_total: 0,
                partial_total: 0,
            };

            // 2. Convert string total to number and assign to the correct key
            const totalValue = parseFloat(item.total);

            if (item.label === 'paid') {
                entry.paid_total = totalValue;
            } else if (item.label === 'unpaid') {
                entry.unpaid_total = totalValue;
            } else if (item.label === 'partial') {
                entry.partial_total = totalValue;
            }

            // 3. Update the map
            acc.set(item.month, entry);
            return acc;
        }, new Map<string, ChartDataEntry>());

        // Convert the Map values back to an array
        return Array.from(groupedData.values());
    };

    const shortMonthOrder = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    let invoice = [...paidInvoices, ...unpaidInvoices, ...partialInvoices].sort(
        (a, b) => {
            const monthAIndex = shortMonthOrder.indexOf(a.month);
            const monthBIndex = shortMonthOrder.indexOf(b.month);
            return monthAIndex - monthBIndex;
        },
    );
    invoice = transformData(invoice);

    let incomes = [...income].sort((a, b) => {
        const monthAIndex = shortMonthOrder.indexOf(a.month);
        const monthBIndex = shortMonthOrder.indexOf(b.month);
        return monthAIndex - monthBIndex;
    });

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="bg-gray-100 py-4">
                <div className="mx-auto xl:px-8">
                    <div className="mb-4 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="grid grid-cols-1 gap-4 overflow-x-auto p-4 text-gray-900 md:grid-cols-3 lg:grid-cols-4 dark:text-gray-100">
                            <Card className="bg-gradient-to-r from-orange-500 to-orange-700 text-white opacity-80">
                                <CardHeader>
                                    <CardTitle>Total Students</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <User />
                                        <span className="text-lg font-bold">
                                            {students}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-r from-blue-600 to-blue-400 text-white opacity-80">
                                <CardHeader>
                                    <CardTitle>Total Teachers</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <User />
                                        <span className="text-lg font-bold">
                                            {teachers}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                            {/* <Card className="bg-gradient-to-r from-green-500 to-green-700 text-white opacity-80">
                                <CardHeader>
                                    <CardTitle>Revenue</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold">
                                            RM
                                        </span>
                                        <span className="text-2xl font-bold text-white">
                                            1
                                        </span>
                                    </div>
                                </CardContent>
                            </Card> */}
                        </div>
                    </div>
                    <div className="mb-4 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex w-full flex-col">
                                <div className="flex justify-center py-2">
                                    <p>Payments</p>
                                </div>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart
                                        width={500}
                                        height={300}
                                        data={invoice}
                                        margin={{
                                            top: 30,
                                            right: 30,
                                            left: 20,
                                            bottom: 10,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            // fill="orange"
                                            // fillOpacity={0.4}
                                        />
                                        <XAxis dataKey="month">
                                            <Label
                                                value="Months"
                                                offset={0}
                                                position="insideBottom"
                                                className="text-sm font-bold"
                                            />
                                        </XAxis>
                                        <YAxis>
                                            <Label
                                                value="Total (RM)"
                                                offset={16}
                                                position="top"
                                                className="text-sm font-bold"
                                            />
                                        </YAxis>
                                        <Tooltip
                                            formatter={(value: number) =>
                                                new Intl.NumberFormat(
                                                    'en',
                                                ).format(value)
                                            }
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="paid_total"
                                            stroke="#42A84A"
                                            name="Paid"
                                            activeDot={{ r: 6 }}
                                            className="text-sm font-bold"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="unpaid_total"
                                            stroke="#ED472B"
                                            name="Unpaid"
                                            activeDot={{ r: 6 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="partial_total"
                                            stroke="#E3910E"
                                            name="Partial"
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex w-full flex-col">
                                <div className="flex justify-center py-2">
                                    <p>Income</p>
                                </div>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart
                                        width={500}
                                        height={300}
                                        data={incomes}
                                        margin={{
                                            top: 30,
                                            right: 30,
                                            left: 20,
                                            bottom: 10,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            // fill="orange"
                                            // fillOpacity={0.4}
                                        />
                                        <XAxis dataKey="month">
                                            <Label
                                                value="Months"
                                                offset={0}
                                                position="insideBottom"
                                                className="text-sm font-bold"
                                            />
                                        </XAxis>
                                        <YAxis>
                                            <Label
                                                value="Total (RM)"
                                                offset={16}
                                                position="top"
                                                className="text-sm font-bold"
                                            />
                                        </YAxis>
                                        <Tooltip
                                            formatter={(value: number) =>
                                                new Intl.NumberFormat(
                                                    'en',
                                                ).format(value)
                                            }
                                        />
                                        <Legend />
                                        <Bar
                                            type="monotone"
                                            dataKey="total"
                                            fill="#42A84A"
                                            name="Income"
                                            className="text-sm font-bold"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="px-4 py-4">
                                <div className="flex justify-center py-2">
                                    <p className="text-sm font-bold">
                                        Upcoming Birthdays
                                    </p>
                                </div>
                                <div className="h-[300px]">
                                    <ScrollArea>
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-300">
                                                    <TableHead className="text-sm font-bold">
                                                        Name
                                                    </TableHead>
                                                    <TableHead className="text-sm font-bold">
                                                        Date
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {birthdays.map(
                                                    (birthday: any) => (
                                                        <TableRow
                                                            key={birthday.dob}
                                                        >
                                                            <TableCell className="">
                                                                {birthday.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {moment(
                                                                    birthday.dob,
                                                                ).format(
                                                                    'DD MMM',
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
