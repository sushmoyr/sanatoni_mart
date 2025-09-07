<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            // User Management
            ['name' => 'view_users', 'display_name' => 'View Users', 'description' => 'Can view user list and details', 'group' => 'users'],
            ['name' => 'create_users', 'display_name' => 'Create Users', 'description' => 'Can create new users', 'group' => 'users'],
            ['name' => 'edit_users', 'display_name' => 'Edit Users', 'description' => 'Can edit user information', 'group' => 'users'],
            ['name' => 'delete_users', 'display_name' => 'Delete Users', 'description' => 'Can delete users', 'group' => 'users'],
            ['name' => 'manage_user_roles', 'display_name' => 'Manage User Roles', 'description' => 'Can assign/remove roles from users', 'group' => 'users'],

            // Product Management
            ['name' => 'view_products', 'display_name' => 'View Products', 'description' => 'Can view product list and details', 'group' => 'products'],
            ['name' => 'create_products', 'display_name' => 'Create Products', 'description' => 'Can create new products', 'group' => 'products'],
            ['name' => 'edit_products', 'display_name' => 'Edit Products', 'description' => 'Can edit product information', 'group' => 'products'],
            ['name' => 'delete_products', 'display_name' => 'Delete Products', 'description' => 'Can delete products', 'group' => 'products'],
            ['name' => 'manage_inventory', 'display_name' => 'Manage Inventory', 'description' => 'Can manage product inventory', 'group' => 'products'],

            // Category Management
            ['name' => 'view_categories', 'display_name' => 'View Categories', 'description' => 'Can view category list and details', 'group' => 'categories'],
            ['name' => 'create_categories', 'display_name' => 'Create Categories', 'description' => 'Can create new categories', 'group' => 'categories'],
            ['name' => 'edit_categories', 'display_name' => 'Edit Categories', 'description' => 'Can edit category information', 'group' => 'categories'],
            ['name' => 'delete_categories', 'display_name' => 'Delete Categories', 'description' => 'Can delete categories', 'group' => 'categories'],

            // Order Management
            ['name' => 'view_orders', 'display_name' => 'View Orders', 'description' => 'Can view order list and details', 'group' => 'orders'],
            ['name' => 'create_orders', 'display_name' => 'Create Orders', 'description' => 'Can create new orders', 'group' => 'orders'],
            ['name' => 'edit_orders', 'display_name' => 'Edit Orders', 'description' => 'Can edit order information', 'group' => 'orders'],
            ['name' => 'delete_orders', 'display_name' => 'Delete Orders', 'description' => 'Can delete orders', 'group' => 'orders'],
            ['name' => 'process_orders', 'display_name' => 'Process Orders', 'description' => 'Can update order status and process orders', 'group' => 'orders'],

            // Customer Management
            ['name' => 'view_customers', 'display_name' => 'View Customers', 'description' => 'Can view customer list and details', 'group' => 'customers'],
            ['name' => 'edit_customers', 'display_name' => 'Edit Customers', 'description' => 'Can edit customer information', 'group' => 'customers'],
            ['name' => 'delete_customers', 'display_name' => 'Delete Customers', 'description' => 'Can delete customers', 'group' => 'customers'],

            // Content Management
            ['name' => 'view_content', 'display_name' => 'View Content', 'description' => 'Can view pages and content', 'group' => 'content'],
            ['name' => 'create_content', 'display_name' => 'Create Content', 'description' => 'Can create new pages and content', 'group' => 'content'],
            ['name' => 'edit_content', 'display_name' => 'Edit Content', 'description' => 'Can edit pages and content', 'group' => 'content'],
            ['name' => 'delete_content', 'display_name' => 'Delete Content', 'description' => 'Can delete pages and content', 'group' => 'content'],

            // Blog Management
            ['name' => 'view_blog', 'display_name' => 'View Blog', 'description' => 'Can view blog posts', 'group' => 'blog'],
            ['name' => 'create_blog', 'display_name' => 'Create Blog Posts', 'description' => 'Can create new blog posts', 'group' => 'blog'],
            ['name' => 'edit_blog', 'display_name' => 'Edit Blog Posts', 'description' => 'Can edit blog posts', 'group' => 'blog'],
            ['name' => 'delete_blog', 'display_name' => 'Delete Blog Posts', 'description' => 'Can delete blog posts', 'group' => 'blog'],

            // Promotion Management
            ['name' => 'view_promotions', 'display_name' => 'View Promotions', 'description' => 'Can view promotions and discounts', 'group' => 'promotions'],
            ['name' => 'create_promotions', 'display_name' => 'Create Promotions', 'description' => 'Can create new promotions and discounts', 'group' => 'promotions'],
            ['name' => 'edit_promotions', 'display_name' => 'Edit Promotions', 'description' => 'Can edit promotions and discounts', 'group' => 'promotions'],
            ['name' => 'delete_promotions', 'display_name' => 'Delete Promotions', 'description' => 'Can delete promotions and discounts', 'group' => 'promotions'],

            // Newsletter Management
            ['name' => 'view_newsletter', 'display_name' => 'View Newsletter', 'description' => 'Can view newsletter subscribers and campaigns', 'group' => 'newsletter'],
            ['name' => 'create_newsletter', 'display_name' => 'Create Newsletter', 'description' => 'Can create and send newsletters', 'group' => 'newsletter'],
            ['name' => 'edit_newsletter', 'display_name' => 'Edit Newsletter', 'description' => 'Can edit newsletter content and settings', 'group' => 'newsletter'],
            ['name' => 'delete_newsletter', 'display_name' => 'Delete Newsletter', 'description' => 'Can delete newsletter campaigns', 'group' => 'newsletter'],

            // Reports and Analytics
            ['name' => 'view_reports', 'display_name' => 'View Reports', 'description' => 'Can view reports and analytics', 'group' => 'reports'],
            ['name' => 'export_data', 'display_name' => 'Export Data', 'description' => 'Can export data and reports', 'group' => 'reports'],

            // System Settings
            ['name' => 'view_settings', 'display_name' => 'View Settings', 'description' => 'Can view system settings', 'group' => 'settings'],
            ['name' => 'edit_settings', 'display_name' => 'Edit Settings', 'description' => 'Can edit system settings', 'group' => 'settings'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name']],
                $permission
            );
        }

        // Create roles
        $roles = [
            [
                'name' => 'admin',
                'display_name' => 'Administrator',
                'description' => 'Full system access with all permissions',
                'is_active' => true,
            ],
            [
                'name' => 'manager',
                'display_name' => 'Manager',
                'description' => 'Management access for products, orders, and customers',
                'is_active' => true,
            ],
            [
                'name' => 'salesperson',
                'display_name' => 'Salesperson',
                'description' => 'Limited access for order processing and customer service',
                'is_active' => true,
            ],
        ];

        foreach ($roles as $roleData) {
            $role = Role::firstOrCreate(
                ['name' => $roleData['name']],
                $roleData
            );

            // Assign permissions to roles
            switch ($roleData['name']) {
                case 'admin':
                    // Admin gets all permissions
                    $role->syncPermissions(Permission::all());
                    break;

                case 'manager':
                    // Manager gets product, category, order, customer, content, blog, promotion, newsletter management
                    $managerPermissions = Permission::whereIn('group', [
                        'products', 'categories', 'orders', 'customers', 
                        'content', 'blog', 'promotions', 'newsletter', 'reports'
                    ])->get();
                    $role->syncPermissions($managerPermissions);
                    break;

                case 'salesperson':
                    // Salesperson gets limited order and customer management
                    $salespersonPermissions = Permission::whereIn('name', [
                        'view_orders', 'edit_orders', 'process_orders',
                        'view_customers', 'edit_customers',
                        'view_products', 'view_categories',
                        'view_reports'
                    ])->get();
                    $role->syncPermissions($salespersonPermissions);
                    break;
            }
        }

        $this->command->info('Roles and permissions seeded successfully!');
    }
}
