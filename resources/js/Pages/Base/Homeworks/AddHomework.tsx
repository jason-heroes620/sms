import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BranchType, Classes } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CircleChevronLeft } from 'lucide-react';
import moment from 'moment';
import { FormEvent } from 'react';
import { toast } from 'sonner';
import HomeworkForm from './HomeworkForm';

const AddHomework = ({
    branches,
    classes,
}: {
    branches: BranchType[];
    classes: Classes[];
}) => {
    const { data, setData, post, processing, errors } = useForm({
        homework_description: '',
        homework_date: moment().format('YYYY-MM-DD'),
        class_id: '',
        subject_id: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('homework.store'), {
            onSuccess: () => {
                toast.success('Homework added successfully.');
            },
            onError: () => {
                toast.error('Failed to add homework.');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Exam" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <CircleChevronLeft
                            color={'#F06F40'}
                            className="cursor-pointer"
                            onClick={() =>
                                router.visit(route('homeworks.index'))
                            }
                        />
                        <div>
                            <span className="font-bold">Homework</span>
                            <span> | Add Homework</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4">
                            <HomeworkForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                handleSubmit={handleSubmit}
                                branches={branches}
                                classes={classes}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AddHomework;
