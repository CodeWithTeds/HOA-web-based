<?php

namespace Database\Factories;

use App\Enums\CivilStatus;
use App\Enums\Gender;
use App\Enums\ResidentStatus;
use App\Enums\ResidentType;
use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Resident>
 */
class ResidentFactory extends Factory
{
    protected $model = Resident::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => $this->faker->firstName(),
            'middle_name' => $this->faker->lastName(), // Using lastName for middle name
            'last_name' => $this->faker->lastName(),
            'suffix' => $this->faker->optional(0.1)->suffix(),
            'gender' => $this->faker->randomElement(Gender::cases()),
            'birth_date' => $this->faker->date('Y-m-d', '-18 years'),
            'age' => $this->faker->numberBetween(18, 80),
            'civil_status' => $this->faker->randomElement(CivilStatus::cases()),
            'nationality' => 'Filipino',
            'mobile_number' => $this->faker->numerify('09#########'),
            'alternate_number' => $this->faker->optional()->numerify('09#########'),
            'email' => $this->faker->unique()->safeEmail(),
            'phase' => $this->faker->numberBetween(1, 3),
            'block' => $this->faker->numberBetween(1, 40),
            'lot' => $this->faker->numberBetween(1, 50),
            'street' => $this->faker->streetName(),
            'unit' => $this->faker->optional(0.3)->numerify('Unit ###'),
            'resident_type' => $this->faker->randomElement(ResidentType::cases()),
            'is_head_of_household' => $this->faker->boolean(20),
            'move_in_date' => $this->faker->date('Y-m-d', '-5 years'),
            'emergency_contact_name' => $this->faker->name(),
            'emergency_contact_number' => $this->faker->numerify('09#########'),
            'status' => $this->faker->randomElement([ResidentStatus::ACTIVE, ResidentStatus::ACTIVE, ResidentStatus::INACTIVE]), // Weight towards active
            'remarks' => $this->faker->optional(0.1)->sentence(),
        ];
    }
}
