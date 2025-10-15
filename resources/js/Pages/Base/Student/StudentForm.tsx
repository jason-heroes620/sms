import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
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
import { Textarea } from '@/components/ui/textarea';
import { Classes, Section } from '@/types';
import { CalendarIcon } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';

const StudentForm = ({ data, setData, errors, classes }: any) => {
    const [openAdmissionDate, setOpenAdmissionDate] = useState(false);
    const [openDOB, setOpenDOB] = useState(false);

    const [sectionByClass, setSectionByClass] = useState<Section[]>(
        data.class_id
            ? classes.filter((c: Classes) => c.class_id === data.class_id)[0]
                  .section
            : [],
    );

    const handleClassChanges = (value: string) => {
        const s: Classes[] = classes.filter(
            (c: Classes) => c.class_id === value,
        );
        setSectionByClass(s[0]?.section);
    };

    return (
        <>
            <div className="flex w-full flex-col md:grid md:grid-cols-3 md:gap-4">
                <div className="mb-4">
                    <label
                        htmlFor="first_name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Assign Class{' '}
                        <span className="font-bold text-red-800">*</span>
                    </label>
                    <Select
                        value={data.class_id}
                        onValueChange={(value) => {
                            setData('class_id', value);
                            handleClassChanges(value);
                        }}
                        required
                    >
                        <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                            <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {classes?.map((c: Classes) => {
                                    return (
                                        <SelectItem
                                            key={`${c.class_id}`}
                                            value={`${c.class_id}`}
                                        >
                                            {`(${c.branch_name}) - ${c.class_name}`}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="section"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Section <span className="text-red-500">*</span>
                    </label>
                    <Select
                        value={data.section_id}
                        onValueChange={(value) => {
                            setData('section_id', value);
                        }}
                        required
                    >
                        <SelectTrigger className="mt-1 flex w-full border-gray-300 shadow-sm">
                            <SelectValue placeholder="Select Section" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {sectionByClass?.map((s: Section) => {
                                    return (
                                        <SelectItem
                                            key={s.section_id}
                                            value={s.section_id}
                                        >
                                            {s.section_name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {errors.section_id && (
                    <p className="mt-2 text-sm text-red-600">
                        {errors.section_id}
                    </p>
                )}
            </div>
            <div>
                <span className="font-bold italic">Student Information</span>
                <hr />
            </div>
            <div className="flex flex-col-reverse gap-4 md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-2">
                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                        {/* First Name */}
                        <div>
                            <label
                                htmlFor="first_name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                First Name{' '}
                                <span className="font-bold text-red-800">
                                    *
                                </span>
                            </label>
                            <Input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={data.first_name}
                                onChange={(e) =>
                                    setData('first_name', e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                            {errors.first_name && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.first_name}
                                </p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label
                                htmlFor="last_name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Last Name{' '}
                                <span className="font-bold text-red-800">
                                    *
                                </span>
                            </label>
                            <Input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={data.last_name}
                                onChange={(e) =>
                                    setData('last_name', e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                            {errors.last_name && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.last_name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Additional Details Section */}
                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                        {/* Date of Birth */}
                        <div>
                            <label
                                htmlFor="dob"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Date of Birth{' '}
                                <span className="font-bold text-red-800">
                                    *
                                </span>
                            </label>
                            <Popover open={openDOB} onOpenChange={setOpenDOB}>
                                <PopoverTrigger className="mt-1 w-full" asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        data-empty={!data.dob}
                                        className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon />
                                        {data.dob ? (
                                            moment(data.dob).format(
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
                                        captionLayout="dropdown"
                                        selected={
                                            moment(data.dob).toDate() ??
                                            new Date()
                                        }
                                        onSelect={(date) => {
                                            setData(
                                                'dob',
                                                moment(date).format(
                                                    'YYYY-MM-DD',
                                                ),
                                            );
                                            setOpenDOB(false);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.dob && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.dob}
                                </p>
                            )}
                        </div>

                        {/* Gender */}
                        <div>
                            <label
                                htmlFor="gender"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Gender{' '}
                                <span className="font-bold text-red-800">
                                    *
                                </span>
                            </label>

                            <Select
                                name="gender"
                                value={data.gender}
                                onValueChange={(value) =>
                                    setData('gender', value)
                                }
                            >
                                <SelectTrigger className="mt-1 w-full">
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    <SelectItem value="M">Male</SelectItem>
                                    <SelectItem value="F">Female</SelectItem>
                                </SelectContent>
                            </Select>

                            {errors.gender && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.gender}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                        {/* Identification Card No. / Passport No. */}
                        <div>
                            <label
                                htmlFor="nic"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Identification Card No. / Passport No.{' '}
                                <span className="font-bold text-red-800">
                                    *
                                </span>
                            </label>
                            <Input
                                type="text"
                                id="nic"
                                name="nic"
                                value={data.nic}
                                onChange={(e) => setData('nic', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                            {errors.nic && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.nic}
                                </p>
                            )}
                        </div>

                        {/* Profile Picture */}
                        {/* <div>
                            <label
                                htmlFor="profile_pic"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Profile Picture{' '}
                                <span className="font-bold text-red-800">
                                    *
                                </span>
                            </label>
                            <Input
                                type="file"
                                id="profile_pic"
                                name="profile_pic"
                                value={data.profile_pic}
                                onChange={(e) =>
                                    setData('profile_pic', e.target.value)
                                }
                                className="mt-1 flex w-full items-center"
                                required
                            />
                        </div> */}
                    </div>
                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                        <div>
                            <label
                                htmlFor="race"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Race
                            </label>

                            <Select
                                name="race"
                                value={data.race}
                                onValueChange={(value) =>
                                    setData('race', value)
                                }
                            >
                                <SelectTrigger className="mt-1 w-full">
                                    <SelectValue placeholder="Select Race" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    <SelectItem value="malay">Malay</SelectItem>
                                    <SelectItem value="chinese">
                                        Chinese
                                    </SelectItem>
                                    <SelectItem value="indian">
                                        Indian
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>

                            {errors.race && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.race}
                                </p>
                            )}
                        </div>
                        {/* Religion */}
                        <div>
                            <label
                                htmlFor="religion"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Religion
                            </label>

                            <Select
                                name="religion"
                                value={data.religion}
                                onValueChange={(value) =>
                                    setData('religion', value)
                                }
                            >
                                <SelectTrigger className="mt-1 w-full">
                                    <SelectValue placeholder="Select Religion" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    <SelectItem value="islam">Islam</SelectItem>
                                    <SelectItem value="buddhist">
                                        Buddhist
                                    </SelectItem>
                                    <SelectItem value="hindu">Hindu</SelectItem>
                                    <SelectItem value="christian">
                                        Christian
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>

                            {errors.religion && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.religion}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mb-4 py-2">
                        <span className="font-bold italic">
                            Other Information
                        </span>
                        <hr />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                        <div className="">
                            <label
                                htmlFor="registration_no"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Student Registration No.{' '}
                                <span className="font-bold text-red-800">
                                    *
                                </span>
                            </label>
                            <Input
                                type="text"
                                id="registration_no"
                                name="registration_no"
                                value={data.registration_no}
                                onChange={(e) =>
                                    setData('registration_no', e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                            {errors.registration_no && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.registration_no}
                                </p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="admission_date"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Admission Date{' '}
                                <span className="font-bold text-red-800">
                                    *
                                </span>
                            </label>
                            <Popover
                                open={openAdmissionDate}
                                onOpenChange={setOpenAdmissionDate}
                            >
                                <PopoverTrigger className="mt-1 w-full" asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        data-empty={!data.admission_date}
                                        className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon />
                                        {data.admission_date ? (
                                            moment(data.admission_date).format(
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
                                        captionLayout="dropdown"
                                        selected={
                                            moment(
                                                data.admission_date,
                                            ).toDate() ?? new Date()
                                        }
                                        onSelect={(date) => {
                                            setData(
                                                'admission_date',
                                                moment(date).format(
                                                    'YYYY-MM-DD',
                                                ),
                                            );
                                            setOpenAdmissionDate(false);
                                        }}
                                        defaultMonth={data.admission_date}
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.admission_date && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.admission_date}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="allergy"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Allergy
                        </label>
                        <Textarea
                            className="mt-1"
                            placeholder="Allergy if any"
                            value={data.allergy}
                            onChange={(e) => setData('allergy', e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="disease"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Disease
                        </label>
                        <Textarea
                            className="mt-1"
                            placeholder="Disease if any"
                            value={data.disease}
                            onChange={(e) => setData('disease', e.target.value)}
                        />
                    </div>
                    <div>
                        <div>
                            <label
                                htmlFor="additional_notes"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Additional Note
                            </label>
                            <Textarea
                                className="mt-1"
                                placeholder="Additional note if any"
                                onChange={(e) =>
                                    setData('additional_notes', e.target.value)
                                }
                                value={data.additional_notes}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 md:col-span-1 md:grid-rows-2">
                    <div className="flex flex-col items-center gap-2 rounded-md border p-4">
                        <span className="font-bold">Profile Picture</span>
                        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-200">
                            {data.profile_picture != undefined ? (
                                <img />
                            ) : (
                                <span>No Image</span>
                            )}
                        </div>
                        <div className="w-full py-4 md:w-[50%]">
                            <Input type="file" value={undefined} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentForm;
