<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display customer dashboard
     */
    public function index()
    {
        $user = auth()->user();
        
        // Get dashboard statistics
        $stats = [
            'orders' => 0, // TODO: Implement when orders are created
            'wishlist_count' => $user->wishlists()->count(),
            'cart_count' => $user->cartItems()->sum('quantity'),
            'addresses_count' => $user->addresses()->count(),
        ];

        // Get recent activities
        $recentWishlist = $user->wishlists()
            ->with(['product.images'])
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('Customer/Dashboard', [
            'stats' => $stats,
            'recentWishlist' => $recentWishlist,
        ]);
    }

    /**
     * Show customer profile
     */
    public function show()
    {
        return Inertia::render('Customer/Profile/Show', [
            'user' => auth()->user()
        ]);
    }

    /**
     * Show customer profile edit form
     */
    public function edit()
    {
        return Inertia::render('Customer/Profile/Edit', [
            'user' => auth()->user()
        ]);
    }

    /**
     * Update customer profile
     */
    public function update(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'preferences' => 'nullable|array',
        ]);

        $userData = $request->only(['name', 'email', 'phone', 'preferences']);

        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            // Delete old profile picture if exists
            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }

            // Store new profile picture
            $profilePicturePath = $request->file('profile_picture')->store('profile-pictures', 'public');
            $userData['profile_picture'] = $profilePicturePath;
        }

        $user->update($userData);

        return redirect()->route('customer.profile.show')
            ->with('success', 'Profile updated successfully.');
    }

    /**
     * Delete profile picture
     */
    public function deleteProfilePicture()
    {
        $user = auth()->user();

        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
            $user->update(['profile_picture' => null]);
        }

        return response()->json([
            'message' => 'Profile picture deleted successfully.'
        ]);
    }

    /**
     * Show account settings
     */
    public function settings()
    {
        return Inertia::render('Customer/Settings', [
            'user' => auth()->user()
        ]);
    }

    /**
     * Update account settings
     */
    public function updateSettings(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'preferences' => 'nullable|array',
            'preferences.newsletter' => 'boolean',
            'preferences.notifications' => 'boolean',
            'preferences.language' => 'string|in:en,bn',
        ]);

        $preferences = array_merge($user->preferences ?? [], $request->preferences ?? []);
        
        $user->update(['preferences' => $preferences]);

        return response()->json([
            'message' => 'Settings updated successfully.',
            'preferences' => $preferences
        ]);
    }

    /**
     * Deactivate account
     */
    public function deactivate(Request $request)
    {
        $request->validate([
            'password' => 'required|current_password'
        ]);

        $user = auth()->user();
        $user->update(['status' => 'inactive']);
        
        auth()->logout();

        return redirect()->route('login')
            ->with('message', 'Your account has been deactivated successfully.');
    }

    /**
     * Delete account permanently
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'password' => 'required|current_password'
        ]);

        $user = auth()->user();

        // Delete profile picture if exists
        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        // Logout and delete user
        auth()->logout();
        $user->delete();

        return redirect()->route('welcome')
            ->with('message', 'Your account has been deleted successfully.');
    }
}
