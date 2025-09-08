import React, { useState, useRef } from 'react';
import { Head, router, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';

interface Newsletter {
    id: number;
    subject: string;
    content: string;
    preheader: string;
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
    schedule_type: 'now' | 'later';
    scheduled_at?: string;
    sent_at?: string;
    subscriber_count: number;
    created_at: string;
    updated_at: string;
}

interface Subscriber {
    id: number;
    email: string;
    name: string;
    status: 'active' | 'inactive' | 'unsubscribed';
    created_at: string;
}

interface Props extends PageProps {
    newsletter: Newsletter;
    subscriber_count: number;
    recent_subscribers: Subscriber[];
}

interface NewsletterData {
    subject: string;
    content: string;
    preheader: string;
    schedule_type: 'now' | 'later';
    scheduled_at: string;
    template: 'basic' | 'promotional' | 'newsletter' | 'announcement';
}

export default function Edit({ newsletter, subscriber_count, recent_subscribers }: Props) {
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const contentRef = useRef<HTMLTextAreaElement>(null);

    const { data, setData, put, processing, errors, reset } = useForm<NewsletterData>({
        subject: newsletter.subject,
        content: newsletter.content,
        preheader: newsletter.preheader || '',
        schedule_type: newsletter.scheduled_at ? 'later' : 'now',
        scheduled_at: newsletter.scheduled_at ? new Date(newsletter.scheduled_at).toISOString().slice(0, 16) : '',
        template: 'basic', // Default template
    });

    const templates = {
        basic: {
            name: 'Basic Newsletter',
            content: `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
    <header style="background-color: #f8f9fa; padding: 20px; text-align: center;">
        <h1 style="color: #333; margin: 0;">Your Newsletter Title</h1>
    </header>
    
    <main style="padding: 30px 20px; background-color: white;">
        <h2 style="color: #333; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">Welcome to Our Newsletter</h2>
        
        <p style="line-height: 1.6; color: #555; margin-bottom: 20px;">
            Thank you for subscribing to our newsletter. We're excited to share the latest updates, news, and exclusive content with you.
        </p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Featured Content</h3>
            <p style="line-height: 1.6; color: #555; margin-bottom: 15px;">
                Add your featured content here. This could be a product highlight, blog post, or important announcement.
            </p>
            <a href="#" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Learn More
            </a>
        </div>
        
        <p style="line-height: 1.6; color: #555;">
            Have questions or feedback? We'd love to hear from you. Simply reply to this email or contact our support team.
        </p>
    </main>
    
    <footer style="background-color: #6c757d; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0; font-size: 14px;">
            © 2024 Your Company Name. All rights reserved.
        </p>
        <p style="margin: 10px 0 0 0; font-size: 12px;">
            <a href="#" style="color: #fff;">Unsubscribe</a> | 
            <a href="#" style="color: #fff;">Update Preferences</a>
        </p>
    </footer>
</div>`
        },
        promotional: {
            name: 'Promotional Email',
            content: `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
    <header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px;">🎉 Special Offer Inside!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Limited time offer - Don't miss out!</p>
    </header>
    
    <main style="padding: 40px 20px; background-color: white;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #333; font-size: 24px; margin-bottom: 15px;">Get 25% Off Everything!</h2>
            <p style="font-size: 18px; color: #666; margin-bottom: 20px;">
                Use code <strong style="background-color: #ffe066; padding: 5px 10px; border-radius: 3px; color: #333;">SAVE25</strong> at checkout
            </p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center; margin: 30px 0;">
            <h3 style="color: #333; margin-top: 0; font-size: 20px;">Featured Products</h3>
            <p style="color: #555; margin-bottom: 25px;">Check out our most popular items now on sale</p>
            
            <a href="#" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block;">
                Shop Now & Save
            </a>
        </div>
        
        <div style="border-top: 1px solid #e9ecef; padding-top: 20px; margin-top: 30px;">
            <p style="color: #888; font-size: 14px; text-align: center; margin: 0;">
                Offer expires in 48 hours. Free shipping on orders over $50.
            </p>
        </div>
    </main>
    
    <footer style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0; font-size: 14px;">© 2024 Your Store Name</p>
        <p style="margin: 10px 0 0 0; font-size: 12px;">
            <a href="#" style="color: #bdc3c7;">Unsubscribe</a> | 
            <a href="#" style="color: #bdc3c7;">Update Preferences</a>
        </p>
    </footer>
</div>`
        },
        newsletter: {
            name: 'Newsletter Digest',
            content: `<div style="max-width: 600px; margin: 0 auto; font-family: Georgia, serif; background-color: #f9f9f9;">
    <header style="background-color: #2c3e50; color: white; padding: 25px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 26px; font-weight: normal;">Weekly Newsletter</h1>
        <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.8;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </header>
    
    <main style="padding: 30px 20px; background-color: white;">
        <div style="border-bottom: 3px solid #3498db; padding-bottom: 15px; margin-bottom: 25px;">
            <h2 style="color: #2c3e50; margin: 0; font-size: 22px;">This Week's Highlights</h2>
        </div>
        
        <article style="margin-bottom: 30px; padding-bottom: 25px; border-bottom: 1px solid #e9ecef;">
            <h3 style="color: #2c3e50; margin: 0 0 10px 0; font-size: 18px;">Article Title Goes Here</h3>
            <p style="color: #666; line-height: 1.7; margin-bottom: 15px;">
                Brief excerpt or summary of your article content. This should be engaging and encourage readers to click through to read the full article.
            </p>
            <a href="#" style="color: #3498db; text-decoration: none; font-weight: bold;">Read More →</a>
        </article>
        
        <article style="margin-bottom: 30px; padding-bottom: 25px; border-bottom: 1px solid #e9ecef;">
            <h3 style="color: #2c3e50; margin: 0 0 10px 0; font-size: 18px;">Second Article Title</h3>
            <p style="color: #666; line-height: 1.7; margin-bottom: 15px;">
                Another compelling article excerpt that will draw your readers in and make them want to learn more about this topic.
            </p>
            <a href="#" style="color: #3498db; text-decoration: none; font-weight: bold;">Read More →</a>
        </article>
        
        <div style="background-color: #ecf0f1; padding: 20px; border-radius: 5px; margin: 25px 0;">
            <h4 style="color: #2c3e50; margin: 0 0 10px 0; font-size: 16px;">📅 Upcoming Events</h4>
            <ul style="color: #666; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>Event 1 - Date</li>
                <li>Event 2 - Date</li>
                <li>Event 3 - Date</li>
            </ul>
        </div>
    </main>
    
    <footer style="background-color: #34495e; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0; font-size: 14px;">Thank you for reading our newsletter!</p>
        <p style="margin: 10px 0 0 0; font-size: 12px;">
            <a href="#" style="color: #bdc3c7;">Unsubscribe</a> | 
            <a href="#" style="color: #bdc3c7;">View Online</a>
        </p>
    </footer>
</div>`
        },
        announcement: {
            name: 'Important Announcement',
            content: `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
    <header style="background-color: #e74c3c; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">📢 Important Announcement</h1>
    </header>
    
    <main style="padding: 30px 20px; background-color: white;">
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 5px; margin-bottom: 25px;">
            <h2 style="color: #856404; margin: 0 0 10px 0; font-size: 20px;">⚠️ Action Required</h2>
            <p style="color: #856404; margin: 0; line-height: 1.6;">
                This is an important announcement that requires your attention. Please read the details below carefully.
            </p>
        </div>
        
        <h3 style="color: #2c3e50; margin: 0 0 15px 0;">What's Happening?</h3>
        <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            Provide clear details about the announcement, change, or important information you need to communicate to your subscribers.
        </p>
        
        <h3 style="color: #2c3e50; margin: 0 0 15px 0;">What You Need to Do:</h3>
        <ol style="color: #555; line-height: 1.6; margin-bottom: 25px; padding-left: 20px;">
            <li>Step one of the required action</li>
            <li>Step two of the required action</li>
            <li>Step three of the required action</li>
        </ol>
        
        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 5px; margin: 25px 0;">
            <h4 style="color: #155724; margin: 0 0 10px 0;">📞 Need Help?</h4>
            <p style="color: #155724; margin: 0; line-height: 1.6;">
                If you have questions or need assistance, please don't hesitate to contact our support team.
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="#" style="background-color: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Take Action Now
            </a>
        </div>
    </main>
    
    <footer style="background-color: #95a5a6; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0; font-size: 14px;">© 2024 Your Company Name</p>
        <p style="margin: 10px 0 0 0; font-size: 12px;">
            <a href="#" style="color: #fff;">Contact Support</a> | 
            <a href="#" style="color: #fff;">Unsubscribe</a>
        </p>
    </footer>
</div>`
        }
    };

    const handleTemplateSelect = (templateKey: keyof typeof templates) => {
        setData('template', templateKey);
        setData('content', templates[templateKey].content);
    };

    const insertTextAtCursor = (text: string) => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentContent = data.content;
        
        const newContent = currentContent.substring(0, start) + text + currentContent.substring(end);
        setData('content', newContent);
        
        // Set cursor position after inserted text
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + text.length;
            textarea.focus();
        }, 0);
    };

    const quickInserts = [
        { label: 'Heading', code: '<h2 style="color: #333; margin: 20px 0 10px 0;">Your Heading</h2>' },
        { label: 'Paragraph', code: '<p style="color: #555; line-height: 1.6; margin-bottom: 15px;">Your paragraph text here.</p>' },
        { label: 'Button', code: '<a href="#" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Button Text</a>' },
        { label: 'Image', code: '<img src="https://via.placeholder.com/600x300" alt="Description" style="max-width: 100%; height: auto; border-radius: 5px;">' },
        { label: 'Divider', code: '<hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (data.schedule_type === 'now') {
            setData('scheduled_at', '');
        }

        put(route('admin.newsletters.update', newsletter.id), {
            onSuccess: () => {
                // Handle success
            },
        });
    };

    const handleSaveDraft = () => {
        setIsSaving(true);
        
        router.put(route('admin.newsletters.update', newsletter.id), {
            ...data,
            status: 'draft',
        }, {
            onSuccess: () => {
                setIsSaving(false);
            },
            onError: () => {
                setIsSaving(false);
            },
        });
    };

    const sendNewsletter = () => {
        if (confirm(`Send newsletter "${newsletter.subject}" to ${newsletter.subscriber_count} subscribers?`)) {
            router.post(route('admin.newsletters.send-now', newsletter.id), {}, {
                preserveScroll: true,
            });
        }
    };

    const getPreviewHtml = () => {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>${data.subject}</title>
            </head>
            <body style="margin: 0; padding: 20px; background-color: #f5f5f5;">
                ${data.content}
            </body>
            </html>
        `;
    };

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

    return (
        <AdminLayout>
            <Head title={`Edit Newsletter: ${newsletter.subject}`} />

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
                        <h1 className="mt-2 text-2xl font-semibold leading-6 text-gray-900">Edit Newsletter</h1>
                        <div className="mt-2 flex items-center space-x-4">
                            {getStatusBadge()}
                            <span className="text-sm text-gray-500">
                                Created {new Date(newsletter.created_at).toLocaleDateString()}
                            </span>
                            <span className="text-sm text-gray-500">
                                Last updated {new Date(newsletter.updated_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-3">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
                                <div className="px-4 py-6 sm:p-8">
                                    <div className="grid max-w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                        {/* Subject */}
                                        <div className="sm:col-span-4">
                                            <InputLabel htmlFor="subject" value="Subject Line" />
                                            <TextInput
                                                id="subject"
                                                type="text"
                                                value={data.subject}
                                                onChange={(e) => setData('subject', e.target.value)}
                                                className="mt-1 block w-full"
                                                placeholder="Enter email subject..."
                                                required
                                            />
                                            <InputError message={errors.subject} className="mt-2" />
                                        </div>

                                        {/* Preheader */}
                                        <div className="sm:col-span-4">
                                            <InputLabel htmlFor="preheader" value="Preheader Text (Optional)" />
                                            <TextInput
                                                id="preheader"
                                                type="text"
                                                value={data.preheader}
                                                onChange={(e) => setData('preheader', e.target.value)}
                                                className="mt-1 block w-full"
                                                placeholder="Preview text that appears after subject..."
                                            />
                                            <p className="mt-1 text-sm text-gray-500">
                                                This text appears next to the subject line in the inbox
                                            </p>
                                            <InputError message={errors.preheader} className="mt-2" />
                                        </div>

                                        {/* Template Selection */}
                                        <div className="sm:col-span-6">
                                            <InputLabel value="Replace Content with Template" />
                                            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                                {Object.entries(templates).map(([key, template]) => (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() => handleTemplateSelect(key as keyof typeof templates)}
                                                        className={`relative rounded-lg border p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                            data.template === key ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'
                                                        }`}
                                                    >
                                                        <span className="block text-sm font-medium text-gray-900">
                                                            {template.name}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Warning: Selecting a template will replace your current content
                                            </p>
                                        </div>

                                        {/* Quick Insert Tools */}
                                        <div className="sm:col-span-6">
                                            <InputLabel value="Quick Insert" />
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {quickInserts.map((item, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => insertTextAtCursor(item.code)}
                                                        className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Content Editor */}
                                        <div className="sm:col-span-6">
                                            <div className="flex items-center justify-between">
                                                <InputLabel htmlFor="content" value="Email Content" />
                                                <button
                                                    type="button"
                                                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    {isPreviewMode ? 'Edit HTML' : 'Preview'}
                                                </button>
                                            </div>
                                            
                                            {isPreviewMode ? (
                                                <div className="mt-2 border rounded-md bg-white p-4" style={{ minHeight: '400px' }}>
                                                    <iframe
                                                        srcDoc={getPreviewHtml()}
                                                        className="w-full h-96 border-0"
                                                        title="Email Preview"
                                                    />
                                                </div>
                                            ) : (
                                                <textarea
                                                    ref={contentRef}
                                                    id="content"
                                                    value={data.content}
                                                    onChange={(e) => setData('content', e.target.value)}
                                                    rows={20}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
                                                    placeholder="Enter your email HTML content..."
                                                    required
                                                />
                                            )}
                                            <InputError message={errors.content} className="mt-2" />
                                        </div>

                                        {/* Schedule Options - Only show if newsletter is not sent */}
                                        {newsletter.status !== 'sent' && (
                                            <div className="sm:col-span-6">
                                                <InputLabel value="Delivery Options" />
                                                <div className="mt-2 space-y-4">
                                                    <div className="flex items-center">
                                                        <input
                                                            id="send_now"
                                                            name="schedule_type"
                                                            type="radio"
                                                            checked={data.schedule_type === 'now'}
                                                            onChange={() => setData('schedule_type', 'now')}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                        />
                                                        <label htmlFor="send_now" className="ml-3 block text-sm font-medium text-gray-700">
                                                            Send immediately when saved
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            id="schedule_later"
                                                            name="schedule_type"
                                                            type="radio"
                                                            checked={data.schedule_type === 'later'}
                                                            onChange={() => setData('schedule_type', 'later')}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                        />
                                                        <label htmlFor="schedule_later" className="ml-3 block text-sm font-medium text-gray-700">
                                                            Schedule for later
                                                        </label>
                                                    </div>
                                                    {data.schedule_type === 'later' && (
                                                        <div className="ml-7">
                                                            <input
                                                                type="datetime-local"
                                                                value={data.scheduled_at}
                                                                onChange={(e) => setData('scheduled_at', e.target.value)}
                                                                min={new Date().toISOString().slice(0, 16)}
                                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                                required={data.schedule_type === 'later'}
                                                            />
                                                            <InputError message={errors.scheduled_at} className="mt-2" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex items-center justify-between gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                                    <div className="flex gap-x-3">
                                        {newsletter.status === 'draft' && (
                                            <SecondaryButton
                                                type="button"
                                                onClick={handleSaveDraft}
                                                disabled={isSaving}
                                            >
                                                {isSaving ? 'Saving...' : 'Save Draft'}
                                            </SecondaryButton>
                                        )}
                                        
                                        {newsletter.status === 'draft' && (
                                            <SecondaryButton
                                                type="button"
                                                onClick={sendNewsletter}
                                            >
                                                Send Now
                                            </SecondaryButton>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-x-3">
                                        <Link
                                            href={route('admin.newsletters.show', newsletter.id)}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Cancel
                                        </Link>
                                        <PrimaryButton
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing 
                                                ? (data.schedule_type === 'now' ? 'Saving & Sending...' : 'Saving & Scheduling...') 
                                                : (data.schedule_type === 'now' ? 'Save & Send' : 'Save & Schedule')
                                            }
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6">
                            {/* Newsletter Status */}
                            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Newsletter Status</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-gray-600">Status:</span>
                                        <div className="mt-1">{getStatusBadge()}</div>
                                    </div>
                                    
                                    {newsletter.scheduled_at && (
                                        <div>
                                            <span className="text-sm text-gray-600">Scheduled for:</span>
                                            <p className="text-sm font-medium text-gray-900 mt-1">
                                                {new Date(newsletter.scheduled_at).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {newsletter.sent_at && (
                                        <div>
                                            <span className="text-sm text-gray-600">Sent at:</span>
                                            <p className="text-sm font-medium text-gray-900 mt-1">
                                                {new Date(newsletter.sent_at).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Subscriber Info */}
                            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Subscriber Info</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-2xl font-bold text-blue-600">{subscriber_count}</span>
                                        <p className="text-sm text-gray-500">Total Subscribers</p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Subscribers */}
                            {recent_subscribers && recent_subscribers.length > 0 && (
                                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Subscribers</h3>
                                    <div className="space-y-3">
                                        {recent_subscribers.slice(0, 5).map((subscriber) => (
                                            <div key={subscriber.id} className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <span className="text-xs font-medium text-blue-800">
                                                            {subscriber.name ? subscriber.name.charAt(0).toUpperCase() : subscriber.email.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {subscriber.name || subscriber.email}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(subscriber.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Link
                                        href={route('admin.newsletters.preview', newsletter.id)}
                                        target="_blank"
                                        className="block w-full text-center bg-purple-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-purple-700"
                                    >
                                        Preview Email
                                    </Link>
                                    
                                    <Link
                                        href={route('admin.newsletters.show', newsletter.id)}
                                        className="block w-full text-center bg-gray-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-700"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="bg-yellow-50 shadow-sm ring-1 ring-yellow-200 sm:rounded-xl p-6">
                                <h3 className="text-lg font-medium text-yellow-800 mb-4">💡 Email Tips</h3>
                                <ul className="text-sm text-yellow-700 space-y-2">
                                    <li>• Keep subject lines under 50 characters</li>
                                    <li>• Use a clear call-to-action</li>
                                    <li>• Test on mobile devices</li>
                                    <li>• Include unsubscribe links</li>
                                    <li>• Personalize when possible</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
