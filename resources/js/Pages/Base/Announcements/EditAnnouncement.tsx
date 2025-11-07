import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BranchType, Classes } from '@/types';
import { Head, router } from '@inertiajs/react';
import { CircleChevronLeft } from 'lucide-react';
import AnnouncementForm from './AnnouncementForm';

const EditAnnouncement = ({
    classes,
    branches,
    announcement,
}: {
    classes: Classes[];
    branches: BranchType[];
    announcement: any;
}) => {
    return (
        <AuthenticatedLayout>
            <Head title="Add Announcement" />
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
                            <span> | Edit Announcement</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4">
                            <AnnouncementForm
                                branches={branches}
                                classes={classes}
                                announcement={announcement}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditAnnouncement;
