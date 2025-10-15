import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Classes } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CircleChevronLeft } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import GuardianForm from './GuardianForm';
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

type Relationship = {
    relationship_label: string;
    relationship_value: string;
};

const AddStudent = ({
    relationships,
    classes,
}: {
    relationships: Relationship[];
    classes: Classes[];
}) => {
    const [parents, setParents] = useState<Parent[]>([
        {
            guardian_id: uuidv4(),
            last_name: '',
            first_name: '',
            contact_no: '',
            email: '',
            occupation: '',
            relationship: '',
        },
    ]);
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        dob: '',
        gender: '',
        nic: '',
        registration_no: '',
        profile_picture: '',
        religion: '',
        race: '',
        allergy: '',
        disease: '',
        address1: '',
        address2: '',
        address3: '',
        additional_notes: '',
        admission_date: new Date().toISOString().split('T')[0],
        parents: parents,
        class_id: '',
        section_id: '',
    });

    // Function to add a new empty parent entry

    // Function to handle changes in input fields for a specific parent entry
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
    };

    // Handle form submission
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        post(route('student.store'), {
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Student information added successfully.',
                });
                // reset(); // Clear the form after successful submission
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

    // const handleTestSubmit = () => {
    //     const d = {
    //         first_name: 'Roger',
    //         last_name: 'Federer',
    //         dob: '2020-02-01',
    //         gender: 'M',
    //         nic: '11223344',
    //         registration_no: 'AB123456',
    //         profile_picture: '',
    //         religion: 'other',
    //         race: 'other',
    //         allergy: 'test',
    //         disease: 'test',
    //         address1: '',
    //         address2: '',
    //         address3: '',
    //         additional_notes: 'test',
    //         admission_date: '2025-01-06',
    //         parents: [
    //             {
    //                 id: '4351aefc-497d-4522-b6ea-c34ca6ca3d26',
    //                 parent_contact_no: '0168992528',
    //                 parent_email: 'jason820620@gmail.com',
    //                 parent_first_name: 'WONG',
    //                 parent_last_name: 'SIANG',
    //                 parent_occupation: 'Doctor',
    //                 relationship: 'father',
    //             },
    //             {
    //                 id: '4351aefc-497d-4522-b6ea-c34ca6ca3d27',
    //                 parent_contact_no: '0168992528',
    //                 parent_email: 'jason820620@gmail.com',
    //                 parent_first_name: 'WONG',
    //                 parent_last_name: 'SIANG',
    //                 parent_occupation: 'Nurse',
    //                 relationship: 'mother',
    //             },
    //         ],
    //     };
    //     axios.post(route('student.store'), d).then((response) => {
    //         if (response.status === 200) console.log(response.data);
    //     });
    // };

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
                            <span>| Add Student</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white p-4 shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                            <div className="flex justify-end py-2">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    variant="primary"
                                    size="sm"
                                >
                                    {processing ? 'Saving ...' : 'Add'}
                                </Button>
                            </div>
                        </form>
                        {/* <div>
                            <Button onClick={(e) => handleTestSubmit()}>
                                Test
                            </Button>
                        </div> */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AddStudent;
