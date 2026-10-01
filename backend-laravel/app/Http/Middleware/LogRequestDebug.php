<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * Logs request/response details to help diagnose 403 errors.
 *
 * Captures: client IP, forwarded-for headers, user-agent, origin,
 * referer, request method/path, and response status code.
 *
 * Logs at 'warning' level for 403/429 responses, 'info' for others.
 *
 * To disable: remove from bootstrap/app.php middleware stack or
 * set LOG_REQUEST_DEBUG=false in .env.
 */
class LogRequestDebug
{
    public function handle(Request $request, Closure $next): Response
    {
        // Allow disabling via .env without code changes
        if (env('LOG_REQUEST_DEBUG', true) === false) {
            return $next($request);
        }

        $response = $next($request);

        $statusCode = $response->getStatusCode();

        $logData = [
            'status'          => $statusCode,
            'method'          => $request->method(),
            'url'             => $request->fullUrl(),
            'path'            => $request->path(),
            'client_ip'       => $request->ip(),
            'forwarded_for'   => $request->header('X-Forwarded-For', 'none'),
            'real_ip'         => $request->header('X-Real-IP', 'none'),
            'origin'          => $request->header('Origin', 'none'),
            'referer'         => $request->header('Referer', 'none'),
            'user_agent'      => $request->userAgent() ?? 'none',
            'host'            => $request->header('Host', 'none'),
            'content_type'    => $request->header('Content-Type', 'none'),
            'accept'          => $request->header('Accept', 'none'),
            'auth_present'    => $request->hasHeader('Authorization') ? 'yes' : 'no',
            'cookie_present'  => $request->hasHeader('Cookie') ? 'yes' : 'no',
        ];

        // Log 403 and 429 (rate limit) at warning level with extra detail
        if ($statusCode === 403 || $statusCode === 429) {
            $logData['response_body_preview'] = mb_substr(
                $response->getContent(),
                0,
                500
            );

            // Include rate limit headers if present
            if ($response->headers->has('X-RateLimit-Limit')) {
                $logData['rate_limit']     = $response->headers->get('X-RateLimit-Limit');
                $logData['rate_remaining'] = $response->headers->get('X-RateLimit-Remaining');
                $logData['retry_after']    = $response->headers->get('Retry-After', 'none');
            }

            // Check CORS-related headers
            $logData['cors_allow_origin'] = $response->headers->get('Access-Control-Allow-Origin', 'NOT SET');
            $logData['cors_allow_credentials'] = $response->headers->get('Access-Control-Allow-Credentials', 'NOT SET');

            Log::channel('request_debug')->warning(
                "🚫 HTTP {$statusCode} response — possible 403 issue",
                $logData
            );
        } else {
            // Log all other requests at debug level (less noisy)
            Log::channel('request_debug')->debug(
                "HTTP {$statusCode} — {$request->method()} {$request->path()}",
                $logData
            );
        }

        return $response;
    }
}
