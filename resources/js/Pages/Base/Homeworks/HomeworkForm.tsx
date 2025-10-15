import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { BranchType, Classes } from '@/types';
import { CalendarIcon } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';

type Subject = {
    subject_id: string;
    subject_name: string;
    subject_description: string;
};

interface SubjectHomeworkFormProps {
    data: {
        homework_description: string;
        homework_date: string;
        subject_id: string;
        class_id: string;
        branch_id?: string;
    };
    setData: (field: string, value: unknown) => void;
    errors: Record<string, string>;
    processing: boolean;
    handleSubmit: (e: React.FormEvent<Element>) => void;
    branches: BranchType[];
    classes: Classes[];
}

const HomeworkForm = ({
    data,
    setData,
    errors,
    processing,
    handleSubmit,
    branches,
    classes,
}: SubjectHomeworkFormProps) => {
    const [open, setOpen] = useState(false);

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
    const [subjects, setSubjects] = useState<Subject[]>(
        data.class_id
            ? classes.filter((c) => c.class_id === data.class_id)[0].subjects
            : [],
    );
    const filterClassByBranch = (value: string) => {
        setClassByBranch(classes.filter((c) => c.branch_id === value));
    };

    const handleClassChange = (value: string) => {
        const c = classes.filter((c) => c.class_id === value)[0];
        setSubjects(c.subjects);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                <div className="mb-4">
                    <label
                        htmlFor="homework_date"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Homework Date
                        <span className="text-red-800"> *</span>
                    </label>
                    <div className="mt-1">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger className="w-full" asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    data-empty={!data.homework_date}
                                    className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                                >
                                    <CalendarIcon />
                                    {data.homework_date ? (
                                        moment(data.homework_date).format(
                                            'DD MMM YYYY',
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={
                                        moment(data.homework_date).toDate() ??
                                        new Date()
                                    }
                                    onSelect={(date) => {
                                        setData(
                                            'homework_date',
                                            moment(date).format('YYYY-MM-DD'),
                                        );
                                        setOpen(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.homework_date && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                {errors.homework_date}
                            </p>
                        )}
                    </div>
                </div>
            </div>
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
                                {branches?.map((branch: BranchType) => (
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
                            onValueChange={(value) => {
                                setData('class_id', value);
                                handleClassChange(value);
                            }}
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
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Subject <span className="text-red-800">*</span>
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
                                {subjects?.map((s: any) => {
                                    return (
                                        <SelectItem
                                            value={s.subject_id}
                                            key={s.subject_id}
                                        >
                                            {s.subject_name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Homework Description
                        <span className="text-red-800"> *</span>
                    </label>
                    <div className="mt-1">
                        <Textarea
                            value={data.homework_description}
                            onChange={(e) =>
                                setData('homework_description', e.target.value)
                            }
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-end py-4">
                <Button type="submit" variant={'primary'} disabled={processing}>
                    {processing ? 'Saving ...' : 'Save'}
                </Button>
            </div>
        </form>
    );
};

export default HomeworkForm;
