export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface Profile {
    school_profile_id: string;
    school_name: string;
    school_email: string;
    school_contact_no: string;
    school_logo: string;
    school_address: {
        address1: string;
        address2?: string;
        address3?: string;
        city: string;
        state: string;
        postcode: string;
        country: string;
    };
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export interface ApiResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

export interface TableOptions {
    showSearch?: boolean;
    showFilters?: boolean;
    showPagination?: boolean;
    defaultPageSize?: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
