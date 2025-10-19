import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Jibble = {
    integration: string;
    client_id: string;
    client_secret: string;
};

const Jibble = ({ jibble }: { jibble: Jibble }) => {
    const { data, setData, errors, processing, post } = useForm({
        integration: 'jibble',
        client_id: jibble.client_id || '',
        client_secret: jibble.client_secret || '',
    });
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(data);
    };

    return (
        <div className="w-full md:w-2/3">
            <form onSubmit={handleSubmit}>
                <div className="rounded-md border px-4 py-4">
                    <div className="py-4">
                        <Label className="text-lg font-bold">Jibble</Label>
                    </div>
                    <div className="mb-4">
                        <Label className="block text-sm font-medium text-gray-700">
                            Client ID
                        </Label>
                        <Input
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={data.client_id}
                            onChange={(e) =>
                                setData('client_id', e.target.value)
                            }
                        />
                    </div>
                    <div className="mb-4">
                        <Label className="block text-sm font-medium text-gray-700">
                            Client Secret
                        </Label>
                        <Input
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={data.client_secret}
                            onChange={(e) =>
                                setData('client_secret', e.target.value)
                            }
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button
                            variant={'primary'}
                            size={'sm'}
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Jibble;
