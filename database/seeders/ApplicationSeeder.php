<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Application;

class ApplicationSeeder extends Seeder
{
    public function run(): void
    {
        // Create 20 fake applications
        Application::factory()->count(20)->create();
    }
}
