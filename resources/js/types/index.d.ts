export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}
export interface AcademicYear {
    academic_year_id: string;
    academic_year: string;
    start_date: string;
    end_date: string;
    is_current: string;
}
export interface Classes {
    academic_year_id: string;
    class_id: string;
    class_name: string;
    class_description: string;
    branch_id: string;
    branch_name: string;
    section: Section[];
    label: string;
    value: string;
    subjects: Subject[];
}

export interface Section {
    section_id: string;
    section_name: string;
    name: string;
}

export interface Subject {
    subject_id: string;
    subject_name: string;
    subject_description: string;
    subject_status: string;
}
// export interface Teacher {
//     user_id: string;
//     teacher_name: string;
// }

export interface Teacher {
    user_id: string;
    name: string;
    branch_id: string;
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

export interface Subject {
    subject_id: string;
    subject_name: string;
}
export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export type UserFormField = {
    user_profile_id: string;
    last_name: string;
    first_name: string;
    gender: string;
    race: string;
    contact_no: string;
    email: string;
    address: {
        address1: string;
        address2: string;
        address3: string;
        city: string;
        postcode: string;
        state: string;
        country: string;
    };
    residential_status: string;
    nic: string;
    passport: string;
    dob: string;
    marital_status: string;
    employment_date: string;
    spouse_info: SpouseInfo;
    user_status: string;
    position_id: string;
    branch_id: string;
    role_info: RoleInfo[];
};

export type SpouseInfo = {
    employment_status: boolean;
    ability_status: boolean;
};

export type RoleInfo = {
    role_id: string;
    branch_id: string[];
    id: string;
};

export type Fee = {
    fee_id: string;
    fee_label: string;
    fee_code: string;
    uom: string;
    amount: number;
    fee_type: string;
    fee_status: string;
    tax_id: string;
    tax_rate: number;
    tax_code: string;
    classification_code: string;
};

export type PackageFormField = {
    package_name: string;
    package_description: string;
    effective_start_date: string;
    fees: Fees[];
    recurring: boolean;
    frequency: string;
};

export type UOM = {
    uom_label: string;
    uom_value: string;
};

export type Tax = {
    id: string;
    name: string;
    code: string;
    rate: number;
};

export type BranchType = {
    branch_id: string;
    branch_name: string;
    branch_address: {
        address1: string;
        address2: string;
        address3: string;
        city: string;
        postcode: string;
        state: string;
        country: string;
    };
    branch_email: string;
    branch_contact_no: string;
    branch_status: string;
};

export interface ApiResponse<T> {
    data: T[];
    meta: PaginationMeta;
    filters?: Record<string, any>;
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
