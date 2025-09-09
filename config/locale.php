<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Locale
    |--------------------------------------------------------------------------
    |
    | This option controls the default locale that will be used by the
    | translation service provider. You are free to set this value
    | to any of the locales which will be supported by the application.
    |
    */

    'default' => 'en',

    /*
    |--------------------------------------------------------------------------
    | Fallback Locale
    |--------------------------------------------------------------------------
    |
    | The fallback locale determines the locale to use when the current one
    | is not available. You may change the value to correspond to any of
    | the language folders that are provided through your application.
    |
    */

    'fallback' => 'en',

    /*
    |--------------------------------------------------------------------------
    | Supported Locales
    |--------------------------------------------------------------------------
    |
    | This array contains all the locales supported by your application.
    | Each locale should have a corresponding language directory in the
    | resources/lang directory.
    |
    */

    'supported' => [
        'en' => [
            'name' => 'English',
            'native_name' => 'English',
            'flag' => '🇺🇸',
            'direction' => 'ltr',
            'date_format' => 'M j, Y',
            'currency' => 'USD',
        ],
        'bn' => [
            'name' => 'Bengali',
            'native_name' => 'বাংলা',
            'flag' => '🇧🇩',
            'direction' => 'ltr',
            'date_format' => 'j F, Y',
            'currency' => 'BDT',
        ],
    ],

    // Alias for compatibility
    'languages' => [
        'en' => [
            'name' => 'English',
            'native_name' => 'English',
            'flag' => '🇺🇸',
            'direction' => 'ltr',
            'date_format' => 'M j, Y',
            'currency' => 'USD',
        ],
        'bn' => [
            'name' => 'Bengali',
            'native_name' => 'বাংলা',
            'flag' => '🇧🇩',
            'direction' => 'ltr',
            'date_format' => 'j F, Y',
            'currency' => 'BDT',
        ],
    ],

    // Supported language codes
    'supported_languages' => ['en', 'bn'],

    /*
    |--------------------------------------------------------------------------
    | Locale Detection
    |--------------------------------------------------------------------------
    |
    | This configuration determines how the application should detect
    | the user's preferred locale. Options: 'header', 'session', 'cookie'
    |
    */

    'detection' => [
        'header' => true,
        'session' => true,
        'cookie' => true,
        'url' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Cookie Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for the locale cookie when cookie detection is enabled.
    |
    */

    'cookie' => [
        'name' => 'locale',
        'expire' => 60 * 24 * 365, // 1 year in minutes
        'path' => '/',
        'secure' => false,
        'http_only' => false,
    ],

    /*
    |--------------------------------------------------------------------------
    | URL Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for URL-based locale detection.
    | When enabled, URLs will include locale prefix: /en/page or /bn/page
    |
    */

    'url' => [
        'enabled' => true,
        'prefix_default' => false, // If true, default locale will also have prefix
        'hide_default' => true,    // If true, default locale won't show in URL
    ],
];
