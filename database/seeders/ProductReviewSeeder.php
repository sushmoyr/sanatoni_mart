<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\ReviewHelpfulVote;

class ProductReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some products and users
        $products = Product::take(8)->get();
        $users = User::take(15)->get();

        if ($products->isEmpty() || $users->isEmpty()) {
            $this->command->warn('Need at least some products and users to create reviews');
            return;
        }

        $reviewData = [
            // Reviews for Bhagavad Gita
            [
                'rating' => 5,
                'title' => 'Life-changing spiritual guide',
                'comment' => 'This authentic Bhagavad Gita has transformed my understanding of life and spirituality. The English translation is clear and profound. Highly recommended for anyone seeking spiritual wisdom.',
                'status' => 'approved'
            ],
            [
                'rating' => 4,
                'title' => 'Beautiful edition, great quality',
                'comment' => 'The book quality is excellent with clear printing. The spiritual teachings are profound and well-translated. A must-have for every devotee.',
                'status' => 'approved'
            ],
            [
                'rating' => 5,
                'title' => 'Authentic and blessed',
                'comment' => 'Received this with beautiful packaging. You can feel the sanctity in every page. Perfect for daily meditation and study.',
                'status' => 'approved'
            ],
            
            // Reviews for Sandalwood Incense
            [
                'rating' => 4,
                'title' => 'Pure sandalwood fragrance',
                'comment' => 'These incense sticks have an authentic sandalwood scent that creates a peaceful atmosphere during prayers. Burns evenly and lasts long.',
                'status' => 'approved'
            ],
            [
                'rating' => 5,
                'title' => 'Premium quality incense',
                'comment' => 'Amazing quality! The fragrance is divine and creates the perfect ambiance for meditation. Will definitely order again.',
                'status' => 'approved'
            ],
            
            // Reviews for Tulsi Mala
            [
                'rating' => 5,
                'title' => 'Sacred and authentic tulsi',
                'comment' => 'This tulsi mala is beautifully crafted with genuine sacred basil wood. Perfect for japa meditation. The beads are smooth and well-polished.',
                'status' => 'approved'
            ],
            [
                'rating' => 4,
                'title' => 'Good quality mala',
                'comment' => 'The mala arrived well-packaged and blessed. Good quality tulsi beads, though slightly smaller than expected. Still very satisfied.',
                'status' => 'approved'
            ],
            [
                'rating' => 3,
                'title' => 'Average quality',
                'comment' => 'The mala is okay but some beads seem uneven. Would prefer better quality control.',
                'status' => 'pending'
            ]
        ];

        $reviewIndex = 0;
        $usedUserProductPairs = [];
        
        foreach ($products as $product) {
            // Give each product 2-4 reviews
            $numReviews = rand(2, 4);
            
            for ($i = 0; $i < $numReviews && $reviewIndex < count($reviewData); $i++) {
                // Find a user that hasn't reviewed this product yet
                $availableUsers = $users->filter(function ($user) use ($product, $usedUserProductPairs) {
                    return !in_array($user->id . '-' . $product->id, $usedUserProductPairs);
                });
                
                if ($availableUsers->isEmpty()) {
                    break; // No more available users for this product
                }
                
                $user = $availableUsers->random();
                $usedUserProductPairs[] = $user->id . '-' . $product->id;
                
                $review = $reviewData[$reviewIndex];
                
                // Create review
                $productReview = ProductReview::create([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'rating' => $review['rating'],
                    'title' => $review['title'],
                    'comment' => $review['comment'],
                    'status' => $review['status'],
                    'verified_purchase_data' => rand(0, 1) ? [
                        'order_id' => rand(1, 100),
                        'order_date' => now()->subDays(rand(7, 60))->toDateString()
                    ] : null,
                    'created_at' => now()->subDays(rand(1, 30)),
                ]);

                // Add approval data for approved reviews
                if ($review['status'] === 'approved') {
                    $productReview->update([
                        'approved_at' => $productReview->created_at->addHours(rand(1, 24)),
                        'approved_by' => $users->first()->id, // Assume first user is admin
                    ]);
                }

                // Add some helpful votes
                if ($review['status'] === 'approved' && rand(0, 1)) {
                    $availableVoters = $users->where('id', '!=', $user->id);
                    $numVotes = rand(1, min(3, $availableVoters->count()));
                    $voterUsers = $availableVoters->random($numVotes);
                    
                    foreach ($voterUsers as $voter) {
                        ReviewHelpfulVote::create([
                            'user_id' => $voter->id,
                            'product_review_id' => $productReview->id,
                            'is_helpful' => rand(0, 1) ? true : false,
                        ]);
                    }
                    
                    // Update helpful votes count
                    $productReview->updateHelpfulVotesCount();
                }

                $reviewIndex++;
            }
        }

        $this->command->info('Created ' . ProductReview::count() . ' product reviews with helpful votes');
    }
}
