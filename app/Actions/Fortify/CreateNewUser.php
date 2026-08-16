<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Enums\CivilStatus;
use App\Enums\Gender;
use App\Enums\ResidentStatus;
use App\Enums\ResidentType;
use App\Enums\UserRole;
use App\Models\Resident;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['nullable', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
                Rule::unique(Resident::class),
            ],
            'password' => $this->passwordRules(),
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'suffix' => ['nullable', 'string', 'max:50'],
            'gender' => ['nullable', new Enum(Gender::class)],
            'birth_date' => ['nullable', 'date'],
            'civil_status' => ['nullable', new Enum(CivilStatus::class)],
            'nationality' => ['nullable', 'string', 'max:100'],
            'mobile_number' => ['nullable', 'string', 'max:20'],
            'alternate_number' => ['nullable', 'string', 'max:20'],
            'phase' => ['nullable', 'string', 'max:50'],
            'block' => ['nullable', 'string', 'max:50'],
            'lot' => ['nullable', 'string', 'max:50'],
            'street' => ['nullable', 'string', 'max:255'],
            'unit' => ['nullable', 'string', 'max:50'],
            'resident_type' => ['required', new Enum(ResidentType::class)],
            'move_in_date' => ['nullable', 'date'],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_number' => ['nullable', 'string', 'max:20'],
        ])->validate();

        return DB::transaction(function () use ($input) {
            $resident = Resident::create([
                'first_name' => $input['first_name'],
                'middle_name' => $input['middle_name'] ?? null,
                'last_name' => $input['last_name'],
                'suffix' => $input['suffix'] ?? null,
                'gender' => $input['gender'] ?? null,
                'birth_date' => $input['birth_date'] ?? null,
                'civil_status' => $input['civil_status'] ?? null,
                'nationality' => $input['nationality'] ?? null,
                'mobile_number' => $input['mobile_number'] ?? null,
                'alternate_number' => $input['alternate_number'] ?? null,
                'email' => $input['email'],
                'phase' => $input['phase'] ?? null,
                'block' => $input['block'] ?? null,
                'lot' => $input['lot'] ?? null,
                'street' => $input['street'] ?? null,
                'unit' => $input['unit'] ?? null,
                'resident_type' => $input['resident_type'],
                'move_in_date' => $input['move_in_date'] ?? null,
                'emergency_contact_name' => $input['emergency_contact_name'] ?? null,
                'emergency_contact_number' => $input['emergency_contact_number'] ?? null,
                'status' => $input['resident_type'] === ResidentType::OWNER->value
                    ? ResidentStatus::PENDING->value
                    : ResidentStatus::ACTIVE->value,
            ]);

            return User::create([
                'name' => $input['name'] ?? $resident->full_name,
                'email' => $input['email'],
                'password' => $input['password'],
                'role' => UserRole::HOMEOWNER->value,
            ]);
        });
    }
}
