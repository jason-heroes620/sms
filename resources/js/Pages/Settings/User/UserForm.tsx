import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UserFormField } from '@/types';
import Countries from '@/utils/countries.json';
import states from '@/utils/states.json';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';

type Role = {
    id: string;
    name: string;
};

type UserFormProps = {
    data: UserFormField;
    setData: (field: string, value: unknown) => void;
    errors: any;
    branches: [
        {
            label: string;
            value: string;
        },
    ];
    positions: [
        {
            position_id: string;
            position: string;
        },
    ];
};

const UserForm = ({
    data,
    setData,
    errors,
    branches,
    positions,
}: UserFormProps) => {
    const [open, setOpen] = useState(false);
    const [employmentDateOpen, setEmploymentDateOpen] = useState(false);

    return (
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
            <div>
                <div>
                    <Label>
                        Last Name{' '}
                        <span className="font-bold text-red-800">*</span>
                    </Label>

                    <Input
                        className="mt-1"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        required
                    />
                </div>
                {errors.last_name && (
                    <span className="text-sm text-red-600">
                        {errors.last_name}
                    </span>
                )}
            </div>
            <div>
                <Label>
                    First Name<span className="font-bold text-red-800">*</span>
                </Label>
                <Input
                    className="mt-1"
                    value={data.first_name}
                    onChange={(e) => setData('first_name', e.target.value)}
                    required
                />
                {errors.first_name && (
                    <span className="text-sm text-red-600">
                        {errors.first_name}
                    </span>
                )}
            </div>
            <div>
                <Label>
                    Gender<span className="font-bold text-red-800">*</span>
                </Label>
                <Select
                    value={data.gender}
                    onValueChange={(value) => setData('gender', value)}
                    required
                >
                    <SelectTrigger className="mt-1 flex w-full">
                        <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="M">Male</SelectItem>
                            <SelectItem value="F">Female</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {errors.gender && (
                    <span className="text-sm text-red-600">
                        {errors.gender}
                    </span>
                )}
            </div>
            <div>
                <Label>
                    Race<span className="font-bold text-red-800">*</span>
                </Label>
                <Select
                    name="race"
                    value={data.race}
                    onValueChange={(value) => setData('race', value)}
                    required
                >
                    <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Select Race" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                        <SelectItem value="malay">Malay</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                        <SelectItem value="indian">Indian</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
                {errors.race && (
                    <span className="text-sm text-red-600">{errors.race}</span>
                )}
            </div>
            <div>
                <Label>
                    Contact No.<span className="font-bold text-red-800">*</span>
                </Label>
                <Input
                    className="mt-1"
                    maxLength={16}
                    type="tel"
                    value={data.contact_no}
                    onChange={(e) => setData('contact_no', e.target.value)}
                    required
                />
                {errors.contact_no && (
                    <span className="text-sm text-red-600">
                        {errors.contact_no}
                    </span>
                )}
            </div>
            <div>
                <Label>
                    Email<span className="font-bold text-red-800">*</span>
                </Label>
                <Input
                    className="mt-1"
                    maxLength={150}
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                />
                {errors.email && (
                    <span className="text-sm text-red-600">{errors.email}</span>
                )}
            </div>
            <div className="col-span-2">
                <Label>
                    Address<span className="font-bold text-red-800">*</span>
                </Label>
                <Input
                    className="mt-1"
                    value={data.address.address1}
                    maxLength={100}
                    onChange={(e) =>
                        setData('address', {
                            ...data.address,
                            address1: e.target.value,
                        })
                    }
                />
                {errors['address.address1'] && (
                    <span className="text-sm text-red-600">
                        The address field is required.
                    </span>
                )}
            </div>
            <div className="col-span-2">
                <Input
                    className="mt-1"
                    value={data.address.address2}
                    maxLength={100}
                    onChange={(e) =>
                        setData('address', {
                            ...data.address,
                            address2: e.target.value,
                        })
                    }
                />
            </div>
            <div className="col-span-2">
                <Input
                    className="mt-1"
                    value={data.address.address3 || ''}
                    maxLength={100}
                    onChange={(e) =>
                        setData('address', {
                            ...data.address,
                            address3: e.target.value,
                        })
                    }
                />
            </div>
            <div>
                <Label>
                    City<span className="font-bold text-red-800">*</span>
                </Label>
                <Input
                    className="mt-1"
                    maxLength={100}
                    value={data.address.city}
                    onChange={(e) =>
                        setData('address', {
                            ...data.address,
                            city: e.target.value,
                        })
                    }
                />
                {errors['address.city'] && (
                    <span className="text-sm text-red-600">
                        The city field is required.
                    </span>
                )}
            </div>
            <div>
                <Label>
                    Postcode<span className="font-bold text-red-800">*</span>
                </Label>
                <Input
                    className="mt-1"
                    maxLength={10}
                    value={data.address.postcode}
                    onChange={(e) =>
                        setData('address', {
                            ...data.address,
                            postcode: e.target.value,
                        })
                    }
                    required
                />
                {errors['address.postcode'] && (
                    <span className="text-sm text-red-600">
                        The postcode field is required.
                    </span>
                )}
            </div>
            <div>
                <Label>
                    State<span className="font-bold text-red-800">*</span>
                </Label>
                <Select
                    name="state"
                    value={data.address.state}
                    onValueChange={(value) =>
                        setData('address', { ...data.address, state: value })
                    }
                    required
                >
                    <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                        {states.sort().map((s: string) => (
                            <SelectItem key={s} value={s}>
                                {s}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors['address.state'] && (
                    <span className="text-sm text-red-600">
                        The state field is required.
                    </span>
                )}
            </div>
            <div>
                <Label>
                    Country<span className="font-bold text-red-800">*</span>
                </Label>
                {/* <Input
                    className="mt-1"
                    maxLength={100}
                    value={data.address.country}
                    onChange={(e) =>
                        setData('address', {
                            ...data.address,
                            country: e.target.value,
                        })
                    }
                    required
                /> */}
                <Select
                    name="country"
                    value={data.address.country || 'Malaysia'}
                    onValueChange={(value) =>
                        setData('address', {
                            ...data.address,
                            country: value,
                        })
                    }
                    required
                >
                    <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                        {Countries.sort().map(
                            (c: { name: string; code: string }) => (
                                <SelectItem key={c.code} value={c.name}>
                                    {c.name}
                                </SelectItem>
                            ),
                        )}
                    </SelectContent>
                </Select>
                {errors['address.country'] && (
                    <span className="text-sm text-red-600">
                        The country field is required.
                    </span>
                )}
            </div>
            <div>
                <Label>
                    Residential Status
                    <span className="font-bold text-red-800">*</span>
                </Label>
                <Select
                    name="residential_status"
                    value={data.residential_status}
                    onValueChange={(value) =>
                        setData('residential_status', value)
                    }
                    required
                >
                    <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Select Residential Status" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                        <SelectItem value={'resident'}>Resident</SelectItem>
                        <SelectItem value={'nonresident'}>
                            Non-Resident
                        </SelectItem>
                    </SelectContent>
                </Select>
                {errors.residential_status && (
                    <span className="text-sm text-red-600">
                        {errors.residential_status}
                    </span>
                )}
            </div>
            {data.residential_status === 'resident' ? (
                <div>
                    <Label>Identification No.</Label>
                    <Input
                        className="mt-1"
                        maxLength={16}
                        value={data.nic}
                        onChange={(e) => setData('nic', e.target.value)}
                    />
                    {errors.nic && (
                        <span className="text-sm text-red-600">
                            {errors.nic}
                        </span>
                    )}
                </div>
            ) : (
                <div>
                    <Label>Passport No.</Label>
                    <Input
                        className="mt-1"
                        maxLength={20}
                        value={data.passport}
                        onChange={(e) => setData('passport', e.target.value)}
                    />
                    {errors.nic && (
                        <span className="text-sm text-red-600">
                            {errors.nic}
                        </span>
                    )}
                </div>
            )}

            <div>
                <Label>
                    DOB<span className="font-bold text-red-800">*</span>
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger className="w-full" asChild>
                        <Button
                            variant="outline"
                            id="date"
                            className="mt-1 w-full justify-between font-normal"
                        >
                            {data.dob
                                ? moment(data.dob).format('DD/MM/YYYY')
                                : 'Select date'}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-full overflow-hidden p-0"
                        align="start"
                    >
                        <Calendar
                            mode="single"
                            selected={moment(data.dob).toDate()}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                                setData(
                                    'dob',
                                    moment(date).format('YYYY-MM-DD'),
                                );
                                setOpen(false);
                            }}
                            defaultMonth={
                                data.dob
                                    ? moment(data.dob).toDate()
                                    : new Date()
                            }
                        />
                    </PopoverContent>
                </Popover>
                {errors.dob && (
                    <span className="text-sm text-red-600">{errors.dob}</span>
                )}
            </div>
            <div>
                <Label>
                    Marital Status
                    <span className="font-bold text-red-800">*</span>
                </Label>
                <Select
                    name="marital_status"
                    value={data.marital_status}
                    onValueChange={(value) => setData('marital_status', value)}
                    required
                >
                    <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Select Marital Status" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                        <SelectItem value={'single'}>Single</SelectItem>
                        <SelectItem value={'married'}>Married</SelectItem>
                        <SelectItem value={'divorced or widowed'}>
                            Divorced or widowed
                        </SelectItem>
                    </SelectContent>
                </Select>
                {errors.marital_status && (
                    <span className="text-sm text-red-600">
                        {errors.marital_status}
                    </span>
                )}
            </div>

            {data.marital_status === 'married' ? (
                <div className="rounded-md border px-2 py-4 md:col-span-2 md:px-4">
                    <div>
                        <div className="py-2">
                            <Label className="font-bold">
                                Spouse Information
                            </Label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <Label className="py-2">
                                    Employment Status
                                </Label>
                                <RadioGroup
                                    defaultValue="true"
                                    onValueChange={(value) =>
                                        setData('spouse_info', {
                                            ...data.spouse_info,
                                            employment_status: value,
                                        })
                                    }
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value={'true'}
                                            id="employed"
                                        />
                                        <Label htmlFor="employed">
                                            Employed
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value={'false'}
                                            id="unemployed"
                                        />
                                        <Label htmlFor="unemployed">
                                            Unemployed
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="flex flex-col">
                                <Label className="py-2">Ability Status</Label>
                                <RadioGroup
                                    defaultValue="false"
                                    onValueChange={(value) =>
                                        setData('spouse_info', {
                                            ...data.spouse_info,
                                            ability_status: value,
                                        })
                                    }
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value={'false'}
                                            id="false"
                                        />
                                        <Label htmlFor="employed">
                                            Non-disabled
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value={'true'}
                                            id="true"
                                        />
                                        <Label htmlFor="disabled">
                                            Disabled
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>
                    <div></div>
                </div>
            ) : null}
            <div>
                <Label>
                    Position
                    <span className="font-bold text-red-800">*</span>
                </Label>
                <Select
                    defaultValue={data.position_id}
                    onValueChange={(value) => setData('position_id', value)}
                    required
                >
                    <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Select Position" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                        {positions.map((position) => (
                            <SelectItem
                                key={position.position_id}
                                value={position.position_id}
                            >
                                {position.position}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.position_d && (
                    <span className="text-sm text-red-600">
                        {errors.position_d}
                    </span>
                )}
            </div>
            <div>
                <Label>
                    Branch
                    <span className="font-bold text-red-800">*</span>
                </Label>
                <Select
                    name="branch_id"
                    defaultValue={data.branch_id}
                    onValueChange={(value) => setData('branch_id', value)}
                    required
                >
                    <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                        {branches.map((branch) => (
                            <SelectItem key={branch.value} value={branch.value}>
                                {branch.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.branch_id && (
                    <span className="text-sm text-red-600">
                        {errors.branch_id}
                    </span>
                )}
            </div>
            <div className="">
                <label
                    htmlFor="homework_date"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Employment Date
                    <span className="text-red-800"> *</span>
                </label>
                <div className="mt-1">
                    <Popover
                        open={employmentDateOpen}
                        onOpenChange={setEmploymentDateOpen}
                    >
                        <PopoverTrigger className="w-full" asChild>
                            <Button
                                type="button"
                                variant="outline"
                                data-empty={!data.employment_date}
                                className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                            >
                                <CalendarIcon />
                                {data.employment_date ? (
                                    moment(data.employment_date).format(
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
                                    moment(data.employment_date).toDate() ??
                                    new Date()
                                }
                                onSelect={(date) => {
                                    setData(
                                        'employment_date',
                                        moment(date).format('YYYY-MM-DD'),
                                    );
                                    setEmploymentDateOpen(false);
                                }}
                                defaultMonth={
                                    data.employment_date
                                        ? moment(data.employment_date).toDate()
                                        : undefined
                                }
                            />
                        </PopoverContent>
                    </Popover>
                    {errors.employment_date && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {errors.employment_date}
                        </p>
                    )}
                </div>
            </div>
            <div>
                <Label>
                    User Status
                    <span className="font-bold text-red-800">*</span>
                </Label>
                <Select
                    name="user_status"
                    value={data.user_status}
                    onValueChange={(value) => setData('user_status', value)}
                    required
                >
                    <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default UserForm;
