<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     * GET /api/users
     */
    public function index()
    {
        $users = User::latest()->get();
        return UserResource::collection($users);
    }

    /**
     * Store a newly created user.
     * POST /api/users
     */
    public function store(UserRequest $request)
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        Log::info('User created:', ['id' => $user->id, 'email' => $user->email]);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil ditambahkan',
            'data' => new UserResource($user)
        ], 201);
    }

    /**
     * Display the specified user.
     * GET /api/users/{id}
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        return new UserResource($user);
    }

    /**
     * Update the specified user.
     * PUT /api/users/{id}
     */
    public function update(UserRequest $request, $id)
    {
        $user = User::findOrFail($id);
        $data = $request->validated();

        $updateData = [
            'name' => $data['name'],
            'email' => $data['email'],
        ];

        // Jika password diisi, update password
        if (!empty($data['password'])) {
            $updateData['password'] = Hash::make($data['password']);
        }

        $user->update($updateData);

        Log::info('User updated:', ['id' => $user->id, 'email' => $user->email]);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil diperbarui',
            'data' => new UserResource($user)
        ]);
    }

    /**
     * Remove the specified user.
     * DELETE /api/users/{id}
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Cegah menghapus diri sendiri
        if ($user->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus akun sendiri'
            ], 403);
        }

        $user->delete();

        Log::info('User deleted:', ['id' => $user->id, 'email' => $user->email]);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dihapus'
        ]);
    }
}