import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'sonner';

type Account = {
    id: string;
    code: number;
    name: string;
    type: string;
};

type Tax = {
    id: string;
    code: string;
    rate: number;
    tax_system: string;
    is_archived: boolean;
    is_exempted: boolean;
};

type Term = {
    id: string;
    name: string;
};

const Configurations = ({
    accounts,
    tax_codes,
    terms,
    account_receivables,
}: {
    accounts: Account[];
    tax_codes: Tax[];
    terms: Term[];
    account_receivables: Account[];
}) => {
    const { data, setData, errors, processing, post } = useForm({
        income_account: '',
        service_tax: '',
        term: '',
        account_receivable: '',
    });

    const getData = async () => {
        await axios.get(route('configurations.index')).then((resp) => {
            resp.data.data.forEach((c: any) => {
                setData((prev) => ({
                    ...prev,
                    [c.configuration_name]: c.value,
                }));
            });
        });
    };

    useEffect(() => {
        getData();
    }, []);

    const handleChange = (name: keyof typeof data, value: string) => {
        setData(name, value);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log('handle post');
        post(route('configurations.store'), {
            onSuccess: () => {
                toast.success('Configurations saved successfully');
            },
            onError: () => {
                toast.error('Failed to save configurations.');
            },
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            {processing && (
                <div className="bg-opacity-50 absolute inset-0 z-10 flex items-center justify-center bg-white">
                    <Loading />
                </div>
            )}
            <div className="rounded-md border px-4 py-4">
                <div className="w-full md:w-1/2">
                    <div className="mb-4">
                        <Label
                            htmlFor="income_account"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Default Income Account
                            <span className="text-red-800"> *</span>
                        </Label>
                        <Select
                            value={data.income_account}
                            onValueChange={(value) =>
                                handleChange('income_account', value)
                            }
                            required
                        >
                            <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                <SelectValue placeholder="Default Income Account" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {accounts?.map((a: Account) => {
                                        return (
                                            <SelectItem
                                                value={a.id.toString()}
                                                key={a.id}
                                            >
                                                <span className="font-bold">
                                                    {a.code}
                                                </span>{' '}
                                                - {a.name}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.income_account && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                {errors.income_account}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <Label
                            htmlFor="receivable_account"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Account Receivable
                            <span className="text-red-800"> *</span>
                        </Label>
                        <Select
                            value={data.account_receivable}
                            onValueChange={(value) =>
                                handleChange('account_receivable', value)
                            }
                            required
                        >
                            <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                <SelectValue placeholder="Default Receivable Account" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {account_receivables?.map((a: Account) => {
                                        return (
                                            <SelectItem
                                                value={a.id.toString()}
                                                key={a.id}
                                            >
                                                <span className="font-bold">
                                                    {a.code}
                                                </span>{' '}
                                                - {a.name}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.account_receivable && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                {errors.account_receivable}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <Label
                            htmlFor="service_tax"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Service Tax
                            <span className="text-red-800"> *</span>
                        </Label>
                        <Select
                            value={data.service_tax}
                            onValueChange={(value) =>
                                handleChange('service_tax', value)
                            }
                            required
                        >
                            <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                <SelectValue placeholder="Service Tax" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {tax_codes?.map((t: any) => {
                                        return (
                                            <SelectItem
                                                value={t.id.toString()}
                                                key={t.id}
                                            >
                                                <span className="font-bold">
                                                    {t.code}
                                                </span>{' '}
                                                {t.name} ({t.rate})%
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.service_tax && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                {errors.service_tax}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <Label
                            htmlFor="term"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Paytment Term
                            <span className="text-red-800"> *</span>
                        </Label>
                        <Select
                            value={data.term}
                            onValueChange={(value) =>
                                handleChange('term', value)
                            }
                            required
                        >
                            <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                <SelectValue placeholder="Payment Term" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {terms?.map((t: any) => {
                                        return (
                                            <SelectItem
                                                value={t.id.toString()}
                                                key={t.id}
                                            >
                                                <span className="font-bold">
                                                    {t.code}
                                                </span>{' '}
                                                {t.name}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.term && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                {errors.term}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button type={'submit'} variant={'primary'} size={'sm'}>
                        {processing ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default Configurations;
