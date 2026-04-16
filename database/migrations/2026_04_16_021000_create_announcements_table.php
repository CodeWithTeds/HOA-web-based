<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\AnnouncementStatus;
use App\Enums\AnnouncementPriority;
use App\Enums\AnnouncementCategory;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->string('category')->default(AnnouncementCategory::GENERAL->value);
            $table->string('priority')->default(AnnouncementPriority::NORMAL->value);
            $table->string('status')->default(AnnouncementStatus::DRAFT->value);
            $table->timestamp('published_at')->nullable();
            $table->string('image_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
