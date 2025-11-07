import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BranchType, Classes } from '@/types';
import { Head, router } from '@inertiajs/react';
import { CircleChevronLeft } from 'lucide-react';
import AnnouncementForm from './AnnouncementForm';

const AddAnnouncement = ({
    classes,
    branches,
}: {
    classes: Classes[];
    branches: BranchType[];
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
                            <span> | Add Announcement</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4">
                            <AnnouncementForm
                                branches={branches}
                                classes={classes}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AddAnnouncement;
