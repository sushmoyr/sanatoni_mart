<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ProductReview;

class ApproveAllReviews extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reviews:approve-all';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Approve all pending product reviews';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $pendingReviews = ProductReview::where('status', 'pending')->get();
        
        $this->info("Found {$pendingReviews->count()} pending reviews");
        
        foreach ($pendingReviews as $review) {
            $review->approve();
            $this->line("Approved review ID {$review->id} for product '{$review->product->name}'");
        }
        
        $this->info("All reviews have been approved!");
        
        return Command::SUCCESS;
    }
}
