<?php

namespace App\Http\Requests\Admin;

use App\Enums\ComplaintCategory;
use App\Enums\ComplaintPriority;
use App\Enums\ComplaintStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateComplaintRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subject' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'category' => ['sometimes', new Enum(ComplaintCategory::class)],
            'priority' => ['sometimes', new Enum(ComplaintPriority::class)],
            'status' => ['sometimes', new Enum(ComplaintStatus::class)],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'resolution_notes' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:5120'],
        ];
    }
}
