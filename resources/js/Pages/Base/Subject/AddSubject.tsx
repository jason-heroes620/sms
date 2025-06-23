import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const AddSubject = () => {
    return (
        <AuthenticatedLayout>
            <Head title="Students" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4 text-gray-900 dark:text-gray-100">
                            <span className="font-bold">Subject</span> | Add
                            Subject
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8"></div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AddSubject;
