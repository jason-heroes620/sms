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
import { Switch } from '@/components/ui/switch';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Fee, UOM } from '@/types';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { CircleQuestionMark } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

type TaxCodes = {
    id: string;
    code: string;
    rate: number;
};

type ClassificationCodes = {
    code: string;
    description: string;
};

const FeeForm = ({
    id,
    editable,
}: {
    id?: string | undefined;
    editable?: string[];
}) => {
    const [uom, setUOM] = useState([]);
    const [taxes, setTaxes] = useState<TaxCodes[]>([]);
    const [taxable, setTaxable] = useState(false);
    const [feeTypes, setFeeTypes] = useState([]);
    const [classificationCodes, setClassificationCodes] = useState<
        ClassificationCodes[]
    >([]);
    const [fee, setFee] = useState<Fee>({
        fee_id: '',
        fee_label: '',
        fee_code: '',
        uom: '',
        amount: 0.0,
        tax_id: '',
        fee_status: '',
        fee_type: '',
        tax_rate: 0.0,
        tax_code: '',
        classification_code: '',
    });

    useEffect(() => {
        const fetchFeeProperties = async () => {
            try {
                await axios.get(route('fees.properties')).then((response) => {
                    if (!response.status) {
                        throw new Error('Error loading properties');
                    }
                    setUOM(response.data.uom);
                    setTaxes(response.data.taxes);
                    setFeeTypes(response.data.fee_type);
                    setClassificationCodes(response.data.classification_codes);
                });
            } catch (error) {
                console.log('Failed to fetch fee properties');
            }
        };

        const fetchFee = async () => {
            try {
                await axios.get(route('fee.edit', id)).then((response) => {
                    if (!response.status) {
                        throw new Error('Error loading properties');
                    }
                    setData(response.data.fee);
                    if (response.data.fee.tax_id != null) {
                        setTaxable(true);
                    }
                });
            } catch (error) {
                console.log('Failed to fetch fees');
            }
        };
        fetchFeeProperties();

        if (id !== undefined) {
            fetchFee();
        }
    }, [id]);

    const { data, setData, processing, errors, post, put, reset } = useForm({
        fee_label: fee?.fee_id,
        fee_code: fee?.fee_code,
        uom: fee?.uom,
        amount: fee?.amount,
        fee_type: fee?.fee_type,
        tax_id: fee?.tax_id,
        tax_rate: fee?.tax_rate,
        tax_code: fee?.tax_code,
        classification_code: fee?.classification_code,
    });

    const handleTaxChange = (tax_id: string) => {
        setData('tax_id', tax_id);
        const selectedTax = taxes.find((tax) => tax.id.toString() === tax_id);

        setData('tax_rate', selectedTax ? selectedTax.rate : 0);
        setData('tax_code', selectedTax ? selectedTax.code : '');
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (id === undefined) {
            post(route('fee.store'), {
                onSuccess: () => {
                    toast.success('Success', {
                        description: 'Fee added successfully.',
                    });
                    reset();
                },
                onError: () => {
                    toast.error('Error', {
                        description: 'Error adding fee.',
                    });
                },
            });
        } else {
            put(route('fee.update', id), {
                onSuccess: () => {
                    toast.success('Success', {
                        description: 'Fee updated successfully.',
                    });
                    reset();
                },
                onError: () => {
                    toast.error('Error', {
                        description: 'Error updating fee.',
                    });
                },
            });
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label
                        htmlFor="fee_label"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Fee Label
                        <span className="text-red-800"> *</span>
                    </label>
                    <Input
                        type="text"
                        id="fee_label"
                        value={data.fee_label}
                        maxLength={100}
                        onChange={(e) => setData('fee_label', e.target.value)}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 ${
                            errors.fee_label ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.fee_label && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {errors.fee_label}
                        </p>
                    )}
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="fee_code"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Fee Code
                        <span className="text-red-800"> *</span>
                    </label>
                    <Input
                        type="text"
                        id="fee_code"
                        value={data.fee_code}
                        maxLength={100}
                        onChange={(e) =>
                            setData('fee_code', e.target.value.toUpperCase())
                        }
                        disabled={editable?.some(
                            (value) => value === 'fee_code',
                        )}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 ${
                            errors.fee_label ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.fee_label && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {errors.fee_code}
                        </p>
                    )}
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="fee_type"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Fee Type
                        <span className="text-red-800"> *</span>
                    </label>
                    <Select
                        value={data.fee_type}
                        onValueChange={(value) => setData('fee_type', value)}
                        required
                    >
                        <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                            <SelectValue placeholder="Select Fee Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {feeTypes?.map((f: any) => {
                                    return (
                                        <SelectItem
                                            value={f.value}
                                            key={f.value}
                                        >
                                            {f.label}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors.fee_type && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {errors.fee_type}
                        </p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Classification Code{' '}
                        <span className="text-red-800">*</span>
                    </label>
                    <Select
                        value={data.classification_code}
                        onValueChange={(value) =>
                            setData('classification_code', value)
                        }
                        required
                    >
                        <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                            <SelectValue placeholder="Select Classification Code" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {classificationCodes?.map(
                                    (c: ClassificationCodes) => {
                                        return (
                                            <SelectItem
                                                value={c.code}
                                                key={c.code}
                                            >
                                                {c.code} - {c.description}
                                            </SelectItem>
                                        );
                                    },
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        UOM <span className="text-red-800">*</span>
                    </label>
                    <Select
                        value={data.uom}
                        onValueChange={(value) => setData('uom', value)}
                        required
                    >
                        <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                            <SelectValue placeholder="Select UOM" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {uom?.map((u: UOM) => {
                                    return (
                                        <SelectItem
                                            value={u.uom_value}
                                            key={u.uom_value}
                                        >
                                            {u.uom_label}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Amount
                        <span className="text-red-800"> *</span>
                    </label>
                    <Input
                        type="number"
                        step={'any'}
                        id="amount"
                        value={data.amount}
                        min={0}
                        onChange={(e) =>
                            setData('amount', parseFloat(e.target.value))
                        }
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 ${
                            errors.amount ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.amount && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {errors.amount}
                        </p>
                    )}
                </div>

                <div className="">
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        <div className="flex flex-row items-center gap-2">
                            Taxable Item
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <CircleQuestionMark size={16} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>SV6 = Service Tax 6%</p>
                                    <p>SV8 = Service Tax 8%</p>
                                    <p>SVE = Exemption Service Tax 6%</p>
                                    <p>SVE8 = Exemption Service Tax 8%</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </Label>
                    <div className="flex flex-row items-center gap-4">
                        <Label className="py-4">No</Label>
                        <Switch
                            checked={taxable ? true : false}
                            onCheckedChange={(value) => {
                                if (!value) {
                                    setData('tax_id', '');
                                }
                                setTaxable(value);
                            }}
                        />
                        <label className="pl-2">Yes</label>
                    </div>
                </div>
                <div>
                    {taxable ? (
                        <Select
                            value={data.tax_id}
                            onValueChange={(value) => handleTaxChange(value)}
                        >
                            <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                <SelectValue placeholder="Select Tax" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {taxes?.map((t: TaxCodes) => {
                                        return (
                                            <SelectItem
                                                key={t.id}
                                                value={t.id.toString()}
                                            >
                                                {`${t.code} (${t.rate}%)`}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    ) : (
                        ''
                    )}
                </div>
                <div className="flex justify-end py-4">
                    <Button
                        type="submit"
                        variant={'primary'}
                        size={'sm'}
                        disabled={processing}
                    >
                        {processing
                            ? 'Saving ...'
                            : id === undefined
                              ? 'Add'
                              : 'Update'}
                    </Button>
                </div>
            </form>
        </>
    );
};

export default FeeForm;
