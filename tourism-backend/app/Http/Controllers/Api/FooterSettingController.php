<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\FooterSettingRequest;
use App\Http\Resources\FooterSettingResource;
use App\Models\FooterSetting;

class FooterSettingController extends Controller
{
    public function index()
    {
        $settings = FooterSetting::latest()->get();

        return FooterSettingResource::collection($settings);
    }

    public function store(FooterSettingRequest $request)
    {
        $setting = FooterSetting::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Footer Setting berhasil ditambahkan',
            'data' => new FooterSettingResource($setting)
        ], 201);
    }

    public function show($id)
    {
        $setting = FooterSetting::findOrFail($id);

        return new FooterSettingResource($setting);
    }

    public function update(FooterSettingRequest $request, $id)
    {
        $setting = FooterSetting::findOrFail($id);

        $setting->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Footer Setting berhasil diperbarui',
            'data' => new FooterSettingResource($setting)
        ]);
    }

    public function destroy($id)
    {
        $setting = FooterSetting::findOrFail($id);

        $setting->delete();

        return response()->json([
            'success' => true,
            'message' => 'Footer Setting berhasil dihapus'
        ]);
    }
}