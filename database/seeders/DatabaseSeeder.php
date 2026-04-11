<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => \App\Enums\UserRole::ADMIN->value,
        ]);

        User::factory()->create([
            'name' => 'Staff User',
            'email' => 'staff@example.com',
            'role' => \App\Enums\UserRole::STAFF->value,
        ]);

        User::factory()->create([
            'name' => 'Homeowner User',
            'email' => 'homeowner@example.com',
            'role' => \App\Enums\UserRole::HOMEOWNER->value,
        ]);
    }
}
