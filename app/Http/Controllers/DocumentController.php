<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocumentRequest;
use App\Models\Application;
use App\Models\Document;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index(Application $application)
    {
        $application->load('documents');

        return Inertia::render('Applications/Documents', [
            'application' => $application,
            'documents'   => $application->documents->map(fn($d) => [
                'id'            => $d->id,
                'title'         => $d->title,
                'url'           => $d->url,
                'original_name' => $d->original_name,
                'mime'          => $d->mime,
                'size'          => $d->size,
                'created_at'    => $d->created_at->toDateTimeString(),
            ]),
            'routes' => [
                'index'   => route('applications.index'),
                'store'   => route('documents.store', $application),
                'destroy' => route('documents.destroy', ':id'), // for client replace
            ],
            'limits' => [
                'maxFiles' => 10,
                'maxSizeMb'=> 5,
                'types'    => 'pdf,jpg,jpeg,png,webp',
            ],
        ]);
    }

    public function store(StoreDocumentRequest $request, Application $application)
    {
        foreach ($request->file('files') as $file) {
            $path = $file->store("applications/{$application->id}", 'public');

            $application->documents()->create([
                'title'         => $request->string('title')->toString() ?: null,
                'disk'          => 'public',
                'path'          => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime'          => $file->getClientMimeType(),
                'size'          => $file->getSize(),
            ]);
        }

        return back()->with('success', 'Document(s) uploaded.');
    }

    public function destroy(Document $document)
    {
        Storage::disk($document->disk)->delete($document->path);
        $document->delete();

        return back()->with('success', 'Document deleted.');
    }
}

