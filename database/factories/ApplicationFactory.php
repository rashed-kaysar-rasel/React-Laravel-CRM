<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicationFactory extends Factory
{
    public function definition(): array
    {
        $countries = ['Thailand', 'Malaysia', 'Pakistan', 'India', 'Singapore'];
        $visaTypes = ['Tourist', 'Business', 'Student'];

        return [
            'full_name'   => $this->faker->name(),
            'passport_no' => strtoupper($this->faker->bothify('??######')), // e.g. AB123456
            'country'     => $this->faker->randomElement($countries),
            'visa_type'   => $this->faker->randomElement($visaTypes),
            'travel_date' => $this->faker->dateTimeBetween('now', '+6 months'),
            'status'      => $this->faker->randomElement(['new', 'screening', 'submitted', 'decision']),
            'created_at'  => now(),
            'updated_at'  => now(),
        ];
    }
}
