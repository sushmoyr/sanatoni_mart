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
        Schema::create('sliders', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->text('description')->nullable();
            $table->string('image_path');
            $table->string('button_text')->nullable();
            $table->string('button_link')->nullable();
            $table->enum('button_style', ['primary', 'secondary', 'outline'])->default('primary');
            $table->string('text_color')->default('#ffffff'); // hex color for text
            $table->string('overlay_color')->default('#000000'); // hex color for overlay
            $table->integer('overlay_opacity')->default(50); // 0-100 percentage
            $table->enum('text_position', ['left', 'center', 'right'])->default('left');
            $table->enum('text_alignment', ['left', 'center', 'right'])->default('left');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->datetime('start_date')->nullable();
            $table->datetime('end_date')->nullable();
            $table->timestamps();

            $table->index(['is_active', 'sort_order']);
            $table->index(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sliders');
    }
};
