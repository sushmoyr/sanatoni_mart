<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$permissions
     */
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        // Check if user is authenticated
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // Check if user has any of the required permissions
        if (!$request->user()->hasAnyPermission($permissions)) {
            // If this is an API request, return JSON error
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'You do not have permission to perform this action.',
                    'required_permissions' => $permissions,
                ], 403);
            }

            // For web requests, redirect with error
            abort(403, 'You do not have permission to perform this action.');
        }

        return $next($request);
    }
}
