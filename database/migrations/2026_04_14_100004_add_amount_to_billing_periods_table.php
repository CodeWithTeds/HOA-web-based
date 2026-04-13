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
        Schema::table('billing_periods', function (Blueprint $table) {
            $table->decimal('amount', 12, 2)->after('due_date')->default(0);
        });
    }
 
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('billing_periods', function (Blueprint $table) {
            $table->dropColumn('amount');
        });
    }
};
