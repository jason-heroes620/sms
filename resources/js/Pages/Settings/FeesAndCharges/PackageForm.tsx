import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { PackageFormField } from '@/types';
import { formattedNumber } from '@/utils/formatNumber';
import { CalendarIcon } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';

type PackageFormProps = {
    data: PackageFormField;
    setData: (field: string, value: unknown) => void;
    fees: any[];
    errors: any;
};

const PackageForm = ({ data, setData, fees, errors }: PackageFormProps) => {
    const [open, setOpen] = useState(false);
    const [endOpen, setEndOpen] = useState(false);

    return (
        <div>
            <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6">
                <div className="mb-4">
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Package Name<span className="text-red-800"> *</span>
                    </Label>
                    <Input
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 ${
                            errors.package_name ? 'border-red-500' : ''
                        }`}
                        value={data.package_name}
                        maxLength={100}
                        onChange={(e) =>
                            setData('package_name', e.target.value)
                        }
                        required
                    />
                    {errors.package_name && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {errors.package_name}
                        </p>
                    )}
                </div>
                <div className="mb-4">
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Effective Date
                    </Label>
                    <div className="mt-1">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    id="date"
                                    className="w-full justify-start font-normal"
                                >
                                    <CalendarIcon />
                                    {data.effective_start_date
                                        ? moment(
                                              data.effective_start_date,
                                          ).format('DD MMM YYYY')
                                        : 'Pick a date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-60 overflow-hidden p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    captionLayout="dropdown"
                                    startMonth={moment()
                                        .subtract(2, 'years')
                                        .toDate()}
                                    endMonth={moment().add(2, 'years').toDate()}
                                    selected={moment(
                                        data.effective_start_date,
                                    ).toDate()}
                                    onSelect={(date) => {
                                        setData(
                                            'effective_start_date',
                                            moment(date).format('YYYY-MM-DD'),
                                        );
                                        setOpen(false);
                                    }}
                                    required
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.effective_start_date && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                {errors.effective_start_date}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6">
                <div className="mb-4 md:col-span-2">
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Package Description
                        <span className="text-red-800"> *</span>
                    </Label>
                    <Textarea
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 ${
                            errors.package_description ? 'border-red-500' : ''
                        }`}
                        value={data.package_description}
                        onChange={(e) =>
                            setData('package_description', e.target.value)
                        }
                        required
                    />
                    {errors.package_description && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {errors.package_description}
                        </p>
                    )}
                </div>
            </div>
            <hr />

            <div className="flex flex-col py-4">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Fees
                </Label>
                <div className="mt-1 flex max-h-60 flex-col gap-4 overflow-y-auto md:col-span-3 md:grid md:grid-cols-6 md:gap-6">
                    {fees.map((f) => (
                        <Card className="px py-2" key={f.fee_id}>
                            <CardContent>
                                <div className="flex flex-row items-center gap-4">
                                    <Checkbox
                                        value={f.fee_id}
                                        checked={data.fees.some(
                                            (d) => d.fee_id === f.fee_id,
                                        )}
                                        onCheckedChange={(checked) => {
                                            return checked
                                                ? setData('fees', [
                                                      ...data.fees,
                                                      {
                                                          fee_id: f.fee_id,
                                                          amount: f.amount,
                                                      },
                                                  ])
                                                : setData(
                                                      'fees',
                                                      data.fees?.filter(
                                                          (d) =>
                                                              d.fee_id !==
                                                              f.fee_id,
                                                      ),
                                                  );
                                        }}
                                    />
                                    <div className="flex flex-col gap-1">
                                        <Label className="text-sm font-bold">
                                            {f.fee_label}
                                        </Label>
                                        <span className="flex flex-row text-sm font-bold text-gray-700 dark:text-gray-300">
                                            {formattedNumber(f.amount)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div>
                    {errors.fees && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {errors.fees}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <hr />
            </div>
            <div className="flex flex-row gap-6 py-4">
                <div>
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Recurring Charges
                    </Label>
                    <div className="flex flex-row items-center gap-4">
                        <Label className="py-4">No</Label>
                        <Switch
                            onCheckedChange={(value) =>
                                setData('recurring', value)
                            }
                        />
                        <label className="pl-2">Yes</label>
                    </div>
                </div>
                <div>
                    {data.recurring && (
                        <div>
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Frequency
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    setData('frequency', value)
                                }
                                required
                            >
                                <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                    <SelectValue placeholder="Select Frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {/* <SelectItem
                                            value={'one_time'}
                                            key={'one_time'}
                                        >
                                            One Time
                                        </SelectItem> */}
                                        <SelectItem
                                            value={'monthly'}
                                            key={'monthly'}
                                        >
                                            Monthly
                                        </SelectItem>
                                        <SelectItem
                                            value={'annual'}
                                            key={'annual'}
                                        >
                                            Annual
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex w-full justify-end">
                <div className="rounded-md border border-red-600 px-4 py-2 shadow-md">
                    <span>Package Total </span>
                    <span className="text-lg font-bold">
                        {formattedNumber(
                            data.fees.reduce(
                                (sum: number, f: any) =>
                                    sum + parseFloat(f.amount),
                                0.0,
                            ),
                        )}
                    </span>
                </div>
            </div>
            {data.package_status && (
                <div className="flex md:grid md:grid-cols-3">
                    <div className="mb-4 flex flex-col md:col-span-1">
                        <label
                            htmlFor="fee_type"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Status
                            <span className="text-red-800"> *</span>
                        </label>
                        <Select
                            value={data.package_status}
                            onValueChange={(value) =>
                                setData('package_status', value)
                            }
                            required
                        >
                            <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={'active'} key={'active'}>
                                        {'Active'}
                                    </SelectItem>
                                    <SelectItem
                                        value={'inactive'}
                                        key={'inactive'}
                                    >
                                        {'Inactive'}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.package_status && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                {errors.package_status}
                            </p>
                        )}
                    </div>
                </div>
            )}
            {data.package_status === 'inactive' && (
                <div className="mb-4 flex md:grid md:grid-cols-3">
                    <div className="mb-4 flex flex-col md:col-span-1">
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Effective End Date
                        </Label>
                        <div className="mt-1">
                            <Popover open={endOpen} onOpenChange={setEndOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="date"
                                        className="w-full justify-start font-normal"
                                    >
                                        <CalendarIcon />
                                        {data.effective_end_date
                                            ? moment(
                                                  data.effective_end_date,
                                              ).format('DD MMM YYYY')
                                            : 'Pick a date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-60 overflow-hidden p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        captionLayout="dropdown"
                                        startMonth={moment()
                                            .subtract(2, 'years')
                                            .toDate()}
                                        endMonth={moment()
                                            .add(2, 'years')
                                            .toDate()}
                                        selected={moment(
                                            data.effective_end_date,
                                        ).toDate()}
                                        onSelect={(date) => {
                                            setData(
                                                'effective_end_date',
                                                moment(date).format(
                                                    'YYYY-MM-DD',
                                                ),
                                            );
                                            setOpen(false);
                                        }}
                                        required
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.effecitve_end_date && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                    {errors.effective_end_date}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PackageForm;
