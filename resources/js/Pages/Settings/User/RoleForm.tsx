import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { RoleInfo } from '@/types';
import { CircleX, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

type Role = {
    id: string;
    name: string;
};

const RoleForm = ({
    branches,
    roles,
    userRole,
    setUserRole,
    handleChange,
}: {
    branches: {
        value: string;
        label: string;
    }[];
    roles: Role[];
    userRole: RoleInfo[];
    setUserRole: React.Dispatch<React.SetStateAction<RoleInfo[]>>;
    handleChange: (
        role_id: string,
        field: keyof RoleInfo,
        value: string | string[],
    ) => void;
}) => {
    const handleAddRoles = () => {
        setUserRole([
            ...userRole,
            {
                role_id: uuidv4(),
                branch_id: [],
                id: '',
            },
        ]);
    };

    const handleRemoveRole = (id: string) => {
        const newrole = userRole.filter((role) => role.role_id !== id);
        setUserRole(newrole);
    };

    return (
        <div className="rounded-md border-gray-300 p-4 shadow-md">
            {userRole.map((u: RoleInfo) => (
                <div key={u.id}>
                    <div className="mb-4">
                        <Label
                            htmlFor="branch"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Branch{' '}
                            <span className="font-bold text-red-800">*</span>
                        </Label>
                        <div className="mt-1">
                            <MultiSelect
                                defaultValue={u.branch_id}
                                options={branches}
                                onValueChange={(values) =>
                                    handleChange(u.role_id, 'branch_id', values)
                                }
                                placeholder="Choose branch"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Role{' '}
                            <span className="font-bold text-red-800">*</span>
                        </Label>
                        <Select
                            value={u.id.toString()}
                            onValueChange={(value) =>
                                handleChange(u.role_id, 'id', value)
                            }
                        >
                            <SelectTrigger className="mt-1 w-full">
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                {roles.map((r: Role) => (
                                    <SelectItem
                                        value={r.id.toString()}
                                        key={`${u.role_id}-${r.id}`}
                                    >
                                        {r.name.toUpperCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {/* <select
                            name=""
                            id=""
                            value={u.id}
                            onChange={(e) =>
                                handleChange(u.role_id, 'id', e.target.value)
                            }
                            className="border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 mt-1 flex w-fit w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                        >
                            <option value="">Choose Role</option>
                            {roles.map((r: Role) => (
                                <option
                                    value={r.id}
                                    key={`${u.role_id}-${r.id}`}
                                >
                                    {r.name.toUpperCase()}
                                </option>
                            ))}
                        </select> */}
                    </div>
                    {userRole.length > 1 && ( // Only show remove button if there's more than one entry
                        <div className="flex w-full items-center justify-end py-2 md:col-span-2">
                            <Button
                                type="button"
                                onClick={() => handleRemoveRole(u.role_id)}
                                className="mt-4 rounded-md bg-red-500 px-4 py-2 text-white shadow-md hover:bg-red-600 md:mt-0"
                            >
                                <CircleX />
                            </Button>
                        </div>
                    )}
                </div>
            ))}

            <div className="mt-4 flex">
                <Button
                    type="button"
                    onClick={handleAddRoles}
                    className="transform rounded-md bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition duration-200 ease-in-out hover:scale-105 hover:bg-blue-600"
                >
                    <Plus />
                    Add Another
                </Button>
            </div>
        </div>
    );
};

export default RoleForm;
