import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface SubjectFormProps {
    data: {
        subject_name: string;
        subject_description: string;
    };
    setData: (field: string, value: unknown) => void;
    errors: Record<string, string>;
    processing: boolean;
    handleSubmit: (e: React.FormEvent<Element>) => void;
}

const SubjectForm = ({
    data,
    setData,
    errors,
    processing,
    handleSubmit,
}: SubjectFormProps) => {
    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3">
                <div className="col-span-1">
                    <label
                        htmlFor="subject_name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Subject Name <span className="text-red-800">*</span>
                    </label>
                    <Input
                        type="text"
                        id="subject_name"
                        name="subject_name"
                        value={data.subject_name}
                        onChange={(e) =>
                            setData('subject_name', e.target.value)
                        }
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    />
                    {errors.subject_name && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.subject_name}
                        </p>
                    )}
                </div>
            </div>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3">
                <div className="col-span-2">
                    <label
                        htmlFor="subject_description"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Subject Description
                        <span className="text-red-800"> *</span>
                    </label>
                    <Textarea
                        id="subject_description"
                        name="subject_description"
                        value={data.subject_description}
                        onChange={(e) =>
                            setData('subject_description', e.target.value)
                        }
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    />
                    {errors.subject_description && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.subject_description}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex justify-end py-4">
                <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    disabled={processing}
                >
                    {processing ? 'Saving ...' : 'Save'}
                </Button>
            </div>
        </form>
    );
};

export default SubjectForm;
