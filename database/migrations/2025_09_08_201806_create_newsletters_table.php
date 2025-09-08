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
        Schema::create('newsletters', function (Blueprint $table) {
            $table->id();
            $table->string('subject');
            $table->text('content'); // HTML content
            $table->text('text_content')->nullable(); // Plain text version
            $table->string('template')->default('default'); // email template to use
            $table->json('recipient_criteria')->nullable(); // criteria for selecting recipients
            $table->integer('recipient_count')->default(0); // total recipients
            $table->timestamp('scheduled_at')->nullable(); // when to send (null = send now)
            $table->timestamp('sent_at')->nullable(); // when it was actually sent
            $table->enum('status', ['draft', 'scheduled', 'sending', 'sent', 'failed'])->default('draft');
            $table->integer('sent_count')->default(0); // successfully sent
            $table->integer('failed_count')->default(0); // failed sends
            $table->integer('opened_count')->default(0); // email opens
            $table->integer('clicked_count')->default(0); // link clicks
            $table->text('failure_reason')->nullable(); // reason for failure
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index(['status', 'scheduled_at']);
            $table->index('sent_at');
            $table->index('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('newsletters');
    }
};
