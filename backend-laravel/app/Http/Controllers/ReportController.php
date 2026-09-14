<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Product;
use App\Models\Client;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function sales(Request $request)
    {
        $interval = $request->input('interval', 'month');
        
        $query = Invoice::where('status', '!=', 'void');

        // Apply interval filtering
        $startDate = match($interval) {
            'week' => now()->startOfWeek(),
            'month' => now()->startOfMonth(),
            'year' => now()->startOfYear(),
            default => now()->startOfMonth(),
        };
        
        $query->where('created_at', '>=', $startDate);
        
        $totalSales = $query->sum('grand_total');
        $invoiceCount = $query->count();
        $paymentsReceived = $query->sum('amount_paid');
        $outstanding = $totalSales - $paymentsReceived;

        $topProducts = InvoiceItem::whereHas('invoice', function ($q) use ($startDate) {
            $q->where('status', '!=', 'void')->where('created_at', '>=', $startDate);
        })
        ->select('product_name as name')
        ->selectRaw('SUM(quantity) as quantity_sold')
        ->selectRaw('SUM(line_total) as revenue')
        ->groupBy('product_id', 'product_name')
        ->orderByDesc('revenue')
        ->limit(5)
        ->get();

        // Generate chart data based on interval
        $chartData = [];
        if ($interval === 'week') {
            for ($i = 0; $i < 7; $i++) {
                $date = now()->startOfWeek()->addDays($i);
                $sum = Invoice::where('status', '!=', 'void')
                    ->whereDate('created_at', $date)
                    ->sum('grand_total');
                $chartData[] = ['label' => $date->format('D'), 'value' => (float) $sum];
            }
        } elseif ($interval === 'month') {
            // Group by week of month
            for ($i = 0; $i < 4; $i++) {
                $start = now()->startOfMonth()->addWeeks($i);
                $end = $start->copy()->endOfWeek();
                if ($i === 3) {
                    $end = now()->endOfMonth(); // last week covers rest of month
                }
                $sum = Invoice::where('status', '!=', 'void')
                    ->whereBetween('created_at', [$start, $end])
                    ->sum('grand_total');
                $chartData[] = ['label' => 'Week ' . ($i + 1), 'value' => (float) $sum];
            }
        } elseif ($interval === 'year') {
            // Group by month
            for ($i = 1; $i <= 12; $i++) {
                $date = now()->startOfYear()->month($i);
                $sum = Invoice::where('status', '!=', 'void')
                    ->whereYear('created_at', now()->year)
                    ->whereMonth('created_at', $i)
                    ->sum('grand_total');
                $chartData[] = ['label' => $date->format('M'), 'value' => (float) $sum];
            }
        }

        return response()->json([
            'total_sales' => (float) $totalSales,
            'invoice_count' => $invoiceCount,
            'payments_received' => (float) $paymentsReceived,
            'outstanding' => (float) $outstanding,
            'top_products' => $topProducts,
            'chart_data' => $chartData
        ]);
    }

    public function inventory()
    {
        $totalSkus = Product::count();
        $totalValue = Product::selectRaw('SUM(price * stock) as total_value')->value('total_value');
        $lowStockCount = Product::where('stock', '<=', 5)->count();
        $items = Product::select('name', 'price', 'stock as stock_quantity')
            ->orderBy('name')
            ->get();

        return response()->json([
            'total_skus' => $totalSkus,
            'total_value' => (float) $totalValue,
            'low_stock_count' => $lowStockCount,
            'items' => $items
        ]);
    }

    public function warranty(Request $request)
    {
        $days = (int) $request->input('period', 30);
        $dateTo = now()->addDays($days);

        $warranties = InvoiceItem::with('invoice.client')
            ->whereNotNull('warranty_end_date')
            ->whereBetween('warranty_end_date', [now(), $dateTo])
            ->get()
            ->map(function ($item) {
                $client = $item->invoice->client;
                return [
                    'client_name' => $client ? ($client->client_type === 'business' ? $client->company_name : $client->contact_person) : 'Unknown',
                    'product_name' => $item->product_name,
                    'serial_number' => $item->serial_number ?: 'N/A',
                    'expiry_date' => $item->warranty_end_date->format('Y-m-d')
                ];
            });

        return response()->json([
            'expiring_warranties' => $warranties
        ]);
    }

    public function topProducts(Request $request)
    {
        $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));

        $topProducts = InvoiceItem::whereHas('invoice', function ($q) use ($startDate, $endDate) {
            $q->where('status', '!=', 'void')->whereBetween('created_at', [$startDate, $endDate]);
        })
        ->select('product_name as name')
        ->selectRaw('SUM(quantity) as quantity_sold')
        ->selectRaw('SUM(line_total) as revenue')
        ->groupBy('product_id', 'product_name')
        ->orderByDesc('revenue')
        ->limit(10)
        ->get();

        return response()->json(['data' => $topProducts]);
    }

    public function clientRevenue(Request $request)
    {
        $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));

        $clients = Invoice::where('status', '!=', 'void')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->join('clients', 'invoices.client_id', '=', 'clients.id')
            ->select('clients.id', 'clients.company_name', 'clients.contact_person', 'clients.client_type')
            ->selectRaw('SUM(invoices.grand_total) as total_revenue')
            ->groupBy('clients.id', 'clients.company_name', 'clients.contact_person', 'clients.client_type')
            ->orderByDesc('total_revenue')
            ->limit(10)
            ->get()
            ->map(function ($client) {
                return [
                    'client_name' => $client->client_type === 'business' ? $client->company_name : $client->contact_person,
                    'revenue' => (float) $client->total_revenue
                ];
            });

        return response()->json(['data' => $clients]);
    }
}
