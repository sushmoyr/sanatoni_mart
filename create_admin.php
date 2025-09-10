<?php

// Simple script to create admin user for testing
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    // Check if admin role exists
    $adminRole = Role::where('name', 'admin')->first();
    if (!$adminRole) {
        echo "Admin role not found. Please run: php artisan db:seed\n";
        exit(1);
    }

    // Create or update admin user
    $admin = User::updateOrCreate(
        ['email' => 'admin@sanatonimart.com'],
        [
            'name' => 'Admin User',
            'password' => Hash::make('admin123'),
            'email_verified_at' => now(),
            'status' => 'active'
        ]
    );

    // Assign admin role if not already assigned
    if (!$admin->hasRole('admin')) {
        $admin->roles()->sync([$adminRole->id]);
    }

    echo "Admin user created/updated successfully!\n";
    echo "Email: admin@sanatonimart.com\n";
    echo "Password: admin123\n";
    echo "You can now log in to the admin panel.\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
