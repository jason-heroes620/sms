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
import { AcademicYear, BranchType, Classes, Section } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CircleChevronLeft } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

type Subject = {
    subject_id: string;
    subject_name: string;
};

const AddClassSchedule = ({
    academic_years,
    branches,
    classes,
    subjects,
}: any) => {
    const { data, setData, processing, errors, post } = useForm({
        academic_year_id: academic_years
            ? academic_years.find((a: AcademicYear) => {
                  return a.is_current ? a.academic_year_id : '';
              }).academic_year_id
            : '',
        branch_id: '',
        class_id: '',
        section_id: '',
        subject_id: '',
        recurrence: {
            pattern: '',
            days: [] as number[],
            start_time: '',
            end_time: '',
        },
        color: '',
    });
    const [branch, setBranch] = useState(
        branches.length === 1 ? branches[0].branch_id : '',
    );
    const [sectionByClass, setSectionByClass] = useState<Section[]>([]);
    const [classByBranch, setClassByBranch] = useState([]);
    const filterClassByBranch = (value: string) => {
        setClassByBranch(classes.filter((c: Classes) => c.branch_id === value));
    };

    const [teacher, setTeacher] = useState('');
    const getTeacherBySection = (value: string) => {
        const t: Section[] = sectionByClass.filter(
            (s: Section) => s.section_id === value,
        );
        setTeacher(t[0].name);
    };

    const handleClassChanges = (value: string) => {
        const s: Classes[] = classByBranch.filter(
            (c: Classes) => c.class_id === value,
        );
        setSectionByClass(s[0]?.section);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        post(route('timetable.store'), {
            preserveState: true,
            onSuccess: () => {
                toast.success('Successfully added to timetable.');
            },
            onError: () => {
                toast.error('Error adding to timetable.');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Timetable" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <CircleChevronLeft
                            color={'#F06F40'}
                            className="cursor-pointer"
                            onClick={() =>
                                router.visit(route('timetables.view'))
                            }
                        />
                        <div>
                            <span className="font-bold">Timetable </span>
                            <span>| Add Schedule</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white p-4 shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
                                <div className="mb-4">
                                    <Label
                                        htmlFor="academicYear"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Academic Year{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.academic_year_id || ''}
                                        onValueChange={(value) =>
                                            setData('academic_year_id', value)
                                        }
                                        required
                                    >
                                        <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                            <SelectValue placeholder="Select Academic Year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {academic_years.map(
                                                    (year: AcademicYear) => (
                                                        <SelectItem
                                                            key={
                                                                year.academic_year_id
                                                            }
                                                            value={
                                                                year.academic_year_id
                                                            }
                                                        >
                                                            {year.academic_year}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors.academic_year_id && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.academic_year_id}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Branch{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        onValueChange={(value) => {
                                            setData('branch_id', value);
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
                                {errors.branch_id && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.branch_id}
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
                                <div className="mb-4">
                                    <label
                                        htmlFor="section_name"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Class{' '}
                                        <span className="text-red-800">*</span>
                                    </label>
                                    <div className="">
                                        <Select
                                            value={data.class_id}
                                            onValueChange={(value) => {
                                                setData('class_id', value);
                                                handleClassChanges(value);
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
                                <div className="mb-4">
                                    <label
                                        htmlFor="section"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Section{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        value={data.section_id}
                                        onValueChange={(value) => {
                                            setData('section_id', value);
                                            getTeacherBySection(value);
                                        }}
                                        required
                                    >
                                        <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                            <SelectValue placeholder="Select Section" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {sectionByClass?.map(
                                                    (s: Section) => {
                                                        return (
                                                            <SelectItem
                                                                key={
                                                                    s.section_id
                                                                }
                                                                value={
                                                                    s.section_id
                                                                }
                                                            >
                                                                {s.section_name}
                                                            </SelectItem>
                                                        );
                                                    },
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {errors.section_id && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.section_id}
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
                                <div className="mb-4">
                                    <label
                                        htmlFor="teacher"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Teacher
                                    </label>

                                    <Input
                                        value={teacher}
                                        disabled
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="subject"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Subject{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        value={data.subject_id}
                                        onValueChange={(value) => {
                                            setData('subject_id', value);
                                        }}
                                        required
                                    >
                                        <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                            <SelectValue placeholder="Select Subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {subjects?.map((s: Subject) => {
                                                    return (
                                                        <SelectItem
                                                            key={s.subject_id}
                                                            value={s.subject_id}
                                                        >
                                                            {s.subject_name}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {errors.subject_id && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.subject_id}
                                    </p>
                                )}
                            </div>
                            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Recurrence
                                    </label>
                                    {/* <select
                                        value={recurrence.pattern}
                                        onChange={(e) =>
                                            setRecurrence({
                                                ...recurrence,
                                                pattern: e.target.value,
                                            })
                                        }
                                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                    >
                                        <option value="">
                                            Does not repeat
                                        </option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select> */}
                                    <Select
                                        value={data.recurrence.pattern}
                                        onValueChange={(value) =>
                                            setData('recurrence', {
                                                ...data.recurrence,
                                                pattern: value,
                                            })
                                        }
                                        required
                                    >
                                        <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                            <SelectValue placeholder="" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="daily">
                                                    Daily
                                                </SelectItem>
                                                <SelectItem value="weekly">
                                                    Weekly
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {data.recurrence.pattern === 'weekly' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Repeat on
                                        </label>
                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                            {[
                                                'Sun',
                                                'Mon',
                                                'Tue',
                                                'Wed',
                                                'Thu',
                                                'Fri',
                                                'Sat',
                                            ].map((day, index) => (
                                                <button
                                                    key={day}
                                                    type="button"
                                                    onClick={() => {
                                                        const newDays =
                                                            data.recurrence.days.includes(
                                                                index,
                                                            )
                                                                ? data.recurrence.days.filter(
                                                                      (d) =>
                                                                          d !==
                                                                          index,
                                                                  )
                                                                : [
                                                                      ...data
                                                                          .recurrence
                                                                          .days,
                                                                      index,
                                                                  ];
                                                        setData('recurrence', {
                                                            ...data.recurrence,
                                                            days: newDays,
                                                        });
                                                    }}
                                                    disabled={
                                                        index === 0
                                                            ? true
                                                            : false
                                                    }
                                                    className={`rounded px-3 py-1 ${
                                                        data.recurrence.days.includes(
                                                            index,
                                                        )
                                                            ? 'bg-[#F06F40] text-white'
                                                            : 'bg-gray-100'
                                                    }`}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                {data.recurrence.pattern && (
                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-6">
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Start Time
                                            </label>
                                            <input
                                                type="time"
                                                min={'06:00'}
                                                max={'19:00'}
                                                value={
                                                    data.recurrence.start_time
                                                }
                                                onChange={(e) =>
                                                    setData('recurrence', {
                                                        ...data.recurrence,
                                                        start_time:
                                                            e.target.value,
                                                    })
                                                }
                                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                End Time
                                            </label>
                                            <input
                                                type="time"
                                                min={'06:00'}
                                                max={'19:00'}
                                                value={data.recurrence.end_time}
                                                onChange={(e) =>
                                                    setData('recurrence', {
                                                        ...data.recurrence,
                                                        end_time:
                                                            e.target.value,
                                                    })
                                                }
                                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Choose Color
                                </label>
                                <input
                                    type="color"
                                    value={data.color}
                                    onChange={(e) =>
                                        setData('color', e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex justify-end py-4">
                                <Button variant={'primary'} type={'submit'}>
                                    Save
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AddClassSchedule;
