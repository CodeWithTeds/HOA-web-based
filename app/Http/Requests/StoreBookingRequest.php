<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'resident_id' => 'required|exists:residents,id',
            'facility_id' => 'required|exists:facilities,id',
            'start_time' => 'required|date|after_or_equal:tomorrow',
            'end_time' => 'required|date|after:start_time|after_or_equal:tomorrow',
            'admin_notes' => 'nullable|string',
            'purpose' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'attendees' => 'nullable|integer|min:1',
        ];
    }
}
