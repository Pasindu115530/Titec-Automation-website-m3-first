<?php

namespace App\Http\Controllers;

use App\Models\QuotationRequest;
use App\Models\Quotation;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Calculate Stats (single query to minimize WAN latency)
        $stats = QuotationRequest::selectRaw("
            COUNT(*) as total,
            COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0) as pending,
            COALESCE(SUM(CASE WHEN status = 'quoted' THEN 1 ELSE 0 END), 0) as quoted,
            COALESCE(SUM(CASE WHEN status = 'reviewed' THEN 1 ELSE 0 END), 0) as reviewed
        ")->first();

        $totalRequests = (int) ($stats->total ?? 0);
        $pendingRequests = (int) ($stats->pending ?? 0);
        $quotedRequests = (int) ($stats->quoted ?? 0);
        $reviewedRequests = (int) ($stats->reviewed ?? 0);

        // 2. Recent Activity (Recent Requests)
        // Eager load 'quotation' to get the amount if it exists
        $recentRequests = QuotationRequest::with('quotation')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'customer' => $request->name, 
                    // Use a fallback for customer name if it's missing (e.g. Guest)
                    // The model has 'name', 'email', 'phone'
                    'email' => $request->email,
                    'date' => $request->created_at->format('M d, Y'),
                    'status' => ucfirst($request->status),
                    // If quoted, show the grand_total formatted
                    'amount' => $request->quotation ? number_format($request->quotation->grand_total, 2) : '-',
                    'raw_amount' => $request->quotation ? $request->quotation->grand_total : 0,
                ];
            });

        return response()->json([
            'stats' => [
                'total' => $totalRequests,
                'pending' => $pendingRequests,
                'quoted' => $quotedRequests,
                'reviewed' => $reviewedRequests,
            ],
            'recent_requests' => $recentRequests
        ]);
    }
}
