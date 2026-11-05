<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,

            'title' => $this->title,

            'slug' => $this->slug,

            'thumbnail' => $this->thumbnail,

            'thumbnail_url' => $this->thumbnail
                ? asset('storage/' . $this->thumbnail)
                : null,

            'content' => $this->content,

            'published_at' => $this->published_at,

            'is_published' => $this->is_published,

            'created_at' => $this->created_at,
        ];
    }
}