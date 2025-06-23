import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const AddClass = () => {
    return (
        <AuthenticatedLayout>
            <Head title="Add Class" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4 text-gray-900 dark:text-gray-100">
                            <span className="font-bold">Class</span> | Add Class
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

export default AddClass;
