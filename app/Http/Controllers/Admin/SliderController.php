<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;

class SliderController extends Controller
{
    /**
     * Display a listing of sliders
     */
    public function index(Request $request): Response
    {
        $query = Slider::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('subtitle', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $status = $request->get('status');
            if ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // Sort
        $sortBy = $request->get('sort_by', 'sort_order');
        $sortDirection = $request->get('sort_direction', 'asc');
        $query->orderBy($sortBy, $sortDirection);

        $sliders = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Sliders/Index', [
            'sliders' => $sliders,
            'filters' => $request->only(['search', 'status', 'sort_by', 'sort_direction']),
        ]);
    }

    /**
     * Show the form for creating a new slider
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Sliders/Create');
    }

    /**
     * Store a newly created slider
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:255',
            'button_style' => 'nullable|in:primary,secondary,outline',
            'text_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'overlay_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'overlay_opacity' => 'nullable|integer|min:0|max:100',
            'text_position' => 'nullable|in:left,center,right',
            'text_alignment' => 'nullable|in:left,center,right',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->store('sliders', 'public');
            $validated['image_path'] = $imagePath;
        }

        // Remove the 'image' key as it's not in the database
        unset($validated['image']);

        $slider = Slider::create($validated);

        return redirect()->route('admin.sliders.index')
            ->with('success', 'Slider created successfully.');
    }

    /**
     * Display the specified slider
     */
    public function show(Slider $slider): Response
    {
        return Inertia::render('Admin/Sliders/Show', [
            'slider' => [
                'id' => $slider->id,
                'title' => $slider->title,
                'subtitle' => $slider->subtitle,
                'description' => $slider->description,
                'image_url' => $slider->image_url,
                'button_text' => $slider->button_text,
                'button_link' => $slider->button_link,
                'button_style' => $slider->button_style,
                'text_color' => $slider->text_color,
                'overlay_color' => $slider->overlay_color,
                'overlay_opacity' => $slider->overlay_opacity,
                'text_position' => $slider->text_position,
                'text_alignment' => $slider->text_alignment,
                'sort_order' => $slider->sort_order,
                'is_active' => $slider->is_active,
                'start_date' => $slider->start_date?->format('Y-m-d H:i:s'),
                'end_date' => $slider->end_date?->format('Y-m-d H:i:s'),
                'created_at' => $slider->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $slider->updated_at->format('Y-m-d H:i:s'),
            ]
        ]);
    }

    /**
     * Show the form for editing the specified slider
     */
    public function edit(Slider $slider): Response
    {
        return Inertia::render('Admin/Sliders/Edit', [
            'slider' => [
                'id' => $slider->id,
                'title' => $slider->title,
                'subtitle' => $slider->subtitle,
                'description' => $slider->description,
                'image_url' => $slider->image_url,
                'image_path' => $slider->image_path,
                'button_text' => $slider->button_text,
                'button_link' => $slider->button_link,
                'button_style' => $slider->button_style,
                'text_color' => $slider->text_color,
                'overlay_color' => $slider->overlay_color,
                'overlay_opacity' => $slider->overlay_opacity,
                'text_position' => $slider->text_position,
                'text_alignment' => $slider->text_alignment,
                'sort_order' => $slider->sort_order,
                'is_active' => $slider->is_active,
                'start_date' => $slider->start_date?->format('Y-m-d\TH:i'),
                'end_date' => $slider->end_date?->format('Y-m-d\TH:i'),
            ]
        ]);
    }

    /**
     * Update the specified slider
     */
    public function update(Request $request, Slider $slider): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:255',
            'button_style' => 'nullable|in:primary,secondary,outline',
            'text_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'overlay_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'overlay_opacity' => 'nullable|integer|min:0|max:100',
            'text_position' => 'nullable|in:left,center,right',
            'text_alignment' => 'nullable|in:left,center,right',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'remove_image' => 'nullable|boolean', // Add flag to indicate image removal
        ]);

        // Handle image upload or removal
        if ($request->hasFile('image')) {
            // Delete old image
            if ($slider->image_path) {
                Storage::disk('public')->delete($slider->image_path);
            }
            
            $image = $request->file('image');
            $imagePath = $image->store('sliders', 'public');
            $validated['image_path'] = $imagePath;
        } elseif ($request->boolean('remove_image')) {
            // Remove existing image if explicitly requested
            if ($slider->image_path) {
                Storage::disk('public')->delete($slider->image_path);
            }
            $validated['image_path'] = null;
        }

        // Remove keys that are not in the database
        unset($validated['image'], $validated['remove_image']);

        $slider->update($validated);

        return redirect()->route('admin.sliders.index')
            ->with('success', 'Slider updated successfully.');
    }

    /**
     * Remove the specified slider
     */
    public function destroy(Slider $slider): RedirectResponse
    {
        // Delete associated image
        if ($slider->image_path) {
            Storage::disk('public')->delete($slider->image_path);
        }

        $slider->delete();

        return redirect()->route('admin.sliders.index')
            ->with('success', 'Slider deleted successfully.');
    }

    /**
     * Bulk actions for sliders
     */
    public function bulkAction(Request $request): RedirectResponse
    {
        $request->validate([
            'action' => 'required|in:activate,deactivate,delete',
            'slider_ids' => 'required|array',
            'slider_ids.*' => 'exists:sliders,id'
        ]);

        $sliders = Slider::whereIn('id', $request->slider_ids);

        switch ($request->action) {
            case 'activate':
                $sliders->update(['is_active' => true]);
                $message = 'Sliders activated successfully.';
                break;
            case 'deactivate':
                $sliders->update(['is_active' => false]);
                $message = 'Sliders deactivated successfully.';
                break;
            case 'delete':
                // Delete images for sliders being deleted
                $slidersToDelete = $sliders->get();
                foreach ($slidersToDelete as $slider) {
                    if ($slider->image_path) {
                        Storage::disk('public')->delete($slider->image_path);
                    }
                }
                $sliders->delete();
                $message = 'Sliders deleted successfully.';
                break;
        }

        return redirect()->route('admin.sliders.index')
            ->with('success', $message);
    }

    /**
     * Reorder sliders
     */
    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'sliders' => 'required|array',
            'sliders.*.id' => 'required|exists:sliders,id',
            'sliders.*.sort_order' => 'required|integer|min:0'
        ]);

        foreach ($request->sliders as $sliderData) {
            Slider::where('id', $sliderData['id'])
                ->update(['sort_order' => $sliderData['sort_order']]);
        }

        return response()->json(['success' => true]);
    }
}
