<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Route::get('/', function () {
//     return redirect('/login');
// });

// /*
// |--------------------------------------------------------------------------
// | Login
// |--------------------------------------------------------------------------
// */

// // Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
// // Route::post('/login', [AuthController::class, 'login']);

// // /*
// |--------------------------------------------------------------------------
// | Admin
// |--------------------------------------------------------------------------
// */

// // Route::middleware('auth')->group(function () {

// //     Route::get('/dashboard', [DashboardController::class, 'index'])
// //         ->name('dashboard');

// //     Route::post('/logout', [AuthController::class, 'logout'])
// //         ->name('logout');

// // });