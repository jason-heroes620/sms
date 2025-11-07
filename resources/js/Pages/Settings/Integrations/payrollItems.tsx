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

        console.log(data);
        setPayrolls(data.payrolls);
        setPayrollItems(data.payrollItems);
    };

    useEffect(() => {
        getPayrollItems();
    }, []);

    const handleChange = () => {};
    return (
        <div>
            <div className="mb-4">
                <Label
                    htmlFor="branch"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Branch <span className="font-bold text-red-800">*</span>
                </Label>
                <div className="mt-1">
                    <MultiSelect
                        defaultValue={payrollItems}
                        options={payrolls}
                        onValueChange={(values) => handleChange()}
                        placeholder="Choose branch"
                    />
                </div>
            </div>
        </div>
    );
};

export default PayrollItems;
