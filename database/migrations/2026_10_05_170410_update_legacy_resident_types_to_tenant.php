<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('residents')
            ->whereIn('resident_type', ['Family Member', 'Helper'])
            ->update(['resident_type' => 'Tenant']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No down migration as we don't know who was a Family Member vs Tenant
    }
};
