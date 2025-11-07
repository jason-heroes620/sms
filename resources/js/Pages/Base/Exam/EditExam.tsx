import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BranchType, Classes } from '@/types';
import { Head, router } from '@inertiajs/react';

import { CircleChevronLeft } from 'lucide-react';
import ExamForm from './ExamForm';

const EditExam = ({
    branches,
    classes,
    exam,
}: {
    branches: BranchType[];
    classes: Classes[];
    exam: any;
}) => {
    return (
        <AuthenticatedLayout>
            <Head title="Add Exam" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <CircleChevronLeft
                            color={'#F06F40'}
                            className="cursor-pointer"
                            onClick={() => router.visit(route('exam.index'))}
                        />
                        <div>
                            <span className="font-bold">Exam</span>
                            <span> | View Exam</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4">
                            <ExamForm
                                branches={branches}
                                classes={classes}
                                exam={exam}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditExam;
