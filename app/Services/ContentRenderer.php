<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ContentRenderer
{
    /**
     * Render content with various processing
     */
    public function render(string $content): string
    {
        // Apply various content transformations
        $content = $this->processShortcodes($content);
        $content = $this->processImages($content);
        $content = $this->processLinks($content);
        $content = $this->processCodeBlocks($content);
        $content = $this->processEmbeds($content);
        $content = $this->addTableOfContents($content);

        return $content;
    }

    /**
     * Process shortcodes in content
     */
    protected function processShortcodes(string $content): string
    {
        // [button url="..." text="..." style="..."]
        $content = preg_replace_callback(
            '/\[button\s+url="([^"]+)"\s+text="([^"]+)"(?:\s+style="([^"]+)")?\]/',
            function ($matches) {
                $url = $matches[1];
                $text = $matches[2];
                $style = $matches[3] ?? 'primary';
                
                $styleClasses = match ($style) {
                    'primary' => 'bg-blue-600 hover:bg-blue-700 text-white',
                    'secondary' => 'bg-gray-600 hover:bg-gray-700 text-white',
                    'success' => 'bg-green-600 hover:bg-green-700 text-white',
                    'danger' => 'bg-red-600 hover:bg-red-700 text-white',
                    default => 'bg-blue-600 hover:bg-blue-700 text-white',
                };

                return sprintf(
                    '<a href="%s" class="inline-block px-6 py-3 rounded-lg font-medium transition-colors %s">%s</a>',
                    htmlspecialchars($url),
                    $styleClasses,
                    htmlspecialchars($text)
                );
            },
            $content
        );

        // [highlight text="..."]
        $content = preg_replace_callback(
            '/\[highlight\s+text="([^"]+)"\]/',
            function ($matches) {
                return sprintf(
                    '<mark class="bg-yellow-200 px-1 rounded">%s</mark>',
                    htmlspecialchars($matches[1])
                );
            },
            $content
        );

        // [quote author="..." source="..."]content[/quote]
        $content = preg_replace_callback(
            '/\[quote(?:\s+author="([^"]+)")?(?:\s+source="([^"]+)")?\](.*?)\[\/quote\]/s',
            function ($matches) {
                $quote = $matches[3];
                $author = $matches[1] ?? null;
                $source = $matches[2] ?? null;

                $html = '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4">';
                $html .= '<p>' . nl2br(htmlspecialchars($quote)) . '</p>';
                
                if ($author || $source) {
                    $html .= '<footer class="text-sm text-gray-500 mt-2">';
                    if ($author) {
                        $html .= '— ' . htmlspecialchars($author);
                    }
                    if ($source) {
                        $html .= $author ? ', ' : '— ';
                        $html .= '<cite>' . htmlspecialchars($source) . '</cite>';
                    }
                    $html .= '</footer>';
                }
                
                $html .= '</blockquote>';
                return $html;
            },
            $content
        );

        // [callout type="..." title="..."]content[/callout]
        $content = preg_replace_callback(
            '/\[callout(?:\s+type="([^"]+)")?(?:\s+title="([^"]+)")?\](.*?)\[\/callout\]/s',
            function ($matches) {
                $type = $matches[1] ?? 'info';
                $title = $matches[2] ?? null;
                $calloutContent = $matches[3];

                $typeClasses = match ($type) {
                    'info' => 'bg-blue-50 border-blue-200 text-blue-800',
                    'warning' => 'bg-yellow-50 border-yellow-200 text-yellow-800',
                    'error' => 'bg-red-50 border-red-200 text-red-800',
                    'success' => 'bg-green-50 border-green-200 text-green-800',
                    default => 'bg-blue-50 border-blue-200 text-blue-800',
                };

                $html = sprintf('<div class="border-l-4 p-4 my-4 %s">', $typeClasses);
                
                if ($title) {
                    $html .= sprintf('<h4 class="font-semibold mb-2">%s</h4>', htmlspecialchars($title));
                }
                
                $html .= '<div>' . nl2br(htmlspecialchars($calloutContent)) . '</div>';
                $html .= '</div>';

                return $html;
            },
            $content
        );

        return $content;
    }

    /**
     * Process images in content
     */
    protected function processImages(string $content): string
    {
        // Add responsive classes and lazy loading to images
        $content = preg_replace_callback(
            '/<img([^>]+)>/i',
            function ($matches) {
                $attributes = $matches[1];
                
                // Add default classes if not present
                if (!preg_match('/class\s*=/', $attributes)) {
                    $attributes .= ' class="max-w-full h-auto rounded-lg shadow-sm"';
                }
                
                // Add lazy loading if not present
                if (!preg_match('/loading\s*=/', $attributes)) {
                    $attributes .= ' loading="lazy"';
                }

                return '<img' . $attributes . '>';
            },
            $content
        );

        // Process figure with caption
        $content = preg_replace_callback(
            '/\[figure\s+src="([^"]+)"(?:\s+alt="([^"]+)")?(?:\s+caption="([^"]+)")?\]/',
            function ($matches) {
                $src = $matches[1];
                $alt = $matches[2] ?? '';
                $caption = $matches[3] ?? null;

                $html = '<figure class="my-6">';
                $html .= sprintf(
                    '<img src="%s" alt="%s" class="w-full h-auto rounded-lg shadow-sm" loading="lazy">',
                    htmlspecialchars($src),
                    htmlspecialchars($alt)
                );
                
                if ($caption) {
                    $html .= sprintf(
                        '<figcaption class="text-sm text-gray-600 text-center mt-2 italic">%s</figcaption>',
                        htmlspecialchars($caption)
                    );
                }
                
                $html .= '</figure>';
                return $html;
            },
            $content
        );

        return $content;
    }

    /**
     * Process links in content
     */
    protected function processLinks(string $content): string
    {
        // Add external link indicators and security attributes
        $content = preg_replace_callback(
            '/<a\s+([^>]*href\s*=\s*["\']([^"\']+)["\'][^>]*)>/i',
            function ($matches) {
                $attributes = $matches[1];
                $url = $matches[2];
                
                // Check if it's an external link
                $isExternal = !str_starts_with($url, '/') && 
                             !str_contains($url, request()->getHost()) &&
                             (str_starts_with($url, 'http://') || str_starts_with($url, 'https://'));
                
                if ($isExternal) {
                    // Add security attributes for external links
                    if (!preg_match('/rel\s*=/', $attributes)) {
                        $attributes .= ' rel="noopener noreferrer"';
                    }
                    
                    if (!preg_match('/target\s*=/', $attributes)) {
                        $attributes .= ' target="_blank"';
                    }
                    
                    // Add external link icon
                    if (!preg_match('/class\s*=/', $attributes)) {
                        $attributes .= ' class="external-link"';
                    }
                }

                return '<a ' . $attributes . '>';
            },
            $content
        );

        return $content;
    }

    /**
     * Process code blocks
     */
    protected function processCodeBlocks(string $content): string
    {
        // Enhanced code block with syntax highlighting classes
        $content = preg_replace_callback(
            '/\[code(?:\s+lang="([^"]+)")?\](.*?)\[\/code\]/s',
            function ($matches) {
                $language = $matches[1] ?? 'text';
                $code = htmlspecialchars($matches[2]);
                
                return sprintf(
                    '<div class="code-block my-4"><pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code class="language-%s">%s</code></pre></div>',
                    $language,
                    $code
                );
            },
            $content
        );

        // Inline code
        $content = preg_replace(
            '/`([^`]+)`/',
            '<code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>',
            $content
        );

        return $content;
    }

    /**
     * Process embeds (YouTube, Twitter, etc.)
     */
    protected function processEmbeds(string $content): string
    {
        // YouTube embed
        $content = preg_replace_callback(
            '/\[youtube\s+id="([^"]+)"(?:\s+width="(\d+)")?(?:\s+height="(\d+)")?\]/',
            function ($matches) {
                $videoId = $matches[1];
                $width = $matches[2] ?? '560';
                $height = $matches[3] ?? '315';
                
                return sprintf(
                    '<div class="video-embed my-6"><iframe width="%s" height="%s" src="https://www.youtube.com/embed/%s" frameborder="0" allowfullscreen class="w-full rounded-lg"></iframe></div>',
                    $width,
                    $height,
                    $videoId
                );
            },
            $content
        );

        // Twitter embed
        $content = preg_replace_callback(
            '/\[twitter\s+url="([^"]+)"\]/',
            function ($matches) {
                $url = $matches[1];
                
                return sprintf(
                    '<div class="twitter-embed my-6"><blockquote class="twitter-tweet"><a href="%s">View Tweet</a></blockquote></div>',
                    htmlspecialchars($url)
                );
            },
            $content
        );

        return $content;
    }

    /**
     * Add table of contents
     */
    protected function addTableOfContents(string $content): string
    {
        // Extract headings
        preg_match_all('/<h([2-6])([^>]*)>([^<]+)<\/h[2-6]>/i', $content, $matches, PREG_SET_ORDER);
        
        if (count($matches) < 3) {
            return $content; // Don't add TOC for short content
        }

        $toc = '<div class="table-of-contents bg-gray-50 p-4 rounded-lg my-6">';
        $toc .= '<h3 class="text-lg font-semibold mb-3">Table of Contents</h3>';
        $toc .= '<ul class="space-y-1">';

        foreach ($matches as $match) {
            $level = (int) $match[1];
            $headingText = strip_tags($match[3]);
            $id = Str::slug($headingText);
            
            // Add ID to the heading in content
            $content = str_replace(
                $match[0],
                sprintf('<h%d%s id="%s">%s</h%d>', $level, $match[2], $id, $match[3], $level),
                $content
            );
            
            // Add to TOC
            $indent = str_repeat('  ', ($level - 2));
            $toc .= sprintf(
                '%s<li><a href="#%s" class="text-blue-600 hover:text-blue-800 text-sm">%s</a></li>',
                $indent,
                $id,
                htmlspecialchars($headingText)
            );
        }

        $toc .= '</ul></div>';

        // Insert TOC after first paragraph or at the beginning
        $firstParagraphPos = strpos($content, '</p>');
        if ($firstParagraphPos !== false) {
            $content = substr_replace($content, '</p>' . $toc, $firstParagraphPos, 4);
        } else {
            $content = $toc . $content;
        }

        return $content;
    }

    /**
     * Strip all shortcodes and return plain text
     */
    public function stripShortcodes(string $content): string
    {
        // Remove all shortcodes
        $content = preg_replace('/\[[^\]]+\]/', '', $content);
        $content = preg_replace('/\[\/[^\]]+\]/', '', $content);
        
        return trim($content);
    }

    /**
     * Get excerpt from rendered content
     */
    public function getExcerpt(string $content, int $length = 150): string
    {
        // Strip shortcodes first
        $content = $this->stripShortcodes($content);
        
        // Strip HTML tags
        $content = strip_tags($content);
        
        // Trim and truncate
        $content = trim($content);
        
        if (strlen($content) <= $length) {
            return $content;
        }
        
        return substr($content, 0, $length) . '...';
    }

    /**
     * Count words in content
     */
    public function countWords(string $content): int
    {
        $content = $this->stripShortcodes($content);
        $content = strip_tags($content);
        
        return str_word_count($content);
    }

    /**
     * Estimate reading time
     */
    public function estimateReadingTime(string $content): int
    {
        $wordCount = $this->countWords($content);
        $wordsPerMinute = 200; // Average reading speed
        
        return max(1, ceil($wordCount / $wordsPerMinute));
    }
}
