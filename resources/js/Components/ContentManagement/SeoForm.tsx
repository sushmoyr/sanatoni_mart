import React, { useState, useEffect } from 'react';
import {
    InformationCircleIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

interface SeoData {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    og_type?: string;
    twitter_card?: string;
    twitter_title?: string;
    twitter_description?: string;
    twitter_image?: string;
    canonical_url?: string;
}

interface SeoAnalysis {
    score: number;
    percentage: number;
    grade: string;
    issues: string[];
    recommendations: string[];
}

interface SeoFormProps {
    initialData?: SeoData;
    contentTitle?: string;
    contentDescription?: string;
    onChange: (data: SeoData) => void;
    onAnalyze?: () => void;
    analysis?: SeoAnalysis;
    loading?: boolean;
}

export default function SeoForm({
    initialData = {},
    contentTitle = '',
    contentDescription = '',
    onChange,
    onAnalyze,
    analysis,
    loading = false,
}: SeoFormProps) {
    const [seoData, setSeoData] = useState<SeoData>(initialData);
    const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'advanced'>('basic');

    useEffect(() => {
        setSeoData(initialData);
    }, [initialData]);

    const updateSeoData = (key: keyof SeoData, value: string) => {
        const newData = { ...seoData, [key]: value };
        setSeoData(newData);
        onChange(newData);
    };

    const generateFromContent = (field: 'meta_title' | 'meta_description') => {
        if (field === 'meta_title' && contentTitle) {
            updateSeoData('meta_title', contentTitle);
        } else if (field === 'meta_description' && contentDescription) {
            // Generate excerpt from content
            const stripped = contentDescription.replace(/<[^>]*>/g, '').substring(0, 155);
            updateSeoData('meta_description', stripped + (stripped.length === 155 ? '...' : ''));
        }
    };

    const copyToSocial = (from: 'meta_title' | 'meta_description') => {
        if (from === 'meta_title' && seoData.meta_title) {
            updateSeoData('og_title', seoData.meta_title);
            updateSeoData('twitter_title', seoData.meta_title);
        } else if (from === 'meta_description' && seoData.meta_description) {
            updateSeoData('og_description', seoData.meta_description);
            updateSeoData('twitter_description', seoData.meta_description);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreIcon = (score: number) => {
        if (score >= 80) return CheckCircleIcon;
        if (score >= 60) return ExclamationTriangleIcon;
        return XCircleIcon;
    };

    const getCharacterCount = (text: string) => text.length;
    const getCharacterCountColor = (text: string, optimal: [number, number]) => {
        const count = getCharacterCount(text);
        if (count >= optimal[0] && count <= optimal[1]) return 'text-green-600';
        if (count === 0) return 'text-gray-400';
        return 'text-red-600';
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg">
            {/* SEO Score Display */}
            {analysis && (
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">SEO Analysis</h3>
                        {onAnalyze && (
                            <button
                                onClick={onAnalyze}
                                disabled={loading}
                                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {loading ? 'Analyzing...' : 'Re-analyze'}
                            </button>
                        )}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 ${getScoreColor(analysis.percentage)}`}>
                                {React.createElement(getScoreIcon(analysis.percentage), { className: 'w-full h-full' })}
                            </div>
                            <div>
                                <div className={`text-2xl font-bold ${getScoreColor(analysis.percentage)}`}>
                                    {analysis.percentage}%
                                </div>
                                <div className="text-sm text-gray-600">Grade: {analysis.grade}</div>
                            </div>
                        </div>
                        
                        {analysis.issues.length > 0 && (
                            <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900 mb-1">Issues to fix:</div>
                                <ul className="text-sm text-red-600 space-y-1">
                                    {analysis.issues.slice(0, 3).map((issue, index) => (
                                        <li key={index}>• {issue}</li>
                                    ))}
                                    {analysis.issues.length > 3 && (
                                        <li>• And {analysis.issues.length - 3} more...</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-4" aria-label="Tabs">
                    {[
                        { key: 'basic', label: 'Basic SEO' },
                        { key: 'social', label: 'Social Media' },
                        { key: 'advanced', label: 'Advanced' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === tab.key
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="p-4">
                {activeTab === 'basic' && (
                    <div className="space-y-6">
                        {/* Meta Title */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Meta Title
                                </label>
                                <div className="flex items-center space-x-2 text-xs">
                                    <span className={getCharacterCountColor(seoData.meta_title || '', [50, 60])}>
                                        {getCharacterCount(seoData.meta_title || '')}/60
                                    </span>
                                    {contentTitle && (
                                        <button
                                            onClick={() => generateFromContent('meta_title')}
                                            className="text-indigo-600 hover:text-indigo-800"
                                        >
                                            Use content title
                                        </button>
                                    )}
                                </div>
                            </div>
                            <input
                                type="text"
                                value={seoData.meta_title || ''}
                                onChange={(e) => updateSeoData('meta_title', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter meta title (50-60 characters)"
                                maxLength={60}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                The title that appears in search engine results. Keep it under 60 characters.
                            </p>
                        </div>

                        {/* Meta Description */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Meta Description
                                </label>
                                <div className="flex items-center space-x-2 text-xs">
                                    <span className={getCharacterCountColor(seoData.meta_description || '', [150, 160])}>
                                        {getCharacterCount(seoData.meta_description || '')}/160
                                    </span>
                                    {contentDescription && (
                                        <button
                                            onClick={() => generateFromContent('meta_description')}
                                            className="text-indigo-600 hover:text-indigo-800"
                                        >
                                            Generate from content
                                        </button>
                                    )}
                                </div>
                            </div>
                            <textarea
                                value={seoData.meta_description || ''}
                                onChange={(e) => updateSeoData('meta_description', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                rows={3}
                                placeholder="Enter meta description (150-160 characters)"
                                maxLength={160}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                The description that appears in search engine results. Keep it between 150-160 characters.
                            </p>
                        </div>

                        {/* Meta Keywords */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Keywords
                            </label>
                            <input
                                type="text"
                                value={seoData.meta_keywords || ''}
                                onChange={(e) => updateSeoData('meta_keywords', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="keyword1, keyword2, keyword3"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Comma-separated keywords. While not heavily used by modern search engines, some still consider them.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'social' && (
                    <div className="space-y-6">
                        {/* Open Graph */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">Facebook</span>
                                Open Graph Tags
                            </h4>
                            
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            OG Title
                                        </label>
                                        <button
                                            onClick={() => copyToSocial('meta_title')}
                                            className="text-xs text-indigo-600 hover:text-indigo-800"
                                        >
                                            Copy from meta title
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={seoData.og_title || ''}
                                        onChange={(e) => updateSeoData('og_title', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Facebook share title"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            OG Description
                                        </label>
                                        <button
                                            onClick={() => copyToSocial('meta_description')}
                                            className="text-xs text-indigo-600 hover:text-indigo-800"
                                        >
                                            Copy from meta description
                                        </button>
                                    </div>
                                    <textarea
                                        value={seoData.og_description || ''}
                                        onChange={(e) => updateSeoData('og_description', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        rows={2}
                                        placeholder="Facebook share description"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        OG Image URL
                                    </label>
                                    <input
                                        type="url"
                                        value={seoData.og_image || ''}
                                        onChange={(e) => updateSeoData('og_image', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Recommended size: 1200x630 pixels
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        OG Type
                                    </label>
                                    <select
                                        value={seoData.og_type || 'website'}
                                        onChange={(e) => updateSeoData('og_type', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="website">Website</option>
                                        <option value="article">Article</option>
                                        <option value="product">Product</option>
                                        <option value="profile">Profile</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Twitter Cards */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                                <span className="bg-blue-400 text-white text-xs px-2 py-1 rounded mr-2">Twitter</span>
                                Twitter Card Tags
                            </h4>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Card Type
                                    </label>
                                    <select
                                        value={seoData.twitter_card || 'summary'}
                                        onChange={(e) => updateSeoData('twitter_card', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="summary">Summary</option>
                                        <option value="summary_large_image">Summary with Large Image</option>
                                        <option value="app">App</option>
                                        <option value="player">Player</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Twitter Title
                                    </label>
                                    <input
                                        type="text"
                                        value={seoData.twitter_title || ''}
                                        onChange={(e) => updateSeoData('twitter_title', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Twitter share title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Twitter Description
                                    </label>
                                    <textarea
                                        value={seoData.twitter_description || ''}
                                        onChange={(e) => updateSeoData('twitter_description', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        rows={2}
                                        placeholder="Twitter share description"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Twitter Image URL
                                    </label>
                                    <input
                                        type="url"
                                        value={seoData.twitter_image || ''}
                                        onChange={(e) => updateSeoData('twitter_image', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Recommended size: 1200x600 pixels
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'advanced' && (
                    <div className="space-y-6">
                        {/* Canonical URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Canonical URL
                            </label>
                            <input
                                type="url"
                                value={seoData.canonical_url || ''}
                                onChange={(e) => updateSeoData('canonical_url', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="https://example.com/canonical-url"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                The preferred URL for this content. Helps prevent duplicate content issues.
                            </p>
                        </div>

                        {/* SEO Tips */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex">
                                <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5" />
                                <div className="ml-3">
                                    <h4 className="text-sm font-medium text-blue-800">SEO Tips</h4>
                                    <ul className="mt-2 text-xs text-blue-700 space-y-1">
                                        <li>• Keep meta titles between 50-60 characters</li>
                                        <li>• Meta descriptions should be 150-160 characters</li>
                                        <li>• Use relevant keywords naturally in your content</li>
                                        <li>• Include target keywords in your meta title and description</li>
                                        <li>• Write compelling meta descriptions that encourage clicks</li>
                                        <li>• Use descriptive, keyword-rich URLs</li>
                                        <li>• Optimize images with descriptive alt text</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
