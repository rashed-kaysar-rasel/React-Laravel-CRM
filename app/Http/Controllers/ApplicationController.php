<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Application;
use Illuminate\Http\Request;
use App\Http\Requests\StoreApplicationRequest;

class ApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $apps = Application::latest()->paginate(10);
        return Inertia::render('Applications/Index', [
            'apps' => $apps,
            'routes' => [
                'create' => route('applications.create'),
                'edit' => route('applications.edit', ['application' => '__id__']),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Optional: provide dropdown options from server
        return Inertia::render('Applications/Create', [
            'options' => [
                'countries' => ['Thailand', 'Malaysia', 'Pakistan', 'India', 'Singapore'],
                'visaTypes' => ['Tourist', 'Business', 'Student'],
            ],
            'routes' => [
                'index' => route('applications.index'),
                'store' => route('applications.store'),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreApplicationRequest $request)
    {
        // Validated data is guaranteed here
        $data = $request->validated();

        // default status
        $data['status'] = $data['status'] ?? 'new';

        Application::create($data);

        return redirect()
            ->route('applications.index')
            ->with('success', 'Application created.');
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
