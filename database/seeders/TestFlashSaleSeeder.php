<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\FlashSale;
use App\Models\Product;
use Carbon\Carbon;

class TestFlashSaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get products first to populate product_ids
        $products = Product::take(8)->get();
        $productIds1 = $products->take(4)->pluck('id')->toArray();
        $productIds2 = $products->skip(4)->take(4)->pluck('id')->toArray();

        // Create first flash sale
        $flashSale1 = FlashSale::create([
            'name' => 'Divine Diwali Collection',
            'description' => 'Special discounts on sacred Diwali items - lamps, rangoli, and more! Light up your celebrations with authentic spiritual products.',
            'discount_percentage' => 25.00,
            'start_date' => Carbon::now()->subHour(),
            'end_date' => Carbon::now()->addDays(2),
            'status' => 'active',
            'is_featured' => true,
            'product_ids' => $productIds1,
            'max_usage' => null,
            'used_count' => 0
        ]);

        // Create second flash sale
        $flashSale2 = FlashSale::create([
            'name' => 'Sacred Scriptures Sale',
            'description' => 'Get blessed with divine knowledge. Premium scriptures and spiritual books at amazing prices.',
            'discount_percentage' => 30.00,
            'start_date' => Carbon::now()->subMinutes(30),
            'end_date' => Carbon::now()->addDays(1)->addHours(12),
            'status' => 'active',
            'is_featured' => false,
            'product_ids' => $productIds2,
            'max_usage' => null,
            'used_count' => 0
        ]);

        // Flash sales created successfully with product_ids arrays

        $this->command->info('Created 2 test flash sales with products');
    }
}
