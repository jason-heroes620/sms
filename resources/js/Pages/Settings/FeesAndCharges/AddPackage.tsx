import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Fee } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CircleChevronLeft } from 'lucide-react';
import moment from 'moment';
import { FormEvent } from 'react';
import { toast } from 'sonner';
import PackageForm from './PackageForm';

const AddPackage = ({ fees }: { fees: Fee[] }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        package_name: '',
        package_description: '',
        effective_start_date: moment().format('YYYY-MM-DD'),
        fees: [],
        recurring: false,
        frequency: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('package.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('New package has been added.');
                reset();
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
                            <span>| Add Package</span>
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
                                            {processing ? 'Saving ... ' : 'Add'}
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

export default AddPackage;
