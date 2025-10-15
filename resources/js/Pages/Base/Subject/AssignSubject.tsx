import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { AcademicYear, BranchType, Classes, Section, Subject } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

const AssignSubject = ({
    academic_years,
    branches,
    classes,
    subjects,
}: {
    academic_years: AcademicYear[];
    branches: BranchType[];
    classes: Classes[];
    subjects: Subject[];
}) => {
    const { data, setData, processing, errors, post } = useForm<{
        academic_year_id: string;
        subject_id: string[];
        class_id: string;
        section_id: string;
    }>({
        academic_year_id:
            academic_years.length > 0
                ? academic_years?.find((a: AcademicYear) => {
                      return a.is_current === 'true' ? a.academic_year_id : '';
                  })?.academic_year_id || ''
                : '',

        subject_id: [],
        class_id: '',
        section_id: '',
    });

    const [branch, setBranch] = useState(
        branches.length === 1 ? branches[0].branch_id : '',
    );
    const [sectionByClass, setSectionByClass] = useState<Section[]>([]);
    const [classByBranch, setClassByBranch] = useState(
        branch !== '' ? classes.filter((c) => c.branch_id === branch) : [],
    );
    const [teacher, setTeacher] = useState('');

    const filterClassByBranch = (value: string) => {
        setClassByBranch(classes.filter((c) => c.branch_id === value));
    };

    const handleClassChanges = (value: string) => {
        const s: Classes[] = classByBranch.filter(
            (c: Classes) => c.class_id === value,
        );
        setSectionByClass(s[0]?.section);
    };

    const getTeacherBySection = (value: string) => {
        const t: Section[] = sectionByClass.filter(
            (s: Section) => s.section_id === value,
        );
        setTeacher(t[0].name);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        post(route('subject_class.store'), {
            onSuccess: () => {
                toast.success('Subject assigned successf');
            },
        });
    };
    return (
        <AuthenticatedLayout>
            <Head title="Add Class" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <div>
                            <span className="font-bold">Subject </span>
                            <span> | Assign Subject</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4">
                            {/* Add your form or content for adding a class here */}
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
                                    <div className="mb-4">
                                        <label
                                            htmlFor="academicYear"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Academic Year{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <Select
                                            value={data.academic_year_id || ''}
                                            onValueChange={(value) =>
                                                setData(
                                                    'academic_year_id',
                                                    value,
                                                )
                                            }
                                            required
                                        >
                                            <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                                <SelectValue placeholder="Select Academic Year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {academic_years.map(
                                                        (
                                                            year: AcademicYear,
                                                        ) => (
                                                            <SelectItem
                                                                key={
                                                                    year.academic_year_id
                                                                }
                                                                value={
                                                                    year.academic_year_id
                                                                }
                                                            >
                                                                {
                                                                    year.academic_year
                                                                }
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
                                            Branch
                                        </Label>
                                        <Select
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
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
                                    <div className="mb-4">
                                        <label
                                            htmlFor="classes"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Class
                                        </label>
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
                                    <div className="mb-4">
                                        <label
                                            htmlFor="section"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Section
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
                                                                    {
                                                                        s.section_name
                                                                    }
                                                                </SelectItem>
                                                            );
                                                        },
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
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
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Subjects
                                    </label>
                                    <div className="mt-1 grid grid-cols-1 rounded-md md:grid-cols-2">
                                        <div className="flex flex-row flex-wrap gap-4 px-4 py-2 md:gap-6">
                                            {subjects?.map((s: Subject) => {
                                                return (
                                                    <div
                                                        className="flex flex-row items-center gap-2 rounded-md border border-gray-200 px-4 py-2"
                                                        key={s.subject_id}
                                                    >
                                                        <Checkbox
                                                            value={s.subject_id}
                                                            onCheckedChange={(
                                                                checked,
                                                            ) => {
                                                                return checked
                                                                    ? setData(
                                                                          'subject_id',
                                                                          [
                                                                              ...data.subject_id,
                                                                              s.subject_id,
                                                                          ],
                                                                      )
                                                                    : setData(
                                                                          'subject_id',
                                                                          data.subject_id?.filter(
                                                                              (
                                                                                  value,
                                                                              ) =>
                                                                                  value !==
                                                                                  s.subject_id,
                                                                          ),
                                                                      );
                                                            }}
                                                        />
                                                        <span>
                                                            {s.subject_name}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end py-4">
                                    <Button
                                        type="submit"
                                        variant={'primary'}
                                        size={'sm'}
                                    >
                                        {processing ? 'Saving ...' : 'Save'}
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

export default AssignSubject;
