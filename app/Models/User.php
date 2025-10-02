<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'profile_picture',
        'status',
        'last_login_at',
        'last_login_ip',
        'preferences',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_login_at' => 'datetime',
            'preferences' => 'array',
        ];
    }

    /**
     * Get the roles for the user.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles')
                    ->withPivot('assigned_at', 'assigned_by')
                    ->withTimestamps();
    }

    /**
     * Check if user has a specific role.
     */
    public function hasRole(string|array $roles): bool
    {
        if (is_string($roles)) {
            return $this->roles()->where('name', $roles)->exists();
        }

        return $this->roles()->whereIn('name', $roles)->exists();
    }

    /**
     * Check if user has any of the specified roles.
     */
    public function hasAnyRole(array $roles): bool
    {
        return $this->roles()->whereIn('name', $roles)->exists();
    }

    /**
     * Check if user has all of the specified roles.
     */
    public function hasAllRoles(array $roles): bool
    {
        $userRoles = $this->roles()->pluck('name')->toArray();
        return empty(array_diff($roles, $userRoles));
    }

    /**
     * Check if user has a specific permission.
     */
    public function hasPermission(string $permission): bool
    {
        return $this->roles()
                   ->whereHas('permissions', function ($query) use ($permission) {
                       $query->where('name', $permission);
                   })->exists();
    }

    /**
     * Check if user has any of the specified permissions.
     */
    public function hasAnyPermission(array $permissions): bool
    {
        return $this->roles()
                   ->whereHas('permissions', function ($query) use ($permissions) {
                       $query->whereIn('name', $permissions);
                   })->exists();
    }

    /**
     * Assign role to user.
     */
    public function assignRole(Role|string $role, ?User $assignedBy = null): static
    {
        if (is_string($role)) {
            $role = Role::where('name', $role)->firstOrFail();
        }

        $pivotData = ['assigned_at' => now()];
        if ($assignedBy) {
            $pivotData['assigned_by'] = $assignedBy->id;
        }

        $this->roles()->syncWithoutDetaching([$role->id => $pivotData]);

        return $this;
    }

    /**
     * Remove role from user.
     */
    public function removeRole(Role|string $role): static
    {
        if (is_string($role)) {
            $role = Role::where('name', $role)->firstOrFail();
        }

        $this->roles()->detach($role->id);

        return $this;
    }

    /**
     * Sync roles for the user.
     */
    public function syncRoles(array $roles, ?User $assignedBy = null): static
    {
        $roleIds = [];
        $pivotData = ['assigned_at' => now()];
        
        if ($assignedBy) {
            $pivotData['assigned_by'] = $assignedBy->id;
        }

        foreach ($roles as $role) {
            if (is_string($role)) {
                $roleModel = Role::where('name', $role)->first();
                if ($roleModel) {
                    $roleIds[$roleModel->id] = $pivotData;
                }
            } elseif ($role instanceof Role) {
                $roleIds[$role->id] = $pivotData;
            }
        }

        $this->roles()->sync($roleIds);

        return $this;
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Check if user is manager.
     */
    public function isManager(): bool
    {
        return $this->hasRole('manager');
    }

    /**
     * Check if user is salesperson.
     */
    public function isSalesperson(): bool
    {
        return $this->hasRole('salesperson');
    }

    /**
     * Check if user has admin access (admin or manager).
     */
    public function hasAdminAccess(): bool
    {
        return $this->hasAnyRole(['admin', 'manager']);
    }

    /**
     * Get all permissions for the user through roles.
     */
    public function getAllPermissions()
    {
        return Permission::whereHas('roles', function ($query) {
            $query->whereIn('roles.id', $this->roles()->pluck('roles.id'));
        })->get();
    }

    /**
     * Update last login information.
     */
    public function updateLastLogin(?string $ipAddress = null): void
    {
        $this->update([
            'last_login_at' => now(),
            'last_login_ip' => $ipAddress ?? request()->ip(),
        ]);
    }

    /**
     * Customer addresses relationship
     */
    public function addresses()
    {
        return $this->hasMany(CustomerAddress::class);
    }

    /**
     * Default customer address
     */
    public function defaultAddress()
    {
        return $this->hasOne(CustomerAddress::class)->where('is_default', true);
    }

    /**
     * Wishlist items relationship
     */
    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    /**
     * Shopping cart items relationship
     */
    public function cartItems()
    {
        return $this->hasMany(ShoppingCart::class);
    }

    /**
     * Check if product is in user's wishlist
     */
    public function hasInWishlist(int $productId): bool
    {
        return $this->wishlists()->where('product_id', $productId)->exists();
    }

    /**
     * Check if product is in user's cart
     */
    public function hasInCart(int $productId): bool
    {
        return $this->cartItems()->where('product_id', $productId)->exists();
    }

    /**
     * Orders relationship
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Product reviews written by this user
     */
    public function productReviews()
    {
        return $this->hasMany(ProductReview::class);
    }

    /**
     * Review helpful votes made by this user
     */
    public function reviewHelpfulVotes()
    {
        return $this->hasMany(ReviewHelpfulVote::class);
    }
}
