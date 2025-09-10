import { usePage } from '@inertiajs/react';
import { PageProps, TranslationData } from '@/types';

/**
 * Custom hook for translations in React components
 * Uses the translations shared via HandleInertiaRequests middleware
 */
export function useTranslation() {
    const { translations, locale } = usePage<PageProps>().props;

    /**
     * Get translation by key with fallback support
     * @param key - Translation key (supports dot notation like 'common.save')
     * @param replacements - Object with placeholder replacements
     * @param fallback - Fallback text if translation not found
     */
    const t = (
        key: string, 
        replacements: Record<string, string | number> = {}, 
        fallback?: string
    ): string => {
        // Split the key by dots to traverse nested objects
        const keys = key.split('.');
        let translation: string | TranslationData | undefined = translations;

        // Traverse the translation object
        for (const k of keys) {
            if (typeof translation === 'object' && translation !== null && k in translation) {
                translation = translation[k];
            } else {
                translation = undefined;
                break;
            }
        }

        // If translation is found and is a string
        if (typeof translation === 'string') {
            let result = translation;

            // Replace placeholders
            Object.entries(replacements).forEach(([placeholder, value]) => {
                result = result.replace(
                    new RegExp(`:${placeholder}`, 'g'), 
                    String(value)
                );
            });

            return result;
        }

        // Return fallback or the key itself
        return fallback || key;
    };

    /**
     * Check if translation exists
     * @param key - Translation key
     */
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

    /**
     * Get current locale
     */
    const currentLocale = locale;

    /**
     * Format pluralized translation
     * @param key - Base translation key
     * @param count - Number for pluralization
     * @param replacements - Placeholder replacements
     */
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

    return {
        t,
        has,
        tChoice,
        currentLocale,
    };
}

export default useTranslation;
