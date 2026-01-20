<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Project::create([
            'title' => 'Titec Automation Upgrade',
            'client' => 'Titec Industries',
            'description' => 'Complete automation overhaul for Titec main factory line. Implemented IoT sensors and real-time monitoring dashboard.',
            'completion_date' => '2023-11-15',
            'status' => 'Completed',
            'thumbnail_path' => 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
            'project_image_urls' => [
                'https://images.unsplash.com/photo-1581093458891-8f3086c85e53',
                'https://images.unsplash.com/photo-1531297461136-82af022f8b28'
            ]
        ]);

        Project::create([
            'title' => 'Smart Warehouse System',
            'client' => 'LogiTech Solutions',
            'description' => 'Development of a smart warehouse management system with automated guided vehicles (AGVs) integration.',
            'completion_date' => '2024-03-20',
            'status' => 'In Progress',
            'thumbnail_path' => 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d',
            'project_image_urls' => [
                'https://images.unsplash.com/photo-1553413077-190dd305871c',
                'https://images.unsplash.com/photo-1565514020176-892eb5bade9f',
                'https://images.unsplash.com/photo-1580983218765-f663bec07b37'
            ]
        ]);

        Project::create([
            'title' => 'Solar Power Grid Integration',
            'client' => 'Green Energy Corp',
            'description' => 'Integration of 5MW solar plant into the national grid with advanced load balancing and forecasting.',
            'completion_date' => '2023-08-10',
            'status' => 'Completed',
            'thumbnail_path' => 'https://images.unsplash.com/photo-1509391366360-2e959784a276',
            'project_image_urls' => [
                'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d',
                'https://images.unsplash.com/photo-1545208942-e94b89d6c243'
            ]
        ]);
        
        Project::create([
            'title' => 'Robotic Assembly Line',
            'client' => 'AutoParts Inc.',
            'description' => 'Assembly line automation using 6-axis robotic arms for precision welding and assembly.',
            'completion_date' => '2024-01-05',
            'status' => 'Completed',
            'thumbnail_path' => 'https://images.unsplash.com/photo-1563770095325-e66c7dd3443b',
            'project_image_urls' => [
                'https://images.unsplash.com/photo-1535378437327-b7149236addf',
                'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73'
            ]
        ]);
    }
}
