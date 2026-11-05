<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\HeroRequest;
use App\Http\Resources\HeroResource;
use App\Models\HeroSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
class HeroController extends Controller
{
    /**
     * Daftar Hero
     */
    public function index()
    {
        $heroes = HeroSection::orderBy('sort_order', 'asc')
            ->orderBy('id', 'desc')
            ->get();

        return HeroResource::collection($heroes);
    }

    /**
     * Detail Hero
     */
    public function show($id)
    {
        $hero = HeroSection::findOrFail($id);

        return new HeroResource($hero);
    }

    /**
     * Tambah Hero
     */
    public function store(HeroRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {

            $data['image'] = $request
                ->file('image')
                ->store('heroes', 'public');
        }

        $hero = HeroSection::create([
            'title' => $data['title'],
            'subtitle' => $data['subtitle'] ?? null,
            'image' => $data['image'] ?? null,
            'is_active' => $data['is_active'] ?? true,
            'sort_order' => $data['sort_order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Hero berhasil ditambahkan',
            'data' => new HeroResource($hero)
        ], 201);
    }

    /**
     * Update Hero
     */
    public function update(HeroRequest $request, $id)
    {
        $hero = HeroSection::findOrFail($id);

        $data = $request->validated();

        if ($request->hasFile('image')) {

            if ($hero->image && Storage::disk('public')->exists($hero->image)) {
                Storage::disk('public')->delete($hero->image);
            }

            $data['image'] = $request
                ->file('image')
                ->store('heroes', 'public');
        }

        $hero->update([
            'title' => $data['title'] ?? $hero->title,
            'subtitle' => $data['subtitle'] ?? $hero->subtitle,
            'image' => $data['image'] ?? $hero->image,
            'is_active' => $data['is_active'] ?? $hero->is_active,
            'sort_order' => $data['sort_order'] ?? $hero->sort_order,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Hero berhasil diperbarui',
            'data' => new HeroResource($hero)
        ]);
    }

    /**
     * Hapus Hero
     */
    public function destroy($id)
    {
        $hero = HeroSection::findOrFail($id);

        if ($hero->image && Storage::disk('public')->exists($hero->image)) {
            Storage::disk('public')->delete($hero->image);
        }

        $hero->delete();

        return response()->json([
            'success' => true,
            'message' => 'Hero berhasil dihapus'
        ]);
    }
}