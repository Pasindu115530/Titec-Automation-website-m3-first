<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * Only allows users with the 'admin' role to proceed.
     * Must be used AFTER auth:sanctum middleware.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || $request->user()->role !== 'admin') {
            Log::channel('request_debug')->warning(
                '🔐 Admin middleware 403 — non-admin user attempted admin route',
                [
                    'url'           => $request->fullUrl(),
                    'method'        => $request->method(),
                    'client_ip'     => $request->ip(),
                    'forwarded_for' => $request->header('X-Forwarded-For', 'none'),
                    'user_agent'    => $request->userAgent() ?? 'none',
                    'user_id'       => $request->user()?->id ?? 'guest',
                    'user_role'     => $request->user()?->role ?? 'none',
                ]
            );

            return response()->json([
                'message' => 'Forbidden. Admin access required.'
            ], 403);
        }

        return $next($request);
    }
}
