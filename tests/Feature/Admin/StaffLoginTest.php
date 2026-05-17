<?php

use App\Enums\UserRole;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

test('created staff can authenticate through the main login form', function () {
    $admin = User::factory()->create([
        'role' => UserRole::ADMIN,
    ]);

    $response = $this->actingAs($admin)->post(route('admin.user.store'), [
        'firstName' => 'Jane',
        'lastName' => 'Staff',
        'email' => 'jane.staff@example.com',
        'password' => 'password123',
        'phone' => '09123456789',
        'role' => 'hoa personnel',
        'department' => 'Operations',
        'status' => 'ACTIVE',
        'hireDate' => now()->toDateString(),
    ]);

    $response->assertRedirect(route('admin.user.index'));
    $this->assertDatabaseHas('staff', [
        'email' => 'jane.staff@example.com',
    ]);
    $this->assertDatabaseHas('users', [
        'email' => 'jane.staff@example.com',
        'role' => UserRole::STAFF->value,
    ]);

    Auth::logout();

    $loginResponse = $this->post(route('login.store'), [
        'email' => 'jane.staff@example.com',
        'password' => 'password123',
    ]);

    $this->assertAuthenticated();
    $loginResponse->assertRedirect(route('staff.dashboard', absolute: false));
});

test('staff email must not already belong to another user account', function () {
    $admin = User::factory()->create([
        'role' => UserRole::ADMIN,
    ]);
    $existingUser = User::factory()->create([
        'role' => UserRole::HOMEOWNER,
    ]);

    $response = $this->actingAs($admin)->from(route('admin.user.create'))->post(route('admin.user.store'), [
        'firstName' => 'Duplicate',
        'lastName' => 'Staff',
        'email' => $existingUser->email,
        'password' => 'password123',
        'phone' => '09123456789',
        'role' => 'hoa personnel',
        'department' => 'Operations',
        'status' => 'ACTIVE',
        'hireDate' => now()->toDateString(),
    ]);

    $response->assertRedirect(route('admin.user.create'));
    $response->assertSessionHasErrors('email');
    expect(Staff::where('email', $existingUser->email)->exists())->toBeFalse();
});
