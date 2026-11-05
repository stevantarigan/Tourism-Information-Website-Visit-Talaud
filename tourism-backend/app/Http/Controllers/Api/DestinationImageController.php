<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DestinationImageRequest;
use App\Http\Resources\DestinationImageResource;
use App\Models\DestinationImage;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class DestinationImageController extends Controller
{
    /**
     * List gambar destination
     */
    public function index(Request $request)
    {
        $query = DestinationImage::orderBy('sort_order')->latest();

        // Filter berdasarkan destination_id jika ada
        if ($request->has('destination_id')) {
            $query->where('destination_id', $request->destination_id);
        }

        $images = $query->get();

        return DestinationImageResource::collection($images);
    }

    /**
     * Detail gambar
     */
    public function show($id)
    {
        $image = DestinationImage::findOrFail($id);

        return new DestinationImageResource($image);
    }

    /**
     * Tambah gambar
     */
    public function store(DestinationImageRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {

            $data['image'] = $request
                ->file('image')
                ->store('destination-images', 'public');
        }

        $image = DestinationImage::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Gambar destination berhasil ditambahkan',
            'data' => new DestinationImageResource($image)
        ], 201);
    }

    /**
     * Update gambar
     */
    public function update(DestinationImageRequest $request, $id)
    {
        $image = DestinationImage::findOrFail($id);

        $data = $request->validated();

        if ($request->hasFile('image')) {

            if (
                $image->image &&
                Storage::disk('public')->exists($image->image)
            ) {
                Storage::disk('public')->delete($image->image);
            }

            $data['image'] = $request
                ->file('image')
                ->store('destination-images', 'public');
        }

        $image->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Gambar destination berhasil diperbarui',
            'data' => new DestinationImageResource($image->fresh())
        ]);
    }

    /**
     * Hapus gambar
     */
    public function destroy($id)
    {
        $image = DestinationImage::findOrFail($id);

        if (
            $image->image &&
            Storage::disk('public')->exists($image->image)
        ) {
            Storage::disk('public')->delete($image->image);
        }

        $image->delete();

        return response()->json([
            'success' => true,
            'message' => 'Gambar destination berhasil dihapus'
        ]);
    }
    public function getByDestinationId($destinationId)
    {
        $images = DestinationImage::where('destination_id', $destinationId)->get();

        return response()->json([
            'data' => $images
        ]);
    }
}