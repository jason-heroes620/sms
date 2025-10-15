import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { CircleChevronLeft } from 'lucide-react';
import moment from 'moment';

const Show = () => {
    const { announcement } = usePage<{ auth: any; announcement: any }>().props;
    console.log('ano =>', announcement);
    return (
        <AuthenticatedLayout>
            <Head title="View Announcement" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <CircleChevronLeft
                            color={'#F06F40'}
                            className="cursor-pointer"
                            onClick={() =>
                                router.visit(route('announcements.index'))
                            }
                        />
                        <div>
                            <span className="font-bold">Announcements</span>
                            <span> | View Announcement</span>
                        </div>
                    </div>
                </div>
                <div className="mx-auto max-w-3xl px-4 py-4">
                    {announcement.image_path && (
                        <img
                            src={`/storage/${announcement.image_path}`}
                            alt={announcement.title}
                            className="h-60 w-full rounded border object-cover"
                        />
                    )}
                    <h1 className="mt-4 text-2xl font-bold">
                        {announcement.title}
                    </h1>
                    <p className="text-sm text-gray-500 italic">
                        {moment(announcement.created_at).format('DD MMM YYYY')}
                    </p>
                    <div
                        className="mt-4 text-justify whitespace-pre-line"
                        dangerouslySetInnerHTML={{
                            __html: announcement.description,
                        }}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;
