import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface Newsletter {
    id: number;
    subject: string;
    content: string;
    preheader: string;
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
    scheduled_at?: string;
    sent_at?: string;
    subscriber_count: number;
    sent_count: number;
    open_count: number;
    click_count: number;
    bounce_count: number;
    unsubscribe_count: number;
    created_at: string;
    updated_at: string;
}

interface Analytics {
    total_opens: number;
    unique_opens: number;
    total_clicks: number;
    unique_clicks: number;
    open_rate: number;
    click_rate: number;
    bounce_rate: number;
    unsubscribe_rate: number;
    delivery_rate: number;
    top_links: Array<{
        url: string;
        clicks: number;
        unique_clicks: number;
    }>;
    opens_over_time: Array<{
        date: string;
        opens: number;
    }>;
    clicks_over_time: Array<{
        date: string;
        clicks: number;
    }>;
}

interface Props extends PageProps {
    newsletter: Newsletter;
    analytics?: Analytics;
}

export default function Show({ newsletter, analytics }: Props) {
    const getStatusBadge = () => {
        const statusConfig = {
            draft: { label: 'Draft', className: 'bg-gray-100 text-gray-800' },
            scheduled: { label: 'Scheduled', className: 'bg-blue-100 text-blue-800' },
            sending: { label: 'Sending', className: 'bg-yellow-100 text-yellow-800' },
            sent: { label: 'Sent', className: 'bg-green-100 text-green-800' },
            failed: { label: 'Failed', className: 'bg-red-100 text-red-800' },
        };

        const config = statusConfig[newsletter.status];
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
                {config.label}
            </span>
        );
    };

    const sendNewsletter = () => {
        if (confirm(`Send newsletter "${newsletter.subject}" to ${newsletter.subscriber_count} subscribers?`)) {
            router.post(route('admin.newsletters.send-now', newsletter.id), {}, {
                preserveScroll: true,
            });
        }
    };

    const duplicateNewsletter = () => {
        router.post(route('admin.newsletters.duplicate', newsletter.id), {}, {
            preserveScroll: true,
        });
    };

    const deleteNewsletter = () => {
        if (confirm(`Delete newsletter "${newsletter.subject}"? This action cannot be undone.`)) {
            router.delete(route('admin.newsletters.destroy', newsletter.id));
        }
    };

    const formatPercentage = (value: number) => {
        return `${value.toFixed(1)}%`;
    };

    const renderAnalytics = () => {
        if (!analytics || newsletter.status !== 'sent') {
            return (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-500">Analytics will be available after the newsletter is sent.</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="text-2xl font-bold text-blue-600">{formatPercentage(analytics.open_rate)}</div>
                        <div className="text-sm text-gray-500">Open Rate</div>
                        <div className="text-xs text-gray-400">{analytics.unique_opens} of {newsletter.sent_count}</div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="text-2xl font-bold text-green-600">{formatPercentage(analytics.click_rate)}</div>
                        <div className="text-sm text-gray-500">Click Rate</div>
                        <div className="text-xs text-gray-400">{analytics.unique_clicks} clicks</div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="text-2xl font-bold text-purple-600">{formatPercentage(analytics.delivery_rate)}</div>
                        <div className="text-sm text-gray-500">Delivery Rate</div>
                        <div className="text-xs text-gray-400">{newsletter.sent_count - newsletter.bounce_count} delivered</div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="text-2xl font-bold text-red-600">{formatPercentage(analytics.unsubscribe_rate)}</div>
                        <div className="text-sm text-gray-500">Unsubscribe Rate</div>
                        <div className="text-xs text-gray-400">{newsletter.unsubscribe_count} unsubscribed</div>
                    </div>
                </div>

                {/* Detailed Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Opens & Clicks */}
                    <div className="bg-white rounded-lg border p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Engagement Details</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Total Opens</span>
                                <span className="font-medium">{analytics.total_opens}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Unique Opens</span>
                                <span className="font-medium">{analytics.unique_opens}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Total Clicks</span>
                                <span className="font-medium">{analytics.total_clicks}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Unique Clicks</span>
                                <span className="font-medium">{analytics.unique_clicks}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Bounces</span>
                                <span className="font-medium text-red-600">{newsletter.bounce_count}</span>
                            </div>
                        </div>
                    </div>

                    {/* Top Links */}
                    <div className="bg-white rounded-lg border p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Clicked Links</h3>
                        {analytics.top_links && analytics.top_links.length > 0 ? (
                            <div className="space-y-3">
                                {analytics.top_links.slice(0, 5).map((link, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {link.url}
                                            </p>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {link.clicks} clicks
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No link clicks recorded</p>
                        )}
                    </div>
                </div>

                {/* Timeline Charts - Simplified representation */}
                {analytics.opens_over_time && analytics.opens_over_time.length > 0 && (
                    <div className="bg-white rounded-lg border p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Engagement Timeline</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-md font-medium text-gray-700 mb-3">Opens Over Time</h4>
                                <div className="space-y-2">
                                    {analytics.opens_over_time.slice(0, 7).map((item, index) => (
                                        <div key={index} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">{new Date(item.date).toLocaleDateString()}</span>
                                            <span className="font-medium">{item.opens} opens</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-md font-medium text-gray-700 mb-3">Clicks Over Time</h4>
                                <div className="space-y-2">
                                    {analytics.clicks_over_time.slice(0, 7).map((item, index) => (
                                        <div key={index} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">{new Date(item.date).toLocaleDateString()}</span>
                                            <span className="font-medium">{item.clicks} clicks</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <AdminLayout>
            <Head title={`Newsletter: ${newsletter.subject}`} />

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <div className="flex items-center space-x-3">
                            <Link
                                href={route('admin.newsletters.index')}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ← Back to Newsletters
                            </Link>
                        </div>
                        <h1 className="mt-2 text-2xl font-semibold leading-6 text-gray-900">{newsletter.subject}</h1>
                        <div className="mt-2 flex items-center space-x-4">
                            {getStatusBadge()}
                            <span className="text-sm text-gray-500">
                                Created {new Date(newsletter.created_at).toLocaleDateString()}
                            </span>
                            {newsletter.sent_at && (
                                <span className="text-sm text-gray-500">
                                    Sent {new Date(newsletter.sent_at).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <div className="flex space-x-3">
                            <Link
                                href={route('admin.newsletters.preview', newsletter.id)}
                                target="_blank"
                                className="inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
                            >
                                Preview
                            </Link>
                            {newsletter.status === 'draft' && (
                                <>
                                    <Link
                                        href={route('admin.newsletters.edit', newsletter.id)}
                                        className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                                    >
                                        Edit
                                    </Link>
                                    <PrimaryButton onClick={sendNewsletter}>
                                        Send Now
                                    </PrimaryButton>
                                </>
                            )}
                            <SecondaryButton onClick={duplicateNewsletter}>
                                Duplicate
                            </SecondaryButton>
                            <SecondaryButton 
                                onClick={deleteNewsletter}
                                className="text-red-600 hover:text-red-700"
                            >
                                Delete
                            </SecondaryButton>
                        </div>
                    </div>
                </div>

                {/* Newsletter Info */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Newsletter Details */}
                        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Newsletter Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                                    <p className="mt-1 text-sm text-gray-900">{newsletter.subject}</p>
                                </div>
                                {newsletter.preheader && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Preheader</label>
                                        <p className="mt-1 text-sm text-gray-900">{newsletter.preheader}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <div className="mt-1">
                                        {getStatusBadge()}
                                        {newsletter.scheduled_at && (
                                            <span className="ml-2 text-sm text-gray-500">
                                                Scheduled for {new Date(newsletter.scheduled_at).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Preview */}
                        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Content Preview</h2>
                            <div className="border rounded-lg overflow-hidden">
                                <iframe
                                    srcDoc={`
                                        <!DOCTYPE html>
                                        <html>
                                        <head>
                                            <meta charset="utf-8">
                                            <meta name="viewport" content="width=device-width, initial-scale=1">
                                            <title>${newsletter.subject}</title>
                                        </head>
                                        <body style="margin: 0; padding: 20px; background-color: #f5f5f5;">
                                            ${newsletter.content}
                                        </body>
                                        </html>
                                    `}
                                    className="w-full h-96"
                                    title="Newsletter Preview"
                                />
                            </div>
                        </div>

                        {/* Analytics */}
                        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Analytics</h2>
                            {renderAnalytics()}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Quick Stats */}
                        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Recipients</span>
                                    <span className="font-medium">{newsletter.subscriber_count}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Sent</span>
                                    <span className="font-medium">{newsletter.sent_count}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Opens</span>
                                    <span className="font-medium">{newsletter.open_count}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Clicks</span>
                                    <span className="font-medium">{newsletter.click_count}</span>
                                </div>
                                {newsletter.bounce_count > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Bounces</span>
                                        <span className="font-medium text-red-600">{newsletter.bounce_count}</span>
                                    </div>
                                )}
                                {newsletter.unsubscribe_count > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Unsubscribes</span>
                                        <span className="font-medium text-red-600">{newsletter.unsubscribe_count}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                            <div className="space-y-3">
                                <Link
                                    href={route('admin.newsletters.preview', newsletter.id)}
                                    target="_blank"
                                    className="block w-full text-center bg-purple-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-purple-700"
                                >
                                    Preview Email
                                </Link>
                                
                                {newsletter.status === 'draft' && (
                                    <Link
                                        href={route('admin.newsletters.edit', newsletter.id)}
                                        className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700"
                                    >
                                        Edit Newsletter
                                    </Link>
                                )}
                                
                                <button
                                    onClick={duplicateNewsletter}
                                    className="block w-full text-center bg-gray-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-700"
                                >
                                    Duplicate Newsletter
                                </button>
                                
                                {newsletter.status === 'sent' && (
                                    <Link
                                        href={route('admin.newsletters.analytics.export', newsletter.id)}
                                        className="block w-full text-center bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700"
                                    >
                                        Export Analytics
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Schedule Info */}
                        {newsletter.scheduled_at && (
                            <div className="bg-blue-50 shadow-sm ring-1 ring-blue-200 sm:rounded-xl p-6">
                                <h3 className="text-lg font-medium text-blue-900 mb-2">📅 Scheduled</h3>
                                <p className="text-sm text-blue-800">
                                    This newsletter is scheduled to be sent on:
                                </p>
                                <p className="text-base font-medium text-blue-900 mt-1">
                                    {new Date(newsletter.scheduled_at).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
