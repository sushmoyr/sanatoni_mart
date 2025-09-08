<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('newsletter_sends', function (Blueprint $table) {
            $table->id();
            $table->foreignId('newsletter_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscriber_id')->constrained('newsletter_subscribers')->onDelete('cascade');
            $table->timestamp('sent_at');
            $table->timestamp('opened_at')->nullable(); // when email was opened
            $table->timestamp('clicked_at')->nullable(); // when links were clicked
            $table->integer('click_count')->default(0); // number of clicks
            $table->json('clicked_links')->nullable(); // which links were clicked
            $table->enum('status', ['sent', 'delivered', 'bounced', 'failed'])->default('sent');
            $table->text('bounce_reason')->nullable(); // reason for bounce
            $table->string('message_id')->nullable(); // email service message ID
            $table->timestamps();

            $table->index(['newsletter_id', 'subscriber_id']);
            $table->index(['newsletter_id', 'status']);
            $table->index('sent_at');
            $table->index('opened_at');
            $table->index('clicked_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('newsletter_sends');
    }
};
