<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DestinationResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,

            'name' => $this->name,

            'slug' => $this->slug,

            'short_description' => $this->short_description,

            'description' => $this->description,

            'address' => $this->address,

            'location' => $this->address,

            'opening_hours' => $this->opening_hours,

            'ticket_price' => $this->ticket_price,

            'contact' => $this->contact,

            'cover_image' => $this->cover_image,

            'cover_image_url' => $this->cover_image
                ? asset('storage/' . $this->cover_image)
                : null,

            'view_count' => $this->view_count,

            'is_active' => $this->is_active,

            'created_at' => $this->created_at,
        ];
    }
}
