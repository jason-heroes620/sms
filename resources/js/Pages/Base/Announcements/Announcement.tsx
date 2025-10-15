import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BranchType, Classes } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, XCircle } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData<T> {
    current_page: number;
    data: T[]; // Array of the actual items (EducationCenter in this case)
    first_page_url: string | null;
    from: number | null;
    last_page: number;
    last_page_url: string | null;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}
const Announcement = ({
    announcements,
    branches,
    classes,
    filters,
}: {
    announcements: PaginatedData<any>;
    branches: BranchType[];
    classes: Classes[];
    filters: any;
}) => {
    const [branch, setBranch] = useState(
        branches.length === 1 ? branches[0].branch_id : (filters ?? ''),
    );
    console.log(filters);
    return (
        <AuthenticatedLayout>
            <Head title="View Class" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row items-center justify-between gap-4 p-4">
                        <div>
                            <span className="font-bold">Announcements</span>
                            <span> | All Announcements</span>
                        </div>
                        <div>
                            <Button
                                variant={'primary'}
                                size={'sm'}
                                onClick={() =>
                                    router.visit(route('announcement.create'))
                                }
                            >
                                <Plus />
                                Create
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4">
                            {/* Filters */}
                            <div className="mb-6 flex gap-4">
                                {/* Add branch + class dropdowns here */}
                                <div className="flex flex-row items-center gap-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Branch{' '}
                                    </label>
                                    <Select
                                        value={branch}
                                        onValueChange={(value) => {
                                            setBranch(value);
                                            // filterClassByBranch(value);
                                        }}
                                        required
                                    >
                                        <SelectTrigger className="flex w-full border-gray-300 shadow-sm">
                                            <SelectValue placeholder="Select Branch" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {branches.map(
                                                    (branch: BranchType) => (
                                                        <SelectItem
                                                            key={
                                                                branch.branch_id
                                                            }
                                                            value={
                                                                branch.branch_id
                                                            }
                                                        >
                                                            {branch.branch_name}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {/* <div className="mb-4 flex flex-row items-center gap-4">
                                    <label
                                        htmlFor="section_name"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Class
                                    </label>
                                    <div className="">
                                        <Select
                                            value={selectedClass}
                                            onValueChange={(value) => {
                                                setSelectedClass(value);
                                            }}
                                            required
                                        >
                                            <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                                <SelectValue placeholder="Select Class" />
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
                                    </div>
                                </div> */}
                                <div className="flex items-center">
                                    <Button
                                        type="button"
                                        variant={'primary'}
                                        size={'sm'}
                                        onClick={() =>
                                            router.visit(
                                                route(
                                                    'announcements.index',
                                                    branch,
                                                ),
                                            )
                                        }
                                    >
                                        Apply
                                    </Button>
                                </div>
                                <div className="flex items-center">
                                    {branch && (
                                        <div>
                                            <Button
                                                type="button"
                                                variant={'outline'}
                                                size={'sm'}
                                                onClick={() =>
                                                    router.visit(
                                                        route(
                                                            'announcements.index',
                                                        ),
                                                    )
                                                }
                                            >
                                                <XCircle />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cards */}

                            {announcements.data.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                                    {announcements.data?.map((a: any) => (
                                        <div
                                            key={a.announcement_id}
                                            className="rounded-lg border shadow-md"
                                        >
                                            {a.image_path && (
                                                <img
                                                    src={`/storage/${a.image_path}`}
                                                    alt={a.title}
                                                    className="h-40 w-full rounded border object-cover"
                                                />
                                            )}
                                            <div className="px-4 py-2">
                                                <h2 className="mt-2 text-lg font-semibold">
                                                    {a.title}{' '}
                                                </h2>
                                                <p className="text-sm text-gray-500 italic">
                                                    {moment(
                                                        a.created_at,
                                                    ).format('DD MMM YYYY')}
                                                </p>
                                                <p className="mt-1 text-sm">
                                                    {a.short_description}
                                                </p>
                                                <div className="flex justify-end py-4">
                                                    <Link
                                                        href={route(
                                                            'announcement.show',
                                                            a.announcement_id,
                                                        )}
                                                        className="inline-block text-sm font-bold italic"
                                                    >
                                                        Read More →
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex justify-center">
                                    <span>
                                        No announcement yet,{' '}
                                        <Link
                                            type="link"
                                            href={route('announcement.create')}
                                            className="cursor-pointer italic underline"
                                        >
                                            create
                                        </Link>{' '}
                                        your first announcement!
                                    </span>
                                </div>
                            )}

                            {/* Pagination */}
                            {announcements.data.length > 0 ? (
                                <Pagination pages={announcements} />
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Announcement;
