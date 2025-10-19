import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { FormEvent, useEffect } from 'react';
import { toast } from 'sonner';

const GradeForm = ({
    id,
    editable,
}: {
    id?: string | undefined;
    editable?: string[];
}) => {
    const { data, setData, processing, errors, post, put, reset } = useForm({
        grade_name: '',
        grade_remark: '',
        min_mark: 0,
        max_mark: 0,
        grade_order: 1,
    });

    useEffect(() => {
        const getGrade = async () => {
            try {
                await axios.get(route('grade.edit', id)).then((response) => {
                    if (!response.status) {
                        throw new Error('Error loading properties');
                    }
                    setData(response.data);
                });
            } catch (error) {
                console.log('Failed to fetch fees');
            }
        };
        if (id) getGrade();
    }, [id]);
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (id === undefined) {
            post(route('grade.store'), {
                onSuccess: () => {
                    setData({
                        grade_name: '',
                        grade_remark: '',
                        min_mark: 0,
                        max_mark: 0,
                        grade_order: 1,
                    });
                    // Handle success, e.g., show a success message or redirect
                    toast.success('Grade added successfully!', {
                        description: 'The grade has been added to the system.',
                    });
                },
                onError: (errors) => {
                    // Handle errors, e.g., show an error message
                    toast.error('Failed to add grade.', {
                        description: 'Please check the form for errors.',
                    });
                },
            });
        } else {
            put(route('grade.update', id), {
                onSuccess: () => {
                    toast.success('Success', {
                        description: 'Grade updated successfully.',
                    });
                    reset();
                },
                onError: () => {
                    toast.error('Error', {
                        description: 'Error updating grade.',
                    });
                },
            });
        }
    };
    return (
        <form onSubmit={handleSubmit} className="py-4">
            <div className="mb-4">
                <label
                    htmlFor="grade_name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Grade Name <span className="text-red-800">*</span>
                </label>
                <Input
                    type="text"
                    id="grade_name"
                    name="grade_name"
                    value={data.grade_name}
                    onChange={(e) => setData('grade_name', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    required
                />
                {errors.grade_name && (
                    <p className="mt-2 text-sm text-red-600">
                        {errors.grade_name}
                    </p>
                )}
            </div>

            <div className="mb-4">
                <label
                    htmlFor="min_mark"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Minimum Mark <span className="text-red-800">*</span>
                </label>
                <Input
                    type="number"
                    id="min_mark"
                    name="min_mark"
                    value={data.min_mark}
                    min={0}
                    max={100}
                    onChange={(e) =>
                        setData('min_mark', parseInt(e.target.value))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    required
                />
                {errors.min_mark && (
                    <p className="mt-2 text-sm text-red-600">
                        {errors.min_mark}
                    </p>
                )}
            </div>
            <div className="mb-4">
                <label
                    htmlFor="max_mark"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Maximum Mark <span className="text-red-800">*</span>
                </label>
                <Input
                    type="number"
                    id="max_mark"
                    name="max_mark"
                    value={data.max_mark}
                    min={0}
                    max={100}
                    onChange={(e) =>
                        setData('max_mark', parseInt(e.target.value))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    required
                />
                {errors.max_mark && (
                    <p className="mt-2 text-sm text-red-600">
                        {errors.max_mark}
                    </p>
                )}
            </div>
            <div className="mb-4">
                <label
                    htmlFor="grade_remark"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Grade Remark <span className="text-red-800">*</span>
                </label>
                <Input
                    type="text"
                    id="grade_remark"
                    name="grade_remark"
                    value={data.grade_remark}
                    onChange={(e) => setData('grade_remark', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    required
                />
                {errors.grade_remark && (
                    <p className="mt-2 text-sm text-red-600">
                        {errors.grade_remark}
                    </p>
                )}
            </div>
            <div className="mb-4">
                <label
                    htmlFor="grade_order"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Grade Order <span className="text-red-800">*</span>
                </label>
                <Input
                    type="number"
                    id="grade_order"
                    name="grade_order"
                    value={data.grade_order}
                    min={1}
                    max={100}
                    onChange={(e) =>
                        setData('grade_order', parseInt(e.target.value))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    required
                />
                {errors.grade_order && (
                    <p className="mt-2 text-sm text-red-600">
                        {errors.grade_order}
                    </p>
                )}
            </div>

            <div className="flex justify-end py-4">
                <Button
                    type="submit"
                    size={'sm'}
                    variant={'primary'}
                    disabled={processing}
                >
                    {processing ? 'Saving ...' : id ? 'Update' : 'Save'}
                </Button>
            </div>
        </form>
    );
};

export default GradeForm;
