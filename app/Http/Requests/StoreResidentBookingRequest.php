<?php

namespace App\Http\Requests;

use App\Models\Facility;
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
            'attendees' => [
                'required', 'integer', 'min:1',
                function ($attribute, $value, $fail) {
                    $facility = Facility::find($this->facility_id);
                    if ($facility && $value > $facility->capacity) {
                        $fail("The number of attendees ({$value}) exceeds the maximum capacity of {$facility->capacity} for {$facility->name}.");
                    }
                },
            ],
            'special_requests' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
