<?php

namespace App\Repositories\User;

use App\Models\User;

interface UserRepositoryInterface
{
    public function findByEmail(string $email): ?User;

    public function create(array $attributes): User;

    public function update(User $user, array $attributes): bool;

    public function delete(User $user): bool;
}
