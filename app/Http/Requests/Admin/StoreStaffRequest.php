<?php

namespace App\Http\Requests\Admin;

use App\Enums\StaffRole;
use App\Enums\StaffStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreStaffRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role->value === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'profilePicture' => ['nullable', 'string'],
            'firstName' => ['required', 'string', 'min:2'],
            'lastName' => ['required', 'string', 'min:2'],
            'email' => ['required', 'string', 'email', 'unique:staff,email'],
            'phone' => ['nullable', 'string'],
            'role' => ['required', new Enum(StaffRole::class)],
            'department' => ['nullable', 'string'],
            'status' => ['required', new Enum(StaffStatus::class)],
            'hireDate' => ['required', 'date'],
        ];
    }
}
