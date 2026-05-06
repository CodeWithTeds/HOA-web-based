<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        if ($this->residentForeignReferences('residents')) {
            return;
        }

        Schema::table('complaints', function (Blueprint $table): void {
            $table->dropForeign(['resident_id']);
        });

        Schema::table('complaints', function (Blueprint $table): void {
            $table->foreign('resident_id')
                ->references('id')
                ->on('residents')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        if ($this->residentForeignReferences('users')) {
            return;
        }

        Schema::table('complaints', function (Blueprint $table): void {
            $table->dropForeign(['resident_id']);
        });

        Schema::table('complaints', function (Blueprint $table): void {
            $table->foreign('resident_id')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();
        });
    }

    private function residentForeignReferences(string $tableName): bool
    {
        $foreign = DB::selectOne(
            "SELECT REFERENCED_TABLE_NAME
             FROM information_schema.KEY_COLUMN_USAGE
             WHERE TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = 'complaints'
                AND COLUMN_NAME = 'resident_id'
                AND REFERENCED_TABLE_NAME IS NOT NULL"
        );

        return $foreign?->REFERENCED_TABLE_NAME === $tableName;
    }
};
