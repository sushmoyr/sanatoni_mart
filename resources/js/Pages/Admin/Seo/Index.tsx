import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    MagnifyingGlassIcon,
    ChartBarIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    EyeIcon,
    GlobeAltIcon,
    ArrowTrendingUpIcon,
    DocumentTextIcon,
    PhotoIcon,
    TagIcon,
} from '@heroicons/react/24/outline';

interface SeoIssue {
    id: string;
    type: 'error' | 'warning' | 'info';
    title: string;
    description: string;
    url: string;
    impact: 'high' | 'medium' | 'low';
    fix_url?: string;
}

interface SeoMetric {
    label: string;
    value: number;
    total: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
    change: number;
}

interface ContentItem {
    id: number;
    type: 'page' | 'post';
    title: string;
    url: string;
    seo_score: number;
    issues_count: number;
    last_updated: string;
}

interface Props extends PageProps {
    overview: {
        total_pages: number;
        total_posts: number;
        optimized_content: number;
        seo_issues: number;
        avg_seo_score: number;
    };
    metrics: SeoMetric[];
    recent_issues: SeoIssue[];
    content_needs_attention: ContentItem[];
    top_performing_content: ContentItem[];
}

export default function SeoOverview({ 
    auth, 
    overview,
    metrics,
    recent_issues,
    content_needs_attention,
    top_performing_content,
}: Props) {
    const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'content'>('overview');

    const getIssueIcon = (type: string) => {
        switch (type) {
            case 'error':
                return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
            case 'warning':
                return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
            default:
                return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
        }
    };

    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'high':
                return 'text-red-600 bg-red-100';
            case 'medium':
                return 'text-yellow-600 bg-yellow-100';
            default:
                return 'text-blue-600 bg-blue-100';
        }
    };

    const getSeoScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-100';
        if (score >= 60) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const tabs = [
        { key: 'overview', label: 'Overview', icon: ChartBarIcon },
        { key: 'issues', label: 'Issues', icon: ExclamationTriangleIcon },
        { key: 'content', label: 'Content', icon: DocumentTextIcon },
    ] as const;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            SEO Dashboard
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Monitor and optimize your website's search engine performance
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link
                            href="/admin/seo/audit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                        >
                            <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                            Run SEO Audit
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="SEO Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Content</p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {overview.total_pages + overview.total_posts}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {overview.total_pages} pages, {overview.total_posts} posts
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Optimized</p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {overview.optimized_content}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {Math.round((overview.optimized_content / (overview.total_pages + overview.total_posts)) * 100)}% of content
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">SEO Issues</p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {overview.seo_issues}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Need attention
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <ChartBarIcon className="h-8 w-8 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Avg SEO Score</p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {overview.avg_seo_score}%
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Across all content
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <GlobeAltIcon className="h-8 w-8 text-indigo-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Site Health</p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {overview.seo_issues === 0 ? 'Excellent' : overview.seo_issues < 5 ? 'Good' : 'Needs Work'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Overall status
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                                                activeTab === tab.key
                                                    ? 'border-indigo-500 text-indigo-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            <Icon className="h-4 w-4 mr-2" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Metrics</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {metrics.map((metric, index) => (
                                                <div key={index} className="bg-gray-50 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-gray-600">
                                                            {metric.label}
                                                        </span>
                                                        <div className="flex items-center">
                                                            <ArrowTrendingUpIcon 
                                                                className={`h-4 w-4 ${
                                                                    metric.trend === 'up' ? 'text-green-500' :
                                                                    metric.trend === 'down' ? 'text-red-500' : 'text-gray-400'
                                                                }`}
                                                            />
                                                            <span className={`text-xs ml-1 ${
                                                                metric.trend === 'up' ? 'text-green-600' :
                                                                metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                                                            }`}>
                                                                {metric.change > 0 ? '+' : ''}{metric.change}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-end justify-between">
                                                        <div>
                                                            <span className="text-2xl font-bold text-gray-900">
                                                                {metric.value}
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                /{metric.total}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-600">
                                                            {metric.percentage}%
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Content</h3>
                                        <div className="space-y-3">
                                            {top_performing_content.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center space-x-3">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeoScoreColor(item.seo_score)}`}>
                                                            {item.seo_score}%
                                                        </span>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                                            <p className="text-xs text-gray-500">{item.url}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                                                        <Link
                                                            href={item.url}
                                                            target="_blank"
                                                            className="text-gray-400 hover:text-gray-600"
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'issues' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-gray-900">Recent SEO Issues</h3>
                                        <Link
                                            href="/admin/seo/issues"
                                            className="text-sm text-indigo-600 hover:text-indigo-900"
                                        >
                                            View all issues →
                                        </Link>
                                    </div>
                                    <div className="space-y-3">
                                        {recent_issues.map((issue) => (
                                            <div key={issue.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-start space-x-3">
                                                    {getIssueIcon(issue.type)}
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-sm font-medium text-gray-900">
                                                                {issue.title}
                                                            </h4>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImpactColor(issue.impact)}`}>
                                                                {issue.impact} impact
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {issue.description}
                                                        </p>
                                                        <div className="flex items-center justify-between mt-3">
                                                            <span className="text-xs text-gray-500">{issue.url}</span>
                                                            {issue.fix_url && (
                                                                <Link
                                                                    href={issue.fix_url}
                                                                    className="text-xs text-indigo-600 hover:text-indigo-900"
                                                                >
                                                                    Fix issue →
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'content' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Content Needs Attention</h3>
                                        <div className="space-y-3">
                                            {content_needs_attention.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                                    <div className="flex items-center space-x-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeoScoreColor(item.seo_score)}`}>
                                                            {item.seo_score}%
                                                        </span>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                                            <div className="flex items-center space-x-4 mt-1">
                                                                <span className="text-xs text-gray-500">{item.url}</span>
                                                                <span className="text-xs text-red-600">
                                                                    {item.issues_count} issue{item.issues_count !== 1 ? 's' : ''}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                                                        <span className="text-xs text-gray-500">
                                                            Updated {formatDate(item.last_updated)}
                                                        </span>
                                                        <Link
                                                            href={`/admin/${item.type}s/${item.id}/edit`}
                                                            className="text-indigo-600 hover:text-indigo-900 text-sm"
                                                        >
                                                            Optimize
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
