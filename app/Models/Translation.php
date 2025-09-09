<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Translation extends Model
{
    use HasFactory;

    protected $fillable = [
        'locale',
        'key',
        'value',
        'group',
        'description',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Scope to filter by locale
     */
    public function scopeForLocale(Builder $query, string $locale): Builder
    {
        return $query->where('locale', $locale);
    }

    /**
     * Scope to filter by group
     */
    public function scopeForGroup(Builder $query, string $group): Builder
    {
        return $query->where('group', $group);
    }

    /**
     * Scope to filter by key pattern
     */
    public function scopeForKey(Builder $query, string $key): Builder
    {
        return $query->where('key', 'LIKE', "%{$key}%");
    }

    /**
     * Get translation by locale and key
     */
    public static function getTranslation(string $locale, string $key, string $default = null): ?string
    {
        $translation = static::where('locale', $locale)
            ->where('key', $key)
            ->first();

        return $translation ? $translation->value : $default;
    }

    /**
     * Set translation for locale and key
     */
    public static function setTranslation(string $locale, string $key, string $value, string $group = null): static
    {
        return static::updateOrCreate(
            ['locale' => $locale, 'key' => $key],
            [
                'value' => $value,
                'group' => $group,
            ]
        );
    }

    /**
     * Get all translations for a locale
     */
    public static function getAllForLocale(string $locale): array
    {
        return static::where('locale', $locale)
            ->pluck('value', 'key')
            ->toArray();
    }

    /**
     * Get all translations for a locale grouped by group
     */
    public static function getAllGroupedForLocale(string $locale): array
    {
        $translations = static::where('locale', $locale)->get();
        $grouped = [];

        foreach ($translations as $translation) {
            $group = $translation->group ?: 'default';
            $grouped[$group][$translation->key] = $translation->value;
        }

        return $grouped;
    }

    /**
     * Check if translation exists
     */
    public static function exists(string $locale, string $key): bool
    {
        return static::where('locale', $locale)
            ->where('key', $key)
            ->exists();
    }

    /**
     * Get missing translations for a locale compared to another locale
     */
    public static function getMissingTranslations(string $locale, string $compareLocale = 'en'): array
    {
        $baseKeys = static::where('locale', $compareLocale)->pluck('key')->toArray();
        $localeKeys = static::where('locale', $locale)->pluck('key')->toArray();

        return array_diff($baseKeys, $localeKeys);
    }
}
