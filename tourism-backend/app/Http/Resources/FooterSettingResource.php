<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FooterSettingResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'website_name' => $this->website_name,
            'description' => $this->description,
            'copyright' => $this->copyright,
            'created_at' => $this->created_at,
        ];
    }
}