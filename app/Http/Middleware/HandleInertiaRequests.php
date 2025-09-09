<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'profile_picture' => $user->profile_picture,
                    'status' => $user->status,
                    'last_login_at' => $user->last_login_at,
                    'email_verified_at' => $user->email_verified_at,
                    'roles' => $user->roles()->with('permissions')->get()->map(function ($role) {
                        return [
                            'id' => $role->id,
                            'name' => $role->name,
                            'display_name' => $role->display_name,
                            'description' => $role->description,
                            'permissions' => $role->permissions->pluck('name')->toArray(),
                        ];
                    }),
                    'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
                    'is_admin' => $user->isAdmin(),
                    'is_manager' => $user->isManager(),
                    'is_salesperson' => $user->isSalesperson(),
                    'has_admin_access' => $user->hasAdminAccess(),
                ] : null,
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'locale' => app()->getLocale(),
            'translations' => $this->getTranslations(),
            'available_languages' => config('locale.supported', []),
            'supported_locales' => array_keys(config('locale.supported', [])),
        ];
    }

    /**
     * Get translations for the current locale
     */
    private function getTranslations(): array
    {
        return app(\App\Services\TranslationService::class)->getAllGrouped();
    }
}
