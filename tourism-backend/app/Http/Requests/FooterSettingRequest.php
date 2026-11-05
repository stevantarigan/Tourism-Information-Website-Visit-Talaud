<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FooterSettingRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        if ($this->isMethod('put') || $this->isMethod('patch')) {

            return [
                'website_name' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'copyright' => 'nullable|string|max:255',
            ];
        }

        return [
            'website_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'copyright' => 'nullable|string|max:255',
        ];
    }
}