import { Config } from 'ziggy-js';

export interface Permission {
    id: number;
    name: string;
    display_name: string;
    description?: string;
    group?: string;
}

export interface Role {
    id: number;
    name: string;
    display_name: string;
    description?: string;
    permissions: string[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    profile_picture?: string;
    status: 'active' | 'inactive' | 'banned';
    email_verified_at?: string;
    last_login_at?: string;
    roles: Role[];
    permissions: string[];
    is_admin: boolean;
    is_manager: boolean;
    is_salesperson: boolean;
    has_admin_access: boolean;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User | null;
    };
    ziggy: Config & { location: string };
};
