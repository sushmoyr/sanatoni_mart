<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Builder;

class LocalizableContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'localizable_type',
        'localizable_id',
        'locale',
        'field',
        'value',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the parent localizable model
     */
    public function localizable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Scope to filter by locale
     */
    public function scopeForLocale(Builder $query, string $locale): Builder
    {
        return $query->where('locale', $locale);
    }

    /**
     * Scope to filter by field
     */
    public function scopeForField(Builder $query, string $field): Builder
    {
        return $query->where('field', $field);
    }

    /**
     * Scope to filter by model type
     */
    public function scopeForType(Builder $query, string $type): Builder
    {
        return $query->where('localizable_type', $type);
    }

    /**
     * Get localized content for a model
     */
    public static function getLocalizedContent($model, string $field, string $locale): ?string
    {
        $content = static::where('localizable_type', get_class($model))
            ->where('localizable_id', $model->id)
            ->where('field', $field)
            ->where('locale', $locale)
            ->first();

        return $content ? $content->value : null;
    }

    /**
     * Set localized content for a model
     */
    public static function setLocalizedContent($model, string $field, string $locale, string $value): static
    {
        return static::updateOrCreate(
            [
                'localizable_type' => get_class($model),
                'localizable_id' => $model->id,
                'field' => $field,
                'locale' => $locale,
            ],
            ['value' => $value]
        );
    }

    /**
     * Get all localized content for a model and locale
     */
    public static function getAllForModel($model, string $locale): array
    {
        return static::where('localizable_type', get_class($model))
            ->where('localizable_id', $model->id)
            ->where('locale', $locale)
            ->pluck('value', 'field')
            ->toArray();
    }

    /**
     * Get available locales for a model
     */
    public static function getAvailableLocales($model): array
    {
        return static::where('localizable_type', get_class($model))
            ->where('localizable_id', $model->id)
            ->distinct()
            ->pluck('locale')
            ->toArray();
    }

    /**
     * Check if localized content exists
     */
    public static function exists($model, string $field, string $locale): bool
    {
        return static::where('localizable_type', get_class($model))
            ->where('localizable_id', $model->id)
            ->where('field', $field)
            ->where('locale', $locale)
            ->exists();
    }

    /**
     * Delete all localized content for a model
     */
    public static function deleteForModel($model): bool
    {
        return static::where('localizable_type', get_class($model))
            ->where('localizable_id', $model->id)
            ->delete();
    }
}
