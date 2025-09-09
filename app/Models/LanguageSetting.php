<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class LanguageSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'locale',
        'is_default',
        'timezone',
        'date_format',
        'currency',
        'rtl',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'rtl' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the language setting
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to filter by user
     */
    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to filter by locale
     */
    public function scopeForLocale(Builder $query, string $locale): Builder
    {
        return $query->where('locale', $locale);
    }

    /**
     * Scope to get default settings
     */
    public function scopeDefault(Builder $query): Builder
    {
        return $query->where('is_default', true);
    }

    /**
     * Scope to get RTL languages
     */
    public function scopeRtl(Builder $query): Builder
    {
        return $query->where('rtl', true);
    }

    /**
     * Get user's language setting or create default
     */
    public static function getForUser(int $userId, string $locale = null): static
    {
        $locale = $locale ?: config('app.locale');

        return static::firstOrCreate(
            ['user_id' => $userId, 'locale' => $locale],
            [
                'is_default' => true,
                'timezone' => config('app.timezone'),
                'date_format' => config('locale.date_format'),
                'currency' => config('locale.currency'),
                'rtl' => in_array($locale, config('locale.rtl_languages', [])),
            ]
        );
    }

    /**
     * Set as default language for user
     */
    public function setAsDefault(): bool
    {
        // Remove default flag from other settings
        static::where('user_id', $this->user_id)
            ->where('id', '!=', $this->id)
            ->update(['is_default' => false]);

        // Set this as default
        return $this->update(['is_default' => true]);
    }

    /**
     * Get default language setting for user
     */
    public static function getDefaultForUser(int $userId): ?static
    {
        return static::where('user_id', $userId)
            ->where('is_default', true)
            ->first();
    }

    /**
     * Get all language settings for user
     */
    public static function getAllForUser(int $userId): array
    {
        return static::where('user_id', $userId)
            ->orderBy('is_default', 'desc')
            ->orderBy('locale')
            ->get()
            ->toArray();
    }

    /**
     * Check if locale is RTL
     */
    public function isRtl(): bool
    {
        return $this->rtl;
    }

    /**
     * Get formatted date format for frontend
     */
    public function getFormattedDateFormat(): string
    {
        return $this->date_format ?: config('locale.date_format');
    }

    /**
     * Get currency symbol
     */
    public function getCurrencySymbol(): string
    {
        $currencies = config('locale.currencies', []);
        return $currencies[$this->currency]['symbol'] ?? '$';
    }

    /**
     * Get language name
     */
    public function getLanguageName(): string
    {
        $languages = config('locale.languages', []);
        return $languages[$this->locale]['name'] ?? $this->locale;
    }
}
