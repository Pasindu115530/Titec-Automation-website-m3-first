<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::with([
            'causer',
            'subject' => function ($morphTo) {
                $morphTo->morphWith([
                    \App\Models\Invoice::class => ['items.product', 'client'],
                    \App\Models\StockReceiving::class => ['items.product'],
                    \App\Models\StockMovement::class => ['product'],
                    \App\Models\Installation::class => ['technicians'],
                    \App\Models\Product::class => ['brand'],
                ]);
            }
        ]);

        if ($request->filled('log_name')) {
            $query->inLog($request->log_name);
        }

        if ($request->filled('event')) {
            $query->where('event', $request->event);
        }

        if ($request->filled('causer_id')) {
            $query->causedBy(\App\Models\User::find($request->causer_id));
        }

        if ($request->filled('search')) {
            $query->where('description', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('from') && $request->filled('to')) {
            $query->whereBetween('created_at', [$request->from, $request->to]);
        }

        $logs = $query->latest()->paginate(15);

        return response()->json($logs);
    }
}
