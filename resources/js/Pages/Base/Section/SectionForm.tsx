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
import { BranchType, Classes, Teacher } from '@/types';
import { useState } from 'react';

interface SectionFormProps {
    data: {
        branch_id?: string;
        section_name: string;
        class_id: string;
        teacher_in_charge: string;
        capacity: number;
    };
    setData: (field: string, value: unknown) => void;
    errors: Record<string, string>;
    processing: boolean;
    handleSubmit: (e: React.FormEvent<Element>) => void;
    classes: Classes[];
    branches: BranchType[];
    teachers: Teacher[];
}

const SectionForm = ({
    data,
    setData,
    errors,
    processing,
    handleSubmit,
    classes,
    branches,
    teachers,
}: SectionFormProps) => {
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
    const [teacherByBranch, setTeacherByBranch] = useState(
        branch !== '' ? teachers.filter((t) => t.branch_id === branch) : [],
    );

    const filterClassByBranch = (value: string) => {
        setClassByBranch(classes.filter((c) => c.branch_id === value));
        setTeacherByBranch(teachers.filter((t) => t.branch_id === value));
    };

    return (
        <form onSubmit={handleSubmit} className="py-4">
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
                                {branches.map((branch: BranchType) => (
                                    <SelectItem
                                        key={branch.branch_id}
                                        value={branch.branch_id}
                                    >
                                        {branch.branch_name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="section_name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Class <span className="text-red-800">*</span>
                    </label>
                    <div className="">
                        <Select
                            value={data.class_id}
                            onValueChange={(value) =>
                                setData('class_id', value)
                            }
                            required
                        >
                            <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {classByBranch?.map((c: Classes) => {
                                        return (
                                            <SelectItem
                                                key={c.class_id}
                                                value={c.class_id}
                                            >
                                                {c.class_name}
                                            </SelectItem>
                                        );
                                    })}
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
            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
                <div className="mb-4">
                    <label
                        htmlFor="section_name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Section <span className="text-red-800">*</span>
                    </label>
                    <Input
                        type="text"
                        id="section_name"
                        name="section_name"
                        value={data.section_name}
                        min={0}
                        max={100}
                        onChange={(e) =>
                            setData('section_name', e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                        required
                    />
                    {errors.section_name && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.section_name}
                        </p>
                    )}
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="teacher_in_charge"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Teacher In Charge{' '}
                        <span className="text-red-800">*</span>
                    </label>
                    <div className="">
                        <Select
                            value={data.teacher_in_charge}
                            onValueChange={(value) =>
                                setData('teacher_in_charge', value)
                            }
                            required
                        >
                            <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                <SelectValue placeholder="Select Teacher In Charge" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {teacherByBranch?.map((t: Teacher) => {
                                        return (
                                            <SelectItem
                                                key={t.user_id}
                                                value={t.user_id}
                                            >
                                                {t.name}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {errors.teacher_in_charge && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.teacher_in_charge}
                        </p>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
                <div className="mb-4">
                    <label
                        htmlFor="capacity"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Capacity <span className="text-red-800">*</span>
                    </label>
                    <Input
                        type="number"
                        id="capacity"
                        name="capacity"
                        value={data.capacity}
                        min={0}
                        max={100}
                        onChange={(e) =>
                            setData('capacity', parseInt(e.target.value))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                        required
                    />
                    {errors.capacity && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.capacity}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-end py-4">
                <Button
                    type="submit"
                    size={'sm'}
                    variant={'primary'}
                    disabled={processing}
                >
                    {processing ? 'Saving ...' : 'Save'}
                </Button>
            </div>
        </form>
    );
};

export default SectionForm;
