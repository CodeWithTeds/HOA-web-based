<?php

use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'nationality' => 'Filipino',
        'resident_type' => 'Owner',
        'move_in_date' => now()->toDateString(),
    ]);

    $this->assertAuthenticated();
    $this->assertDatabaseHas('residents', [
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'resident_type' => 'Owner',
        'status' => 'Active',
    ]);
    $response->assertRedirect(route('dashboard', absolute: false));
});
