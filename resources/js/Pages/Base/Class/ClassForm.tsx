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
import { AcademicYear, BranchType } from '@/types';

interface StudentFormProps {
    data: {
        academic_year_id: string | undefined;
        class_name: string;
        class_description: string;
        branch_id: string;
    };
    setData: (field: string, value: unknown) => void;
    errors: Record<string, string>;
    processing: boolean;
    handleSubmit: (e: React.FormEvent<Element>) => void;
    branches: BranchType[];
    academic_years: AcademicYear[];
}

const ClassForm = ({
    data,
    setData,
    errors,
    processing,
    handleSubmit,
    branches,
    academic_years,
}: StudentFormProps) => {
    return (
        <div>
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
                                                key={year.academic_year_id}
                                                value={year.academic_year_id}
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
                            Branch
                        </Label>
                        <Select
                            value={data.branch_id || ''}
                            onValueChange={(value) =>
                                setData('branch_id', value)
                            }
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
                </div>

                <div className="mb-4 grid grid-cols-1 md:grid-cols-3 md:gap-6">
                    <div>
                        <label
                            htmlFor="className"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Class Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            id="class_name"
                            name="class_name"
                            value={data.class_name}
                            onChange={(e) =>
                                setData('class_name', e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                            required
                        />
                        {errors.class_name && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.class_name}
                            </p>
                        )}
                    </div>
                </div>
                <div className="mb-4 grid grid-cols-1 md:grid-cols-3">
                    <div className="col-span-2">
                        <label
                            htmlFor="class_description"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Class Description
                        </label>
                        <Textarea
                            id="class_description"
                            name="class_description"
                            value={data.class_description}
                            onChange={(e) =>
                                setData('class_description', e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                            required
                        />
                        {errors.class_description && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.class_description}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end py-4">
                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        disabled={processing}
                    >
                        {processing ? 'Saving ...' : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ClassForm;
