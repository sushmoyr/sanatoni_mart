<?php

namespace App\Traits;

use App\Models\LocalizableContent;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasLocalizedContent
{
    /**
     * Get all localized content for this model
     */
    public function localizedContent(): MorphMany
    {
        return $this->morphMany(LocalizableContent::class, 'localizable');
    }

    /**
     * Get localized value for a field
     */
    public function getLocalized(string $field, string $locale = null): ?string
    {
        $locale = $locale ?: app()->getLocale();
        
        // Try to get from localized content first
        $localized = LocalizableContent::getLocalizedContent($this, $field, $locale);
        
        if ($localized) {
            return $localized;
        }
        
        // Fallback to original field value if exists
        if ($this->hasAttribute($field)) {
            return $this->getAttribute($field);
        }
        
        // Fallback to default locale if current locale failed
        if ($locale !== config('app.locale')) {
            return LocalizableContent::getLocalizedContent($this, $field, config('app.locale'));
        }
        
        return null;
    }

    /**
     * Set localized value for a field
     */
    public function setLocalized(string $field, string $value, string $locale = null): LocalizableContent
    {
        $locale = $locale ?: app()->getLocale();
        
        return LocalizableContent::setLocalizedContent($this, $field, $locale, $value);
    }

    /**
     * Get all localized content for a specific locale
     */
    public function getAllLocalized(string $locale = null): array
    {
        $locale = $locale ?: app()->getLocale();
        
        return LocalizableContent::getAllForModel($this, $locale);
    }

    /**
     * Get available locales for this model
     */
    public function getAvailableLocales(): array
    {
        return LocalizableContent::getAvailableLocales($this);
    }

    /**
     * Check if localized content exists for a field and locale
     */
    public function hasLocalized(string $field, string $locale = null): bool
    {
        $locale = $locale ?: app()->getLocale();
        
        return LocalizableContent::exists($this, $field, $locale);
    }

    /**
     * Delete all localized content when model is deleted
     */
    protected static function bootHasLocalizedContent(): void
    {
        static::deleting(function ($model) {
            LocalizableContent::deleteForModel($model);
        });
    }

    /**
     * Get localized attribute dynamically
     * Usage: $model->name_localized or $model->description_localized
     */
    public function getAttribute($key)
    {
        if (str_ends_with($key, '_localized')) {
            $field = str_replace('_localized', '', $key);
            return $this->getLocalized($field);
        }

        return parent::getAttribute($key);
    }
}
