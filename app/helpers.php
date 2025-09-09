<?php

use App\Services\TranslationService;

if (!function_exists('__t')) {
    /**
     * Enhanced translation function with database support
     */
    function __t(string $key, array $replace = [], string $locale = null): string
    {
        return app(TranslationService::class)->get($key, $locale, $replace);
    }
}

if (!function_exists('trans_choice_db')) {
    /**
     * Pluralization with database support
     */
    function trans_choice_db(string $key, int $number, array $replace = [], string $locale = null): string
    {
        $translation = __t($key, $replace, $locale);
        
        // Simple pluralization logic
        if ($number === 1) {
            return $translation;
        }
        
        // Try to get plural form
        $pluralKey = $key . '_plural';
        $pluralTranslation = __t($pluralKey, $replace, $locale);
        
        // If plural translation exists and is different, use it
        if ($pluralTranslation !== $pluralKey) {
            return $pluralTranslation;
        }
        
        return $translation;
    }
}

if (!function_exists('set_locale')) {
    /**
     * Set application locale and store in session
     */
    function set_locale(string $locale): void
    {
        $supportedLocales = array_keys(config('locale.supported', []));
        
        if (in_array($locale, $supportedLocales)) {
            app()->setLocale($locale);
            session(['locale' => $locale]);
            
            // Set Carbon locale if available
            if (class_exists('Carbon\Carbon')) {
                \Carbon\Carbon::setLocale($locale);
            }
        }
    }
}

if (!function_exists('get_available_locales')) {
    /**
     * Get list of available locales
     */
    function get_available_locales(): array
    {
        return array_keys(config('locale.supported', []));
    }
}

if (!function_exists('get_locale_name')) {
    /**
     * Get human readable name for locale
     */
    function get_locale_name(string $locale = null): string
    {
        $locale = $locale ?: app()->getLocale();
        $languages = config('locale.supported', []);
        
        return $languages[$locale]['name'] ?? $locale;
    }
}

if (!function_exists('get_locale_direction')) {
    /**
     * Get text direction for locale (ltr/rtl)
     */
    function get_locale_direction(string $locale = null): string
    {
        $locale = $locale ?: app()->getLocale();
        $rtlLanguages = config('locale.rtl_languages', []);
        
        return in_array($locale, $rtlLanguages) ? 'rtl' : 'ltr';
    }
}

if (!function_exists('is_rtl_locale')) {
    /**
     * Check if locale is RTL
     */
    function is_rtl_locale(string $locale = null): bool
    {
        return get_locale_direction($locale) === 'rtl';
    }
}

if (!function_exists('localized_route')) {
    /**
     * Generate localized route URL
     */
    function localized_route(string $name, array $parameters = [], string $locale = null): string
    {
        $locale = $locale ?: app()->getLocale();
        $urlLocaleType = config('locale.url_locale_type');
        
        // Generate normal route
        $url = route($name, $parameters);
        
        if ($urlLocaleType === 'path' && $locale !== config('app.locale')) {
            // Prepend locale to path
            $parsed = parse_url($url);
            $path = '/' . $locale . ($parsed['path'] ?? '');
            $url = $parsed['scheme'] . '://' . $parsed['host'] . 
                   (isset($parsed['port']) ? ':' . $parsed['port'] : '') . $path .
                   (isset($parsed['query']) ? '?' . $parsed['query'] : '') .
                   (isset($parsed['fragment']) ? '#' . $parsed['fragment'] : '');
        } elseif ($urlLocaleType === 'subdomain' && $locale !== config('app.locale')) {
            // Replace subdomain with locale
            $url = preg_replace('/^(https?:\/\/)([^.]+\.)?(.+)$/', '$1' . $locale . '.$3', $url);
        }
        
        return $url;
    }
}

if (!function_exists('current_locale')) {
    /**
     * Get current application locale
     */
    function current_locale(): string
    {
        return app()->getLocale();
    }
}

if (!function_exists('format_date_localized')) {
    /**
     * Format date according to locale settings
     */
    function format_date_localized($date, string $format = null, string $locale = null): string
    {
        if (!$date) {
            return '';
        }
        
        $locale = $locale ?: app()->getLocale();
        $format = $format ?: config('locale.date_format');
        
        if (is_string($date)) {
            $date = \Carbon\Carbon::parse($date);
        }
        
        // Set locale for formatting
        $originalLocale = \Carbon\Carbon::getLocale();
        \Carbon\Carbon::setLocale($locale);
        
        $formatted = $date->format($format);
        
        // Restore original locale
        \Carbon\Carbon::setLocale($originalLocale);
        
        return $formatted;
    }
}

if (!function_exists('format_currency_localized')) {
    /**
     * Format currency according to locale settings
     */
    function format_currency_localized(float $amount, string $currency = null, string $locale = null): string
    {
        $locale = $locale ?: app()->getLocale();
        $currency = $currency ?: config('locale.currency');
        
        $currencies = config('locale.currencies', []);
        $currencyConfig = $currencies[$currency] ?? ['symbol' => '$', 'position' => 'before'];
        
        $formatted = number_format($amount, 2);
        
        if ($currencyConfig['position'] === 'before') {
            return $currencyConfig['symbol'] . $formatted;
        } else {
            return $formatted . $currencyConfig['symbol'];
        }
    }
}
