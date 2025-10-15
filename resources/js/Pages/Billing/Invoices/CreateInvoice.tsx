import { Button } from '@/components/ui/button';
import axios from 'axios';

const CreateInvoice = ({ students }: any) => {
    const handleGenerate = async () => {
        console.log(students);
        await axios
            .post(route('billing.generate'), {
                students: students,
                billing_month: 10,
                billing_year: 2025,
            })
            .then((resp) => {
                console.log(resp);
            });
    };
    return (
        <div>
            <Button onClick={() => handleGenerate()}>Generate</Button>
        </div>
    );
};

export default CreateInvoice;
