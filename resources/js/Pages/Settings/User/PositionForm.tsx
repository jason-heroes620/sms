import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { FormEvent, useEffect } from 'react';
import { toast } from 'sonner';

const PositionForm = ({
    id,
    editable,
}: {
    id?: string;
    editable?: boolean;
}) => {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        position: '',
    });

    const getPosition = async (id: string | undefined) => {
        if (id) {
            await axios.get(route('position.edit', id)).then((response) => {
                setData(response.data.position);
            });
        }
    };

    useEffect(() => {
        getPosition(id);
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (id) {
            put(route('position.update', id), {
                onSuccess: () => {
                    toast.success('Position updated successfully');
                    reset();
                },
            });
        } else {
            post(route('position.store'), {
                onSuccess: () => {
                    toast.success('Position added successfully');
                    reset();
                },
            });
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4 flex flex-col">
                    <label
                        htmlFor="position"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Position <span className="text-red-800">*</span>
                    </label>
                    <Input
                        className="mt-1"
                        maxLength={50}
                        defaultValue={data.position}
                        onChange={(e) => setData('position', e.target.value)}
                        required
                    />
                    {errors.position && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.position}
                        </p>
                    )}
                </div>

                <div className="flex justify-end py-4">
                    <Button
                        type="submit"
                        variant={'primary'}
                        size={'sm'}
                        disabled={processing}
                    >
                        {processing ? 'Saving ...' : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PositionForm;
