<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Application;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        // Number of applications by status
        $statusData = Application::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get()
            ->mapWithKeys(fn($item) => [$item->status => $item->count]);

        // Number of applications by country
        $countryData = Application::selectRaw('country, count(*) as count')
            ->groupBy('country')
            ->get()
            ->mapWithKeys(fn($item) => [$item->country => $item->count]);

        return Inertia::render('dashboard', [
            'statusData' => $statusData,
            'countryData' => $countryData,
        ]);
    }
}
