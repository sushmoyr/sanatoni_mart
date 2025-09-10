import React, { createContext, useContext, ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps, TranslationData } from '@/types';

interface TranslationContextType {
    t: (key: string, replacements?: Record<string, string | number>, fallback?: string) => string;
    has: (key: string) => boolean;
    tChoice: (key: string, count: number, replacements?: Record<string, string | number>) => string;
    locale: string;
    translations: TranslationData;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
    children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
    const { translations, locale } = usePage<PageProps>().props;

    const t = (
        key: string,
        replacements: Record<string, string | number> = {},
        fallback?: string
    ): string => {
        const keys = key.split('.');
        let translation: string | TranslationData | undefined = translations;

        for (const k of keys) {
            if (typeof translation === 'object' && translation !== null && k in translation) {
                translation = translation[k];
            } else {
                translation = undefined;
                break;
            }
        }

        if (typeof translation === 'string') {
            let result = translation;

            Object.entries(replacements).forEach(([placeholder, value]) => {
                result = result.replace(
                    new RegExp(`:${placeholder}`, 'g'),
                    String(value)
                );
            });

            return result;
        }

        return fallback || key;
    };

    const has = (key: string): boolean => {
        const keys = key.split('.');
        let translation: string | TranslationData | undefined = translations;

        for (const k of keys) {
            if (typeof translation === 'object' && translation !== null && k in translation) {
                translation = translation[k];
            } else {
                return false;
            }
        }

        return typeof translation === 'string';
    };

    const tChoice = (
        key: string,
        count: number,
        replacements: Record<string, string | number> = {}
    ): string => {
        const pluralKey = count === 1 ? key : `${key}_plural`;
        const finalReplacements = { count, ...replacements };

        if (has(pluralKey)) {
            return t(pluralKey, finalReplacements);
        }

        return t(key, finalReplacements);
    };

    const value: TranslationContextType = {
        t,
        has,
        tChoice,
        locale,
        translations,
    };

    return (
        <TranslationContext.Provider value={value}>
            {children}
        </TranslationContext.Provider>
    );
}

export function useTranslation(): TranslationContextType {
    const context = useContext(TranslationContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
}

export default TranslationContext;
