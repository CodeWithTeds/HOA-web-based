<?php

use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('owner registrations are pending verification until approved', function () {
    $response = $this->post(route('register.store'), [
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'owner@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'nationality' => 'Filipino',
        'resident_type' => 'Owner',
        'move_in_date' => now()->toDateString(),
    ]);

    $this->assertGuest();
    $this->assertDatabaseHas('residents', [
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'owner@example.com',
        'resident_type' => 'Owner',
        'status' => 'Pending',
    ]);
    $response->assertRedirect(route('login', absolute: false));
    $response->assertSessionHas('status');
});

test('non-owner registrations are active immediately', function () {
    $response = $this->post(route('register.store'), [
        'first_name' => 'Test',
        'last_name' => 'Tenant',
        'email' => 'tenant@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'nationality' => 'Filipino',
        'resident_type' => 'Tenant',
        'move_in_date' => now()->toDateString(),
    ]);

    $this->assertAuthenticated();
    $this->assertDatabaseHas('residents', [
        'first_name' => 'Test',
        'last_name' => 'Tenant',
        'email' => 'tenant@example.com',
        'resident_type' => 'Tenant',
        'status' => 'Active',
    ]);
    $response->assertRedirect(route('dashboard', absolute: false));
});
