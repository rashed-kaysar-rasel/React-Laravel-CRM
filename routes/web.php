<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ApplicationController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Route::middleware('auth')->group(function () {
    Route::resource('applications', ApplicationController::class);
    Route::patch('applications/{application}/status', [ApplicationController::class, 'updateStatus'])
        ->name('applications.status');
    Route::get('applications/search', [ApplicationController::class, 'search'])
        ->name('applications.search');

    // Documents nested under applications
    Route::get('applications/{application}/documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::post('applications/{application}/documents', [DocumentController::class, 'store'])->name('documents.store');
    Route::delete('documents/{document}', [DocumentController::class, 'destroy'])->name('documents.destroy');

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

});
