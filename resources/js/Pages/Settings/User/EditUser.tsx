import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { RoleInfo, UserFormField } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CircleChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import UserForm from './UserForm';

const EditUser = ({
    user,
    roles,
    branches,
    positions,
}: {
    user: UserFormField;
    roles: RoleInfo[];
    branches: [
        {
            label: string;
            value: string;
        },
    ];
    positions: [
        {
            position_id: string;
            position: string;
        },
    ];
}) => {
    const { data, setData, processing, errors, put } =
        useForm<UserFormField>(user);

    const handleUpdate = () => {
        put(route('user.update', user.user_profile_id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Update Successful.', {
                    description: 'User information has been updated.',
                });
            },
            onError: () => {
                const errorMessages = Object.values(errors);

                // Option B: Show a single toast with all messages
                const combinedMessage = errorMessages.join('\n');
                toast.error('Error on update', {
                    description:
                        'Error updating user information.\n' + combinedMessage,
                    style: {
                        whiteSpace: 'pre-wrap',
                    },
                });
            },
        });
    };
    return (
        <AuthenticatedLayout>
            <Head title="Edit Users" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <CircleChevronLeft
                            color={'#F06F40'}
                            className="cursor-pointer"
                            onClick={() => router.visit(route('users.index'))}
                        />
                        <div>
                            <span className="font-bold">User </span>
                            <span>| Edit User</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4 text-gray-900 dark:text-gray-100">
                            <div className="py-2">
                                <div className="pb-2">
                                    <UserForm
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                        branches={branches}
                                        positions={positions}
                                    />
                                </div>
                                <div className="py-4">
                                    <hr />
                                </div>
                                <div className="flex justify-end py-2">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        variant={'primary'}
                                        onClick={() => handleUpdate()}
                                    >
                                        {processing ? 'Updating ...' : 'Update'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditUser;
