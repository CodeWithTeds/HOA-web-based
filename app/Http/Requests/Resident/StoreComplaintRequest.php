<?php

namespace App\Http\Requests\Resident;

use App\Enums\ComplaintCategory;
use App\Enums\ComplaintPriority;
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
            'subject'     => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'category'    => ['required', new Enum(ComplaintCategory::class)],
            'priority'    => ['required', new Enum(ComplaintPriority::class)],
            'image'       => ['nullable', 'image', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'subject.required'     => 'A complaint subject is required.',
            'description.required' => 'Please describe your complaint in detail.',
            'category.required'    => 'Please select a category.',
            'priority.required'    => 'Please select a priority level.',
        ];
    }
}
