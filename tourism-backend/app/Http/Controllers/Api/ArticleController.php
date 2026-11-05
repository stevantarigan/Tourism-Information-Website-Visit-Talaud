<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::latest()->get();

        return ArticleResource::collection($articles);
    }

    public function show($id)
    {
        $article = Article::findOrFail($id);

        return new ArticleResource($article);
    }

    public function store(ArticleRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('thumbnail')) {

            $data['thumbnail'] = $request
                ->file('thumbnail')
                ->store('articles', 'public');
        }

        $article = Article::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Article berhasil ditambahkan',
            'data' => new ArticleResource($article)
        ], 201);
    }

    public function update(ArticleRequest $request, $id)
    {
        $article = Article::findOrFail($id);

        $data = $request->validated();

        if ($request->hasFile('thumbnail')) {

            if (
                $article->thumbnail &&
                Storage::disk('public')->exists($article->thumbnail)
            ) {
                Storage::disk('public')->delete($article->thumbnail);
            }

            $data['thumbnail'] = $request
                ->file('thumbnail')
                ->store('articles', 'public');
        }

        $article->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Article berhasil diperbarui',
            'data' => new ArticleResource($article->fresh())
        ]);
    }

    public function destroy($id)
    {
        $article = Article::findOrFail($id);

        if (
            $article->thumbnail &&
            Storage::disk('public')->exists($article->thumbnail)
        ) {
            Storage::disk('public')->delete($article->thumbnail);
        }

        $article->delete();

        return response()->json([
            'success' => true,
            'message' => 'Article berhasil dihapus'
        ]);
    }
}