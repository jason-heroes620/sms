import EventModal from '@/components/Modal/CalendarEventModal';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { AcademicYear, BranchType, Classes, PageProps, Subject } from '@/types';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Head, useForm } from '@inertiajs/react';
import moment from 'moment';
import { useState } from 'react';

interface Event {
    id: number;
    title: string;
    course_code: string;
    location: string;
    instructor: string;
    description: string;
    start: string;
    end: string;
    allDay: boolean;
    color: string;
}

export default function Calendar({
    academic_years,
    branches,
    classes,
    subjects,
    events,
    holidays,
}: PageProps<{
    academic_years: AcademicYear;
    branches: BranchType;
    classes: Classes;
    subjects: Subject;
    events: any;
    holidays: any;
}>) {
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [calendarView, setCalendarView] = useState('timeGridWeek');
    const isMobile = useIsMobile();
    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
    } = useForm({
        title: '',
        instructor: '',
        start: '',
        end: '',
        allDay: false,
        color: '#3b82f6',
    });
    const handleDateClick = (arg: any) => {
        setData({
            ...data,
            start: arg.dateStr,
            end: arg.dateStr,
            allDay: arg.allDay,
        });
        setSelectedEvent(null);
        setShowModal(true);
    };

    const handleEventClick = (info: any) => {
        const event = info.event;
        setSelectedEvent({
            id: event.id,
            title: event.title,
            course_code: event.extendedProps.course_code,
            location: event.extendedProps.location,
            instructor: event.extendedProps.instructor,
            description: event.extendedProps.description,
            start: event.startStr,
            end: event.endStr,
            allDay: event.allDay,
            color: event.backgroundColor,
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedEvent) {
            put(`/events/${selectedEvent.id}`, {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post('/events', {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const handleDelete = () => {
        if (selectedEvent) {
            destroy(`/events/${selectedEvent.id}`, {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const isHoliday = (dateStr: string): boolean => {
        return holidays.includes(dateStr);
    };

    const dayCellDidMount = (info: any) => {
        const cellDate = moment(info.date).format('yyyy-MM-DD');
        const isAllDay = events
            .filter((f: any) => f.allDay === true)
            .some((event: any) => {
                const eventDate = moment(event.start).format('yyyy-MM-DD');
                return eventDate === cellDate;
            });
        if (isAllDay) {
            // Apply the custom background color to the entire column
            info.el.style.backgroundColor = '#e8f3f8'; // A light blue color, similar to today's date
        }
    };
    return (
        <AuthenticatedLayout>
            <Head title="Timetables" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <div>
                            <span className="font-bold">Timetable</span>
                        </div>
                    </div>
                </div>
                <div className="py-4">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex flex-col gap-4 px-4 py-4 md:grid md:grid-cols-4">
                            <div className="w-full md:col-span-1">
                                <select
                                    name=""
                                    id=""
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                >
                                    <option value="">Select Class</option>
                                </select>
                            </div>
                            <div>
                                <select
                                    name=""
                                    id=""
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                >
                                    <option value="">Select Subject</option>
                                </select>
                            </div>
                            <div>
                                <select
                                    name=""
                                    id=""
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                    aria-placeholder="Select Teacher"
                                >
                                    <option value="">Select Teacher</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <Button variant={'outline'}>Apply</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-4">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-white p-6">
                            <FullCalendar
                                timeZone="Asia/Kuala_Lumpur"
                                plugins={[
                                    dayGridPlugin,
                                    timeGridPlugin,
                                    interactionPlugin,
                                    listPlugin,
                                ]}
                                initialView={
                                    isMobile ? 'timeGridDay' : calendarView
                                }
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: isMobile
                                        ? ''
                                        : 'dayGridMonth,timeGridWeek,timeGridDay',
                                }}
                                buttonText={{
                                    month: 'Month',
                                    week: 'Week',
                                    day: 'Day',
                                    today: 'Today',
                                }}
                                events={events}
                                dateClick={handleDateClick}
                                eventClick={handleEventClick}
                                editable={true}
                                selectable={true}
                                selectMirror={true}
                                dayMaxEvents={true}
                                height="auto"
                                eventDidMount={(info) => {
                                    if (
                                        isHoliday(
                                            moment(info.event.start).format(
                                                'yyyy-MM-DD',
                                            ),
                                        ) &&
                                        info.event.allDay === false
                                    ) {
                                        const el = info.el as HTMLElement;
                                        el.style.display = 'none';
                                    }
                                }}
                                dayCellDidMount={dayCellDidMount}
                            />
                        </div>
                    </div>
                </div>

                <EventModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmit}
                    onDelete={handleDelete}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    selectedEvent={selectedEvent}
                />
            </div>
        </AuthenticatedLayout>
    );
}
