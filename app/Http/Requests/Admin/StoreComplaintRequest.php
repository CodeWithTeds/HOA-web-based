<?php

namespace App\Http\Requests\Admin;

use App\Enums\ComplaintCategory;
use App\Enums\ComplaintPriority;
use App\Enums\ComplaintStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreComplaintRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subject' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'resident_id' => ['required', 'exists:residents,id'],
            'category' => ['required', new Enum(ComplaintCategory::class)],
            'priority' => ['required', new Enum(ComplaintPriority::class)],
            'status' => ['required', new Enum(ComplaintStatus::class)],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'image' => ['nullable', 'image', 'max:5120'],
        ];
    }
}
