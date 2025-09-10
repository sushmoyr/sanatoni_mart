import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { User, Role, PageProps } from '@/types';
import { Card, Button, Badge, Input } from '@/Components/ui';
import { 
    PlusIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    UserIcon,
    ShieldCheckIcon,
    XCircleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

interface UsersIndexProps extends PageProps {
    users: {
        data: (User & {
            roles: Role[];
            created_at: string;
            last_login_at?: string;
        })[];
        links: any[];
        meta: any;
    };
    filters: {
        search?: string;
        status?: string;
        role?: string;
    };
    roles: Role[];
}

export default function Index({ auth, users, filters = {}, roles }: UsersIndexProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const search = formData.get('search') as string;
        router.get(route('admin.users.index'), { search }, { preserveState: true });
    };

    const handleFilter = (filterType: string, value: string) => {
        router.get(route('admin.users.index'), 
            { ...filters, [filterType]: value }, 
            { preserveState: true }
        );
    };

    const clearFilters = () => {
        router.get(route('admin.users.index'));
    };

    const handleDelete = (user: User & { roles: Role[]; created_at: string; last_login_at?: string }) => {
        if (confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)) {
            router.delete(route('admin.users.destroy', user.id));
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="success">Active</Badge>;
            case 'inactive':
                return <Badge variant="warning">Inactive</Badge>;
            case 'banned':
                return <Badge variant="danger">Banned</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getRoleBadges = (userRoles: Role[]) => {
        return userRoles.map(role => (
            <Badge key={role.id} variant="secondary" className="mr-1">
                {role.display_name || role.name}
            </Badge>
        ));
    };

    const usersList = users?.data || [];

    return (
        <AdminLayout>
            <Head title="User Management" />

            <div className="container-custom py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                                User Management
                            </h1>
                            <p className="text-semantic-textSub">
                                Manage system users, roles, and permissions
                            </p>
                        </div>
                        <Button asChild>
                            <Link href={route('admin.users.create')}>
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Add User
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Search and Filter Controls */}
                <Card className="mb-6">
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-semantic-textSub" />
                                    <Input
                                        name="search"
                                        defaultValue={filters.search}
                                        placeholder="Search users by name, email, or phone..."
                                        className="pl-10"
                                    />
                                </div>
                            </form>

                            {/* Filter Toggle */}
                            <Button
                                variant="secondary"
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="whitespace-nowrap"
                            >
                                <FunnelIcon className="w-4 h-4 mr-2" />
                                Filters
                            </Button>

                            <Button type="submit" form="search-form">
                                Search
                            </Button>
                        </div>

                        {/* Filter Panel */}
                        {isFilterOpen && (
                            <div className="mt-4 pt-4 border-t border-semantic-border">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {/* Status Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={filters.status || ''}
                                            onChange={(e) => handleFilter('status', e.target.value)}
                                            className="w-full border border-semantic-border rounded-md px-3 py-2 text-semantic-text bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                        >
                                            <option value="">All Statuses</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="banned">Banned</option>
                                        </select>
                                    </div>

                                    {/* Role Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-semantic-text mb-2">
                                            Role
                                        </label>
                                        <select
                                            value={filters.role || ''}
                                            onChange={(e) => handleFilter('role', e.target.value)}
                                            className="w-full border border-semantic-border rounded-md px-3 py-2 text-semantic-text bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                        >
                                            <option value="">All Roles</option>
                                            {roles.map(role => (
                                                <option key={role.id} value={role.name}>
                                                    {role.display_name || role.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Clear Filters */}
                                    <div className="flex items-end">
                                        <Button
                                            variant="secondary"
                                            onClick={clearFilters}
                                            className="w-full"
                                        >
                                            Clear Filters
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Users List */}
                <div className="space-y-4">
                    {usersList.length === 0 ? (
                        <Card>
                            <div className="p-8 text-center">
                                <UserIcon className="w-12 h-12 text-semantic-textSub mx-auto mb-4" />
                                <p className="text-semantic-textSub">No users found</p>
                            </div>
                        </Card>
                    ) : (
                        usersList.map((user) => (
                            <Card key={user.id} className="devotional-border">
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-serif font-medium text-semantic-text">
                                                        {user.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        {getStatusBadge(user.status)}
                                                        {user.email_verified_at && (
                                                            <Badge variant="info" className="text-xs">
                                                                <CheckCircleIcon className="w-3 h-3 mr-1" />
                                                                Verified
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm font-medium text-semantic-text">Email</p>
                                                    <p className="text-sm text-semantic-textSub">{user.email}</p>
                                                </div>
                                                {user.phone && (
                                                    <div>
                                                        <p className="text-sm font-medium text-semantic-text">Phone</p>
                                                        <p className="text-sm text-semantic-textSub">{user.phone}</p>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-semantic-text">Member Since</p>
                                                    <p className="text-sm text-semantic-textSub">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Roles */}
                                            {user.roles && user.roles.length > 0 && (
                                                <div className="mb-4">
                                                    <p className="text-sm font-medium text-semantic-text mb-2">Roles</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {getRoleBadges(user.roles)}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Last Login */}
                                            {user.last_login_at && (
                                                <div>
                                                    <p className="text-sm font-medium text-semantic-text">Last Login</p>
                                                    <p className="text-sm text-semantic-textSub">
                                                        {new Date(user.last_login_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 ml-4">
                                            <Button 
                                                variant="secondary" 
                                                size="sm" 
                                                asChild
                                            >
                                                <Link href={route('admin.users.show', user.id)}>
                                                    <EyeIcon className="w-4 h-4 mr-1" />
                                                    View
                                                </Link>
                                            </Button>
                                            
                                            <Button 
                                                variant="secondary" 
                                                size="sm" 
                                                asChild
                                            >
                                                <Link href={route('admin.users.edit', user.id)}>
                                                    <PencilIcon className="w-4 h-4 mr-1" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            
                                            {user.id !== auth.user?.id && (
                                                <Button 
                                                    variant="destructive" 
                                                    size="sm"
                                                    onClick={() => handleDelete(user)}
                                                >
                                                    <TrashIcon className="w-4 h-4 mr-1" />
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {users?.links && users.links.length > 3 && (
                    <div className="mt-6 flex justify-center">
                        <div className="flex space-x-1">
                            {users.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-2 text-sm rounded-md ${
                                        link.active
                                            ? 'bg-brand-600 text-white'
                                            : link.url
                                            ? 'bg-white text-semantic-text border border-semantic-border hover:bg-semantic-hover'
                                            : 'bg-semantic-disabled text-semantic-textSub cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
