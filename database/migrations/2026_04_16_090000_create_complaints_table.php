<?php

use App\Enums\ComplaintCategory;
use App\Enums\ComplaintPriority;
use App\Enums\ComplaintStatus;
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
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->string('subject');
            $table->text('description');
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->string('category')->default(ComplaintCategory::MAINTENANCE->value);
            $table->string('priority')->default(ComplaintPriority::LOW->value);
            $table->string('status')->default(ComplaintStatus::PENDING->value);
            $table->string('attachment_path')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
