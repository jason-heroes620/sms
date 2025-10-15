import { useEffect } from 'react';

interface EventModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onDelete: () => void;
    data: {
        title: string;
        instructor: string;
        start: string;
        end: string;
        allDay: boolean;
        color: string;
    };
    setData: (data: any) => void;
    errors: any;
    processing: boolean;
    selectedEvent: any;
}

export default function EventModal({
    show,
    onClose,
    onSubmit,
    onDelete,
    data,
    setData,
    errors,
    processing,
    selectedEvent,
}: EventModalProps) {
    useEffect(() => {
        if (selectedEvent) {
            setData({
                title: selectedEvent.title,
                instructor: selectedEvent.instructor,
                start: selectedEvent.start,
                end: selectedEvent.end,
                allDay: selectedEvent.allDay,
                color: selectedEvent.color,
            });
        }
    }, [selectedEvent]);

    if (!show) return null;

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
                <h2 className="mb-4 text-xl font-semibold">
                    {selectedEvent ? 'Edit Class Event' : 'New Class Event'}
                </h2>

                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="mb-2 block text-gray-700">
                            Course Title
                        </label>
                        <input
                            type="text"
                            className="w-full rounded border px-3 py-2"
                            value={data.title}
                            onChange={(e) =>
                                setData({ ...data, title: e.target.value })
                            }
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-gray-700">
                            Teacher In Charge
                        </label>
                        <input
                            type="text"
                            className="w-full rounded border px-3 py-2"
                            value={data.instructor}
                            onChange={(e) =>
                                setData({ ...data, instructor: e.target.value })
                            }
                        />
                        {errors.instructor && (
                            <p className="text-sm text-red-500">
                                {errors.instructor}
                            </p>
                        )}
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-gray-700">
                                Start
                            </label>
                            <input
                                type="datetime-local"
                                className="w-full rounded border px-3 py-2"
                                value={data.start}
                                onChange={(e) =>
                                    setData({ ...data, start: e.target.value })
                                }
                            />
                            {errors.start && (
                                <p className="text-sm text-red-500">
                                    {errors.start}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="mb-2 block text-gray-700">
                                End
                            </label>
                            <input
                                type="datetime-local"
                                className="w-full rounded border px-3 py-2"
                                value={data.end}
                                onChange={(e) =>
                                    setData({ ...data, end: e.target.value })
                                }
                            />
                            {errors.end && (
                                <p className="text-sm text-red-500">
                                    {errors.end}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mb-4 flex items-center">
                        <input
                            type="checkbox"
                            id="allDay"
                            className="mr-2"
                            checked={data.allDay}
                            onChange={(e) =>
                                setData({ ...data, allDay: e.target.checked })
                            }
                        />
                        <label htmlFor="allDay">All day event</label>
                    </div>

                    {/* <div className="mb-4">
                        <label className="mb-2 block text-gray-700">
                            Color
                        </label>
                        <input
                            type="color"
                            className="h-10 w-10"
                            value={data.color}
                            onChange={(e) =>
                                setData({ ...data, color: e.target.value })
                            }
                        />
                    </div> */}

                    <div className="flex justify-end space-x-2">
                        {/* {selectedEvent && (
                            <button
                                type="button"
                                onClick={onDelete}
                                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                                disabled={processing}
                            >
                                Delete
                            </button>
                        )} */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                            disabled={processing}
                        >
                            {selectedEvent ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
