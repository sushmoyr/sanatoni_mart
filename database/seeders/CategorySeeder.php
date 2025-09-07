<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Deity Portraits',
                'description' => 'Beautiful portraits and images of Hindu deities',
                'icon' => '🖼️',
                'sort_order' => 1,
                'children' => [
                    ['name' => 'Krishna', 'description' => 'Lord Krishna portraits and images', 'icon' => '🌟'],
                    ['name' => 'Ganesha', 'description' => 'Lord Ganesha portraits and images', 'icon' => '🐘'],
                    ['name' => 'Shiva', 'description' => 'Lord Shiva portraits and images', 'icon' => '🔱'],
                    ['name' => 'Lakshmi', 'description' => 'Goddess Lakshmi portraits and images', 'icon' => '💰'],
                    ['name' => 'Durga', 'description' => 'Goddess Durga portraits and images', 'icon' => '⚔️'],
                ]
            ],
            [
                'name' => 'Prayer Beads',
                'description' => 'Sacred malas and prayer beads for meditation and worship',
                'icon' => '📿',
                'sort_order' => 2,
                'children' => [
                    ['name' => 'Rudraksha Malas', 'description' => 'Traditional Rudraksha seed malas', 'icon' => '🌰'],
                    ['name' => 'Tulsi Malas', 'description' => 'Sacred Tulsi wood malas', 'icon' => '🌿'],
                    ['name' => 'Crystal Malas', 'description' => 'Gemstone and crystal malas', 'icon' => '💎'],
                    ['name' => 'Sandalwood Malas', 'description' => 'Aromatic sandalwood malas', 'icon' => '🪵'],
                ]
            ],
            [
                'name' => 'Holy Scriptures',
                'description' => 'Sacred texts and religious books',
                'icon' => '📚',
                'sort_order' => 3,
                'children' => [
                    ['name' => 'Bhagavad Gita', 'description' => 'The sacred Bhagavad Gita texts', 'icon' => '📖'],
                    ['name' => 'Ramayana', 'description' => 'The epic Ramayana texts', 'icon' => '📜'],
                    ['name' => 'Mahabharata', 'description' => 'The great epic Mahabharata', 'icon' => '📋'],
                    ['name' => 'Puranas', 'description' => 'Various Puranic texts', 'icon' => '📄'],
                ]
            ],
            [
                'name' => 'Puja Items',
                'description' => 'Essential items for worship and rituals',
                'icon' => '🕯️',
                'sort_order' => 4,
                'children' => [
                    ['name' => 'Incense Sticks', 'description' => 'Aromatic incense for worship', 'icon' => '🔥'],
                    ['name' => 'Diyas & Lamps', 'description' => 'Traditional oil lamps and diyas', 'icon' => '🪔'],
                    ['name' => 'Flowers & Garlands', 'description' => 'Fresh and artificial flowers for offering', 'icon' => '🌸'],
                    ['name' => 'Brass Items', 'description' => 'Traditional brass puja items', 'icon' => '🥉'],
                ]
            ],
            [
                'name' => 'Spiritual Jewelry',
                'description' => 'Sacred jewelry and accessories',
                'icon' => '💍',
                'sort_order' => 5,
                'children' => [
                    ['name' => 'Pendants', 'description' => 'Religious pendants and lockets', 'icon' => '🔮'],
                    ['name' => 'Rings', 'description' => 'Sacred rings with religious symbols', 'icon' => '💍'],
                    ['name' => 'Bracelets', 'description' => 'Spiritual bracelets and bangles', 'icon' => '📿'],
                ]
            ],
        ];

        foreach ($categories as $categoryData) {
            $children = $categoryData['children'] ?? [];
            unset($categoryData['children']);

            $category = Category::create($categoryData);

            foreach ($children as $index => $childData) {
                Category::create([
                    ...$childData,
                    'parent_id' => $category->id,
                    'sort_order' => $index + 1,
                ]);
            }
        }
    }
}
