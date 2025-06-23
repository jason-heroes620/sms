import ClassTable from '@/components/Tables/ClassTable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const Classes = ({ classes }: any) => {
    return (
        <AuthenticatedLayout>
            <Head title="Classes" />

            <div className="px-4 py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4 text-gray-900 dark:text-gray-100">
                            <span className="font-bold">Classes</span> | All
                            Classes
                        </div>
                    </div>
                    <div>
                        <div className="mt-4">
                            {/* ClassTable component can be added here */}
                            <ClassTable classes={classes} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Classes;
