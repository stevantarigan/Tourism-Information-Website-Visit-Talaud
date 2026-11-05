<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GalleryRequest;
use App\Http\Resources\GalleryResource;
use App\Models\Gallery;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    /**
     * List gallery
     */
    public function index()
    {
        $galleries = Gallery::latest()->get();

        return GalleryResource::collection($galleries);
    }

    /**
     * Detail gallery
     */
    public function show($id)
    {
        $gallery = Gallery::findOrFail($id);

        return new GalleryResource($gallery);
    }

    /**
     * Tambah gallery
     */
    public function store(GalleryRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request
                ->file('image')
                ->store('galleries', 'public');
        }

        $gallery = Gallery::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Gallery berhasil ditambahkan',
            'data' => new GalleryResource($gallery)
        ], 201);
    }

    /**
     * Update gallery
     */
    public function update(GalleryRequest $request, $id)
    {
        $gallery = Gallery::findOrFail($id);

        $data = $request->validated();

        if ($request->hasFile('image')) {

            if (
                $gallery->image &&
                Storage::disk('public')->exists($gallery->image)
            ) {
                Storage::disk('public')->delete($gallery->image);
            }

            $data['image'] = $request
                ->file('image')
                ->store('galleries', 'public');
        }

        $gallery->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Gallery berhasil diperbarui',
            'data' => new GalleryResource($gallery->fresh())
        ]);
    }

    /**
     * Hapus gallery
     */
    public function destroy($id)
    {
        $gallery = Gallery::findOrFail($id);

        if (
            $gallery->image &&
            Storage::disk('public')->exists($gallery->image)
        ) {
            Storage::disk('public')->delete($gallery->image);
        }

        $gallery->delete();

        return response()->json([
            'success' => true,
            'message' => 'Gallery berhasil dihapus'
        ]);
    }
}