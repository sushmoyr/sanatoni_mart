<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class CouponController extends Controller
{
    /**
     * Display a listing of coupons
     */
    public function index(Request $request): Response
    {
        $query = Coupon::query();

        // Search functionality
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Sort by created date descending by default
        $query->orderBy('created_at', 'desc');

        $coupons = $query->paginate(15)->withQueryString();

        // Update expired coupons
        Coupon::chunk(100, function ($coupons) {
            foreach ($coupons as $coupon) {
                $coupon->updateStatus();
            }
        });

        // Statistics
        $stats = [
            'total' => Coupon::count(),
            'active' => Coupon::where('status', 'active')->count(),
            'expired' => Coupon::where('status', 'expired')->count(),
            'total_usage' => CouponUsage::count(),
            'total_discount_given' => CouponUsage::sum('discount_amount'),
        ];

        return Inertia::render('Admin/Coupons/Index', [
            'coupons' => $coupons,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'type']),
        ]);
    }

    /**
     * Show the form for creating a new coupon
     */
    public function create(): Response
    {
        $products = Product::select('id', 'name', 'price', 'sku', 'category_id')
            ->where('is_active', true)
            ->with(['category' => function ($query) {
                $query->select('id', 'name')->where('is_active', true);
            }])
            ->orderBy('name')
            ->get();

        $categories = Category::select('id', 'name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Coupons/Create', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created coupon
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'code' => 'required|string|max:50|unique:coupons,code',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'minimum_order_amount' => 'nullable|numeric|min:0',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
            'usage_limit' => 'nullable|integer|min:1',
            'per_customer_limit' => 'nullable|integer|min:1',
            'valid_from' => 'required|date',
            'valid_until' => 'nullable|date|after:valid_from',
        ]);

        // Additional validation for percentage type
        if ($validated['type'] === 'percentage' && $validated['value'] > 100) {
            return back()->withErrors(['value' => 'Percentage discount cannot exceed 100%']);
        }

        $coupon = Coupon::create([
            ...$validated,
            'code' => strtoupper($validated['code']),
            'used_count' => 0,
        ]);

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Coupon created successfully!');
    }

    /**
     * Display the specified coupon
     */
    public function show(Coupon $coupon): Response
    {
        $coupon->load(['usages.user', 'usages.order']);

        // Analytics
        $analytics = [
            'usage_percentage' => $coupon->usage_limit 
                ? ($coupon->used_count / $coupon->usage_limit) * 100 
                : null,
            'total_discount_given' => $coupon->usages->sum('discount_amount'),
            'average_discount' => $coupon->usages->avg('discount_amount') ?? 0,
            'unique_customers' => $coupon->usages->whereNotNull('user_id')->unique('user_id')->count(),
            'is_valid' => $coupon->isValid(),
        ];

        // Recent usage
        $recentUsage = $coupon->usages()
            ->with(['user:id,name,email', 'order:id,order_number,total'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Coupons/Show', [
            'coupon' => $coupon,
            'analytics' => $analytics,
            'recentUsage' => $recentUsage,
        ]);
    }

    /**
     * Show the form for editing the specified coupon
     */
    public function edit(Coupon $coupon): Response
    {
        $products = Product::select('id', 'name', 'price', 'sku', 'category_id')
            ->where('is_active', true)
            ->with(['category' => function ($query) {
                $query->select('id', 'name')->where('is_active', true);
            }])
            ->orderBy('name')
            ->get();

        $categories = Category::select('id', 'name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Coupons/Edit', [
            'coupon' => $coupon,
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified coupon
     */
    public function update(Request $request, Coupon $coupon): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'code' => ['required', 'string', 'max:50', Rule::unique('coupons')->ignore($coupon->id)],
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'minimum_order_amount' => 'nullable|numeric|min:0',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
            'usage_limit' => 'nullable|integer|min:1',
            'per_customer_limit' => 'nullable|integer|min:1',
            'valid_from' => 'required|date',
            'valid_until' => 'nullable|date|after:valid_from',
        ]);

        // Additional validation for percentage type
        if ($validated['type'] === 'percentage' && $validated['value'] > 100) {
            return back()->withErrors(['value' => 'Percentage discount cannot exceed 100%']);
        }

        // Don't allow changing usage_limit below current used_count
        if ($validated['usage_limit'] && $validated['usage_limit'] < $coupon->used_count) {
            return back()->withErrors(['usage_limit' => 'Usage limit cannot be less than current usage count.']);
        }

        $coupon->update([
            ...$validated,
            'code' => strtoupper($validated['code']),
        ]);

        $coupon->updateStatus();

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Coupon updated successfully!');
    }

    /**
     * Remove the specified coupon
     */
    public function destroy(Coupon $coupon): RedirectResponse
    {
        // Don't allow deletion if coupon has been used
        if ($coupon->used_count > 0) {
            return back()->with('error', 'Cannot delete coupon that has been used.');
        }

        $coupon->delete();

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Coupon deleted successfully!');
    }

    /**
     * Toggle coupon status
     */
    public function toggleStatus(Coupon $coupon): RedirectResponse
    {
        $newStatus = $coupon->status === 'active' ? 'inactive' : 'active';
        
        // Validate that we can activate the coupon
        if ($newStatus === 'active') {
            if ($coupon->valid_until && $coupon->valid_until->isPast()) {
                return back()->with('error', 'Cannot activate expired coupon.');
            }
            if ($coupon->usage_limit && $coupon->used_count >= $coupon->usage_limit) {
                return back()->with('error', 'Cannot activate coupon that has reached usage limit.');
            }
        }

        $coupon->update(['status' => $newStatus]);

        $message = $newStatus === 'active' 
            ? 'Coupon activated successfully!' 
            : 'Coupon deactivated successfully!';

        return back()->with('success', $message);
    }

    /**
     * Validate coupon code (API endpoint)
     */
    public function validateCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'user_id' => 'nullable|exists:users,id',
            'customer_email' => 'nullable|email',
            'order_total' => 'required|numeric|min:0',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id',
        ]);

        $coupon = Coupon::where('code', strtoupper($request->code))->first();

        if (!$coupon) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid coupon code.',
            ], 404);
        }

        if (!$coupon->isValid()) {
            return response()->json([
                'valid' => false,
                'message' => 'This coupon is not valid or has expired.',
            ]);
        }

        if (!$coupon->canBeUsedBy($request->user_id, $request->customer_email)) {
            return response()->json([
                'valid' => false,
                'message' => 'You have reached the usage limit for this coupon.',
            ]);
        }

        // Check product/category restrictions
        if ($request->product_ids) {
            $productCategoryIds = Product::whereIn('id', $request->product_ids)
                ->pluck('category_id')
                ->toArray();

            if (!$coupon->appliesToProducts($request->product_ids) && 
                !$coupon->appliesToCategories($productCategoryIds)) {
                return response()->json([
                    'valid' => false,
                    'message' => 'This coupon is not applicable to the selected products.',
                ]);
            }
        }

        $discountAmount = $coupon->calculateDiscount($request->order_total);

        return response()->json([
            'valid' => true,
            'coupon' => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'name' => $coupon->name,
                'type' => $coupon->type,
                'value' => $coupon->value,
                'discount_amount' => $discountAmount,
            ],
            'message' => 'Coupon is valid!',
        ]);
    }

    /**
     * Generate unique coupon code
     */
    public function generateCode(Request $request)
    {
        $prefix = $request->get('prefix', 'COUP');
        $code = Coupon::generateCode($prefix);

        return response()->json(['code' => $code]);
    }
}
