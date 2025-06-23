import SubjectTable from '@/components/Tables/SubjectTable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const Subjects = ({ subjects }: any) => {
    return (
        <AuthenticatedLayout>
            <Head title="Subjects" />

            <div className="px-4 py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4 text-gray-900 dark:text-gray-100">
                            <span className="font-bold">Subjects</span> | All
                            Subjects
                        </div>
                    </div>
                    <div>
                        <div className="mt-4">
                            {/* SubjectTable component can be added here */}
                            <SubjectTable subjects={subjects} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Subjects;
