import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { CalendarIcon } from 'lucide-react';
import moment from 'moment';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

const AcademicYearForm = ({
    id,
    editable,
}: {
    id?: string | null;
    editable?: string[];
}) => {
    const { data, setData, processing, errors, post, put, reset } = useForm<{
        academic_year: string;
        start_date: string | undefined;
        end_date: string | undefined;
        is_current: boolean;
    }>({
        academic_year: '',
        start_date: '',
        end_date: '',
        is_current: false,
    });

    const [startDateOpen, setStartDateOpen] = useState(false);
    const [endDateOpen, setEndDateOpen] = useState(false);

    useEffect(() => {
        if (id) {
            axios.get(route('academic-year.edit', id)).then((resp) => {
                if (resp.status === 200) {
                    console.log(resp.data);
                    setData(resp.data);
                }
            });
        }
    }, [id]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (id) {
            put(route('academic-year.update', id), {
                onSuccess: () => {
                    reset;
                    toast.success('Academic year updated successfully');
                },
                onError: (error) => {
                    toast.error('Failed to update academic year.', {
                        description: 'Please check the form for errors.',
                    });
                },
            });
        } else {
            post(route('academic-year.store'), {
                preserveState: true,
                onSuccess: () => {
                    toast.success('New Academic Year Saved.');
                },
                onError: (error) => {
                    toast.error('Error saving new academic year.');
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col">
                <label
                    htmlFor="academic_year"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Academic Year <span className="text-red-800">*</span>
                </label>
                <Input
                    className="mt-1"
                    maxLength={30}
                    onChange={(e) => setData('academic_year', e.target.value)}
                    value={data.academic_year}
                    required
                />
                {errors.academic_year && (
                    <p className="mt-2 text-sm text-red-600">
                        {errors.academic_year}
                    </p>
                )}
            </div>
            <div className="mb-4 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Start Date <span className="text-red-800">*</span>
                </label>
                <div className="z-50 mt-1">
                    <Popover
                        open={startDateOpen}
                        onOpenChange={setStartDateOpen}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="date"
                                className="w-full justify-start font-normal"
                            >
                                <CalendarIcon />
                                {data.start_date !== ''
                                    ? moment(data.start_date).format(
                                          'DD MMM YYYY',
                                      )
                                    : 'Pick a date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="pointer-events-auto z-50 w-60 overflow-hidden p-0"
                            align="start"
                        >
                            <Calendar
                                mode="single"
                                captionLayout="dropdown"
                                startMonth={moment()
                                    .subtract(2, 'years')
                                    .toDate()}
                                endMonth={moment().add(2, 'years').toDate()}
                                selected={moment(data.start_date).toDate()}
                                onSelect={(date) => {
                                    setData(
                                        'start_date',
                                        moment(date).format('YYYY-MM-DD'),
                                    );
                                    setStartDateOpen(false);
                                }}
                                month={
                                    data.start_date
                                        ? moment(data.start_date).toDate()
                                        : undefined
                                }
                                required
                            />
                        </PopoverContent>
                    </Popover>
                    {errors.start_date && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {errors.start_date}
                        </p>
                    )}
                </div>
            </div>
            <div className="mb-4 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    End Date <span className="text-red-800">*</span>
                </label>
                <div className="mt-1">
                    <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="date"
                                className="data-[empty=true]:text-muted-foreground w-full justify-start font-normal"
                            >
                                <CalendarIcon />
                                {data.end_date
                                    ? moment(data.end_date).format(
                                          'DD MMM YYYY',
                                      )
                                    : 'Pick a date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="pointer-events-auto w-60 overflow-hidden p-0"
                            align="start"
                        >
                            <Calendar
                                mode="single"
                                captionLayout="dropdown"
                                selected={moment(data.end_date).toDate()}
                                onSelect={(date) => {
                                    setData(
                                        'end_date',
                                        moment(date).format('YYYY-MM-DD'),
                                    );
                                    setEndDateOpen(false);
                                }}
                                startMonth={moment()
                                    .subtract(2, 'years')
                                    .toDate()}
                                endMonth={moment().add(2, 'years').toDate()}
                                month={
                                    data.end_date
                                        ? moment(data.end_date).toDate()
                                        : undefined
                                }
                                required
                            />
                        </PopoverContent>
                    </Popover>
                    {errors.end_date && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {errors.end_date}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center">
                <Switch
                    checked={data.is_current}
                    onCheckedChange={(value) => setData('is_current', value)}
                />
                <label className="pl-2">Set As Current</label>
            </div>
            <div className="flex justify-end py-4">
                <Button
                    type="submit"
                    variant={'primary'}
                    size={'sm'}
                    disabled={processing}
                >
                    {processing ? 'Saving ...' : id ? 'Update' : 'Save'}
                </Button>
            </div>
        </form>
    );
};

export default AcademicYearForm;
