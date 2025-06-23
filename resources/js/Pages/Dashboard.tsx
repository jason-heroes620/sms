import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { User } from 'lucide-react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="grid grid-cols-1 gap-4 overflow-x-auto p-4 text-gray-900 md:grid-cols-3 lg:grid-cols-4 dark:text-gray-100">
                            <Card className="bg-gradient-to-r from-orange-400 to-orange-600 text-white">
                                <CardHeader>
                                    <CardTitle>Total Students</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <User />
                                        <span className="text-lg font-bold">
                                            1
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-r from-blue-400 to-blue-600 text-white">
                                <CardHeader>
                                    <CardTitle>Total Employees</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <User />
                                        <span className="text-lg font-bold">
                                            1
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-r from-green-400 to-green-600 text-white">
                                <CardHeader>
                                    <CardTitle>Revenue</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold">
                                            RM
                                        </span>
                                        <span className="text-lg font-bold">
                                            1
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
