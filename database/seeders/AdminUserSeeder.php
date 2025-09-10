<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = \App\Models\User::updateOrCreate(
            ['email' => 'admin@sanatonimart.com'],
            [
                'name' => 'Admin User',
                'email' => 'admin@sanatonimart.com',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'email_verified_at' => now(),
                'status' => 'active',
            ]
        );

        // Assign admin role
        $adminRole = \App\Models\Role::where('name', 'admin')->first();
        if ($adminRole) {
            $user->assignRole($adminRole);
        }

        echo "Admin user created: admin@sanatonimart.com / password123\n";
    }
}
