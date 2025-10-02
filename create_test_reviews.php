<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Product;
use App\Models\User;
use App\Models\ProductReview;

// Clear existing reviews first
ProductReview::truncate();

// Get first product and user
$product = Product::first();
$user = User::first();

if (!$product || !$user) {
    echo "No products or users found. Please seed the database first.\n";
    exit(1);
}

// Get all products to spread reviews across different products
$products = Product::limit(5)->get();
$users = User::limit(3)->get();

// Create test reviews across different products and users
$reviews = [];
$reviewData = [
    [
        'rating' => 5,
        'title' => 'Excellent Product!',
        'comment' => 'This product exceeded my expectations. Great quality and fast shipping.',
        'is_verified_purchase' => true,
        'status' => 'approved',
        'helpful_count' => 15,
        'not_helpful_count' => 2
    ],
    [
        'rating' => 3,
        'title' => 'Average Quality',
        'comment' => 'The product is okay but could be better. Packaging was good.',
        'is_verified_purchase' => true,
        'status' => 'pending',
        'helpful_count' => 5,
        'not_helpful_count' => 1
    ],
    [
        'rating' => 1,
        'title' => 'Poor Quality',
        'comment' => 'This product broke after one day. Very disappointed.',
        'is_verified_purchase' => false,
        'status' => 'pending',
        'helpful_count' => 2,
        'not_helpful_count' => 8
    ],
    [
        'rating' => 4,
        'title' => 'Good value for money',
        'comment' => 'Nice product overall. Some minor issues but nothing major.',
        'is_verified_purchase' => true,
        'status' => 'approved',
        'helpful_count' => 10,
        'not_helpful_count' => 0
    ],
    [
        'rating' => 2,
        'title' => 'Not as described',
        'comment' => 'The product description was misleading. Color was different.',
        'is_verified_purchase' => true,
        'status' => 'rejected',
        'helpful_count' => 3,
        'not_helpful_count' => 12
    ]
];

// Create reviews for different product/user combinations
foreach ($reviewData as $index => $data) {
    $productIndex = $index % $products->count();
    $userIndex = $index % $users->count();
    
    $reviews[] = array_merge($data, [
        'product_id' => $products[$productIndex]->id,
        'user_id' => $users[$userIndex]->id
    ]);
}

foreach ($reviews as $reviewData) {
    ProductReview::create($reviewData);
}

echo "Created " . count($reviews) . " test reviews successfully!\n";
echo "Product: {$product->name}\n";
echo "User: {$user->name}\n";