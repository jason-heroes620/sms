import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { RoleInfo, UserFormField } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CircleChevronLeft } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import RoleForm from './RoleForm';
import UserForm from './UserForm';

type Role = {
    id: string;
    name: string;
};

const AddUser = ({
    roles,
    branches,
    positions,
}: {
    roles: Role[];
    branches: [
        {
            value: string;
            label: string;
        },
    ];
    positions: [
        {
            position_id: string;
            position: string;
        },
    ];
}) => {
    const [userRole, setUserRole] = useState<RoleInfo[]>([
        {
            role_id: uuidv4(),
            branch_id: [],
            id: '',
        },
    ]);

    const { data, setData, processing, errors, post } = useForm<UserFormField>({
        user_profile_id: '',
        last_name: '',
        first_name: '',
        gender: '',
        race: '',
        contact_no: '',
        email: '',
        address: {
            address1: '',
            address2: '',
            address3: '',
            city: '',
            postcode: '',
            state: '',
            country: '',
        },
        residential_status: '',
        nic: '',
        passport: '',
        dob: '',
        marital_status: '',
        employment_date: '',
        user_status: 'active',
        position_id: '',
        branch_id: '',
        spouse_info: {
            employment_status: true,
            ability_status: false,
        },
        role_info: userRole,
    });

    // const { data, setData, processing, errors, post } = useForm<UserFormField>({
    //     user_profile_id: '',
    //     last_name: 'Doe 4',
    //     first_name: 'John',
    //     gender: 'M',
    //     race: 'malay',
    //     contact_no: '012345678',
    //     email: 'jason4@gmail.com',
    //     address: {
    //         address1: 'no.2, jalan jelutong',
    //         address2: 'batu kawa',
    //         address3: '',
    //         city: 'Subang Jaya',
    //         postcode: '57200',
    //         state: 'Selangor',
    //         country: 'Malaysia',
    //     },
    //     residential_status: 'resident',
    //     nic: '801014135222',
    //     passport: '',
    //     dob: '2020-01-01',
    //     marital_status: 'married',
    //     user_status: 'active',
    //     employment_date: '2025-01-01',
    //     position_id: '0199a375-d238-704d-9427-024241dd778f',
    //     branch_id: '0199857a-d6bc-72a7-b620-de600b50fe12',
    //     spouse_info: {
    //         employment_status: true,
    //         ability_status: false,
    //     },
    //     role_info: [
    //         {
    //             role_id: uuidv4(),
    //             branch_id: ['0199857a-d6bc-72a7-b620-de600b50fe12'],
    //             id: '2',
    //         },
    //     ],
    // });

    const handleChange = (
        role_id: string,
        field: keyof RoleInfo,
        value: string | string[],
    ) => {
        const newUserRole = userRole.map((role: RoleInfo) =>
            role.role_id === role_id ? { ...role, [field]: value } : role,
        );
        setData('role_info', newUserRole);
        setUserRole(newUserRole);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        post(route('user.store'), {
            preserveScroll: true,

            onSuccess: () => {
                toast.success('User added successfully.');
            },
            onError: () => {
                toast.error('Failed to add user.');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Users" />
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
                            <span>| Add User</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4 text-gray-900 dark:text-gray-100">
                            <form onSubmit={handleSubmit}>
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
                                    <div className="col-span-2 py-2">
                                        <hr />
                                    </div>
                                    <div className="py-2">
                                        <span className="font-bold">
                                            User Role
                                        </span>
                                    </div>
                                    <div className="flex flex-col md:grid md:grid-cols-2">
                                        <RoleForm
                                            branches={branches}
                                            roles={roles}
                                            userRole={userRole}
                                            setUserRole={setUserRole}
                                            handleChange={handleChange}
                                        />
                                    </div>
                                    <div className="py-4">
                                        <hr />
                                    </div>
                                    <div className="flex justify-end py-2">
                                        <Button
                                            type="submit"
                                            variant={'primary'}
                                            disabled={processing}
                                        >
                                            {processing ? 'Saving ... ' : 'Add'}
                                        </Button>
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

export default AddUser;
