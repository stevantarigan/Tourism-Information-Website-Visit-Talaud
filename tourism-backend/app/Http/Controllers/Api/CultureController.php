<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CultureRequest;
use App\Http\Resources\CultureResource;
use App\Models\Culture;
use Illuminate\Support\Facades\Storage;

class CultureController extends Controller
{
    public function index()
    {
        $cultures = Culture::latest()->get();

        return CultureResource::collection($cultures);
    }

    public function show($id)
    {
        $culture = Culture::findOrFail($id);

        return new CultureResource($culture);
    }

    public function store(CultureRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request
                ->file('image')
                ->store('cultures', 'public');
        }

        $culture = Culture::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Culture berhasil ditambahkan',
            'data' => new CultureResource($culture)
        ], 201);
    }

    public function update(CultureRequest $request, $id)
    {
        $culture = Culture::findOrFail($id);

        $data = $request->validated();

        if ($request->hasFile('image')) {

            if (
                $culture->image &&
                Storage::disk('public')->exists($culture->image)
            ) {
                Storage::disk('public')->delete($culture->image);
            }

            $data['image'] = $request
                ->file('image')
                ->store('cultures', 'public');
        }

        $culture->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Culture berhasil diperbarui',
            'data' => new CultureResource($culture->fresh())
        ]);
    }

    public function destroy($id)
    {
        $culture = Culture::findOrFail($id);

        if (
            $culture->image &&
            Storage::disk('public')->exists($culture->image)
        ) {
            Storage::disk('public')->delete($culture->image);
        }

        $culture->delete();

        return response()->json([
            'success' => true,
            'message' => 'Culture berhasil dihapus'
        ]);
    }
}