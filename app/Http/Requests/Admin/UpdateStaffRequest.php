<?php

namespace App\Http\Requests\Admin;

use App\Enums\StaffRole;
use App\Enums\StaffStatus;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdateStaffRequest extends FormRequest
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
        // we can access the route parameter 'staff' or 'id'
        $staffId = $this->route('user') ?? $this->route('staff') ?? $this->route('id');
        $staff = Staff::find($staffId);
        $loginUser = $staff ? User::where('email', $staff->email)->first() : null;

        return [
            'photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:1024'],
            'firstName' => ['required', 'string', 'min:2'],
            'lastName' => ['required', 'string', 'min:2'],
            'email' => [
                'required',
                'string',
                'email',
                'unique:staff,email,' . $staffId,
                Rule::unique('users', 'email')->ignore($loginUser?->role?->value === 'staff' ? $loginUser->id : null),
            ],
            'password' => ['nullable', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'digits:11'],
            'role' => ['required', new Enum(StaffRole::class)],
            'department' => ['nullable', 'string'],
            'status' => ['required', new Enum(StaffStatus::class)],
            'hireDate' => ['required', 'date'],
        ];
    }
}
