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
    protected ?array $data;

    /**
     * @param int|null $ignoreId Resident ID to exclude from the uniqueness check
     * @param array|null $data Optional explicit data (for programmatic validation)
     */
    public function __construct(?int $ignoreId = null, ?array $data = null)
    {
        $this->ignoreId = $ignoreId;
        $this->data = $data;
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
        $input = $this->data ?? request()->all();
        // Fallback: if still empty, try to get from validator's data via request
        if (empty($input['resident_type']) && empty($input['phase'])) {
            $input = array_merge($input, request()->all());
        }

        // Only enforce one-address-per-account for Owner type
        // Tenants, Family Members, Helpers can share same household address
        $residentType = $input['resident_type'] ?? null;
        if ($residentType !== 'Owner') {
            return;
        }

        // Only check against existing Owner records (or pending owners?) - scope to Owner addresses
        $query = Resident::where('phase', $input['phase'] ?? null)
            ->where('block', $input['block'] ?? null)
            ->where('lot', $input['lot'] ?? null)
            ->where('street', $input['street'] ?? null)
            ->where('unit', $input['unit'] ?? null)
            ->where('resident_type', 'Owner');

        if ($this->ignoreId) {
            $query->where('id', '!=', $this->ignoreId);
        }

        if ($query->exists()) {
            $fail('An Owner account already exists for this address. Only one Owner per household is allowed.');
        }
    }
}
