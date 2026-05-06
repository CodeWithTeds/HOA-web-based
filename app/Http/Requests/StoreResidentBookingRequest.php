<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreResidentBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // We use role middleware on routes
    }

    public function rules(): array
    {
        return [
            'facility_id' => ['required', 'exists:facilities,id'],
            'start_time' => ['required', 'date', 'after_or_equal:now'],
            'end_time' => ['required', 'date', 'after:start_time'],
            'purpose' => ['required', 'string', 'max:255'],
            'attendees' => ['required', 'integer', 'min:1'],
            'special_requests' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
