import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
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
import { CalendarIcon, CircleChevronLeft } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';
import { toast } from 'sonner';

const AddExam = ({
    branches,
    classes,
}: {
    branches: BranchType[];
    classes: Classes[];
}) => {
    const { data, setData, post, processing, errors } = useForm({
        branch_id: '',
        class_id: '',
        exam_name: '',
        exam_description: '',
        start_date: '',
        end_date: '',
    });

    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);

    const [branch, setBranch] = useState(
        branches && branches.length === 1
            ? branches[0].branch_id
            : data.branch_id
              ? data.branch_id
              : '',
    );
    const [classByBranch, setClassByBranch] = useState(
        branch !== '' ? classes.filter((c) => c.branch_id === branch) : [],
    );

    const filterClassByBranch = (value: string) => {
        setClassByBranch(classes.filter((c) => c.branch_id === value));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle form submission logic here
        post(route('exam.store'), {
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Subject added successfully.',
                });
                setData({
                    branch_id: '',
                    class_id: '',
                    exam_name: '',
                    exam_description: '',
                    start_date: '',
                    end_date: '',
                });
                setTimeout(() => {
                    router.visit(route('exams.index'));
                }, 2000);
            },
            onError: (errors) => {
                toast.error('Error', {
                    description: 'Failed to add subject.',
                });
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Exam" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <CircleChevronLeft
                            color={'#F06F40'}
                            className="cursor-pointer"
                            onClick={() => router.visit(route('exam.index'))}
                        />
                        <div>
                            <span className="font-bold">Exam</span>
                            <span> | Add Exam</span>
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
                                            }}
                                            required
                                        >
                                            <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                                <SelectValue placeholder="Select Branch" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {branches?.map(
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
                                    <div className="mb-4">
                                        <label
                                            htmlFor="section_name"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Class{' '}
                                            <span className="text-red-800">
                                                *
                                            </span>
                                        </label>
                                        <div className="">
                                            <Select
                                                value={data.class_id}
                                                onValueChange={(value) => {
                                                    setData('class_id', value);
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

                                        {errors.class_id && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.class_id}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div className="mb-4">
                                        <label
                                            htmlFor="exam_name"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Exam Name
                                            <span className="text-red-800">
                                                {' '}
                                                *
                                            </span>
                                        </label>
                                        <Input
                                            type="text"
                                            id="exam_name"
                                            value={data.exam_name}
                                            onChange={(e) =>
                                                setData(
                                                    'exam_name',
                                                    e.target.value,
                                                )
                                            }
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 ${
                                                errors.exam_name
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                        />
                                        {errors.exam_name && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                {errors.exam_name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                                        <div>
                                            <label
                                                htmlFor="start_date"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Start Date
                                                <span className="text-red-800">
                                                    {' '}
                                                    *
                                                </span>
                                            </label>
                                            <Popover
                                                open={openStartDate}
                                                onOpenChange={setOpenStartDate}
                                            >
                                                <PopoverTrigger
                                                    className="w-full pt-1"
                                                    asChild
                                                >
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        data-empty={
                                                            !data.start_date
                                                        }
                                                        className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                                                    >
                                                        <CalendarIcon />
                                                        {data.start_date ? (
                                                            moment(
                                                                data.start_date,
                                                            ).format(
                                                                'DD MMM YYYY',
                                                            )
                                                        ) : (
                                                            <span>
                                                                Pick a date
                                                            </span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            moment(
                                                                data.start_date,
                                                            ).toDate() ??
                                                            new Date()
                                                        }
                                                        onSelect={(date) => {
                                                            setData(
                                                                'start_date',
                                                                moment(
                                                                    date,
                                                                ).format(
                                                                    'YYYY-MM-DD',
                                                                ),
                                                            );
                                                            setOpenStartDate(
                                                                false,
                                                            );
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {errors.start_date && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                    {errors.start_date}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="end_date"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                End Date
                                                <span className="text-red-800">
                                                    {' '}
                                                    *
                                                </span>
                                            </label>
                                            <Popover
                                                open={openEndDate}
                                                onOpenChange={setOpenEndDate}
                                            >
                                                <PopoverTrigger
                                                    className="w-full p-1"
                                                    asChild
                                                >
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        data-empty={
                                                            !data.start_date
                                                        }
                                                        className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                                                    >
                                                        <CalendarIcon />
                                                        {data.end_date ? (
                                                            moment(
                                                                data.end_date,
                                                            ).format(
                                                                'DD MMM YYYY',
                                                            )
                                                        ) : (
                                                            <span>
                                                                Pick a date
                                                            </span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            moment(
                                                                data.end_date,
                                                            ).toDate() ??
                                                            new Date()
                                                        }
                                                        onSelect={(date) => {
                                                            setData(
                                                                'end_date',
                                                                moment(
                                                                    date,
                                                                ).format(
                                                                    'YYYY-MM-DD',
                                                                ),
                                                            );
                                                            setOpenEndDate(
                                                                false,
                                                            );
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {errors.end_date && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                    {errors.end_date}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4 grid grid-cols-1 md:grid-cols-3">
                                    <div className="col-span-1 md:col-span-2">
                                        <label
                                            htmlFor="exam_description"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Exam Description
                                        </label>
                                        <Textarea
                                            id="exam_description"
                                            value={data.exam_description}
                                            onChange={(e) =>
                                                setData(
                                                    'exam_description',
                                                    e.target.value,
                                                )
                                            }
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 ${
                                                errors.exam_description
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                        ></Textarea>
                                        {errors.exam_description && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                {errors.exam_description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end py-4">
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
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AddExam;
