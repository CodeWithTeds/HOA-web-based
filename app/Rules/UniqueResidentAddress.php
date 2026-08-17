<?php

namespace App\Rules;

use App\Models\Resident;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class UniqueResidentAddress implements ValidationRule
{
    /**
     * @var int|null ID of the resident to ignore (for updates)
     */
    protected ?int $ignoreId;

    /**
     * @param int|null $ignoreId Resident ID to exclude from the uniqueness check
     */
    public function __construct(?int $ignoreId = null)
    {
        $this->ignoreId = $ignoreId;
    }

    /**
     * Run the validation rule.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @param  \Closure(string, ?string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $input = request()->all();

        $query = Resident::where('phase', $input['phase'] ?? null)
            ->where('block', $input['block'] ?? null)
            ->where('lot', $input['lot'] ?? null)
            ->where('street', $input['street'] ?? null)
            ->where('unit', $input['unit'] ?? null)
            ->where('status', 'Active');

        if ($this->ignoreId) {
            $query->where('id', '!=', $this->ignoreId);
        }

        if ($query->exists()) {
            $fail('An account already exists for this address. Only one account per household is allowed.');
        }
    }
}
