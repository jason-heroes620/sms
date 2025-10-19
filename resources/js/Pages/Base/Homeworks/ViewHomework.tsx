import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BranchType, Classes } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CircleChevronLeft } from 'lucide-react';
import { FormEvent } from 'react';
import { toast } from 'sonner';
import HomeworkForm from './HomeworkForm';

const ViewHomework = ({
    branch,
    homework,
    branches,
    classes,
}: {
    branch: BranchType;
    homework: any;
    branches: BranchType[];
    classes: Classes[];
}) => {
    const { data, setData, errors, processing, put } = useForm({
        homework_description: homework?.homework_description,
        homework_date: homework?.homework_date,
        subject_id: homework?.subject_id,
        class_id: homework?.class_id,
        section_id: homework?.section_id,
        branch_id: branch.branch_id,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('homework.update', homework.homework_id), {
            onSuccess: () => {
                toast.success('Homework updated successfully');
            },
            onError: (error) => {
                toast.error('Failed to update homework');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="View Homework" />
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
                            <span> | View Homework</span>
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

export default ViewHomework;
