import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Classes } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CircleChevronLeft } from 'lucide-react';
import moment from 'moment';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

const EditAssessment = ({
    assessment,
    classes,
}: {
    assessment: {
        assessment_id: string;
        class_id: string;
        name: string;
        comments: string;
        assessment_date: string;
        assessed_by: string;
    };
    classes: Classes[];
}) => {
    const { data, setData, processing, put, errors } = useForm<{
        class_id: string;
        name: string;
        comments: string;
        assessment_date: string;
        assessed_by: string;
    }>({
        class_id: assessment.class_id || '',
        name: assessment.name || '',
        comments: assessment.comments || '',
        assessed_by: assessment.assessed_by || '',
        assessment_date: assessment.assessment_date || '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        put(route('assessment.update', assessment.assessment_id), {
            onSuccess: () => {
                toast.success('Assessment updated.');
                setTimeout(() => {
                    router.visit(route('assessments.index'));
                }, 2000);
            },
            onError: () => {
                toast.error('There was an error updating assessment.');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Assessment" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <CircleChevronLeft
                            color={'#F06F40'}
                            className="cursor-pointer"
                            onClick={() =>
                                router.visit(route('assessments.index'))
                            }
                        />
                        <div>
                            <span className="font-bold">Assessment</span>
                            <span> | View Assessment</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                                    <div className="mb-4">
                                        <label
                                            htmlFor="student_name"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Student Name
                                            <span className="text-red-800">
                                                {' '}
                                                *
                                            </span>
                                        </label>
                                        <div className="mt-1">
                                            <Input
                                                defaultValue={data.name}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="assessment_date"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Assesed On
                                            <span className="text-red-800">
                                                {' '}
                                                *
                                            </span>
                                        </label>
                                        <div className="mt-1">
                                            <Input
                                                defaultValue={moment(
                                                    data.assessment_date,
                                                ).format('DD MMM YYYY')}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                                    <div className="mb-4">
                                        <label
                                            htmlFor="assesed_by"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Assessed By
                                            <span className="text-red-800">
                                                {' '}
                                                *
                                            </span>
                                        </label>
                                        <div className="mt-1">
                                            <Input
                                                defaultValue={data.assessed_by}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="col-span-2 md:col-span-2">
                                        <label
                                            htmlFor=""
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Comments
                                        </label>
                                        <Textarea
                                            className="mt-1"
                                            rows={10}
                                            defaultValue={data.comments}
                                            onChange={(e) =>
                                                setData(
                                                    'comments',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end py-4">
                                    <Button
                                        type="submit"
                                        variant={'primary'}
                                        size={'sm'}
                                        disabled={processing}
                                    >
                                        {processing ? 'Saving ...' : 'Save'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditAssessment;
