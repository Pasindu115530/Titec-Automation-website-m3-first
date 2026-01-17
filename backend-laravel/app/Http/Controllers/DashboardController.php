<?php

namespace App\Http\Controllers;

use App\Models\QuotationRequest;
use App\Models\Quotation;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Calculate Stats
        $totalRequests = QuotationRequest::count();
        $pendingRequests = QuotationRequest::where('status', 'pending')->count();
        $quotedRequests = QuotationRequest::where('status', 'quoted')->count();
        $reviewedRequests = QuotationRequest::where('status', 'reviewed')->count();

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
