<?php

namespace App\Services;

use App\Models\Translation;
use App\Models\LocalizableContent;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;

class TranslationService
{
    /**
     * Cache key prefix for translations
     */
    private const CACHE_PREFIX = 'translations:';
    
    /**
     * Cache TTL in seconds (24 hours)
     */
    private const CACHE_TTL = 86400;

    /**
     * Get translation with fallback support
     */
    public function get(string $key, string $locale = null, array $replace = [], string $fallback = null): string
    {
        $locale = $locale ?: app()->getLocale();
        $fallback = $fallback ?: $key;
        
        // Try to get from cache first
        $cacheKey = self::CACHE_PREFIX . $locale . ':' . $key;
        $translation = Cache::get($cacheKey);
        
        if ($translation === null) {
            // Try database first
            $translation = Translation::getTranslation($locale, $key);
            
            if ($translation === null) {
                // Try Laravel's default translation files
                $translation = trans($key, [], $locale);
                
                if ($translation === $key) {
                    // Use fallback locale if current locale failed
                    if ($locale !== config('app.locale')) {
                        $translation = Translation::getTranslation(config('app.locale'), $key);
                        
                        if ($translation === null) {
                            $translation = trans($key, [], config('app.locale'));
                        }
                    }
                    
                    // Use provided fallback if all else fails
                    if ($translation === $key) {
                        $translation = $fallback;
                    }
                }
            }
            
            // Cache the result
            Cache::put($cacheKey, $translation, self::CACHE_TTL);
        }
        
        // Replace placeholders
        if (!empty($replace)) {
            foreach ($replace as $search => $replacement) {
                $translation = str_replace(':' . $search, $replacement, $translation);
            }
        }
        
        return $translation;
    }

    /**
     * Set translation and clear cache
     */
    public function set(string $key, string $value, string $locale = null, string $group = null): Translation
    {
        $locale = $locale ?: app()->getLocale();
        
        $translation = Translation::setTranslation($locale, $key, $value, $group);
        
        // Clear cache
        $this->clearCache($locale, $key);
        
        return $translation;
    }

    /**
     * Get all translations for a locale
     */
    public function getAll(string $locale = null): array
    {
        $locale = $locale ?: app()->getLocale();
        
        $cacheKey = self::CACHE_PREFIX . $locale . ':all';
        
        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($locale) {
            $dbTranslations = Translation::getAllForLocale($locale);
            $fileTranslations = $this->getFileTranslations($locale);
            
            return array_merge($fileTranslations, $dbTranslations);
        });
    }

    /**
     * Get translations grouped by group
     */
    public function getAllGrouped(string $locale = null): array
    {
        $locale = $locale ?: app()->getLocale();
        
        $cacheKey = self::CACHE_PREFIX . $locale . ':grouped';
        
        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($locale) {
            $dbTranslations = Translation::getAllGroupedForLocale($locale);
            $fileTranslations = $this->getFileTranslationsGrouped($locale);
            
            // Merge database translations with file translations
            foreach ($dbTranslations as $group => $translations) {
                if (isset($fileTranslations[$group])) {
                    $fileTranslations[$group] = array_merge($fileTranslations[$group], $translations);
                } else {
                    $fileTranslations[$group] = $translations;
                }
            }
            
            return $fileTranslations;
        });
    }

    /**
     * Import translations from file to database
     */
    public function importFromFile(string $locale, string $filePath, string $group = null): int
    {
        if (!File::exists($filePath)) {
            throw new \InvalidArgumentException("Translation file not found: {$filePath}");
        }
        
        $translations = include $filePath;
        
        if (!is_array($translations)) {
            throw new \InvalidArgumentException("Translation file must return an array");
        }
        
        $count = 0;
        $group = $group ?: pathinfo($filePath, PATHINFO_FILENAME);
        
        foreach ($translations as $key => $value) {
            if (is_string($value)) {
                Translation::setTranslation($locale, $key, $value, $group);
                $count++;
            } elseif (is_array($value)) {
                // Handle nested arrays
                $count += $this->importNestedArray($locale, $key, $value, $group);
            }
        }
        
        // Clear cache for this locale
        $this->clearCacheForLocale($locale);
        
        return $count;
    }

    /**
     * Export translations to file
     */
    public function exportToFile(string $locale, string $group = null, string $filePath = null): string
    {
        $translations = $group 
            ? Translation::where('locale', $locale)->where('group', $group)->pluck('value', 'key')->toArray()
            : Translation::getAllForLocale($locale);
        
        if (!$filePath) {
            $fileName = $group ? "{$group}.php" : "all.php";
            $filePath = resource_path("lang/{$locale}/{$fileName}");
        }
        
        $content = "<?php\n\nreturn " . var_export($translations, true) . ";\n";
        
        // Ensure directory exists
        $directory = dirname($filePath);
        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }
        
        File::put($filePath, $content);
        
        return $filePath;
    }

    /**
     * Get missing translations
     */
    public function getMissingTranslations(string $locale, string $compareLocale = 'en'): array
    {
        return Translation::getMissingTranslations($locale, $compareLocale);
    }

    /**
     * Clear translation cache
     */
    public function clearCache(string $locale = null, string $key = null): void
    {
        if ($locale && $key) {
            $cacheKey = self::CACHE_PREFIX . $locale . ':' . $key;
            Cache::forget($cacheKey);
        } elseif ($locale) {
            $this->clearCacheForLocale($locale);
        } else {
            // Clear all translation cache
            $supportedLocales = config('locale.supported_languages', ['en']);
            foreach ($supportedLocales as $supportedLocale) {
                $this->clearCacheForLocale($supportedLocale);
            }
        }
    }

    /**
     * Clear all cache for a locale
     */
    private function clearCacheForLocale(string $locale): void
    {
        Cache::forget(self::CACHE_PREFIX . $locale . ':all');
        Cache::forget(self::CACHE_PREFIX . $locale . ':grouped');
        
        // Note: Individual key caches are harder to clear without knowing all keys
        // In production, consider using cache tags for better cache management
    }

    /**
     * Get translations from Laravel translation files
     */
    private function getFileTranslations(string $locale): array
    {
        $langPath = resource_path("lang/{$locale}");
        $translations = [];
        
        if (File::exists($langPath)) {
            $files = File::files($langPath);
            
            foreach ($files as $file) {
                if ($file->getExtension() === 'php') {
                    $group = $file->getFilenameWithoutExtension();
                    $groupTranslations = include $file->getPathname();
                    
                    if (is_array($groupTranslations)) {
                        foreach ($groupTranslations as $key => $value) {
                            $translations["{$group}.{$key}"] = $value;
                        }
                    }
                }
            }
        }
        
        return $translations;
    }

    /**
     * Get translations from files grouped by file
     */
    private function getFileTranslationsGrouped(string $locale): array
    {
        $langPath = resource_path("lang/{$locale}");
        $translations = [];
        
        if (File::exists($langPath)) {
            $files = File::files($langPath);
            
            foreach ($files as $file) {
                if ($file->getExtension() === 'php') {
                    $group = $file->getFilenameWithoutExtension();
                    $groupTranslations = include $file->getPathname();
                    
                    if (is_array($groupTranslations)) {
                        $translations[$group] = $groupTranslations;
                    }
                }
            }
        }
        
        return $translations;
    }

    /**
     * Import nested array recursively
     */
    private function importNestedArray(string $locale, string $prefix, array $array, string $group): int
    {
        $count = 0;
        
        foreach ($array as $key => $value) {
            $fullKey = $prefix . '.' . $key;
            
            if (is_string($value)) {
                Translation::setTranslation($locale, $fullKey, $value, $group);
                $count++;
            } elseif (is_array($value)) {
                $count += $this->importNestedArray($locale, $fullKey, $value, $group);
            }
        }
        
        return $count;
    }
}
