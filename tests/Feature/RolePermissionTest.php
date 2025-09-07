<?php

use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(\Database\Seeders\DatabaseSeeder::class);
});

test('roles can be created and assigned permissions', function () {
    $role = Role::create([
        'name' => 'test_role',
        'display_name' => 'Test Role',
        'description' => 'A test role',
    ]);

    $permission = Permission::create([
        'name' => 'test_permission',
        'display_name' => 'Test Permission',
        'description' => 'A test permission',
        'group' => 'test',
    ]);

    $role->givePermissionTo($permission);

    expect($role->hasPermission('test_permission'))->toBeTrue();
});

test('users can be assigned roles', function () {
    $user = User::factory()->create();
    $role = Role::factory()->create([
        'name' => 'test_role',
        'display_name' => 'Test Role',
    ]);

    $user->assignRole($role);

    expect($user->hasRole('test_role'))->toBeTrue();
});

test('users inherit permissions from roles', function () {
    $user = User::factory()->create();
    
    $role = Role::create([
        'name' => 'test_role',
        'display_name' => 'Test Role',
    ]);

    $permission = Permission::create([
        'name' => 'test_permission',
        'display_name' => 'Test Permission',
        'group' => 'test',
    ]);

    $role->givePermissionTo($permission);
    $user->assignRole($role);

    expect($user->hasPermission('test_permission'))->toBeTrue();
});

test('admin users have admin access', function () {
    $user = User::factory()->create();
    $adminRole = Role::where('name', 'admin')->first();
    
    $user->assignRole($adminRole);

    expect($user->isAdmin())->toBeTrue();
    expect($user->hasAdminAccess())->toBeTrue();
});

test('manager users have admin access', function () {
    $user = User::factory()->create();
    $managerRole = Role::where('name', 'manager')->first();
    
    $user->assignRole($managerRole);

    expect($user->isManager())->toBeTrue();
    expect($user->hasAdminAccess())->toBeTrue();
});

test('salesperson users do not have admin access', function () {
    $user = User::factory()->create();
    $salespersonRole = Role::where('name', 'salesperson')->first();
    
    $user->assignRole($salespersonRole);

    expect($user->isSalesperson())->toBeTrue();
    expect($user->hasAdminAccess())->toBeFalse();
});

test('role middleware blocks unauthorized access', function () {
    $user = User::factory()->create();
    
    // Test without any roles
    $this->actingAs($user)
         ->get('/admin/dashboard')
         ->assertStatus(403);
});

test('admin can access admin dashboard', function () {
    $admin = User::where('email', 'admin@sanatonimart.com')->first();
    
    $this->actingAs($admin)
         ->get('/admin/dashboard')
         ->assertStatus(200);
});

test('manager can access admin dashboard', function () {
    $manager = User::where('email', 'manager@sanatonimart.com')->first();
    
    $this->actingAs($manager)
         ->get('/admin/dashboard')
         ->assertStatus(200);
});

test('users are redirected based on role after login', function () {
    $admin = User::where('email', 'admin@sanatonimart.com')->first();
    
    $response = $this->post('/login', [
        'email' => 'admin@sanatonimart.com',
        'password' => 'password',
    ]);

    $response->assertRedirect('/admin/dashboard');
});
