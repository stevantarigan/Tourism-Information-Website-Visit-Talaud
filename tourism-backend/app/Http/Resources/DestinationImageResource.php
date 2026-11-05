<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DestinationImageResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,

            'destination_id' => $this->destination_id,

            'image' => $this->image,

            'image_url' => $this->image
                ? asset('storage/' . $this->image)
                : null,

            'sort_order' => $this->sort_order,

            'created_at' => $this->created_at,
        ];
    }
}