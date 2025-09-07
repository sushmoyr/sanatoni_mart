<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some categories to assign products to
        $krishnaCategory = Category::where('name', 'Krishna')->first();
        $ganeshaCategory = Category::where('name', 'Ganesha')->first();
        $rudrakshaCategory = Category::where('name', 'Rudraksha Malas')->first();
        $tulsiCategory = Category::where('name', 'Tulsi Malas')->first();
        $gitaCategory = Category::where('name', 'Bhagavad Gita')->first();
        $incenseCategory = Category::where('name', 'Incense Sticks')->first();

        $products = [
            // Krishna Products
            [
                'name' => 'Krishna Wooden Portrait - Large',
                'short_description' => 'Beautiful handcrafted wooden portrait of Lord Krishna',
                'description' => 'This exquisite wooden portrait of Lord Krishna is handcrafted by skilled artisans. The intricate details and vibrant colors make it perfect for home decoration and worship. Made from high-quality wood with natural finish.',
                'price' => 2499.00,
                'sale_price' => 1999.00,
                'category_id' => $krishnaCategory?->id,
                'stock_quantity' => 25,
                'featured' => true,
                'specifications' => [
                    'Material' => 'Teak Wood',
                    'Size' => '12" x 16"',
                    'Finish' => 'Natural Wood Finish',
                    'Weight' => '500g'
                ],
                'weight' => 0.5,
                'meta_title' => 'Krishna Wooden Portrait - Handcrafted Religious Art',
                'meta_description' => 'Buy beautiful handcrafted Krishna wooden portrait online. Perfect for home decoration and worship. High-quality teak wood with natural finish.',
            ],
            [
                'name' => 'Krishna Canvas Painting - Premium',
                'short_description' => 'High-quality canvas painting of Lord Krishna playing flute',
                'description' => 'Premium quality canvas painting featuring Lord Krishna in his divine form playing the flute. Printed with fade-resistant inks and ready to hang. Perfect for living rooms, prayer rooms, and meditation spaces.',
                'price' => 1299.00,
                'category_id' => $krishnaCategory?->id,
                'stock_quantity' => 50,
                'specifications' => [
                    'Material' => 'Canvas',
                    'Size' => '8" x 12"',
                    'Print Quality' => 'HD Digital Print',
                    'Frame' => 'Not Included'
                ],
                'weight' => 0.2,
            ],

            // Ganesha Products
            [
                'name' => 'Brass Ganesha Statue - Medium',
                'short_description' => 'Traditional brass statue of Lord Ganesha',
                'description' => 'Beautiful brass statue of Lord Ganesha, handcrafted with intricate details. This traditional piece is perfect for home temples, office desks, and as a gift for religious occasions. The statue brings prosperity and removes obstacles.',
                'price' => 1899.00,
                'sale_price' => 1599.00,
                'category_id' => $ganeshaCategory?->id,
                'stock_quantity' => 30,
                'featured' => true,
                'specifications' => [
                    'Material' => 'Pure Brass',
                    'Height' => '6 inches',
                    'Weight' => '800g',
                    'Finish' => 'Antique Brass'
                ],
                'weight' => 0.8,
            ],

            // Rudraksha Malas
            [
                'name' => '108 Bead Rudraksha Mala - Original',
                'short_description' => 'Authentic 108 bead Rudraksha mala for meditation',
                'description' => 'Original 108 bead Rudraksha mala sourced from Nepal. Each bead is carefully selected for quality and authenticity. Perfect for meditation, chanting, and spiritual practices. Comes with authenticity certificate.',
                'price' => 999.00,
                'category_id' => $rudrakshaCategory?->id,
                'stock_quantity' => 75,
                'featured' => true,
                'specifications' => [
                    'Beads' => '108 + 1 Guru Bead',
                    'Size' => '5-6mm',
                    'Origin' => 'Nepal',
                    'Thread' => 'Red Cotton Thread'
                ],
                'weight' => 0.1,
                'manage_stock' => false, // Unlimited stock like flowers
            ],

            // Tulsi Malas
            [
                'name' => 'Tulsi Mala - Sacred Basil Wood',
                'short_description' => 'Sacred Tulsi wood mala for Krishna devotees',
                'description' => 'Sacred Tulsi wood mala specially recommended for Krishna devotees. Made from pure Tulsi wood, this mala is ideal for chanting the Hare Krishna mantra. Each bead is smooth and perfectly rounded for comfortable use.',
                'price' => 599.00,
                'category_id' => $tulsiCategory?->id,
                'stock_quantity' => 100,
                'specifications' => [
                    'Material' => 'Tulsi Wood',
                    'Beads' => '108',
                    'Size' => '4-5mm',
                    'Color' => 'Natural Brown'
                ],
                'weight' => 0.05,
            ],

            // Bhagavad Gita
            [
                'name' => 'Bhagavad Gita As It Is - English',
                'short_description' => 'Complete English translation of Bhagavad Gita',
                'description' => 'The complete Bhagavad Gita As It Is with English translation and commentary. This sacred text contains the divine conversation between Prince Arjuna and Lord Krishna. Perfect for daily reading and spiritual growth.',
                'price' => 399.00,
                'category_id' => $gitaCategory?->id,
                'stock_quantity' => 200,
                'specifications' => [
                    'Language' => 'English',
                    'Pages' => '850+',
                    'Binding' => 'Hardcover',
                    'Publisher' => 'Bhaktivedanta Book Trust'
                ],
                'weight' => 0.6,
            ],

            // Incense Sticks
            [
                'name' => 'Sandalwood Incense Sticks - Premium',
                'short_description' => 'Pure sandalwood incense sticks for worship',
                'description' => 'Premium quality sandalwood incense sticks made from pure sandalwood powder. Creates a divine atmosphere perfect for worship, meditation, and relaxation. Each stick burns for approximately 45 minutes.',
                'price' => 199.00,
                'category_id' => $incenseCategory?->id,
                'stock_quantity' => 500,
                'specifications' => [
                    'Fragrance' => 'Pure Sandalwood',
                    'Quantity' => '20 Sticks',
                    'Burn Time' => '45 minutes per stick',
                    'Length' => '9 inches'
                ],
                'weight' => 0.1,
                'manage_stock' => false, // Unlimited stock
            ],
        ];

        foreach ($products as $productData) {
            if ($productData['category_id']) { // Only create if category exists
                Product::create($productData);
            }
        }
    }
}
