<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DestinationRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $destinationId = $this->route('destination');

        $isUpdate = $this->isMethod('put') || $this->isMethod('patch');

        return [
            'name' => 'required|string|max:255',

            'slug' => 'required|string|max:255|unique:destinations,slug'
                . ($isUpdate && $destinationId ? ',' . $destinationId : ''),

            'short_description' => 'nullable|string',

            'description' => 'required|string',

            'address' => 'nullable|string|max:255',

            'opening_hours' => 'nullable|string|max:255',

            'ticket_price' => 'nullable|string|max:255',

            'contact' => 'nullable|string|max:255',

            'cover_image' => ($isUpdate ? 'nullable' : 'required')
                . '|image|mimes:jpeg,png,jpg,gif,webp|max:2048',

            'is_active' => 'nullable|boolean',
        ];
    }
}
