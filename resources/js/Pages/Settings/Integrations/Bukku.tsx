import Checkbox from '@/components/Checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { toast } from 'sonner';

type Bukku = {
    integration: string;
    token: string;
    subdomain: string;
    integration_status: string;
};

const Bukku = ({ bukku }: { bukku: Bukku }) => {
    const { data, setData, errors, processing, put } = useForm({
        integration: 'bukku',
        token: bukku.token || '',
        subdomain: bukku.subdomain || '',
        integration_status: bukku.integration_status || 'disabled',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        put(route('integrations.update', 'bukku'), {
            onSuccess: () => {
                toast.success('Integration saved successfully');
            },
            onError: () => {
                toast.error('Unable to save integration.');
            },
        });
    };
    return (
        <form onSubmit={handleSubmit} className="w-full md:w-1/2">
            <div className="rounded-md border px-4 py-4">
                <div className="flex justify-between py-4">
                    <Label className="text-lg font-bold">Bukku</Label>
                    <div className="flex flex-row items-center gap-2">
                        <Checkbox
                            className="rounded-md"
                            checked={
                                data.integration_status === 'enabled'
                                    ? true
                                    : false
                            }
                            onChange={(e) =>
                                setData(
                                    'integration_status',
                                    e.target.checked ? 'enabled' : 'disabled',
                                )
                            }
                        />
                        <span className="text-sm">Enabled</span>
                    </div>
                </div>
                <div className="mb-4">
                    <Label className="block text-sm font-medium text-gray-700">
                        Token
                    </Label>
                    <Textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={data.token}
                        onChange={(e) => setData('token', e.target.value)}
                        disabled={
                            data.integration_status === 'disabled'
                                ? true
                                : false
                        }
                    />
                </div>
                <div className="mb-4">
                    <Label className="block text-sm font-medium text-gray-700">
                        Subdomain
                    </Label>
                    <Input
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={data.subdomain}
                        onChange={(e) => setData('subdomain', e.target.value)}
                        disabled={
                            data.integration_status === 'disabled'
                                ? true
                                : false
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
    );
};

export default Bukku;
