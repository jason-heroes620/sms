import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BranchType, Classes, Teacher } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CircleChevronLeft } from 'lucide-react';
import { FormEvent } from 'react';
import { toast } from 'sonner';
import SectionForm from './SectionForm';

const ViewSection = ({
    section,
    classes,
    branches,
    teachers,
}: {
    section: any;
    classes: Classes[];
    branches: BranchType[];
    teachers: Teacher[];
}) => {
    const { data, setData, put, errors, processing } = useForm({
        branch_id: section.branch_id,
        section_name: section.section_name,
        class_id: section.class_id,
        capacity: section.capacity,
        teacher_in_charge: section.teacher_in_charge,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        put(route('section.update', section.section_id), {
            onSuccess: () => {
                toast.success('Section added successfully');
            },
            onError: (error) => {
                toast.error('Failed to add section');
            },
        });
    };
    return (
        <AuthenticatedLayout>
            <Head title="View Section" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <CircleChevronLeft
                            color={'#F06F40'}
                            className="cursor-pointer"
                            onClick={() => router.visit(route('section.index'))}
                        />
                        <div>
                            <span className="font-bold">Section</span>
                            <span> | View Section</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4">
                            {/* Add your form or content for adding a class here */}
                            <SectionForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                handleSubmit={handleSubmit}
                                classes={classes}
                                branches={branches}
                                teachers={teachers}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ViewSection;
