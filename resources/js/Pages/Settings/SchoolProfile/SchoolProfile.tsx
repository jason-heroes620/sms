import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Profile } from '@/types';
import States from '@/utils/states.json';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'sonner';
interface Props {
    profile: Profile;
}

const states = States.sort((a, b) => (a > b ? 1 : -1)).map((s) => {
    return { label: s, value: s };
});

const SchoolProfile = ({ profile }: Props) => {
    const { data, setData, processing, errors } = useForm({
        schoolName: profile?.school_name || '',
        schoolContactNo: profile?.school_contact_no || '',
        schoolEmail: profile?.school_email || '',
        schoolAddress: profile?.school_address || {
            address1: '',
            address2: '',
            address3: '',
            city: '',
            state: '',
            postcode: '',
            country: '',
        },
        schoolLogo: profile?.school_logo || null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        axios
            .post(route('school.profile.update'), data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                toast.success('Profile updated successfully');
            })
            .catch((error) => {
                toast.error('Error updating profile');
            });
    };
    return (
        <AuthenticatedLayout>
            <Head title="School Profile" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="p-4 text-gray-900 dark:text-gray-100">
                        <div>
                            <span className="font-bold">Settings</span>
                            <span> | School Profile</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4">
                            <form onSubmit={submit}>
                                <div className="flex flex-col md:grid md:grid-cols-2 md:gap-6">
                                    <div className="flex flex-col gap-2 py-4 md:grid-rows-2">
                                        <div className="flex flex-col items-center gap-2 rounded-md border p-4">
                                            <span className="font-bold">
                                                Your Logo
                                            </span>
                                            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-200">
                                                <img src="" alt="" />
                                            </div>
                                            <div className="w-full py-4 md:w-[50%]">
                                                <Input
                                                    type="file"
                                                    value={undefined}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4 py-4">
                                        <div>
                                            <label
                                                htmlFor="schoolName"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                School Name
                                            </label>
                                            <Input
                                                type="text"
                                                name="schoolName"
                                                value={data.schoolName}
                                                onChange={(e) =>
                                                    setData(
                                                        'schoolName',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="School Name"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                            />
                                            {errors.schoolName && (
                                                <span className="text-red-500">
                                                    {errors.schoolName}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="schoolContactNo"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Contact No
                                            </label>
                                            <Input
                                                type="text"
                                                name="schoolContactNo"
                                                value={data.schoolContactNo}
                                                onChange={(e) =>
                                                    setData(
                                                        'schoolContactNo',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Contact No"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                            />
                                            {errors.schoolContactNo && (
                                                <span className="text-red-500">
                                                    {errors.schoolContactNo}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="schoolEmail"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Email
                                            </label>
                                            <Input
                                                type="email"
                                                name="schoolEmail"
                                                value={data.schoolEmail}
                                                onChange={(e) =>
                                                    setData(
                                                        'schoolEmail',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Email"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                            />
                                            {errors.schoolEmail && (
                                                <span className="text-red-500">
                                                    {errors.schoolEmail}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="schoolAddress1"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Address 1
                                            </label>
                                            <Input
                                                type="text"
                                                name="schoolAddress1"
                                                value={
                                                    data.schoolAddress.address1
                                                }
                                                onChange={(e) =>
                                                    setData('schoolAddress', {
                                                        ...data.schoolAddress,
                                                        address1:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Address 1"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                            />
                                            {errors.schoolAddress && (
                                                <span className="text-red-500">
                                                    {errors.schoolAddress}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="schoolAddress2"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Address 2
                                            </label>
                                            <Input
                                                type="text"
                                                name="schoolAddress2"
                                                value={
                                                    data.schoolAddress.address2
                                                }
                                                onChange={(e) =>
                                                    setData('schoolAddress', {
                                                        ...data.schoolAddress,
                                                        address2:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Address 2"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                            />
                                            {errors.schoolAddress && (
                                                <span className="text-red-500">
                                                    {errors.schoolAddress}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="schoolAddress3"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Address 3
                                            </label>
                                            <Input
                                                type="text"
                                                name="schoolAddress3"
                                                value={
                                                    data.schoolAddress.address3
                                                }
                                                onChange={(e) =>
                                                    setData('schoolAddress', {
                                                        ...data.schoolAddress,
                                                        address3:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Address 3"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                            />
                                            {errors.schoolAddress && (
                                                <span className="text-red-500">
                                                    {errors.schoolAddress}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="school_city"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                City
                                            </label>
                                            <Input
                                                type="text"
                                                name="school_city"
                                                value={data.schoolAddress.city}
                                                onChange={(e) =>
                                                    setData('schoolAddress', {
                                                        ...data.schoolAddress,
                                                        city: e.target.value,
                                                    })
                                                }
                                                placeholder="City"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                            />
                                            {errors.schoolAddress && (
                                                <span className="text-red-500">
                                                    {errors.schoolAddress}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="school_postcode"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Postcode
                                            </label>
                                            <Input
                                                type="text"
                                                name="school_postcode"
                                                maxLength={12}
                                                value={
                                                    data.schoolAddress.postcode
                                                }
                                                onChange={(e) =>
                                                    setData('schoolAddress', {
                                                        ...data.schoolAddress,
                                                        postcode:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Postcode"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                            />
                                            {errors.schoolAddress && (
                                                <span className="text-red-500">
                                                    {errors.schoolAddress}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <Label
                                                htmlFor="school_state"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                State
                                            </Label>

                                            <Select
                                                value={data.schoolAddress.state}
                                                onValueChange={(value) =>
                                                    setData('schoolAddress', {
                                                        ...data.schoolAddress,
                                                        state: value,
                                                    })
                                                }
                                                required
                                            >
                                                <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                                    <SelectValue placeholder="Select State" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {states.map((state) => (
                                                            <SelectItem
                                                                key={
                                                                    state.value
                                                                }
                                                                value={
                                                                    state.value
                                                                }
                                                            >
                                                                {state.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {errors.schoolAddress && (
                                                <span className="text-red-500">
                                                    {errors.schoolAddress}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex justify-end py-4">
                                            <Button
                                                size={'sm'}
                                                variant={'primary'}
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Updating ...'
                                                    : 'Update'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default SchoolProfile;
