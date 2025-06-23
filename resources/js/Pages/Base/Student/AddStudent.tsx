import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const AddStudent = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        date_of_birth: '',
        gender: '',
        nic: '',
        student_registration_no: '',
        profile_pic: '',
        religion: '',
        ethnic: '',
        father_first_name: '',
        father_last_name: '',
        father_contact_no: '',
        father_occupation: '',
        father_email: '',
        mother_first_name: '',
        mother_last_name: '',
        mother_contact_no: '',
        mother_occupation: '',
        mother_email: '',
        allergy: '',
        disease: '',
        address1: '',
        address2: '',
        address3: '',
        additional_notes: '',
        admission_date: new Date().toISOString().split('T')[0], // Default to today
    });

    // Handle form submission
    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('students.store'), {
            onSuccess: () => {
                alert('Student added successfully!'); // Replace with a custom modal/toast
                reset(); // Clear the form after successful submission
            },
            onError: (formErrors) => {
                console.error('Form submission errors:', formErrors);
                // Errors are automatically populated in the `errors` object
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Students" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4 text-gray-900 dark:text-gray-100">
                            <span className="font-bold">Student</span> | Add
                            Student
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Student Information Section */}
                            <div>
                                <span className="font-bold italic">
                                    Student Information
                                </span>
                                <hr />
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* First Name */}
                                <div>
                                    <label
                                        htmlFor="first_name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        First Name{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        value={data.first_name}
                                        onChange={(e) =>
                                            setData(
                                                'first_name',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.first_name && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.first_name}
                                        </p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label
                                        htmlFor="last_name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Last Name{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        value={data.last_name}
                                        onChange={(e) =>
                                            setData('last_name', e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.last_name && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.last_name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Additional Details Section */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Date of Birth */}
                                <div>
                                    <label
                                        htmlFor="date_of_birth"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Date of Birth{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="date"
                                        id="date_of_birth"
                                        name="date_of_birth"
                                        value={data.date_of_birth}
                                        onChange={(e) =>
                                            setData(
                                                'date_of_birth',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.date_of_birth && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.date_of_birth}
                                        </p>
                                    )}
                                </div>

                                {/* Gender */}
                                <div>
                                    <label
                                        htmlFor="gender"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Gender{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>

                                    <Select
                                        name="gender"
                                        value={data.gender}
                                        onValueChange={(value) =>
                                            setData('gender', value)
                                        }
                                    >
                                        <SelectTrigger className="mt-1 w-full">
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full">
                                            <SelectItem value="M">
                                                Male
                                            </SelectItem>
                                            <SelectItem value="F">
                                                Female
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {errors.gender && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.gender}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Identification Card No. / Passport No. */}
                                <div>
                                    <label
                                        htmlFor="nic"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Identification Card No. / Passport No.{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="text"
                                        id="nic"
                                        name="nic"
                                        value={data.nic}
                                        onChange={(e) =>
                                            setData('nic', e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.nic && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.nic}
                                        </p>
                                    )}
                                </div>

                                {/* Profile Picture */}
                                <div>
                                    <label
                                        htmlFor="profile_pic"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Profile Picture{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="file"
                                        id="profile_pic"
                                        name="profile_pic"
                                        value={data.profile_pic}
                                        onChange={(e) =>
                                            setData(
                                                'profile_pic',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 flex w-full items-center"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="ethnic"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Ethnic Group
                                    </label>

                                    <Select
                                        name="ethnic"
                                        value={data.ethnic}
                                        onValueChange={(value) =>
                                            setData('ethnic', value)
                                        }
                                    >
                                        <SelectTrigger className="mt-1 w-full">
                                            <SelectValue placeholder="Select Religion" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full">
                                            <SelectItem value="malay">
                                                Malay
                                            </SelectItem>
                                            <SelectItem value="chinese">
                                                Chinese
                                            </SelectItem>
                                            <SelectItem value="indian">
                                                Indian
                                            </SelectItem>
                                            <SelectItem value="other">
                                                Other
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {errors.ethnic && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.ethnic}
                                        </p>
                                    )}
                                </div>
                                {/* Religion */}
                                <div>
                                    <label
                                        htmlFor="religion"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Religion
                                    </label>

                                    <Select
                                        name="religion"
                                        value={data.religion}
                                        onValueChange={(value) =>
                                            setData('religion', value)
                                        }
                                    >
                                        <SelectTrigger className="mt-1 w-full">
                                            <SelectValue placeholder="Select Religion" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full">
                                            <SelectItem value="islam">
                                                Islam
                                            </SelectItem>
                                            <SelectItem value="buddhism">
                                                Buddhism
                                            </SelectItem>
                                            <SelectItem value="hinduism">
                                                Hinduism
                                            </SelectItem>
                                            <SelectItem value="christianity">
                                                Christianity
                                            </SelectItem>
                                            <SelectItem value="other">
                                                Other
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {errors.religion && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.religion}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="py-2">
                                <span className="font-bold italic">
                                    Other Information
                                </span>
                                <hr />
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="student_registration_no"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Student Registration No.{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="text"
                                        id="student_registration_no"
                                        name="student_registration_no"
                                        value={data.student_registration_no}
                                        onChange={(e) =>
                                            setData(
                                                'student_registration_no',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.student_registration_no && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.student_registration_no}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="admission_date"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Admission Date{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="date"
                                        id="admission_date"
                                        name="admission_date"
                                        value={data.admission_date}
                                        onChange={(e) =>
                                            setData(
                                                'admission_date',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.admission_date && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.admission_date}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label
                                        htmlFor="allergy"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Allergy
                                    </label>
                                    <Textarea
                                        className="mt-1"
                                        placeholder="Allergy if any"
                                        onChange={(e) =>
                                            setData('allergy', e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label
                                        htmlFor="disease"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Disease
                                    </label>
                                    <Textarea
                                        className="mt-1"
                                        placeholder="Disease if any"
                                        onChange={(e) =>
                                            setData('disease', e.target.value)
                                        }
                                        value={data.disease}
                                    />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label
                                        htmlFor="additional_notes"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Additional Notes
                                    </label>
                                    <Textarea
                                        className="mt-1"
                                        placeholder="Additional notes if any"
                                        onChange={(e) =>
                                            setData(
                                                'additional_notes',
                                                e.target.value,
                                            )
                                        }
                                        value={data.additional_notes}
                                    />
                                </div>
                            </div>

                            <div className="py-2">
                                <span className="font-bold italic">
                                    Parent's / Guardian's Information
                                </span>
                                <hr />
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="father_first_name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Father / Guardian First Name{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="text"
                                        id="father_first_name"
                                        name="father_first_name"
                                        value={data.father_first_name}
                                        onChange={(e) =>
                                            setData(
                                                'father_first_name',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.father_first_name && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.father_first_name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="father_last_name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Last Name{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="text"
                                        id="father_last_name"
                                        name="father_last_name"
                                        value={data.father_last_name}
                                        onChange={(e) =>
                                            setData(
                                                'father_last_name',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.father_last_name && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.father_last_name}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="father_contact_no"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Contact No.{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="text"
                                        id="father_contact_no"
                                        name="father_contact_no"
                                        value={data.father_contact_no}
                                        onChange={(e) =>
                                            setData(
                                                'father_contact_no',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.father_contact_no && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.father_contact_no}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="father_occupation"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Occupation{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="text"
                                        id="father_occupation"
                                        name="father_occupation"
                                        value={data.father_occupation}
                                        onChange={(e) =>
                                            setData(
                                                'father_occupation',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.father_occupation && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.father_occupation}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="father_email"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Email{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="email"
                                        id="father_email"
                                        name="father_email"
                                        value={data.father_email}
                                        onChange={(e) =>
                                            setData(
                                                'father_email',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.father_email && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.father_email}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <hr />
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="mother_first_name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Mother First Name{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="text"
                                        id="mother_first_name"
                                        name="mother_first_name"
                                        value={data.father_first_name}
                                        onChange={(e) =>
                                            setData(
                                                'mother_first_name',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.mother_first_name && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.mother_first_name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="mother_last_name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Last Name{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="text"
                                        id="mother_last_name"
                                        name="mother_last_name"
                                        value={data.mother_last_name}
                                        onChange={(e) =>
                                            setData(
                                                'mother_last_name',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.mother_last_name && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.mother_last_name}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="mother_contact_no"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Contact No.{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="text"
                                        id="mother_contact_no"
                                        name="mother_contact_no"
                                        value={data.mother_contact_no}
                                        onChange={(e) =>
                                            setData(
                                                'mother_contact_no',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.mother_contact_no && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.mother_contact_no}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="father_occupation"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Occupation{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="text"
                                        id="father_occupation"
                                        name="father_occupation"
                                        value={data.father_occupation}
                                        onChange={(e) =>
                                            setData(
                                                'father_occupation',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.father_occupation && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.father_occupation}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="mother_email"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Email{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        type="email"
                                        id="mother_email"
                                        name="mother_email"
                                        value={data.mother_email}
                                        onChange={(e) =>
                                            setData(
                                                'mother_email',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.mother_email && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.mother_email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                {' '}
                                <span className="text-sm font-bold text-red-800">
                                    * Required fields
                                </span>
                                <hr />
                            </div>
                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-[#F06F40] shadow-sm hover:bg-[#F06F40] hover:font-bold hover:text-white focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Add Student'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AddStudent;
