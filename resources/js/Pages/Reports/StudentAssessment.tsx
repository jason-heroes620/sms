import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const StudentAssessment = () => {
    return (
        <AuthenticatedLayout>
            <Head title="Student Assessment Report" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex items-center p-4 text-gray-900 dark:text-gray-100">
                        <div>
                            <span className="font-bold">
                                Student Assessment Report{' '}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="px-4 py-4"></div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default StudentAssessment;
