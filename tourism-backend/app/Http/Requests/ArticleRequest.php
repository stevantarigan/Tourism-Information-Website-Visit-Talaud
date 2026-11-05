<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ArticleRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $articleId = $this->route('article');

        return [
            'title' => 'required|string|max:255',

            'slug' => 'required|string|max:255|unique:articles,slug,' . $articleId,

            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',

            'content' => 'required|string',

            'published_at' => 'nullable|date',

            'is_published' => 'nullable|boolean',
        ];
    }
}