<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles and permissions first
        $this->call([
            RolesAndPermissionsSeeder::class,
        ]);

        // Create default admin user
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@sanatonimart.com',
            'status' => 'active',
        ]);

        // Assign admin role
        $admin->assignRole('admin');

        // Create test manager user
        $manager = User::factory()->create([
            'name' => 'Manager User',
            'email' => 'manager@sanatonimart.com',
            'status' => 'active',
        ]);

        // Assign manager role
        $manager->assignRole('manager');

        // Create test salesperson user
        $salesperson = User::factory()->create([
            'name' => 'Salesperson User',
            'email' => 'salesperson@sanatonimart.com',
            'status' => 'active',
        ]);

        // Assign salesperson role
        $salesperson->assignRole('salesperson');

        // Create regular test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'status' => 'active',
        ]);
    }
}
