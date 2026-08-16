<?php

use App\Enums\ResidentStatus;
use App\Enums\UserRole;
use App\Models\Resident;
use App\Models\User;

test('pending owner cannot sign in until approved', function () {
    User::factory()->create([
        'email' => 'owner@example.com',
        'role' => UserRole::HOMEOWNER->value,
    ]);

    Resident::factory()->create([
        'email' => 'owner@example.com',
        'status' => ResidentStatus::PENDING,
    ]);

    $response = $this->post(route('login'), [
        'email' => 'owner@example.com',
        'password' => 'password',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('email');
});

test('approved owner can sign in', function () {
    $user = User::factory()->create([
        'email' => 'owner@example.com',
        'role' => UserRole::HOMEOWNER->value,
    ]);

    Resident::factory()->create([
        'email' => 'owner@example.com',
        'status' => ResidentStatus::ACTIVE,
    ]);

    $response = $this->post(route('login'), [
        'email' => 'owner@example.com',
        'password' => 'password',
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertAuthenticatedAs($user);
});

test('admin can approve a pending resident', function () {
    $admin = User::factory()->create([
        'email' => 'admin@example.com',
        'role' => UserRole::ADMIN->value,
    ]);

    $resident = Resident::factory()->create([
        'email' => 'owner@example.com',
        'status' => ResidentStatus::PENDING,
    ]);

    $this->actingAs($admin)
        ->patch(route('admin.residents.approve', $resident))
        ->assertRedirect();

    $this->assertDatabaseHas('residents', [
        'id' => $resident->id,
        'status' => ResidentStatus::ACTIVE->value,
    ]);
});
