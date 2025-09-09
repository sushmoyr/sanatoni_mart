import React from 'react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';

interface PageSection {
    id: number;
    type: string;
    content: any;
    settings: any;
    sort_order: number;
}

interface Page {
    id: number;
    title: string;
    slug: string;
    content: string;
    template: string;
    sections: PageSection[];
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    twitter_title?: string;
    twitter_description?: string;
    twitter_image?: string;
    created_at: string;
    updated_at: string;
}

interface Props extends PageProps {
    page: Page;
}

// Section Components
const HeroSection: React.FC<{ content: any; settings: any }> = ({ content, settings }) => (
    <section className={`relative ${settings?.height || 'h-96'} flex items-center justify-center`}>
        {settings?.background_image && (
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${settings.background_image})` }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>
        )}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
            {content?.title && (
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {content.title}
                </h1>
            )}
            {content?.subtitle && (
                <p className="text-xl md:text-2xl mb-8">
                    {content.subtitle}
                </p>
            )}
            {content?.button_text && content?.button_url && (
                <a
                    href={content.button_url}
                    className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                    {content.button_text}
                </a>
            )}
        </div>
    </section>
);

const TextSection: React.FC<{ content: any; settings: any }> = ({ content, settings }) => (
    <section className={`py-12 ${settings?.background_color || 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-4">
            {content?.title && (
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    {content.title}
                </h2>
            )}
            {content?.text && (
                <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: content.text }}
                />
            )}
        </div>
    </section>
);

const ImageSection: React.FC<{ content: any; settings: any }> = ({ content, settings }) => (
    <section className={`py-12 ${settings?.background_color || 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4">
            {content?.title && (
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                    {content.title}
                </h2>
            )}
            <div className={`grid ${settings?.layout === 'side-by-side' ? 'md:grid-cols-2' : 'grid-cols-1'} gap-8 items-center`}>
                {content?.image && (
                    <div className={settings?.layout === 'side-by-side' && settings?.image_position === 'right' ? 'md:order-2' : ''}>
                        <img
                            src={content.image}
                            alt={content.alt_text || content.title || 'Image'}
                            className="w-full h-auto rounded-lg shadow-lg"
                        />
                    </div>
                )}
                {content?.text && (
                    <div className={settings?.layout === 'side-by-side' && settings?.image_position === 'right' ? 'md:order-1' : ''}>
                        <div 
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: content.text }}
                        />
                    </div>
                )}
            </div>
        </div>
    </section>
);

const GallerySection: React.FC<{ content: any; settings: any }> = ({ content, settings }) => (
    <section className={`py-12 ${settings?.background_color || 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4">
            {content?.title && (
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                    {content.title}
                </h2>
            )}
            {content?.images && content.images.length > 0 && (
                <div className={`grid gap-4 ${
                    settings?.columns === '2' ? 'grid-cols-1 md:grid-cols-2' :
                    settings?.columns === '3' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                    settings?.columns === '4' ? 'grid-cols-2 md:grid-cols-4' :
                    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}>
                    {content.images.map((image: any, index: number) => (
                        <div key={index} className="relative group">
                            <img
                                src={image.url}
                                alt={image.alt_text || `Gallery image ${index + 1}`}
                                className="w-full h-64 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                            />
                            {image.caption && (
                                <p className="mt-2 text-sm text-gray-600 text-center">
                                    {image.caption}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    </section>
);

const CallToActionSection: React.FC<{ content: any; settings: any }> = ({ content, settings }) => (
    <section className={`py-16 ${settings?.background_color || 'bg-indigo-600'}`}>
        <div className="max-w-4xl mx-auto text-center px-4">
            {content?.title && (
                <h2 className="text-3xl font-bold text-white mb-4">
                    {content.title}
                </h2>
            )}
            {content?.text && (
                <p className="text-xl text-indigo-100 mb-8">
                    {content.text}
                </p>
            )}
            {content?.button_text && content?.button_url && (
                <a
                    href={content.button_url}
                    className={`inline-block font-semibold py-3 px-6 rounded-lg transition-colors ${
                        settings?.button_style === 'outline' 
                            ? 'border-2 border-white text-white hover:bg-white hover:text-indigo-600'
                            : 'bg-white text-indigo-600 hover:bg-gray-100'
                    }`}
                >
                    {content.button_text}
                </a>
            )}
        </div>
    </section>
);

const TestimonialsSection: React.FC<{ content: any; settings: any }> = ({ content, settings }) => (
    <section className={`py-16 ${settings?.background_color || 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4">
            {content?.title && (
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                    {content.title}
                </h2>
            )}
            {content?.testimonials && content.testimonials.length > 0 && (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {content.testimonials.map((testimonial: any, index: number) => (
                        <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                            <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-5 h-5 ${
                                            i < (testimonial.rating || 5) ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <blockquote className="text-gray-600 mb-4">
                                "{testimonial.text}"
                            </blockquote>
                            <div className="flex items-center">
                                {testimonial.avatar && (
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                )}
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        {testimonial.name}
                                    </div>
                                    {testimonial.position && (
                                        <div className="text-sm text-gray-500">
                                            {testimonial.position}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </section>
);

const FaqSection: React.FC<{ content: any; settings: any }> = ({ content, settings }) => (
    <section className={`py-16 ${settings?.background_color || 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-4">
            {content?.title && (
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                    {content.title}
                </h2>
            )}
            {content?.faqs && content.faqs.length > 0 && (
                <div className="space-y-6">
                    {content.faqs.map((faq: any, index: number) => (
                        <details key={index} className="bg-gray-50 rounded-lg p-6">
                            <summary className="font-semibold text-gray-900 cursor-pointer">
                                {faq.question}
                            </summary>
                            <div className="mt-4 text-gray-600">
                                {faq.answer}
                            </div>
                        </details>
                    ))}
                </div>
            )}
        </div>
    </section>
);

const ContactSection: React.FC<{ content: any; settings: any }> = ({ content, settings }) => (
    <section className={`py-16 ${settings?.background_color || 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4">
            {content?.title && (
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                    {content.title}
                </h2>
            )}
            <div className="grid gap-8 md:grid-cols-2">
                <div>
                    {content?.description && (
                        <div 
                            className="prose prose-lg mb-8"
                            dangerouslySetInnerHTML={{ __html: content.description }}
                        />
                    )}
                    {content?.contact_info && (
                        <div className="space-y-4">
                            {content.contact_info.address && (
                                <div className="flex items-start">
                                    <svg className="w-6 h-6 text-indigo-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="text-gray-600">{content.contact_info.address}</p>
                                </div>
                            )}
                            {content.contact_info.phone && (
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <p className="text-gray-600">{content.contact_info.phone}</p>
                                </div>
                            )}
                            {content.contact_info.email && (
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-600">{content.contact_info.email}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div>
                    {content?.show_form && (
                        <form className="bg-white rounded-lg p-6 shadow-md">
                            <div className="grid gap-4 md:grid-cols-2">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Subject"
                                className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                            <textarea
                                placeholder="Your Message"
                                rows={4}
                                className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                            >
                                Send Message
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    </section>
);

const CustomSection: React.FC<{ content: any; settings: any }> = ({ content, settings }) => (
    <section className={`py-12 ${settings?.background_color || 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4">
            <div 
                dangerouslySetInnerHTML={{ __html: content?.html || '' }}
            />
        </div>
    </section>
);

// Section renderer
const renderSection = (section: PageSection) => {
    const { type, content, settings } = section;

    switch (type) {
        case 'hero':
            return <HeroSection key={section.id} content={content} settings={settings} />;
        case 'text':
            return <TextSection key={section.id} content={content} settings={settings} />;
        case 'image':
            return <ImageSection key={section.id} content={content} settings={settings} />;
        case 'gallery':
            return <GallerySection key={section.id} content={content} settings={settings} />;
        case 'cta':
            return <CallToActionSection key={section.id} content={content} settings={settings} />;
        case 'testimonials':
            return <TestimonialsSection key={section.id} content={content} settings={settings} />;
        case 'faq':
            return <FaqSection key={section.id} content={content} settings={settings} />;
        case 'contact':
            return <ContactSection key={section.id} content={content} settings={settings} />;
        case 'custom':
            return <CustomSection key={section.id} content={content} settings={settings} />;
        default:
            return null;
    }
};

export default function DynamicPage({ auth, page }: Props) {
    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;
    
    // Sort sections by sort_order
    const sortedSections = [...page.sections].sort((a, b) => a.sort_order - b.sort_order);

    return (
        <Layout>
            <Head title={page.seo_title || page.title}>
                {/* SEO Meta Tags */}
                {page.seo_description && <meta name="description" content={page.seo_description} />}
                {page.seo_keywords && <meta name="keywords" content={page.seo_keywords} />}

                {/* Open Graph */}
                {page.og_title && <meta property="og:title" content={page.og_title} />}
                {page.og_description && <meta property="og:description" content={page.og_description} />}
                {page.og_image && <meta property="og:image" content={page.og_image} />}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                {page.twitter_title && <meta name="twitter:title" content={page.twitter_title} />}
                {page.twitter_description && <meta name="twitter:description" content={page.twitter_description} />}
                {page.twitter_image && <meta name="twitter:image" content={page.twitter_image} />}

                {/* Additional SEO */}
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
            </Head>

            <div className="min-h-screen">
                {/* Render page sections if available */}
                {sortedSections.length > 0 ? (
                    sortedSections.map(renderSection)
                ) : (
                    /* Fallback to basic content if no sections */
                    <div className="py-12">
                        <div className="max-w-4xl mx-auto px-4">
                            <h1 className="text-4xl font-bold text-gray-900 mb-8">
                                {page.title}
                            </h1>
                            <div 
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
