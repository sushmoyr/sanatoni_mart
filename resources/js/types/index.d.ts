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
    preferences?: Record<string, any>;
    roles: Role[];
    permissions: string[];
    is_admin: boolean;
    is_manager: boolean;
    is_salesperson: boolean;
    has_admin_access: boolean;
    // Customer-specific relationships
    addresses?: CustomerAddress[];
    wishlists?: Wishlist[];
    cart_items?: ShoppingCart[];
}

export interface CustomerAddress {
    id: number;
    user_id: number;
    type: 'home' | 'work' | 'other';
    name?: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
    full_address?: string;
}

export interface Wishlist {
    id: number;
    user_id: number;
    product_id: number;
    created_at: string;
    updated_at: string;
    product?: Product;
}

export interface ShoppingCart {
    id: number;
    session_id?: string;
    user_id?: number;
    product_id: number;
    quantity: number;
    created_at: string;
    updated_at: string;
    product?: Product;
    total_price?: number;
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

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    parent_id?: number;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
    parent?: Category;
    children?: Category[];
    products_count?: number;
}

export interface ProductImage {
    id: number;
    product_id: number;
    image_path: string;
    alt_text?: string;
    sort_order: number;
    is_main: boolean;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description?: string;
    short_description?: string;
    sku: string;
    category_id: number;
    price: number;
    sale_price?: number;
    weight?: number;
    dimensions?: any;
    specifications?: Record<string, any>;
    manage_stock: boolean;
    stock_quantity: number;
    allow_backorders: boolean;
    stock_status: string;
    featured: boolean;
    is_active: boolean;
    status: string;
    main_image?: string;
    gallery_images?: string[];
    meta_title?: string;
    meta_description?: string;
    created_at: string;
    updated_at: string;
    category?: Category;
    images?: ProductImage[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User | null;
    };
    ziggy: Config & { location: string };
};
