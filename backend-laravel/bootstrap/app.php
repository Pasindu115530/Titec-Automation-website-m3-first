<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Log;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
      $middleware->statefulApi();

      // Append request debug logging middleware to capture 403/429 diagnostics
      $middleware->append(\App\Http\Middleware\LogRequestDebug::class);

      $middleware->alias([
          'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
          'superadmin' => \App\Http\Middleware\EnsureSuperAdmin::class,
      ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Log detailed info for 403/429 exceptions to help diagnose
        // university WiFi / shared-IP blocking issues
        $exceptions->renderable(function (\Symfony\Component\HttpKernel\Exception\HttpException $e, $request) {
            $status = $e->getStatusCode();

            if (in_array($status, [403, 429])) {
                Log::channel('request_debug')->warning(
                    "⚠️ Exception {$status}: {$e->getMessage()}",
                    [
                        'url'           => $request->fullUrl(),
                        'method'        => $request->method(),
                        'client_ip'     => $request->ip(),
                        'forwarded_for' => $request->header('X-Forwarded-For', 'none'),
                        'user_agent'    => $request->userAgent() ?? 'none',
                        'origin'        => $request->header('Origin', 'none'),
                        'referer'       => $request->header('Referer', 'none'),
                        'exception'     => get_class($e),
                        'trace_preview' => mb_substr($e->getTraceAsString(), 0, 500),
                    ]
                );
            }

            // Return null to let Laravel's default handler still render the response
            return null;
        });
    })->create();
