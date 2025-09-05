<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Application;
use Illuminate\Http\Request;
use App\Http\Requests\StoreApplicationRequest;
use App\Http\Requests\UpdateApplicationRequest;

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
                'edit' => route('applications.edit', ['application' => ':id']),
                'delete' => route('applications.destroy', ['application' => ':id']),
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
    public function edit(Application $application)
    {
        return Inertia::render('Applications/Edit', [
            'application' => $application,
            'options' => [
                'countries' => ['Thailand', 'Malaysia', 'Pakistan', 'India', 'Singapore'],
                'visaTypes' => ['Tourist', 'Business', 'Student'],
                'statuses' => ['new', 'screening', 'submitted', 'decision'],
            ],
            'routes' => [
                'index' => route('applications.index'),
                'update' => route('applications.update', $application),
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateApplicationRequest $request, Application $application)
    {
        $application->update($request->validated());

        return redirect()->route('applications.index')->with('success', 'Application updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Application $application)
    {
        $application->delete();
        return back()->with('success', 'Application deleted.');
    }
}
