import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { AcademicYear, BranchType, Classes } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CircleChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import ClassForm from './ClassForm';

const ViewClass = ({
    classes,
    academic_years,
    branches,
}: {
    classes: Classes;
    academic_years: AcademicYear[];
    branches: BranchType[];
}) => {
    const { data, setData, put, errors, processing } = useForm({
        academic_year_id: classes.academic_year_id,
        class_name: classes.class_name,
        class_description: classes.class_description,
        branch_id: classes.branch_id,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('class.update', classes.class_id), {
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Class updated successfully!',
                });

                setTimeout(function () {
                    router.visit(route('classes.index'));
                }, 2000);
            },
            onError: () => {
                toast.error('Error', {
                    description: 'Failed to update class.',
                });
            },
            preserveState: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="View Class" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <CircleChevronLeft
                            color={'#F06F40'}
                            className="cursor-pointer"
                            onClick={() => router.visit(route('class.index'))}
                        />
                        <div>
                            <span className="font-bold">Class</span>
                            <span> | View Class</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4">
                            <ClassForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                handleSubmit={handleSubmit}
                                branches={branches}
                                academic_years={academic_years}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ViewClass;
