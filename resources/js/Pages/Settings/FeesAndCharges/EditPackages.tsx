import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Fee, PackageFormField } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CircleChevronLeft } from 'lucide-react';
import moment from 'moment';
import { FormEvent } from 'react';
import { toast } from 'sonner';
import PackageForm from './PackageForm';

const EditPackage = ({
    fees,
    packages,
}: {
    fees: Fee[];
    packages: PackageFormField;
}) => {
    const { data, setData, put, processing, errors, reset } = useForm({
        package_name: packages.package_name,
        package_description: packages.package_description,
        effective_start_date: moment(packages.effective_start_date).format(
            'YYYY-MM-DD',
        ),
        effective_end_date:
            packages.effective_end_date != null
                ? moment(packages.effective_end_date).format('YYYY-MM-DD')
                : null,
        fees: packages.fees,
        recurring: packages.recurring,
        frequency: packages.frequency,
        package_status: packages.package_status,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('package.update', packages.package_id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('New package has been added.');
            },
            onError: () => {
                toast.error('Error adding new package.');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Package" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex flex-row gap-4 p-4">
                        <CircleChevronLeft
                            color={'#F06F40'}
                            className="cursor-pointer"
                            onClick={() =>
                                router.visit(route('packages.index'))
                            }
                        />
                        <div>
                            <span className="font-bold">
                                Fees And Packages{' '}
                            </span>
                            <span>| View Package</span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4 text-gray-900 dark:text-gray-100">
                            <div className="py-2">
                                <form onSubmit={handleSubmit}>
                                    <PackageForm
                                        data={data}
                                        setData={setData}
                                        fees={fees}
                                        errors={errors}
                                    />
                                    <div className="py-4">
                                        <hr />
                                    </div>
                                    <div className="flex justify-end py-2">
                                        <Button
                                            type="submit"
                                            variant={'primary'}
                                            disabled={processing}
                                        >
                                            {processing
                                                ? 'Saving ... '
                                                : 'Update'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditPackage;
