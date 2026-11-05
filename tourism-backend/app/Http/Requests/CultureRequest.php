<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CultureRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'description' => 'required|string',
            'event_date' => 'nullable|date',
            'location' => 'nullable|string|max:255',
        ];
    }
}