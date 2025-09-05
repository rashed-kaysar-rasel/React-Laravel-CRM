<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'passport_no' => ['required', 'string', 'max:50', 'regex:/^[A-Z0-9]{6,12}$/i'],
            'country' => ['required', 'string', 'max:100'],
            'visa_type' => ['required', 'string', 'max:100'],
            'travel_date' => ['nullable', 'date', 'after_or_equal:today'],
            'status' => ['required', Rule::in(['new', 'screening', 'submitted', 'decision'])],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'passport_no.regex' => 'Passport must be 6–12 letters or numbers (no spaces).',
            'travel_date.after_or_equal' => 'Travel date cannot be in the past.',
        ];
    }
}
