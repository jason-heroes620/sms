// components/SearchSelect.tsx
import { Input } from '@/components/ui/input';
import { useEffect, useRef, useState } from 'react';

interface Option {
    id: string;
    name: string;
}

interface SearchSelectProps {
    endpoint: string;
    placeholder?: string;
    onSelect: (id: string) => void;
    initialValue?: string;
}

export default function SearchSelect({
    endpoint,
    placeholder = 'Search...',
    onSelect,
    initialValue = '',
}: SearchSelectProps) {
    const [query, setQuery] = useState(initialValue);
    const [options, setOptions] = useState<Option[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Fetch options from API when query changes
    useEffect(() => {
        const fetchOptions = async () => {
            if (query.length < 2) {
                setOptions([]);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`${endpoint}?search=${query}`);
                const data = await response.json();
                console.log('data =>', data);
                setOptions(data);
            } catch (error) {
                console.error('Error fetching options:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchOptions, 300);
        return () => clearTimeout(debounceTimer);
    }, [query, endpoint]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: Option) => {
        setQuery(option.name);
        onSelect(option.id);
        setIsOpen(false);
    };

    return (
        <div className="search-select" ref={wrapperRef}>
            <Input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                onClick={() => setIsOpen(true)}
                placeholder={placeholder}
                className="mt-1 block h-[40px] w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />

            {isOpen && (
                <div className="absolute z-50 max-h-[200px] max-w-[300px] min-w-[300px] overflow-y-auto border bg-white">
                    {loading ? (
                        <div className="p-8 italic">Loading...</div>
                    ) : options.length === 0 ? (
                        <div className="p-8 italic">No results found</div>
                    ) : (
                        <ul className="list-none">
                            {options.map((option) => (
                                <li
                                    key={option.id}
                                    onClick={() => handleSelect(option)}
                                    className="list-none px-2 py-2"
                                >
                                    {option.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
