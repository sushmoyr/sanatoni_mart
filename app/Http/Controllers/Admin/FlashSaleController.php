<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FlashSale;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class FlashSaleController extends Controller
{
    /**
     * Display a listing of flash sales
     */
    public function index(Request $request): Response
    {
        $query = FlashSale::query();

        // Search functionality
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Sort by start date descending by default
        $query->orderBy('start_date', 'desc');

        $flashSales = $query->paginate(15)->withQueryString();

        // Update status for all flash sales
        FlashSale::chunk(100, function ($sales) {
            foreach ($sales as $sale) {
                $sale->updateStatus();
            }
        });

        // Statistics
        $stats = [
            'total' => FlashSale::count(),
            'active' => FlashSale::where('status', 'active')->count(),
            'scheduled' => FlashSale::where('status', 'scheduled')->count(),
            'expired' => FlashSale::where('status', 'expired')->count(),
        ];

        return Inertia::render('Admin/FlashSales/Index', [
            'flashSales' => $flashSales,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new flash sale
     */
    public function create(): Response
    {
        $products = Product::select('id', 'name', 'price', 'sku')
            ->where('is_active', true)
            ->with(['category:id,name', 'images' => function ($query) {
                $query->where('is_primary', true);
            }])
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/FlashSales/Create', [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created flash sale
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'discount_percentage' => 'required|numeric|min:0|max:99.99',
            'product_ids' => 'required|array|min:1',
            'product_ids.*' => 'exists:products,id',
            'start_date' => 'required|date|after:now',
            'end_date' => 'required|date|after:start_date',
            'max_usage' => 'nullable|integer|min:1',
            'is_featured' => 'boolean',
        ]);

        // Set initial status based on start date
        $status = Carbon::parse($validated['start_date'])->isFuture() ? 'scheduled' : 'active';

        $flashSale = FlashSale::create([
            ...$validated,
            'status' => $status,
            'used_count' => 0,
        ]);

        return redirect()->route('admin.flash-sales.index')
            ->with('success', 'Flash sale created successfully!');
    }

    /**
     * Display the specified flash sale
     */
    public function show(FlashSale $flashSale): Response
    {
        $flashSale->load(['products' => function ($query) {
            $query->with(['category:id,name', 'images' => function ($q) {
                $q->where('is_primary', true);
            }]);
        }]);

        // Calculate analytics
        $analytics = [
            'time_remaining' => $flashSale->timeRemaining(),
            'usage_percentage' => $flashSale->max_usage 
                ? ($flashSale->used_count / $flashSale->max_usage) * 100 
                : null,
            'total_products' => count($flashSale->product_ids),
        ];

        return Inertia::render('Admin/FlashSales/Show', [
            'flashSale' => $flashSale,
            'analytics' => $analytics,
        ]);
    }

    /**
     * Show the form for editing the specified flash sale
     */
    public function edit(FlashSale $flashSale): Response
    {
        $products = Product::select('id', 'name', 'price', 'sku')
            ->where('is_active', true)
            ->with(['category:id,name', 'images' => function ($query) {
                $query->where('is_primary', true);
            }])
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/FlashSales/Edit', [
            'flashSale' => $flashSale,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified flash sale
     */
    public function update(Request $request, FlashSale $flashSale): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'discount_percentage' => 'required|numeric|min:0|max:99.99',
            'product_ids' => 'required|array|min:1',
            'product_ids.*' => 'exists:products,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'max_usage' => 'nullable|integer|min:1',
            'is_featured' => 'boolean',
        ]);

        // Don't allow changing start_date if sale is already active and has usage
        if ($flashSale->used_count > 0 && $flashSale->start_date->isPast()) {
            $validated['start_date'] = $flashSale->start_date;
        }

        $flashSale->update($validated);
        $flashSale->updateStatus();

        return redirect()->route('admin.flash-sales.index')
            ->with('success', 'Flash sale updated successfully!');
    }

    /**
     * Remove the specified flash sale
     */
    public function destroy(FlashSale $flashSale): RedirectResponse
    {
        // Don't allow deletion if sale has been used
        if ($flashSale->used_count > 0) {
            return back()->with('error', 'Cannot delete flash sale that has been used.');
        }

        $flashSale->delete();

        return redirect()->route('admin.flash-sales.index')
            ->with('success', 'Flash sale deleted successfully!');
    }

    /**
     * Toggle flash sale status
     */
    public function toggleStatus(FlashSale $flashSale): RedirectResponse
    {
        $newStatus = $flashSale->status === 'active' ? 'inactive' : 'active';
        
        // Validate that we can activate the sale
        if ($newStatus === 'active') {
            if ($flashSale->end_date->isPast()) {
                return back()->with('error', 'Cannot activate expired flash sale.');
            }
            if ($flashSale->max_usage && $flashSale->used_count >= $flashSale->max_usage) {
                return back()->with('error', 'Cannot activate flash sale that has reached usage limit.');
            }
        }

        $flashSale->update(['status' => $newStatus]);

        $message = $newStatus === 'active' 
            ? 'Flash sale activated successfully!' 
            : 'Flash sale deactivated successfully!';

        return back()->with('success', $message);
    }

    /**
     * Get active flash sales for API
     */
    public function getActive()
    {
        $activeFlashSales = FlashSale::active()
            ->with(['products' => function ($query) {
                $query->select('id', 'name', 'price', 'sku')
                    ->with(['images' => function ($q) {
                        $q->where('is_primary', true);
                    }]);
            }])
            ->get();

        return response()->json($activeFlashSales);
    }
}
