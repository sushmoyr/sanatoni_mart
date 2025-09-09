<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Page;

class PageController extends Controller
{
    public function show(Page $page)
    {
        // Check if page is published (unless it's a preview)
        if ($page->status !== 'published' && !request()->has('preview')) {
            abort(404);
        }

        return Inertia::render('Page/Show', [
            'page' => [
                'id' => $page->id,
                'title' => $page->title,
                'content' => $page->content,
                'excerpt' => $page->excerpt,
                'template' => $page->template,
                'sections' => $page->sections ?? [],
                'seo_title' => $page->seo_title,
                'seo_description' => $page->seo_description,
                'seo_keywords' => $page->seo_keywords,
                'social_image' => $page->social_image,
                'og_title' => $page->og_title,
                'og_description' => $page->og_description,
                'twitter_title' => $page->twitter_title,
                'twitter_description' => $page->twitter_description,
                'published_at' => $page->published_at,
                'updated_at' => $page->updated_at,
            ]
        ]);
    }

    public function preview(Page $page)
    {
        // Allow preview for any status when explicitly requested
        return $this->show($page);
    }
}
