<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class SeoSetting extends Model
{
    protected $fillable = [
        'model_type',
        'model_id',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'og_title',
        'og_description',
        'og_image',
        'og_type',
        'twitter_card',
        'twitter_title',
        'twitter_description',
        'twitter_image',
        'canonical_url',
        'structured_data',
    ];

    protected $casts = [
        'structured_data' => 'array',
    ];

    /**
     * Get the owning model
     */
    public function model(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the effective meta title
     */
    public function getEffectiveMetaTitleAttribute(): ?string
    {
        if ($this->meta_title) {
            return $this->meta_title;
        }

        // Try to get from the model
        if ($this->model && method_exists($this->model, 'getEffectiveMetaTitleAttribute')) {
            return $this->model->effective_meta_title;
        }

        if ($this->model && isset($this->model->title)) {
            return $this->model->title;
        }

        return null;
    }

    /**
     * Get the effective meta description
     */
    public function getEffectiveMetaDescriptionAttribute(): ?string
    {
        if ($this->meta_description) {
            return $this->meta_description;
        }

        // Try to get from the model
        if ($this->model && method_exists($this->model, 'getEffectiveMetaDescriptionAttribute')) {
            return $this->model->effective_meta_description;
        }

        return null;
    }

    /**
     * Get the effective Open Graph title
     */
    public function getEffectiveOgTitleAttribute(): ?string
    {
        return $this->og_title ?: $this->effective_meta_title;
    }

    /**
     * Get the effective Open Graph description
     */
    public function getEffectiveOgDescriptionAttribute(): ?string
    {
        return $this->og_description ?: $this->effective_meta_description;
    }

    /**
     * Get the effective Twitter title
     */
    public function getEffectiveTwitterTitleAttribute(): ?string
    {
        return $this->twitter_title ?: $this->effective_og_title;
    }

    /**
     * Get the effective Twitter description
     */
    public function getEffectiveTwitterDescriptionAttribute(): ?string
    {
        return $this->twitter_description ?: $this->effective_og_description;
    }

    /**
     * Generate structured data for the model
     */
    public function generateStructuredData(): array
    {
        $data = $this->structured_data ?: [];

        // Add basic Organization schema if not present
        if (!isset($data['@type'])) {
            $data = array_merge([
                '@context' => 'https://schema.org/',
                '@type' => $this->getSchemaType(),
                'name' => $this->effective_meta_title,
                'description' => $this->effective_meta_description,
            ], $data);
        }

        return $data;
    }

    /**
     * Get the appropriate schema type based on the model
     */
    private function getSchemaType(): string
    {
        switch ($this->model_type) {
            case 'App\Models\Product':
                return 'Product';
            case 'App\Models\BlogPost':
                return 'Article';
            case 'App\Models\Page':
                return 'WebPage';
            default:
                return 'Thing';
        }
    }

    /**
     * Create or update SEO settings for a model
     */
    public static function updateOrCreateForModel(Model $model, array $data): self
    {
        return self::updateOrCreate(
            [
                'model_type' => get_class($model),
                'model_id' => $model->id,
            ],
            $data
        );
    }
}
