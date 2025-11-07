import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { CircleChevronLeft } from 'lucide-react';
import moment from 'moment';

const Show = () => {
    const { announcement } = usePage<{ auth: any; announcement: any }>().props;
    return (
        <AuthenticatedLayout>
            <Head title="View Announcement" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex justify-between">
                        <div className="flex flex-row gap-4 p-4">
                            <CircleChevronLeft
                                color={'#F06F40'}
                                className="cursor-pointer"
                                onClick={() =>
                                    router.visit(route('announcements.index'))
                                }
                            />
                            <div className="flex flex-row gap-4">
                                <div>
                                    <span className="font-bold">
                                        Announcements
                                    </span>
                                    <span> | View Announcement</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 px-4">
                            {announcement.announcement_status === 'draft' ? (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant={'primary'} size={'sm'}>
                                            Publish
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Confirm to publish this
                                                announcement?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription></AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() =>
                                                    router.put(
                                                        route(
                                                            'announcement.publish',
                                                            announcement.announcement_id,
                                                        ),
                                                    )
                                                }
                                            >
                                                Continue
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            ) : (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant={'destructive'}
                                            size={'sm'}
                                        >
                                            Archive
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Confirm to archive this
                                                announcement?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription></AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() =>
                                                    router.put(
                                                        route(
                                                            'announcement.archive',
                                                            announcement.announcement_id,
                                                        ),
                                                    )
                                                }
                                            >
                                                Continue
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                            <Button
                                variant={'primary'}
                                size={'sm'}
                                onClick={() =>
                                    router.visit(
                                        route(
                                            'announcement.edit',
                                            announcement.announcement_id,
                                        ),
                                    )
                                }
                            >
                                Edit
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="mx-auto max-w-3xl px-4 py-4">
                    {announcement.image_path && (
                        <img
                            src={`/storage/${announcement.image_path}`}
                            alt={announcement.title}
                            className="aspect-3/2 h-80 w-full rounded border object-contain"
                        />
                    )}
                    <div className="flex justify-between">
                        <p className="py-4 text-sm text-gray-500 italic">
                            {moment(announcement.created_at).format(
                                'DD MMM YYYY',
                            )}
                        </p>
                        <div></div>
                    </div>
                    <h1 className="mt-2 text-2xl font-bold">
                        {announcement.title}
                    </h1>

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
