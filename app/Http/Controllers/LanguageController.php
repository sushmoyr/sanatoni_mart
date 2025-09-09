<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Models\LanguageSetting;

class LanguageController extends Controller
{
    /**
     * Switch application language
     */
    public function switch(Request $request): RedirectResponse
    {
        $locale = $request->input('locale');
        $supportedLocales = array_keys(config('locale.supported', []));
        
        if (!in_array($locale, $supportedLocales)) {
            return back()->withErrors(['locale' => 'Unsupported language.']);
        }
        
        // Set locale for current session
        set_locale($locale);
        
        // Update user preference if authenticated
        if ($request->user()) {
            $setting = LanguageSetting::getForUser($request->user()->id, $locale);
            $setting->setAsDefault();
        }
        
        // Set cookie for non-authenticated users
        $cookie = cookie('locale', $locale, 60 * 24 * 365); // 1 year
        
        $redirectUrl = $request->input('redirect', $request->header('referer', '/'));
        
        return redirect($redirectUrl)->cookie($cookie);
    }

    /**
     * Get available languages
     */
    public function available()
    {
        $languages = config('locale.supported', []);
        $supportedLocales = array_keys($languages);
        
        $availableLanguages = [];
        foreach ($supportedLocales as $locale) {
            if (isset($languages[$locale])) {
                $availableLanguages[$locale] = $languages[$locale];
            }
        }
        
        return response()->json([
            'current' => app()->getLocale(),
            'available' => $availableLanguages,
        ]);
    }

    /**
     * Get current language settings for authenticated user
     */
    public function settings(Request $request)
    {
        if (!$request->user()) {
            return response()->json(['error' => 'Authentication required'], 401);
        }
        
        $settings = LanguageSetting::getAllForUser($request->user()->id);
        
        return response()->json([
            'settings' => $settings,
            'current' => app()->getLocale(),
        ]);
    }

    /**
     * Update language settings for authenticated user
     */
    public function updateSettings(Request $request): RedirectResponse
    {
        if (!$request->user()) {
            return back()->withErrors(['auth' => 'Authentication required']);
        }
        
        $request->validate([
            'locale' => 'required|string|in:' . implode(',', array_keys(config('locale.supported', []))),
            'timezone' => 'nullable|string',
            'date_format' => 'nullable|string',
            'currency' => 'nullable|string',
        ]);
        
        $setting = LanguageSetting::getForUser($request->user()->id, $request->locale);
        $setting->update([
            'timezone' => $request->timezone ?: config('app.timezone'),
            'date_format' => $request->date_format ?: config('locale.date_format'),
            'currency' => $request->currency ?: config('locale.currency'),
        ]);
        
        if ($request->boolean('set_as_default')) {
            $setting->setAsDefault();
            set_locale($request->locale);
        }
        
        return back()->with('success', __t('settings.language_updated'));
    }
}
