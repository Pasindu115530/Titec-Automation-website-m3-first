<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::with(['causer', 'subject']);

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

        $logs->getCollection()->transform(function ($activity) {
            if ($activity->subject) {
                switch ($activity->subject_type) {
                    case 'App\Models\Invoice':
                        $activity->subject->load(['items.product', 'client']);
                        break;
                    case 'App\Models\StockReceiving':
                        $activity->subject->load('items.product');
                        break;
                    case 'App\Models\StockMovement':
                        $activity->subject->load('product');
                        break;
                    case 'App\Models\Installation':
                        $activity->subject->load('technicians');
                        break;
                    case 'App\Models\Product':
                        $activity->subject->load('brand');
                        break;
                }
            }
            return $activity;
        });

        return response()->json($logs);
    }
}
