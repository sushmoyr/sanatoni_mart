import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { PageProps } from '@/types';

export default function Guest({ children }: PropsWithChildren) {
    const { locale, available_languages } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen bg-semantic-bg sacred-bg relative overflow-hidden">
            {/* Sacred Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 text-6xl">🕉</div>
                <div className="absolute top-32 right-20 text-4xl">🔱</div>
                <div className="absolute bottom-20 left-16 text-5xl">🪷</div>
                <div className="absolute bottom-32 right-12 text-3xl">📿</div>
                <div className="absolute top-1/2 left-1/3 text-4xl">🕯</div>
                <div className="absolute top-1/4 right-1/3 text-3xl">🌸</div>
            </div>

            {/* Language Switcher */}
            <div className="absolute top-6 right-6 z-10">
                <LanguageSwitcher 
                    currentLocale={locale}
                    availableLanguages={available_languages}
                    className="bg-semantic-surface/80 backdrop-blur-sm border border-semantic-border rounded-lg shadow-e2"
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
                {/* Simple Branding */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block group">
                        <h1 className="text-3xl font-serif font-bold text-semantic-text group-hover:text-primary-600 transition-colors duration-300 flex items-center justify-center gap-2">
                            <span className="text-primary-600">🕉</span>
                            Sanatoni Mart
                            <span className="text-primary-600">🕉</span>
                        </h1>
                    </Link>
                    <p className="text-semantic-textSub text-sm mt-2">
                        Sacred & Authentic Religious Products
                    </p>
                </div>

                {/* Content Card */}
                <div className="w-full max-w-md">
                    <div className="bg-semantic-surface/95 backdrop-blur-sm rounded-2xl shadow-e3 border border-semantic-border overflow-hidden devotional-glow">
                        {children}
                    </div>
                </div>

                {/* Spiritual Quote */}
                <div className="mt-8 text-center max-w-md">
                    <blockquote className="text-sm text-semantic-textSub italic">
                        "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"
                    </blockquote>
                    <p className="text-xs text-semantic-textSub mt-1">
                        May all beings be happy and free from illness
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-semantic-textSub">
                        © 2024 Sanatoni Mart • Made with devotion 🙏
                    </p>
                </div>
            </div>
        </div>
    );
}
