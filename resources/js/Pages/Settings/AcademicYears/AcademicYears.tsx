import { DataTable } from '@/components/Datatables/data-table';
import { Badge } from '@/components/ui/badge';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import EditSheet from '@/components/EditSheet';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { MoreHorizontal } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';
import { toast } from 'sonner';
import AcademicYearForm from './AcademicYearForm';

type AcademicYear = {
    academic_year_id: string;
    academic_year: string;
    start_date: Date;
    end_date: Date;
    is_current: boolean;
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
            const is_current = row.getValue('is_current') as boolean;
            return is_current === true ? (
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

            const [id, setId] = useState('');
            const [isSheetOpen, setIsSheetOpen] = useState(false);
            const [isDropdownOpen, setIsDropdownOpen] = useState(false);
            const editable = [''];
            const handleEditClick = (id: string) => {
                setIsDropdownOpen(false);
                setIsSheetOpen(true);
                setId(id);
            };

            return (
                <div>
                    <DropdownMenu
                        open={isDropdownOpen}
                        onOpenChange={setIsDropdownOpen}
                    >
                        <DropdownMenuTrigger>
                            <MoreHorizontal />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() =>
                                    handleEditClick(
                                        academic_year.academic_year_id,
                                    )
                                }
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={academic_year.is_current}
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
                                                toast.success('Successful', {
                                                    description:
                                                        resp.data.success,
                                                });
                                                router.reload();
                                            } else {
                                                toast.error('Error', {
                                                    description:
                                                        resp.data.error,
                                                });
                                            }
                                        })
                                }
                            >
                                Set As Current
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <EditSheet
                        isSheetOpen={isSheetOpen}
                        setIsSheetOpen={setIsSheetOpen}
                    >
                        <AcademicYearForm id={id} editable={editable} />
                    </EditSheet>
                </div>
            );
        },
    },
];

const AcademicYears = () => {
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
                                <AcademicYearForm />
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
