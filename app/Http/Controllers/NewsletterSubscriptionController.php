<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class NewsletterSubscriptionController extends Controller
{
    /**
     * Handle newsletter subscription
     */
    public function subscribe(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => [
                'required',
                'email',
                'max:255',
                'unique:newsletter_subscribers,email'
            ],
            'name' => 'nullable|string|max:255',
        ], [
            'email.unique' => 'This email is already subscribed to our newsletter.',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            // Create newsletter subscriber
            $subscriber = NewsletterSubscriber::create([
                'email' => $request->email,
                'name' => $request->name,
                'status' => 'subscribed', // Direct subscription for now, can implement double opt-in later
                'source' => 'website_footer',
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'subscribed_at' => now(),
            ]);

            // Generate unsubscribe token for future use
            $subscriber->generateUnsubscribeToken();

            // TODO: Send welcome email (implement later)
            // Mail::to($subscriber->email)->send(new WelcomeNewsletter($subscriber));

            return back()->with('success', 'Thank you for subscribing! You will receive updates about our sacred products and special offers.');
        } catch (\Exception $e) {
            return back()->withErrors(['email' => 'An error occurred while subscribing. Please try again.']);
        }
    }

    /**
     * Show unsubscribe form
     */
    public function unsubscribeForm(Request $request): Response
    {
        $email = $request->get('email', '');
        $token = $request->get('token', '');
        
        // Check if already unsubscribed via token
        if ($token && $email) {
            $subscriber = NewsletterSubscriber::where('email', $email)
                ->where('unsubscribe_token', $token)
                ->first();
                
            if ($subscriber && $subscriber->isSubscribed()) {
                // Auto-unsubscribe if valid token
                $subscriber->unsubscribe('direct_link');
                
                return Inertia::render('Newsletter/Unsubscribe', [
                    'email' => $email,
                    'token' => $token,
                    'message' => 'You have been successfully unsubscribed from our newsletter.',
                ]);
            }
        }
        
        return Inertia::render('Newsletter/Unsubscribe', [
            'email' => $email,
            'token' => $token,
        ]);
    }

    /**
     * Handle unsubscribe request
     */
    public function unsubscribe(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'token' => 'nullable|string',
            'reason' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $subscriber = NewsletterSubscriber::where('email', $request->email)->first();

        if (!$subscriber) {
            return back()->withErrors(['email' => 'Email address not found in our newsletter list.']);
        }

        if (!$subscriber->isSubscribed()) {
            return back()->with('message', 'This email is already unsubscribed from our newsletter.');
        }

        // If token provided, verify it
        if ($request->token && $subscriber->unsubscribe_token !== $request->token) {
            return back()->withErrors(['token' => 'Invalid unsubscribe token.']);
        }

        try {
            // Unsubscribe the user
            $subscriber->unsubscribe($request->reason);

            return back()->with('message', 'You have been successfully unsubscribed from our newsletter. We respect your decision and wish you well on your spiritual journey.');
        } catch (\Exception $e) {
            return back()->withErrors(['email' => 'An error occurred while unsubscribing. Please try again.']);
        }
    }
}
