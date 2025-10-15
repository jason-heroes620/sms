import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { CircleChevronLeft } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import GuardianForm from './GuardianForm';
import PackageForm from './PackageForm';
import StudentForm from './StudentForm';

interface Parent {
    guardian_id: string; // Unique ID for React list keying and easy removal
    first_name: string;
    last_name: string;
    contact_no: string;
    email: string;
    occupation: string;
    relationship: string;
    [key: string]: string; // Add index signature for compatibility with FormDataConvertible
}

const EditStudent = ({
    student,
    existingParents,
    relationships,
    classes,
}: any) => {
    const { data, setData, processing, patch, errors } = useForm({
        first_name: student.first_name,
        last_name: student.last_name,
        dob: student.dob,
        gender: student.gender,
        nic: student.nic,
        registration_no: student.registration_no,
        admission_date: student.admission_date,
        profile_picture: student.profile_picture,
        religion: student.religion,
        race: student.race,
        allergy: student.allergy,
        disease: student.disease,
        additional_notes: student.additional_notes,
        parents: existingParents,
        class_id: student.class_id,
        section_id: student.section_id,
    });
    const [activeTab, setActiveTab] = useState('information');
    const [parents, setParents] = useState<Parent[]>(
        existingParents ?? [
            // Initialize with one empty parent entry
            {
                guardian_id: uuidv4(),
                last_name: '',
                first_name: '',
                contact_no: '',
                email: '',
                occupation: '',
                relationship: '',
            },
        ],
    );

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        patch(route('student.update', student.student_id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Student information updated.',
                });
            },
            onError: () => {
                const errorMessages = Object.values(errors);

                // Option B: Show a single toast with all messages
                const combinedMessage = errorMessages.join('\n');
                toast.error('Error', {
                    description:
                        'Error updating student information.\n' +
                        combinedMessage,
                    style: {
                        whiteSpace: 'pre-wrap',
                    },
                });
            },
        });
    };

    const handleChange = (
        guardian_id: string,
        field: keyof Omit<Parent, 'guardian_id'>,
        value: string,
    ) => {
        const newParents = parents.map((parent) =>
            parent.guardian_id === guardian_id
                ? { ...parent, [field]: value }
                : parent,
        );
        setParents(newParents);
        setData('parents', newParents);
    };

    const handleRemoveParent = (id: string) => {
        const newParents = parents.filter(
            (parent) => parent.guardian_id !== id,
        );
        setParents(newParents);
        setData('parents', newParents);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Students" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <CircleChevronLeft
                            color={'#F06F40'}
                            className="cursor-pointer"
                            onClick={() =>
                                router.visit(route('students.index'))
                            }
                        />
                        <div>
                            <span className="font-bold">Student </span>
                            <span>| Edit Student</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <Tabs
                        className="w-full"
                        defaultValue={activeTab}
                        onValueChange={setActiveTab}
                    >
                        <TabsList>
                            <TabsTrigger value="information">
                                Student Information
                            </TabsTrigger>
                            <TabsTrigger value="billing">Billing</TabsTrigger>
                        </TabsList>
                        <TabsContent value="information">
                            <div className="overflow-hidden bg-white p-4 shadow-sm sm:rounded-lg">
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* Student Information Section */}
                                    <StudentForm
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                        classes={classes}
                                    />
                                    <GuardianForm
                                        parents={parents}
                                        relationships={relationships}
                                        handleChange={handleChange}
                                        setParents={setParents}
                                        handleRemoveParent={handleRemoveParent}
                                        errors={errors}
                                    />

                                    <div className="flex justify-end py-4">
                                        <Button
                                            type={'submit'}
                                            variant={'primary'}
                                            size={'sm'}
                                        >
                                            Update
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </TabsContent>
                        <TabsContent value="billing">
                            <PackageForm student_id={student.student_id} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditStudent;
