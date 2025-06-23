import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Profile } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';

interface Props {
    profile: Profile;
}

const SchoolProfile = ({ profile }: Props) => {
    const { data, setData, post, processing, errors } = useForm({
        school_name: profile?.school_name || '',
        school_contact_no: profile?.school_contact_no || '',
        school_email: profile?.school_email || '',
        school_address: profile?.school_address || {
            address1: '',
            address2: '',
            address3: '',
            city: '',
            state: '',
            postcode: '',
            country: '',
        },
        school_logo: profile?.school_logo || null,
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
                console.log('Profile updated successfully:', response.data);
            })
            .catch((error) => {
                console.error('Error updating profile:', error);
            });
    };
    return (
        <AuthenticatedLayout>
            <Head title="School Profile" />

            <div className="px-4 py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4 text-gray-900 dark:text-gray-100">
                            <span className="font-bold">School Profile</span>
                        </div>
                    </div>
                    <div className="flex flex-col py-4">
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
                                        <label htmlFor="school_name">
                                            School Name
                                        </label>
                                        <Input
                                            type="text"
                                            name="school_name"
                                            value={data.school_name}
                                            onChange={(e) =>
                                                setData(
                                                    'school_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="School Name"
                                            className="w-full"
                                        />
                                        {errors.school_name && (
                                            <span className="text-red-500">
                                                {errors.school_name}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="school_contact_no">
                                            Contact No
                                        </label>
                                        <Input
                                            type="text"
                                            name="school_contact_no"
                                            value={data.school_contact_no}
                                            onChange={(e) =>
                                                setData(
                                                    'school_contact_no',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contact No"
                                            className="w-full"
                                        />
                                        {errors.school_contact_no && (
                                            <span className="text-red-500">
                                                {errors.school_contact_no}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="school_email">
                                            Email
                                        </label>
                                        <Input
                                            type="email"
                                            name="school_email"
                                            value={data.school_email}
                                            onChange={(e) =>
                                                setData(
                                                    'school_email',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Email"
                                            className="w-full"
                                        />
                                        {errors.school_email && (
                                            <span className="text-red-500">
                                                {errors.school_email}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="school_address1">
                                            Address 1
                                        </label>
                                        <Input
                                            type="text"
                                            name="school_address1"
                                            value={data.school_address.address1}
                                            onChange={(e) =>
                                                setData('school_address', {
                                                    ...data.school_address,
                                                    address1: e.target.value,
                                                })
                                            }
                                            placeholder="Address 1"
                                            className="w-full"
                                        />
                                        {errors.school_address && (
                                            <span className="text-red-500">
                                                {errors.school_address}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="school_address2">
                                            Address 2
                                        </label>
                                        <Input
                                            type="text"
                                            name="school_address2"
                                            value={data.school_address.address2}
                                            onChange={(e) =>
                                                setData('school_address', {
                                                    ...data.school_address,
                                                    address2: e.target.value,
                                                })
                                            }
                                            placeholder="Address 2"
                                            className="w-full"
                                        />
                                        {errors.school_address && (
                                            <span className="text-red-500">
                                                {errors.school_address}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="school_address3">
                                            Address 3
                                        </label>
                                        <Input
                                            type="text"
                                            name="school_address3"
                                            value={data.school_address.address3}
                                            onChange={(e) =>
                                                setData('school_address', {
                                                    ...data.school_address,
                                                    address3: e.target.value,
                                                })
                                            }
                                            placeholder="Address 3"
                                            className="w-full"
                                        />
                                        {errors.school_address && (
                                            <span className="text-red-500">
                                                {errors.school_address}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-end py-4">
                                        <Button size={'sm'} variant={'primary'}>
                                            {processing
                                                ? 'Updating...'
                                                : 'Update Profile'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default SchoolProfile;
