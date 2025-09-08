<?php

namespace App\Http\Controllers;

use App\Models\CustomerAddress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AddressController extends Controller
{
    /**
     * Display user's addresses
     */
    public function index()
    {
        $addresses = auth()->user()->addresses()
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Customer/Addresses/Index', [
            'addresses' => $addresses
        ]);
    }

    /**
     * Show the form for creating a new address
     */
    public function create()
    {
        return Inertia::render('Customer/Addresses/Create');
    }

    /**
     * Store a newly created address
     */
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:home,work,other',
            'name' => 'nullable|string|max:255',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:255',
            'is_default' => 'boolean'
        ]);

        $address = auth()->user()->addresses()->create($request->all());

        return redirect()->route('addresses.index')
            ->with('success', 'Address added successfully.');
    }

    /**
     * Display the specified address
     */
    public function show(CustomerAddress $address)
    {
        // Ensure the address belongs to the authenticated user
        if ($address->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action');
        }

        return Inertia::render('Customer/Addresses/Show', [
            'address' => $address
        ]);
    }

    /**
     * Show the form for editing the specified address
     */
    public function edit(CustomerAddress $address)
    {
        // Ensure the address belongs to the authenticated user
        if ($address->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action');
        }

        return Inertia::render('Customer/Addresses/Edit', [
            'address' => $address
        ]);
    }

    /**
     * Update the specified address
     */
    public function update(Request $request, CustomerAddress $address)
    {
        // Ensure the address belongs to the authenticated user
        if ($address->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action');
        }

        $request->validate([
            'type' => 'required|in:home,work,other',
            'name' => 'nullable|string|max:255',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:255',
            'is_default' => 'boolean'
        ]);

        $address->update($request->all());

        return redirect()->route('addresses.index')
            ->with('success', 'Address updated successfully.');
    }

    /**
     * Remove the specified address
     */
    public function destroy(CustomerAddress $address)
    {
        // Ensure the address belongs to the authenticated user
        if ($address->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action');
        }

        // Prevent deletion of default address if user has multiple addresses
        if ($address->is_default && auth()->user()->addresses()->count() > 1) {
            return response()->json([
                'message' => 'Cannot delete default address. Please set another address as default first.'
            ], 422);
        }

        $address->delete();

        return response()->json([
            'message' => 'Address deleted successfully.'
        ]);
    }

    /**
     * Set address as default
     */
    public function setDefault(CustomerAddress $address)
    {
        // Ensure the address belongs to the authenticated user
        if ($address->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action');
        }

        $address->update(['is_default' => true]);

        return response()->json([
            'message' => 'Default address updated successfully.'
        ]);
    }
}
