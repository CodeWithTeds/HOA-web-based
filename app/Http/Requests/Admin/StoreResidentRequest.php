<?php

namespace App\Http\Requests\Admin;

use App\Enums\CivilStatus;
use App\Enums\Gender;
use App\Enums\ResidentStatus;
use App\Enums\ResidentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreResidentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Personal Info
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'suffix' => ['nullable', 'string', 'max:50'],
            'gender' => ['nullable', new Enum(Gender::class)],
            'birth_date' => ['nullable', 'date'],
            'civil_status' => ['nullable', new Enum(CivilStatus::class)],
            'nationality' => ['nullable', 'string', 'max:100'],

            // Contact Info
            'mobile_number' => ['nullable', 'string', 'max:20'],
            'alternate_number' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'unique:residents,email'],

            // Residency Details
            'phase' => ['nullable', 'string', 'max:50'],
            'block' => ['nullable', 'string', 'max:50'],
            'lot' => ['nullable', 'string', 'max:50'],
            'street' => ['nullable', 'string', 'max:255'],
            'unit' => ['nullable', 'string', 'max:50'],
            'resident_type' => ['required', new Enum(ResidentType::class)],
            'is_head_of_household' => ['boolean'],
            'move_in_date' => ['nullable', 'date'],

            // Emergency Contact
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_number' => ['nullable', 'string', 'max:20'],

            // Status
            'status' => ['required', new Enum(ResidentStatus::class)],
            'remarks' => ['nullable', 'string'],
        ];
    }
}
