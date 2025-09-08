<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Carbon\Carbon;

class NewsletterController extends Controller
{
    /**
     * Display a listing of newsletters
     */
    public function index(Request $request): Response
    {
        $query = Newsletter::with(['creator:id,name']);

        // Search functionality
        if ($request->filled('search')) {
            $query->where('subject', 'like', '%' . $request->search . '%');
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Sort by created date descending by default
        $query->orderBy('created_at', 'desc');

        $newsletters = $query->paginate(15)->withQueryString();

        // Statistics
        $stats = [
            'total' => Newsletter::count(),
            'sent' => Newsletter::where('status', 'sent')->count(),
            'scheduled' => Newsletter::where('status', 'scheduled')->count(),
            'draft' => Newsletter::where('status', 'draft')->count(),
            'total_subscribers' => NewsletterSubscriber::subscribed()->count(),
            'total_sent_emails' => Newsletter::sum('sent_count'),
        ];

        return Inertia::render('Admin/Newsletters/Index', [
            'newsletters' => $newsletters,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new newsletter
     */
    public function create(): Response
    {
        $subscriberStats = [
            'total_subscribers' => NewsletterSubscriber::subscribed()->count(),
            'recent_subscribers' => NewsletterSubscriber::subscribed()
                ->where('subscribed_at', '>=', Carbon::now()->subDays(30))
                ->count(),
        ];

        return Inertia::render('Admin/Newsletters/Create', [
            'subscriberStats' => $subscriberStats,
        ]);
    }

    /**
     * Store a newly created newsletter
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'text_content' => 'nullable|string',
            'template' => 'required|string|in:default,promotional,announcement',
            'recipient_criteria' => 'nullable|array',
            'scheduled_at' => 'nullable|date|after:now',
        ]);

        // Calculate recipient count based on criteria
        $recipientCount = $this->calculateRecipientCount($validated['recipient_criteria'] ?? []);

        $newsletter = Newsletter::create([
            ...$validated,
            'recipient_count' => $recipientCount,
            'status' => $request->has('send_now') ? 'scheduled' : 'draft',
            'scheduled_at' => $request->has('send_now') ? null : $validated['scheduled_at'],
            'created_by' => auth()->id(),
        ]);

        $message = $request->has('send_now') 
            ? 'Newsletter created and queued for sending!' 
            : 'Newsletter saved as draft!';

        return redirect()->route('admin.newsletters.index')
            ->with('success', $message);
    }

    /**
     * Display the specified newsletter
     */
    public function show(Newsletter $newsletter): Response
    {
        $newsletter->load(['creator:id,name,email']);

        // Get engagement metrics
        $metrics = $newsletter->getEngagementMetrics();

        // Recent sends with engagement data
        $recentSends = $newsletter->newsletterSends()
            ->with(['subscriber:id,email,name'])
            ->orderBy('sent_at', 'desc')
            ->limit(20)
            ->get();

        // Performance over time (if sent)
        $performanceData = [];
        if ($newsletter->isSent()) {
            $performanceData = $newsletter->newsletterSends()
                ->selectRaw('DATE(sent_at) as date')
                ->selectRaw('COUNT(*) as sent')
                ->selectRaw('COUNT(opened_at) as opened')
                ->selectRaw('COUNT(clicked_at) as clicked')
                ->groupBy('date')
                ->orderBy('date')
                ->get();
        }

        return Inertia::render('Admin/Newsletters/Show', [
            'newsletter' => $newsletter,
            'metrics' => $metrics,
            'recentSends' => $recentSends,
            'performanceData' => $performanceData,
        ]);
    }

    /**
     * Show the form for editing the specified newsletter
     */
    public function edit(Newsletter $newsletter): Response
    {
        // Only allow editing if not sent
        if ($newsletter->isSent()) {
            return redirect()->route('admin.newsletters.show', $newsletter)
                ->with('error', 'Cannot edit sent newsletter.');
        }

        $subscriberStats = [
            'total_subscribers' => NewsletterSubscriber::subscribed()->count(),
            'recent_subscribers' => NewsletterSubscriber::subscribed()
                ->where('subscribed_at', '>=', Carbon::now()->subDays(30))
                ->count(),
        ];

        return Inertia::render('Admin/Newsletters/Edit', [
            'newsletter' => $newsletter,
            'subscriberStats' => $subscriberStats,
        ]);
    }

    /**
     * Update the specified newsletter
     */
    public function update(Request $request, Newsletter $newsletter): RedirectResponse
    {
        // Only allow editing if not sent
        if ($newsletter->isSent()) {
            return back()->with('error', 'Cannot edit sent newsletter.');
        }

        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'text_content' => 'nullable|string',
            'template' => 'required|string|in:default,promotional,announcement',
            'recipient_criteria' => 'nullable|array',
            'scheduled_at' => 'nullable|date|after:now',
        ]);

        // Recalculate recipient count
        $recipientCount = $this->calculateRecipientCount($validated['recipient_criteria'] ?? []);

        $newsletter->update([
            ...$validated,
            'recipient_count' => $recipientCount,
        ]);

        return redirect()->route('admin.newsletters.index')
            ->with('success', 'Newsletter updated successfully!');
    }

    /**
     * Remove the specified newsletter
     */
    public function destroy(Newsletter $newsletter): RedirectResponse
    {
        // Don't allow deletion if newsletter has been sent
        if ($newsletter->isSent()) {
            return back()->with('error', 'Cannot delete sent newsletter.');
        }

        $newsletter->delete();

        return redirect()->route('admin.newsletters.index')
            ->with('success', 'Newsletter deleted successfully!');
    }

    /**
     * Send newsletter immediately
     */
    public function sendNow(Newsletter $newsletter): RedirectResponse
    {
        if ($newsletter->isSent()) {
            return back()->with('error', 'Newsletter has already been sent.');
        }

        $newsletter->update([
            'status' => 'scheduled',
            'scheduled_at' => null, // Send immediately
        ]);

        // Here you would typically dispatch a job to send the newsletter
        // dispatch(new SendNewsletterJob($newsletter));

        return back()->with('success', 'Newsletter queued for immediate sending!');
    }

    /**
     * Duplicate newsletter
     */
    public function duplicate(Newsletter $newsletter): RedirectResponse
    {
        $duplicate = Newsletter::create([
            'subject' => $newsletter->subject . ' (Copy)',
            'content' => $newsletter->content,
            'text_content' => $newsletter->text_content,
            'template' => $newsletter->template,
            'recipient_criteria' => $newsletter->recipient_criteria,
            'recipient_count' => $this->calculateRecipientCount($newsletter->recipient_criteria ?? []),
            'status' => 'draft',
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('admin.newsletters.edit', $duplicate)
            ->with('success', 'Newsletter duplicated successfully!');
    }

    /**
     * Preview newsletter
     */
    public function preview(Newsletter $newsletter): Response
    {
        return Inertia::render('Admin/Newsletters/Preview', [
            'newsletter' => $newsletter,
        ]);
    }

    /**
     * Get subscriber analytics
     */
    public function subscriberAnalytics(): Response
    {
        $stats = [
            'total_subscribers' => NewsletterSubscriber::count(),
            'subscribed' => NewsletterSubscriber::subscribed()->count(),
            'unsubscribed' => NewsletterSubscriber::unsubscribed()->count(),
            'pending_verification' => NewsletterSubscriber::pendingVerification()->count(),
            'this_month_new' => NewsletterSubscriber::where('created_at', '>=', Carbon::now()->startOfMonth())->count(),
            'last_month_new' => NewsletterSubscriber::whereBetween('created_at', [
                Carbon::now()->subMonth()->startOfMonth(),
                Carbon::now()->subMonth()->endOfMonth()
            ])->count(),
        ];

        // Growth over time
        $growthData = NewsletterSubscriber::selectRaw('DATE(created_at) as date')
            ->selectRaw('COUNT(*) as new_subscribers')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Subscription sources
        $sourceData = NewsletterSubscriber::selectRaw('source, COUNT(*) as count')
            ->whereNotNull('source')
            ->groupBy('source')
            ->orderBy('count', 'desc')
            ->get();

        return Inertia::render('Admin/Newsletters/Analytics', [
            'stats' => $stats,
            'growthData' => $growthData,
            'sourceData' => $sourceData,
        ]);
    }

    /**
     * Calculate recipient count based on criteria
     */
    private function calculateRecipientCount(array $criteria): int
    {
        $query = NewsletterSubscriber::subscribed();
        
        foreach ($criteria as $criterion => $value) {
            switch ($criterion) {
                case 'source':
                    $query->where('source', $value);
                    break;
                case 'subscribed_after':
                    $query->where('subscribed_at', '>=', $value);
                    break;
                case 'subscribed_before':
                    $query->where('subscribed_at', '<=', $value);
                    break;
            }
        }
        
        return $query->count();
    }
}
