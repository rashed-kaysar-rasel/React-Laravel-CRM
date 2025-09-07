<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;


class Document extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $appends = ['url'];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }

    // Small helper to expose a public URL for listing
    public function getUrlAttribute(): ?string
    {
        if (!$this->path) return null;
        return Storage::disk($this->disk)->url($this->path);
    }

}
