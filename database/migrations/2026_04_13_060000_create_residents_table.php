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
        Schema::create('residents', function (Blueprint $table) {
            $table->id();
            
            // Personal Information
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();
            $table->string('gender')->nullable(); // From Gender Enum
            $table->date('birth_date')->nullable();
            $table->integer('age')->nullable();
            $table->string('civil_status')->nullable(); // From CivilStatus Enum
            $table->string('nationality')->nullable();

            // Contact Information
            $table->string('mobile_number')->nullable();
            $table->string('alternate_number')->nullable();
            $table->string('email')->unique()->nullable();

            // Residency Details (Simplified for now)
            $table->string('phase')->nullable();
            $table->string('block')->nullable();
            $table->string('lot')->nullable();
            $table->string('street')->nullable();
            $table->string('unit')->nullable();
            
            $table->string('resident_type'); // From ResidentType Enum
            $table->boolean('is_head_of_household')->default(false);
            $table->date('move_in_date')->nullable();
            $table->date('move_out_date')->nullable();

            // Emergency Contact
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_number')->nullable();

            // Status & Notes
            $table->string('status')->default('Active'); // From ResidentStatus Enum
            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('residents');
    }
};
