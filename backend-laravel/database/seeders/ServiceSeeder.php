<?php

namespace Database\Seeders;

use App\Models\ServiceCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        // Copy images from frontend assets to Laravel public/services/
        $this->copyImages();

        $services = [
            [
                'title' => 'Industrial Automation Solutions',
                'description' => 'Everything related to automation systems, controllers, and smart integration.',
                'image_path' => '/services/industrial_automation.png',
                'slug' => 'industrial-automation-solutions',
                'sort_order' => 1,
                'items' => [
                    ['title' => 'Complete Automation Systems', 'description' => 'Upgrade your facility with fully integrated automation systems designed for reliability, efficiency, and long-term performance.'],
                    ['title' => 'Machines fabrication', 'description' => 'Custom-made machine fabrication tailored to your operational needs—built for durability, efficiency, and seamless integration into your production line.'],
                    ['title' => 'Machine Installations', 'description' => 'Complete installation and commissioning of industrial machines with precise alignment, safety compliance, and reliable performance from day one.'],
                    ['title' => 'PLC Programming', 'description' => 'Custom PLC solutions that keep your machines running smoothly, safely, and with precise control.'],
                    ['title' => 'HMI & SCADA Designing and Programming', 'description' => 'Interactive, real-time monitoring and control interfaces for seamless plant operation.'],
                    ['title' => 'VFD, Servo, Stepper & DC Drive Programming', 'description' => 'Optimize motor performance with expert drive tuning and programming for any application.'],
                    ['title' => 'Robot Arm Configuration and Programming', 'description' => 'Professional setup, calibration, and programming of robotic arms for automated workflows.'],
                    ['title' => 'Motor Control Panels', 'description' => 'Robust, safety-compliant control panels designed to deliver consistent motor performance.'],
                    ['title' => 'Troubleshooting, Upgrades & Modifications', 'description' => 'Fast fault diagnosis, repairs, and performance improvements for existing systems.'],
                    ['title' => 'Data Monitoring, Recording & Analytics Systems', 'description' => 'Smart data logging and analysis solutions for better decision-making and efficiency tracking.'],
                    ['title' => 'Vision System Integration', 'description' => 'Machine vision setups for accurate detection, quality inspection, and automation of visual tasks.'],
                ],
            ],
            [
                'title' => 'Electrical Power & Control Panels',
                'description' => 'All electrical panel design, fabrication, and power distribution systems.',
                'image_path' => '/services/electrical_panels.png',
                'slug' => 'electrical-power-and-control-panels',
                'sort_order' => 2,
                'items' => [
                    ['title' => 'Electrical Power Panel Designing & Fabrication', 'description' => 'Custom-built panels engineered to meet your power requirements and industry standards.'],
                    ['title' => 'Electrical Distribution Panels', 'description' => 'Safe and organized distribution of power across your facility with high-quality components.'],
                    ['title' => 'ATS (Automatic Transfer Switch) Panels', 'description' => 'Automatic and manual transfer switch panels for uninterrupted power during outages.'],
                    ['title' => 'MTS (Manual Transfer Switch) Panels', 'description' => 'Reliable manual switching solutions for power management.'],
                    ['title' => 'Fire Pump Panels (Duty + Standby)', 'description' => 'Dedicated panels ensuring reliable fire pump operation in emergency conditions.'],
                    ['title' => 'Capacitor Bank Panels', 'description' => 'Improve power factor and reduce energy costs with precisely engineered capacitor bank systems.'],
                    ['title' => 'Building wiring', 'description' => 'Safe, reliable, and standards-compliant electrical wiring for residential, commercial, and industrial buildings.'],
                    ['title' => 'Cable management systems', 'description' => 'Organized and efficient cable routing solutions that improve safety, reduce clutter, and ensure long-term maintainability of your electrical systems.'],
                ],
            ],
            [
                'title' => 'Renewable Energy Solutions',
                'description' => 'Everything related to sustainable power systems.',
                'image_path' => '/services/renewable_energy.png',
                'slug' => 'renewable-energy-solutions',
                'sort_order' => 3,
                'items' => [
                    ['title' => 'Off-Grid Solar Systems', 'description' => 'Independent solar setups that deliver reliable power in remote locations—day and night.'],
                    ['title' => 'Solar Water Pump Systems', 'description' => 'Energy-efficient solar pumping solutions for agriculture, irrigation, and rural applications.'],
                ],
            ],
            [
                'title' => 'Home Automation & Security',
                'description' => 'Smart home and residential solutions.',
                'image_path' => '/services/home_automation.png',
                'slug' => 'home-automation-and-security',
                'sort_order' => 4,
                'items' => [
                    ['title' => 'Smart Home Automation', 'description' => 'Control lighting, appliances, climate, and more—with complete automation and mobile access.'],
                    ['title' => 'Security System Installations (CCTV, Alarms, Access Control)', 'description' => 'Professional CCTV, alarm, and access control systems to protect what matters most.'],
                ],
            ],
            [
                'title' => 'Emergency Support',
                'description' => 'Our Warranty for you. 24/7 Emergency Service.',
                'image_path' => '/services/emergency_support.png',
                'slug' => 'emergency-support',
                'sort_order' => 5,
                'items' => [
                    ['title' => '24/7 Emergency Service', 'description' => 'Round-the-clock support for critical breakdowns and urgent repairs—anytime, anywhere.'],
                ],
            ],
        ];

        foreach ($services as $serviceData) {
            $items = $serviceData['items'];
            unset($serviceData['items']);

            $service = ServiceCategory::create($serviceData);

            foreach ($items as $index => $item) {
                $service->items()->create([
                    'title' => $item['title'],
                    'description' => $item['description'],
                    'sort_order' => $index,
                ]);
            }
        }

        $this->command->info('Services seeded successfully with ' . ServiceCategory::count() . ' categories.');
    }

    private function copyImages(): void
    {
        $sourceDir = base_path('../frontend-next/src/assets/services');
        $destDir = public_path('services');

        if (!File::isDirectory($destDir)) {
            File::makeDirectory($destDir, 0755, true);
        }

        $images = [
            'industrial_automation.png',
            'electrical_panels.png',
            'renewable_energy.png',
            'home_automation.png',
            'emergency_support.png',
        ];

        foreach ($images as $image) {
            $sourcePath = $sourceDir . '/' . $image;
            $destPath = $destDir . '/' . $image;

            if (File::exists($sourcePath) && !File::exists($destPath)) {
                File::copy($sourcePath, $destPath);
                $this->command->info("Copied: {$image}");
            }
        }
    }
}
