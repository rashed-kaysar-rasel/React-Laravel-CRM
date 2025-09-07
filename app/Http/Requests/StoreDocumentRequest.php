<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentRequest extends FormRequest
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
            'title' => ['nullable','string','max:120'],
            'files' => ['required','array','min:1','max:10'],        // multiple upload
            'files.*' => ['file','max:5120', // 5MB each
                'mimes:pdf,jpg,jpeg,png,webp'
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'files.*.mimes' => 'Allowed types: pdf, jpg, jpeg, png, webp',
            'files.*.max'   => 'Each file must be at most 5MB',
        ];
    }
}
