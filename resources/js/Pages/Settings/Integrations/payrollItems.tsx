import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import axios from 'axios';
import { useEffect, useState } from 'react';

const PayrollItems = () => {
    const [payrolls, setPayrolls] = useState([]);
    const [payrollItems, setPayrollItems] = useState([]);

    const getPayrollItems = async () => {
        const response = await axios.get(route('integrations.payrollItems'));
        const data = await response.data;

        setPayrolls(data.payrolls);
        setPayrollItems(data.payrollItems);
    };

    useEffect(() => {
        getPayrollItems();
    }, []);

    const handleChange = () => {};
    return (
        <div className="w-full rounded-md border px-4 py-4 md:w-1/2">
            <div className="mb-4">
                <Label
                    htmlFor="branch"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Payroll Items{' '}
                    <span className="font-bold text-red-800">*</span>
                </Label>
                <div className="mt-1">
                    <MultiSelect
                        defaultValue={payrollItems}
                        options={payrolls}
                        onValueChange={(values) => handleChange()}
                        placeholder="Select Your Payroll Items"
                    />
                </div>
            </div>
            <div className="flex justify-end">
                <Button type="submit" variant={'primary'}>
                    Save
                </Button>
            </div>
        </div>
    );
};

export default PayrollItems;
