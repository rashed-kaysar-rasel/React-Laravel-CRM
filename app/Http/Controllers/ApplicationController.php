<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Application;
use Illuminate\Http\Request;
use App\Http\Requests\StoreApplicationRequest;
use App\Http\Requests\UpdateApplicationRequest;
use App\Http\Requests\UpdateApplicationStatusRequest;

class ApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $q = $request->string('q')->toString();
        $status = $request->string('status')->toString();
        $country = $request->string('country')->toString();

        $apps = Application::query()
            ->when($q, fn($q2) => $q2->where(function ($sub) use ($q) {
                $sub->where('full_name', 'like', "%{$q}%")
                    ->orWhere('passport_no', 'like', "%{$q}%")
                    ->orWhere('visa_type', 'like', "%{$q}%")
                    ->orWhere('country', 'like', "%{$q}%");
            }))
            ->when($status, fn($q2) => $q2->where('status', $status))
            ->when($country, fn($q2) => $q2->where('country', $country))
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Applications/Index', [
            'apps' => $apps,
            'filters' => [               // <- ALWAYS present
                'q' => $q ?? '',
                'status' => $status ?? '',
                'country' => $country ?? '',
            ],
            'options' => [
                'statuses' => ['new', 'screening', 'submitted', 'decision'],
                'countries' => ['Thailand', 'Malaysia', 'Pakistan', 'India', 'Singapore'],
            ],
            'routes' => [
                'create' => route('applications.create'),
                'edit' => route('applications.edit', ['application' => ':id']),
                'delete' => route('applications.destroy', ['application' => ':id']),
                'status' => route('applications.status', ['application' => ':id']),
                'index' => route('applications.index'),
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


    public function updateStatus(UpdateApplicationStatusRequest $request, Application $application)
    {
        $application->update(['status' => $request->validated()['status']]);

        return back()->with('success', 'Status updated.');
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
