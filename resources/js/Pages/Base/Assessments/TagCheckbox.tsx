// components/ui/tag-checkbox.tsx
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface TagCheckboxProps {
    label: string;
    value: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    className?: string;
}

export function TagCheckbox({
    label,
    value,
    checked,
    onCheckedChange,
    className,
}: TagCheckboxProps) {
    return (
        <label
            className={cn(
                'inline-flex cursor-pointer items-center rounded-full border-2 border-gray-200 px-4 py-2 transition-all duration-200',
                'hover:border-gray-300 hover:bg-gray-50',
                checked && 'border-blue-500 bg-blue-100 text-blue-700',
                className,
            )}
        >
            <Checkbox
                checked={checked}
                onCheckedChange={onCheckedChange}
                value={value}
                className="sr-only" // Hide the actual checkbox
            />
            <span className="text-sm font-medium">{label}</span>
        </label>
    );
}
