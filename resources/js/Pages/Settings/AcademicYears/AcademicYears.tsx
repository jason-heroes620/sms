// import AcademicYearTable from '@/components/Tables/AcademicYearTable';
import { DataTable } from '@/components/Datatables/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { CalendarIcon, MoreHorizontal } from 'lucide-react';
import moment from 'moment';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

type AcademicYear = {
    academic_year_id: string;
    academic_year: string;
    start_date: Date;
    end_date: Date;
    is_current: string;
};

export const columns: ColumnDef<AcademicYear>[] = [
    {
        accessorKey: 'academic_year',
        header: 'Academic Year',
        cell: ({ row }) => {
            return row.getValue('academic_year') as string;
        },
    },
    {
        accessorKey: 'start_date',
        header: 'Start Date',
        cell: ({ row }) => {
            return moment(row.getValue('start_date') as string).format(
                'DD MMM YYYY',
            );
        },
    },
    {
        accessorKey: 'end_date',
        header: 'End Date',
        cell: ({ row }) => {
            return moment(row.getValue('end_date') as string).format(
                'DD MMM YYYY',
            );
        },
    },
    {
        accessorKey: 'is_current',
        header: 'Current',
        cell: ({ row }) => {
            const is_current = row.getValue('is_current') as string;
            return is_current === 'true' ? (
                <Badge variant="outline" className="bg-green-200">
                    Current
                </Badge>
            ) : (
                ''
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const academic_year = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() =>
                                console.log(academic_year.academic_year_id)
                            }
                        >
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={academic_year.is_current == 'true'}
                            onClick={() =>
                                axios
                                    .put(
                                        route(
                                            'academic-year.updateIsCurrent',
                                            academic_year.academic_year_id,
                                        ),
                                    )
                                    .then((resp) => {
                                        if (resp.status === 200) {
                                            console.log(resp);
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
                            Set As Current
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const AcademicYears = () => {
    const { data, setData, processing, errors, post } = useForm<{
        academic_year: string;
        start_date: string | undefined;
        end_date: string | undefined;
        is_current: boolean;
    }>({
        academic_year: '',
        start_date: '',
        end_date: '',
        is_current: false,
    });

    const [startDateOpen, setStartDateOpen] = useState(false);
    const [endDateOpen, setEndDateOpen] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('academic-year.store'), {
            preserveState: true,
            onSuccess: () => {
                toast.success('New Academic Year Saved.');
            },
            onError: (error) => {
                toast.error('Error saving new academic year.');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Academic Years" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex justify-between gap-4 p-4">
                        <div>
                            <span className="font-bold">Settings </span>
                            <span>| Academic Years</span>
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
                                            htmlFor="academic_year"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Academic Year{' '}
                                            <span className="text-red-800">
                                                *
                                            </span>
                                        </label>
                                        <Input
                                            className="mt-1"
                                            maxLength={30}
                                            onChange={(e) =>
                                                setData(
                                                    'academic_year',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        {errors.academic_year && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.academic_year}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4 flex flex-col">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Start Date{' '}
                                            <span className="text-red-800">
                                                *
                                            </span>
                                        </label>
                                        <div className="mt-1">
                                            <Popover
                                                open={startDateOpen}
                                                onOpenChange={setStartDateOpen}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        id="date"
                                                        className="w-full justify-start font-normal"
                                                    >
                                                        <CalendarIcon />
                                                        {data.start_date
                                                            ? moment(
                                                                  data.start_date,
                                                              ).format(
                                                                  'DD MMM YYYY',
                                                              )
                                                            : 'Pcik a date'}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-60 overflow-hidden p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        captionLayout="dropdown"
                                                        startMonth={moment()
                                                            .subtract(
                                                                2,
                                                                'years',
                                                            )
                                                            .toDate()}
                                                        endMonth={moment()
                                                            .add(2, 'years')
                                                            .toDate()}
                                                        selected={moment(
                                                            data.start_date,
                                                        ).toDate()}
                                                        onSelect={(date) => {
                                                            setData(
                                                                'start_date',
                                                                moment(
                                                                    date,
                                                                ).format(
                                                                    'YYYY-MM-DD',
                                                                ),
                                                            );
                                                            setStartDateOpen(
                                                                false,
                                                            );
                                                        }}
                                                        required
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {errors.start_date && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                    {errors.start_date}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mb-4 flex flex-col">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            End Date{' '}
                                            <span className="text-red-800">
                                                *
                                            </span>
                                        </label>
                                        <div className="mt-1">
                                            <Popover
                                                open={endDateOpen}
                                                onOpenChange={setEndDateOpen}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        id="date"
                                                        className="data-[empty=true]:text-muted-foreground w-full justify-start font-normal"
                                                    >
                                                        <CalendarIcon />
                                                        {data.end_date
                                                            ? moment(
                                                                  data.end_date,
                                                              ).format(
                                                                  'DD MMM YYYY',
                                                              )
                                                            : 'Pick a date'}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-60 overflow-hidden p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        captionLayout="dropdown"
                                                        selected={moment(
                                                            data.end_date,
                                                        ).toDate()}
                                                        onSelect={(date) => {
                                                            setData(
                                                                'end_date',
                                                                moment(
                                                                    date,
                                                                ).format(
                                                                    'YYYY-MM-DD',
                                                                ),
                                                            );
                                                            setEndDateOpen(
                                                                false,
                                                            );
                                                        }}
                                                        startMonth={moment()
                                                            .subtract(
                                                                2,
                                                                'years',
                                                            )
                                                            .toDate()}
                                                        endMonth={moment()
                                                            .add(2, 'years')
                                                            .toDate()}
                                                        required
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {errors.end_date && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                    {errors.end_date}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Switch
                                            onCheckedChange={(value) =>
                                                setData('is_current', value)
                                            }
                                        />
                                        <label className="pl-2">
                                            Set As Current
                                        </label>
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
                                    endpoint="/academic_years"
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

export default AcademicYears;
