import { DataTable } from '@/components/Datatables/data-table';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';

type Student = {
    student_id: string;
    last_name: string;
    first_name: string;
    gender: string;
    class: string;
    attendance: string;
};

type Class = {
    class_id: string;
    class_name: string;
};

export const columns: ColumnDef<Student>[] = [
    {
        accessorKey: 'last_name',
        header: 'Last Name',
        cell: ({ row }) => {
            return row.getValue('last_name') as string;
        },
    },
    {
        accessorKey: 'first_name',
        header: 'First Name',
        cell: ({ row }) => {
            return row.getValue('first_name') as string;
        },
    },
    {
        accessorKey: 'class_name',
        header: 'Class',
        cell: ({ row }) => {
            return row.getValue('class_name') as string;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const student = row.original;

            const handleChange = (studentId: string, value: string) =>
                axios.post(route('attendance.update'), {
                    student_id: studentId,
                    attendance: value,
                });

            return (
                <RadioGroup
                    className="flex flex-row"
                    defaultValue={student.attendance || ''}
                    onValueChange={(value) =>
                        handleChange(student.student_id, value)
                    }
                >
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="p" id="r1" />
                        <Label htmlFor="r1">Present</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="a" id="r2" />
                        <Label htmlFor="r2">Absent</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="l" id="r3" />
                        <Label htmlFor="r3">On Leave</Label>
                    </div>
                </RadioGroup>
            );
        },
    },
];

const Attendance = ({ classes }: { classes: Class[] }) => {
    const filterConfig = [
        {
            key: 'class_id',
            label: 'Class',
            options: classes,
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Students" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <div>
                            <span className="font-bold">Student </span>
                            <span>| Attendance</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4 text-gray-900 dark:text-gray-100">
                            <div className="py-2">
                                {/* <AcademicYearTable academicYears={academicYears} /> */}
                                {/* <DataTableToolbar
                                                table={table}
                                                filters={filters}
                                                searchableFields={searchableFields}
                                                onSearchChange={handleSearchChange}
                                            /> */}

                                <DataTable
                                    columns={columns}
                                    endpoint="/all_students"
                                    options={{
                                        showSearch: true,
                                        showFilters: true,
                                        showPagination: true,
                                        defaultPageSize: 20,
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

export default Attendance;
