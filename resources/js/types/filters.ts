// types/filters.ts
export type FilterType =
    | 'text'
    | 'select'
    | 'multi-select'
    | 'date'
    | 'date-range'
    | 'boolean'
    | 'number'
    | 'number-range';

export interface FilterOption {
    value: string | number;
    label: string;
}

export interface FilterConfig {
    key: string;
    label: string;
    type: FilterType;
    options?: FilterOption[];
    placeholder?: string;
    min?: number;
    max?: number;
}

export interface FilterState {
    search: string;
    columnFilters: Record<string, any>;
    dateRanges: Record<string, { from?: string; to?: string }>;
}
