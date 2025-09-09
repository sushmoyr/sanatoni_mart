<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\LanguageSetting;

class LocalizationMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $this->getLocale($request);
        
        // Set the application locale
        app()->setLocale($locale);
        
        // Store locale in session for persistence
        session(['locale' => $locale]);
        
        // Set locale for Carbon (dates)
        if (class_exists('Carbon\Carbon')) {
            \Carbon\Carbon::setLocale($locale);
        }
        
        return $next($request);
    }

    /**
     * Determine the appropriate locale for the request
     */
    private function getLocale(Request $request): string
    {
        $supportedLocales = config('locale.supported_languages', ['en']);
        $defaultLocale = config('app.locale', 'en');
        $detectionOrder = config('locale.detection_order', ['user', 'session', 'header', 'url']);
        
        foreach ($detectionOrder as $method) {
            $locale = $this->detectLocaleByMethod($request, $method);
            
            if ($locale && in_array($locale, $supportedLocales)) {
                return $locale;
            }
        }
        
        return $defaultLocale;
    }

    /**
     * Detect locale by specific method
     */
    private function detectLocaleByMethod(Request $request, string $method): ?string
    {
        switch ($method) {
            case 'user':
                return $this->getLocaleFromUser($request);
                
            case 'session':
                return $request->session()->get('locale');
                
            case 'cookie':
                return $request->cookie('locale');
                
            case 'header':
                return $this->getLocaleFromHeader($request);
                
            case 'url':
                return $this->getLocaleFromUrl($request);
                
            case 'query':
                return $request->query('locale');
                
            default:
                return null;
        }
    }

    /**
     * Get locale from authenticated user settings
     */
    private function getLocaleFromUser(Request $request): ?string
    {
        if (!$request->user()) {
            return null;
        }
        
        $setting = LanguageSetting::getDefaultForUser($request->user()->id);
        
        return $setting ? $setting->locale : null;
    }

    /**
     * Get locale from Accept-Language header
     */
    private function getLocaleFromHeader(Request $request): ?string
    {
        $acceptLanguage = $request->header('Accept-Language');
        
        if (!$acceptLanguage) {
            return null;
        }
        
        // Parse Accept-Language header
        $languages = explode(',', $acceptLanguage);
        $supportedLocales = config('locale.supported_languages', ['en']);
        
        foreach ($languages as $language) {
            $locale = trim(explode(';', $language)[0]);
            
            // Check exact match
            if (in_array($locale, $supportedLocales)) {
                return $locale;
            }
            
            // Check language part only (e.g., 'en' from 'en-US')
            $languagePart = explode('-', $locale)[0];
            if (in_array($languagePart, $supportedLocales)) {
                return $languagePart;
            }
        }
        
        return null;
    }

    /**
     * Get locale from URL (subdomain or path)
     */
    private function getLocaleFromUrl(Request $request): ?string
    {
        $urlLocaleType = config('locale.url_locale_type');
        
        if ($urlLocaleType === 'subdomain') {
            return $this->getLocaleFromSubdomain($request);
        } elseif ($urlLocaleType === 'path') {
            return $this->getLocaleFromPath($request);
        }
        
        return null;
    }

    /**
     * Get locale from subdomain (e.g., bn.example.com)
     */
    private function getLocaleFromSubdomain(Request $request): ?string
    {
        $host = $request->getHost();
        $parts = explode('.', $host);
        
        if (count($parts) >= 2) {
            $subdomain = $parts[0];
            $supportedLocales = config('locale.supported_languages', ['en']);
            
            if (in_array($subdomain, $supportedLocales)) {
                return $subdomain;
            }
        }
        
        return null;
    }

    /**
     * Get locale from URL path (e.g., /bn/products)
     */
    private function getLocaleFromPath(Request $request): ?string
    {
        $path = trim($request->getPathInfo(), '/');
        $segments = explode('/', $path);
        
        if (!empty($segments[0])) {
            $supportedLocales = config('locale.supported_languages', ['en']);
            
            if (in_array($segments[0], $supportedLocales)) {
                return $segments[0];
            }
        }
        
        return null;
    }
}
