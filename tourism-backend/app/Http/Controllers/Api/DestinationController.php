<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DestinationRequest;
use App\Http\Resources\DestinationResource;
use App\Models\Destination;
use Illuminate\Support\Facades\Storage;

class DestinationController extends Controller
{
    public function index()
    {
        $destinations = Destination::orderByDesc('view_count')
            ->latest()
            ->get();

        return DestinationResource::collection($destinations);
    }

    public function show($id)
    {
        $destination = Destination::findOrFail($id);

        $destination->increment('view_count');

        return new DestinationResource($destination->fresh());
    }

    public function store(DestinationRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')
                ->store('destinations', 'public');
        }

        $destination = Destination::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Destination berhasil ditambahkan',
            'data' => new DestinationResource($destination),
        ], 201);
    }

    public function update(DestinationRequest $request, $id)
    {
        $destination = Destination::findOrFail($id);

        $data = $request->validated();

        if ($request->hasFile('cover_image')) {
            if (
                $destination->cover_image &&
                Storage::disk('public')->exists($destination->cover_image)
            ) {
                Storage::disk('public')->delete($destination->cover_image);
            }

            $data['cover_image'] = $request->file('cover_image')
                ->store('destinations', 'public');
        }

        $destination->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Destination berhasil diperbarui',
            'data' => new DestinationResource($destination->fresh()),
        ]);
    }

    public function destroy($id)
    {
        $destination = Destination::findOrFail($id);

        if (
            $destination->cover_image &&
            Storage::disk('public')->exists($destination->cover_image)
        ) {
            Storage::disk('public')->delete($destination->cover_image);
        }

        $destination->delete();

        return response()->json([
            'success' => true,
            'message' => 'Destination berhasil dihapus',
        ]);
    }
}
