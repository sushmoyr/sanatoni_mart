<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingZone;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ShippingZoneController extends Controller
{
    /**
     * Display a listing of shipping zones
     */
    public function index(Request $request)
    {
        $query = ShippingZone::query();

        // Search functionality
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        // Filter by status
        if ($request->status !== null) {
            $query->where('is_active', $request->status === 'active');
        }

        $shippingZones = $query->orderBy('name')->paginate(15);

        return Inertia::render('Admin/ShippingZones/Index', [
            'shippingZones' => $shippingZones,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
            ],
        ]);
    }

    /**
     * Show the form for creating a new shipping zone
     */
    public function create()
    {
        return Inertia::render('Admin/ShippingZones/Create');
    }

    /**
     * Store a newly created shipping zone
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:shipping_zones',
            'description' => 'nullable|string|max:1000',
            'areas' => 'required|array|min:1',
            'areas.*' => 'required|string|max:255',
            'shipping_cost' => 'required|numeric|min:0|max:99999.99',
            'delivery_time_min' => 'required|integer|min:1|max:365',
            'delivery_time_max' => 'required|integer|min:1|max:365|gte:delivery_time_min',
            'is_active' => 'boolean',
        ]);

        // Clean and format areas
        $validated['areas'] = array_map('trim', array_filter($validated['areas']));
        $validated['is_active'] = $validated['is_active'] ?? true;

        ShippingZone::create($validated);

        return redirect()->route('admin.shipping-zones.index')->with([
            'flash' => [
                'type' => 'success',
                'message' => 'Shipping zone created successfully.'
            ]
        ]);
    }

    /**
     * Display the specified shipping zone
     */
    public function show(ShippingZone $shippingZone)
    {
        return Inertia::render('Admin/ShippingZones/Show', [
            'shippingZone' => $shippingZone,
        ]);
    }

    /**
     * Show the form for editing the specified shipping zone
     */
    public function edit(ShippingZone $shippingZone)
    {
        return Inertia::render('Admin/ShippingZones/Edit', [
            'shippingZone' => $shippingZone,
        ]);
    }

    /**
     * Update the specified shipping zone
     */
    public function update(Request $request, ShippingZone $shippingZone)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('shipping_zones')->ignore($shippingZone->id)],
            'description' => 'nullable|string|max:1000',
            'areas' => 'required|array|min:1',
            'areas.*' => 'required|string|max:255',
            'shipping_cost' => 'required|numeric|min:0|max:99999.99',
            'delivery_time_min' => 'required|integer|min:1|max:365',
            'delivery_time_max' => 'required|integer|min:1|max:365|gte:delivery_time_min',
            'is_active' => 'boolean',
        ]);

        // Clean and format areas
        $validated['areas'] = array_map('trim', array_filter($validated['areas']));
        $validated['is_active'] = $validated['is_active'] ?? false;

        $shippingZone->update($validated);

        return redirect()->route('admin.shipping-zones.index')->with([
            'flash' => [
                'type' => 'success',
                'message' => 'Shipping zone updated successfully.'
            ]
        ]);
    }

    /**
     * Remove the specified shipping zone
     */
    public function destroy(ShippingZone $shippingZone)
    {
        // Check if zone is being used by any orders
        $ordersCount = \App\Models\Order::whereJsonContains('shipping_address->zone_id', $shippingZone->id)->count();
        
        if ($ordersCount > 0) {
            return back()->with([
                'flash' => [
                    'type' => 'error',
                    'message' => "Cannot delete shipping zone. It is being used by {$ordersCount} order(s)."
                ]
            ]);
        }

        $zoneName = $shippingZone->name;
        $shippingZone->delete();

        return redirect()->route('admin.shipping-zones.index')->with([
            'flash' => [
                'type' => 'success',
                'message' => "Shipping zone '{$zoneName}' has been deleted."
            ]
        ]);
    }

    /**
     * Toggle shipping zone status
     */
    public function toggleStatus(ShippingZone $shippingZone)
    {
        $shippingZone->update([
            'is_active' => !$shippingZone->is_active
        ]);

        $status = $shippingZone->is_active ? 'activated' : 'deactivated';

        return back()->with([
            'flash' => [
                'type' => 'success',
                'message' => "Shipping zone '{$shippingZone->name}' has been {$status}."
            ]
        ]);
    }

    /**
     * Test shipping zone area matching
     */
    public function testArea(Request $request)
    {
        $request->validate([
            'test_address' => 'required|string|max:255',
        ]);

        $testAddress = ['city' => $request->test_address];
        $matchedZone = ShippingZone::findForAddress($testAddress);

        return response()->json([
            'matched_zone' => $matchedZone ? [
                'id' => $matchedZone->id,
                'name' => $matchedZone->name,
                'shipping_cost' => $matchedZone->shipping_cost,
                'delivery_time_range' => $matchedZone->delivery_time_range,
            ] : null,
            'test_address' => $request->test_address,
        ]);
    }
}
