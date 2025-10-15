import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { CircleChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import SubjectForm from './SubjectForm';

const AddSubject = () => {
    const { data, setData, post, processing, errors } = useForm({
        subject_name: '',
        subject_description: '',
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle form submission logic here
        post(route('subject.store'), {
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Subject added successfully.',
                });
                setData({
                    subject_name: '',
                    subject_description: '',
                });
                setTimeout(() => {
                    router.visit(route('subjects.index'));
                }, 2000);
            },
            onError: (errors) => {
                toast.error('Error', {
                    description: 'Failed to add subject.',
                });
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Subject" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <CircleChevronLeft
                            color={'#F06F40'}
                            className="cursor-pointer"
                            onClick={() =>
                                router.visit(route('subjects.index'))
                            }
                        />
                        <div>
                            <span className="font-bold">Subject</span>
                            <span> | Add Subject</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4">
                            <SubjectForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                handleSubmit={handleSubmit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AddSubject;
