import { DataTable } from '@/components/Datatables/data-table';
import EditSheet from '@/components/EditSheet';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import GradeForm from './GradeForm';

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
        header: 'Action',
        cell: ({ row }) => {
            const grades = row.original;
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
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault();
                                    handleEditClick(grades.grade_id);
                                }}
                            >
                                Edit
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <EditSheet
                        isSheetOpen={isSheetOpen}
                        setIsSheetOpen={setIsSheetOpen}
                    >
                        <GradeForm id={id} editable={editable} />
                    </EditSheet>
                </div>
            );
        },
    },
];

const Grades = () => {
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
                                        <GradeForm />
                                    </div>
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
