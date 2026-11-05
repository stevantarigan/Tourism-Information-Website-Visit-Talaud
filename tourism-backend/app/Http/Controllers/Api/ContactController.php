<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactRequest;
use App\Http\Resources\ContactResource;
use App\Models\Contact;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::latest()->get();

        return ContactResource::collection($contacts);
    }

    public function store(ContactRequest $request)
    {
        $contact = Contact::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Contact berhasil ditambahkan',
            'data' => new ContactResource($contact)
        ], 201);
    }

    public function show($id)
    {
        $contact = Contact::findOrFail($id);

        return new ContactResource($contact);
    }

    public function update(ContactRequest $request, $id)
    {
        $contact = Contact::findOrFail($id);

        $contact->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Contact berhasil diperbarui',
            'data' => new ContactResource($contact)
        ]);
    }

    public function destroy($id)
    {
        $contact = Contact::findOrFail($id);

        $contact->delete();

        return response()->json([
            'success' => true,
            'message' => 'Contact berhasil dihapus'
        ]);
    }
}