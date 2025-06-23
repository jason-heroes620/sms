import StudentTable from '@/components/Tables/StudentTable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const Students = ({ students }: any) => {
    return (
        <AuthenticatedLayout>
            <Head title="Students" />

            <div className="px-4 py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4 text-gray-900 dark:text-gray-100">
                            <span className="font-bold">Students</span> | All
                            Students
                        </div>
                    </div>
                    <div className="mt-4">
                        <StudentTable students={students} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Students;
