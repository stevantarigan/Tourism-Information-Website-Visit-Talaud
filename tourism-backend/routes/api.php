<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HeroController;
use App\Http\Controllers\Api\DestinationController;
use App\Http\Controllers\Api\DestinationImageController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\CultureController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\FooterSettingController;
use App\Http\Controllers\Api\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ==========================
// AUTH
// ==========================
Route::post('/login', [AuthController::class, 'login']);


// ==========================
// PUBLIC API (TANPA LOGIN)
// ==========================

// Hero
Route::get('/heroes', [HeroController::class, 'index']);
Route::get('/heroes/{hero}', [HeroController::class, 'show']);


// Destination
Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/{destination}', [DestinationController::class, 'show']);

// Destination Images
Route::get('/destination-images', [DestinationImageController::class, 'index']);
Route::get('/destination-images/destination/{destinationId}', [DestinationImageController::class, 'getByDestinationId']);
Route::get('/destination-images/{destination_image}', [DestinationImageController::class, 'show']);

// Gallery
Route::get('/galleries', [GalleryController::class, 'index']);
Route::get('/galleries/{gallery}', [GalleryController::class, 'show']);

// Culture
Route::get('/cultures', [CultureController::class, 'index']);
Route::get('/cultures/{culture}', [CultureController::class, 'show']);

// Article
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{article}', [ArticleController::class, 'show']);

// Contact
Route::get('/contacts', [ContactController::class, 'index']);
Route::get('/contacts/{contact}', [ContactController::class, 'show']);

// Footer Setting
Route::get('/footer-settings', [FooterSettingController::class, 'index']);
Route::get('/footer-settings/{footer_setting}', [FooterSettingController::class, 'show']);


// ==========================
// ADMIN API (LOGIN REQUIRED)
// ==========================
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/me', [AuthController::class, 'me']);

    // ===== USER MANAGEMENT =====
    Route::apiResource('users', UserController::class); // ← Tambahkan ini

    Route::apiResource('heroes', HeroController::class)
        ->except(['index', 'show']);

    Route::apiResource('destinations', DestinationController::class)
        ->except(['index', 'show']);

    Route::apiResource('destination-images', DestinationImageController::class)
        ->except(['index', 'show']);

    Route::apiResource('galleries', GalleryController::class)
        ->except(['index', 'show']);

    Route::apiResource('cultures', CultureController::class)
        ->except(['index', 'show']);

    Route::apiResource('articles', ArticleController::class)
        ->except(['index', 'show']);

    Route::apiResource('contacts', ContactController::class)
        ->except(['index', 'show']);

    Route::apiResource('footer-settings', FooterSettingController::class)
        ->except(['index', 'show']);


});