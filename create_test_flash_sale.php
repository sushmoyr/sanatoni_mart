<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->boot();

// Create test flash sale
$flashSale = new \App\Models\FlashSale([
    'name' => 'Divine Diwali Collection',
    'description' => 'Special discounts on sacred Diwali items - lamps, rangoli, and more!',
    'discount_percentage' => 25.00,
    'start_date' => now()->subHour(),
    'end_date' => now()->addDays(2),
    'is_active' => true,
    'featured_image' => null
]);
$flashSale->save();

// Add some products to this flash sale
$products = \App\Models\Product::take(5)->get();
foreach($products as $product) {
    $flashSale->products()->attach($product->id);
}

echo "Flash sale created with ID: " . $flashSale->id . "\n";
echo "Added " . $products->count() . " products to flash sale\n";
