import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Card, Badge } from '@/Components/ui';
import { 
    UsersIcon, 
    ShieldCheckIcon, 
    StarIcon, 
    BuildingOfficeIcon,
    BriefcaseIcon,
    ClockIcon 
} from '@heroicons/react/24/outline';

interface DashboardStats {
    total_users: number;
    active_users: number;
    admin_users: number;
    manager_users: number;
    salesperson_users: number;
}

interface RecentUser {
    id: number;
    name: string;
    email: string;
    status: string;
    roles: string[];
    created_at: string;
    last_login_at?: string;
}

export default function Dashboard({ 
    stats, 
    recent_users, 
    user_permissions 
}: PageProps<{ 
    stats: DashboardStats; 
    recent_users: RecentUser[];
    user_permissions: string[];
}>) {
    const statCards = [
        {
            title: 'Total Users',
            value: stats.total_users,
            icon: UsersIcon,
            color: 'brand',
            bgColor: 'bg-brand-100',
            iconColor: 'text-brand-600'
        },
        {
            title: 'Active Users',
            value: stats.active_users,
            icon: ShieldCheckIcon,
            color: 'success',
            bgColor: 'bg-success-100',
            iconColor: 'text-success-600'
        },
        {
            title: 'Admins',
            value: stats.admin_users,
            icon: StarIcon,
            color: 'accent',
            bgColor: 'bg-accent-100',
            iconColor: 'text-accent-600'
        },
        {
            title: 'Managers',
            value: stats.manager_users,
            icon: BuildingOfficeIcon,
            color: 'warning',
            bgColor: 'bg-warning-100',
            iconColor: 'text-warning-600'
        },
        {
            title: 'Salespersons',
            value: stats.salesperson_users,
            icon: BriefcaseIcon,
            color: 'neutral',
            bgColor: 'bg-neutral-100',
            iconColor: 'text-neutral-600'
        }
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            
            <div className="container-custom py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-serif font-bold text-semantic-text mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-semantic-textSub">
                        Overview of your sacred marketplace management
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
                    {statCards.map((stat) => (
                        <Card key={stat.title} className="p-6 devotional-border hover:shadow-e2 transition-all duration-300">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                                        <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-semantic-textSub">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold text-semantic-text font-tnum">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Recent Users */}
                <Card className="devotional-border">
                    <div className="p-6 border-b border-semantic-border">
                        <div className="flex items-center">
                            <UsersIcon className="h-5 w-5 text-brand-600 mr-2" />
                            <h3 className="text-lg font-serif font-semibold text-semantic-text">
                                Recent Users
                            </h3>
                        </div>
                    </div>
                    <div className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-semantic-border">
                                <thead className="bg-semantic-surface">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">
                                            Roles
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-semantic-textSub uppercase tracking-wider">
                                            Last Login
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-semantic-border">
                                    {recent_users.map((user) => (
                                        <tr key={user.id} className="hover:bg-semantic-surface transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-semantic-text">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-semantic-textSub">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge 
                                                    variant={
                                                        user.status === 'active' 
                                                            ? 'success' 
                                                            : user.status === 'inactive'
                                                            ? 'warning'
                                                            : 'danger'
                                                    }
                                                    size="sm"
                                                >
                                                    {user.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map((role, index) => (
                                                        <Badge key={index} variant="secondary" size="sm">
                                                            {role}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-semantic-textSub">
                                                <div className="flex items-center">
                                                    <ClockIcon className="h-4 w-4 mr-1" />
                                                    {user.last_login_at 
                                                        ? new Date(user.last_login_at).toLocaleDateString()
                                                        : 'Never'
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
