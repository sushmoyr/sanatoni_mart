import { usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@/types';

interface TranslationData {
    [key: string]: string | TranslationData;
}

interface PageProps extends InertiaPageProps {
    translations?: TranslationData;
    locale?: string;
}

/**
 * Hook for accessing translations in React components
 */
export function useTranslations() {
    const { props } = usePage<PageProps>();
    const translations = props.translations || {};
    const locale = props.locale || 'en';

    /**
     * Get translation by key with optional replacements
     */
    const t = (key: string, replacements: Record<string, string | number> = {}): string => {
        const value = getNestedValue(translations, key);
        
        if (typeof value !== 'string') {
            return key; // Return key if translation not found
        }

        // Replace placeholders
        let result = value;
        Object.entries(replacements).forEach(([placeholder, replacement]) => {
            result = result.replace(`:${placeholder}`, String(replacement));
        });

        return result;
    };

    /**
     * Get translation with pluralization support
     */
    const tChoice = (key: string, count: number, replacements: Record<string, string | number> = {}): string => {
        const pluralKey = count === 1 ? key : `${key}_plural`;
        const value = getNestedValue(translations, pluralKey);
        
        if (typeof value === 'string') {
            let result = value;
            // Replace count placeholder
            result = result.replace(':count', String(count));
            // Replace other placeholders
            Object.entries(replacements).forEach(([placeholder, replacement]) => {
                result = result.replace(`:${placeholder}`, String(replacement));
            });
            return result;
        }

        // Fallback to singular form
        return t(key, { count, ...replacements });
    };

    /**
     * Check if translation exists
     */
    const hasTranslation = (key: string): boolean => {
        return getNestedValue(translations, key) !== undefined;
    };

    /**
     * Get current locale
     */
    const getLocale = (): string => {
        return locale;
    };

    return {
        t,
        tChoice,
        hasTranslation,
        getLocale,
        translations
    };
}

/**
 * Helper function to get nested object value by dot notation key
 */
function getNestedValue(obj: any, key: string): any {
    return key.split('.').reduce((current, keyPart) => {
        return current && current[keyPart];
    }, obj);
}

/**
 * Format number according to locale
 */
export function formatNumber(
    number: number, 
    locale?: string, 
    options?: Intl.NumberFormatOptions
): string {
    const { getLocale } = useTranslations();
    const currentLocale = locale || getLocale();
    
    return new Intl.NumberFormat(currentLocale, options).format(number);
}

/**
 * Format currency according to locale
 */
export function formatCurrency(
    amount: number, 
    currency = 'USD', 
    locale?: string
): string {
    return formatNumber(amount, locale, {
        style: 'currency',
        currency: currency
    });
}

/**
 * Format date according to locale
 */
export function formatDate(
    date: Date | string, 
    locale?: string, 
    options?: Intl.DateTimeFormatOptions
): string {
    const { getLocale } = useTranslations();
    const currentLocale = locale || getLocale();
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat(currentLocale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
    }).format(dateObj);
}

/**
 * Check if current locale is RTL
 */
export function isRTL(locale?: string): boolean {
    const { getLocale } = useTranslations();
    const currentLocale = locale || getLocale();
    
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.includes(currentLocale);
}

/**
 * Get text direction for current locale
 */
export function getTextDirection(locale?: string): 'ltr' | 'rtl' {
    return isRTL(locale) ? 'rtl' : 'ltr';
}
