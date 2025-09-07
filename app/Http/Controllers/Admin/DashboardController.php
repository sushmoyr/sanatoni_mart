<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Basic dashboard statistics
        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('status', 'active')->count(),
            'admin_users' => User::whereHas('roles', function ($query) {
                $query->where('name', 'admin');
            })->count(),
            'manager_users' => User::whereHas('roles', function ($query) {
                $query->where('name', 'manager');
            })->count(),
            'salesperson_users' => User::whereHas('roles', function ($query) {
                $query->where('name', 'salesperson');
            })->count(),
        ];

        // Recent users
        $recent_users = User::with('roles')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'status' => $user->status,
                    'roles' => $user->roles->pluck('display_name')->toArray(),
                    'created_at' => $user->created_at,
                    'last_login_at' => $user->last_login_at,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recent_users' => $recent_users,
            'user_permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
        ]);
    }
}
