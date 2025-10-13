<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$status = $kernel->call('migrate:fresh', ['--seed' => true, '--force' => true]);

echo "\nMigrations completed with status: " . $status . "\n";

// Create admin user
echo "\nCreating admin user...\n";
$app->make(App\Models\User::class);

$admin = App\Models\User::updateOrCreate(
    ['email' => 'admin@sanatonimart.com'],
    [
        'name' => 'Admin User',
        'password' => bcrypt('admin123'),
        'status' => 'active',
    ]
);

$adminRole = App\Models\Role::where('name', 'admin')->first();
if ($adminRole) {
    $admin->roles()->syncWithoutDetaching([$adminRole->id]);
}

echo "Admin user created/updated successfully!\n";
echo "Email: admin@sanatonimart.com\n";
echo "Password: admin123\n";
