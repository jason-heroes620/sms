import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { AcademicYear, BranchType } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CircleChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import ClassForm from './ClassForm';

const AddClass = ({
    academic_years,
    branches,
}: {
    academic_years: AcademicYear[];
    branches: BranchType[];
}) => {
    const { data, setData, post, errors, processing } = useForm({
        academic_year_id: academic_years
            ? academic_years.find((a: AcademicYear) => {
                  return a.is_current === 'true' ? a.academic_year_id : '';
              })?.academic_year_id
            : '',
        class_name: '',
        class_description: '',
        academic_year: '',
        branch_id: branches.length === 1 ? branches[0].branch_id : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('class.store'), {
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Class added successfully!',
                });
                setData({
                    academic_year_id: '',
                    class_name: '',
                    class_description: '',
                    academic_year: '',
                    branch_id: '',
                });
                setTimeout(function () {
                    router.visit(route('classes.index'));
                }, 2000);
            },
            onError: () => {
                // Handle error, e.g., show an error message
                toast.error('Error', {
                    description: 'Failed to add class.',
                });
            },
            preserveState: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Class" />
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
                            <span> | Add Class</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4">
                            {/* Add your form or content for adding a class here */}
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

export default AddClass;
