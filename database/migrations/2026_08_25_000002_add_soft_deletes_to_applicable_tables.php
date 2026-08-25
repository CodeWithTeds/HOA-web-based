<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('residents', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('facilities', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('announcements', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('complaints', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('billing_periods', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('invoices', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('staff', function (Blueprint $table) {
            if (!Schema::hasColumn('staff', 'deleted_at')) {
                $table->softDeletes();
            }
        });
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'deleted_at')) {
                $table->softDeletes();
            }
        });
    }

    public function down(): void
    {
        Schema::table('residents', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::table('facilities', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::table('announcements', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::table('complaints', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::table('billing_periods', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::table('staff', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
