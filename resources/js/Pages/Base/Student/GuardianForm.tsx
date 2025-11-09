import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { CircleX, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

type Relationship = {
    relationship_label: string;
    relationship_value: string;
};

type Parent = {
    guardian_id: string;
    last_name: string;
    first_name: string;
    contact_no: string;
    email: string;
    occupation: string;
    relationship: string;
};

type GuardianFormProps = {
    parents: Parent[];
    relationships: Relationship[];
    handleChange: (
        guardian_id: string,
        field: keyof Parent,
        value: string,
    ) => void;
    setParents: React.Dispatch<React.SetStateAction<Parent[]>>;
    handleRemoveParent: (guardian_id: string) => void;
    errors: any;
};

const GuardianForm = ({
    parents,
    relationships,
    handleChange,
    setParents,
    handleRemoveParent,
    errors,
}: GuardianFormProps) => {
    const handleAddParent = () => {
        setParents([
            ...parents,
            {
                guardian_id: uuidv4(),
                last_name: '',
                first_name: '',
                contact_no: '',
                email: '',
                occupation: '',
                relationship: '',
            },
        ]);
    };

    // Function to remove a parent entry by its ID

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="col-span-2">
                    <div className="mb-4 py-2">
                        <span className="font-bold italic">
                            Parent's / Guardian's Information
                        </span>
                        <hr />
                    </div>

                    {parents?.map(
                        (
                            parent: {
                                guardian_id: string;
                                last_name: string;
                                first_name: string;
                                contact_no: string;
                                email: string;
                                occupation: string;
                                relationship: string;
                            },
                            index: number,
                        ) => (
                            <div
                                key={parent.guardian_id}
                                className="mb-4 grid grid-cols-1 items-center space-y-4 rounded-md border border-gray-200 p-4 md:grid-cols-2 md:flex-row md:gap-4 md:space-y-0 md:space-x-4"
                            >
                                <div className="w-full flex-1">
                                    <label
                                        htmlFor={`first_name-${parent.guardian_id}`}
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        First Name{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        id={`first_name-${parent.guardian_id}`}
                                        type="text"
                                        value={parent.first_name}
                                        placeholder="Enter parent's first name"
                                        onChange={(e) =>
                                            handleChange(
                                                parent.guardian_id,
                                                'first_name',
                                                e.target.value,
                                            )
                                        }
                                        required
                                        className="mt-1"
                                    />
                                </div>
                                <div className="w-full flex-1">
                                    <label
                                        htmlFor={`parent_last_name-${parent.guardian_id}`}
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Last Name{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        id={`last_name-${parent.guardian_id}`}
                                        type="text"
                                        value={parent.last_name}
                                        placeholder="Enter parent's last name"
                                        onChange={(e) =>
                                            handleChange(
                                                parent.guardian_id,
                                                'last_name',
                                                e.target.value,
                                            )
                                        }
                                        required
                                        className="mt-1"
                                    />
                                </div>

                                <div className="w-full flex-1">
                                    <label
                                        htmlFor={`contact_no-${parent.guardian_id}`}
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Contact No.{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        id={`contact_no-${parent.guardian_id}`}
                                        type="tel"
                                        value={parent.contact_no}
                                        onChange={(e) =>
                                            handleChange(
                                                parent.guardian_id,
                                                'contact_no',
                                                e.target.value,
                                            )
                                        }
                                        required
                                        maxLength={20}
                                        className="mt-1"
                                    />
                                </div>
                                <div className="w-full flex-1">
                                    <label
                                        htmlFor={`email-${parent.guardian_id}`}
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Email{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        id={`email-${parent.guardian_id}`}
                                        type="email"
                                        value={parent.email}
                                        maxLength={150}
                                        onChange={(e) =>
                                            handleChange(
                                                parent.guardian_id,
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                        required
                                        className="mt-1"
                                    />
                                    {errors &&
                                        errors[`parents.${index}.email`] && (
                                            <p className="text-sm text-red-600">
                                                {
                                                    errors[
                                                        `parents.${index}.email`
                                                    ]
                                                }
                                            </p>
                                        )}
                                </div>
                                <div className="w-full flex-1">
                                    <label
                                        htmlFor={`occupation-${parent.guardian_id}`}
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Occupation{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Input
                                        id={`occupation-${parent.guardian_id}`}
                                        type="text"
                                        value={parent.occupation}
                                        maxLength={150}
                                        onChange={(e) =>
                                            handleChange(
                                                parent.guardian_id,
                                                'occupation',
                                                e.target.value,
                                            )
                                        }
                                        required
                                        className="mt-1"
                                    />
                                </div>

                                <div className="w-full flex-1">
                                    <label
                                        htmlFor={`relationship-${parent.guardian_id}`}
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Relationship{' '}
                                        <span className="font-bold text-red-800">
                                            *
                                        </span>
                                    </label>
                                    <Select
                                        value={parent.relationship}
                                        onValueChange={(value) =>
                                            handleChange(
                                                parent.guardian_id,
                                                'relationship',
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="mt-1 w-full">
                                            <SelectValue placeholder="Choose Relationship" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full">
                                            {relationships.map(
                                                (r: Relationship) => (
                                                    <SelectItem
                                                        key={`relationship-${parent.guardian_id}-${r.relationship_value}`}
                                                        value={
                                                            r.relationship_value
                                                        }
                                                    >
                                                        {r.relationship_label}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {parents.length > 1 && ( // Only show remove button if there's more than one entry
                                    <div className="flex w-full items-center justify-end py-2 md:col-span-2">
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveParent(
                                                    parent.guardian_id,
                                                )
                                            }
                                            className="mt-4 rounded-md bg-red-500 px-4 py-2 text-white shadow-md hover:bg-red-600 md:mt-0"
                                        >
                                            <CircleX />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ),
                    )}
                    {errors.parents && (
                        <p className="text-sm text-red-700">
                            * {errors.parents}
                        </p>
                    )}
                    <div className="mt-4 flex">
                        <Button
                            type="button"
                            onClick={handleAddParent}
                            className="transform rounded-md bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition duration-200 ease-in-out hover:scale-105 hover:bg-blue-600"
                        >
                            <Plus />
                            Add Another
                        </Button>
                    </div>
                    <div className="py-2">
                        {' '}
                        <span className="text-xs font-bold text-red-800">
                            * Required fields
                        </span>
                        <hr />
                    </div>
                </div>
            </div>
        </>
    );
};

export default GuardianForm;
