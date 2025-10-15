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
import { Textarea } from '@/components/ui/textarea';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BranchType, Classes } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CircleChevronLeft } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

const AddAnnouncement = ({
    classes,
    branches,
}: {
    classes: Classes[];
    branches: BranchType[];
}) => {
    const { data, setData, post, processing, errors } = useForm<{
        branch_id: string;
        class_id: any[];
        title: string;
        description: string;
        image: File | null;
    }>({
        branch_id: '',
        class_id: [],
        title: '',
        description: '',
        image: null as File | null,
    });
    const [branch, setBranch] = useState(
        data.branch_id && data.branch_id !== ''
            ? data.branch_id
            : branches.length === 1
              ? branches[0].branch_id
              : '',
    );
    const [classByBranch, setClassByBranch] = useState(
        branch !== '' ? classes.filter((c) => c.branch_id === branch) : [],
    );

    const filterClassByBranch = (value: string) => {
        setData('class_id', []);
        setClassByBranch(classes.filter((c) => c.branch_id === value));
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData((prev) => ({ ...prev, image: e.target.files![0] }));
        }
    };

    const handleClassChanges = (values: string[]) => {
        console.log('values =>', values);
        setData('class_id', values);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('announcement.store'), {
            onSuccess: () => {
                toast.success('New announcement created.');
                setData({
                    branch_id: '',
                    class_id: [],
                    title: '',
                    description: '',
                    image: null,
                });
            },
            onError: () => {
                toast.error('Error creating announcement!');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Announcement" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <CircleChevronLeft
                            color={'#F06F40'}
                            className="cursor-pointer"
                            onClick={() =>
                                router.visit(route('announcements.index'))
                            }
                        />
                        <div>
                            <span className="font-bold">Announcements</span>
                            <span> | Add Announcement</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
                                    <div className="mb-4">
                                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Branch
                                        </Label>
                                        <Select
                                            value={branch}
                                            onValueChange={(value) => {
                                                setBranch(value);
                                                filterClassByBranch(value);
                                                setData('branch_id', value);
                                            }}
                                            required
                                        >
                                            <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                                <SelectValue placeholder="All Branches" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {branches.map(
                                                        (
                                                            branch: BranchType,
                                                        ) => (
                                                            <SelectItem
                                                                key={
                                                                    branch.branch_id
                                                                }
                                                                value={
                                                                    branch.branch_id
                                                                }
                                                            >
                                                                {
                                                                    branch.branch_name
                                                                }
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {/* <div className="mb-4">
                                        <label
                                            htmlFor="section_name"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Class{' '}
                                        </label>
                                        <div className="">
                                            <Select
                                                value={data.class_id}
                                                onValueChange={(value) =>
                                                    setData('class_id', value)
                                                }
                                            >
                                                <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                                    <SelectValue placeholder="All Class" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {classByBranch?.map(
                                                            (c: Classes) => {
                                                                return (
                                                                    <SelectItem
                                                                        key={
                                                                            c.class_id
                                                                        }
                                                                        value={
                                                                            c.class_id
                                                                        }
                                                                    >
                                                                        {
                                                                            c.class_name
                                                                        }
                                                                    </SelectItem>
                                                                );
                                                            },
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <MultiSelect
                                                options={classByBranch}
                                                value={data.class_id}
                                                onValueChange={(values) =>
                                                    handleClassChanges(values)
                                                }
                                                placeholder="Choose class..."
                                            />
                                        </div>

                                        {errors.class_id && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.class_id}
                                            </p>
                                        )}
                                    </div> */}
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                                    <div className="mb-4">
                                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Title{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                            required
                                            onChange={(e) =>
                                                setData('title', e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                                    <div className="mb-4 md:col-span-2">
                                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Content{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Textarea
                                            required
                                            onChange={(e) =>
                                                setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Image
                                        </label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end py-4">
                                    <Button
                                        type={'submit'}
                                        variant={'primary'}
                                        size={'sm'}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AddAnnouncement;
