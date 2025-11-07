import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Bukku from './Bukku';
import Configurations from './Configurations';
import Jibble from './Jibble';
import Payroll from './Payroll';
import PayrollItems from './payrollItems';

type IntegrationKeys = {
    payroll: {
        integration: string;
        client_id: string;
        client_secret: string;
    };
    jibble: {
        integration: string;
        client_id: string;
        client_secret: string;
    };
    bukku: {
        integration: string;
        token: string;
        subdomain: string;
        integration_status: string;
    };
    accounts: Account[];
    tax_codes: Tax[];
    terms: Term[];
    account_receivables: Account[];
};

type Account = {
    id: string;
    code: number;
    name: string;
    type: string;
};

type Tax = {
    id: string;
    code: string;
    rate: number;
    tax_system: string;
    is_archived: boolean;
    is_exempted: boolean;
};

type Term = {
    id: string;
    name: string;
};

const Integrations = ({
    payroll,
    jibble,
    bukku,
    accounts,
    tax_codes,
    terms,
    account_receivables,
}: IntegrationKeys) => {
    const [activeTab, setActiveTab] = useState('account');
    return (
        <AuthenticatedLayout>
            <Head title="Integrations" />
            <div className="mx-auto">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="flex items-center p-4 text-gray-900 dark:text-gray-100">
                        <div>
                            <span className="font-bold">Integration </span>
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="px-4 py-4">
                            <Tabs
                                defaultValue={activeTab}
                                onValueChange={setActiveTab}
                            >
                                <TabsList>
                                    <TabsTrigger value="account">
                                        Integration Accounts
                                    </TabsTrigger>
                                    <TabsTrigger value="configurations">
                                        Configurations
                                    </TabsTrigger>
                                    <TabsTrigger value="payrollItems">
                                        Payroll Items
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent
                                    value="account"
                                    className="flex flex-col gap-4"
                                >
                                    <Payroll payroll={payroll} />
                                    <Jibble jibble={jibble} />
                                    <Bukku bukku={bukku} />
                                </TabsContent>
                                <TabsContent value="configurations">
                                    <Configurations
                                        accounts={accounts}
                                        tax_codes={tax_codes}
                                        terms={terms}
                                        account_receivables={
                                            account_receivables
                                        }
                                    />
                                </TabsContent>
                                <TabsContent value="payrollItems">
                                    <PayrollItems />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Integrations;
