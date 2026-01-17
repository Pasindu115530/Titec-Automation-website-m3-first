<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Quotation</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; }
        .header { text-align: center; margin-bottom: 30px; }
        .details { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total { text-align: right; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h2>Quotation</h2>
        <p>Titec Automation</p>
    </div>

    <div class="details">
        <strong>Customer:</strong> {{ $request->name ?? ($request->user ? $request->user->name : 'N/A') }}<br>
        <strong>Email:</strong> {{ $request->email ?? ($request->user ? $request->user->email : 'N/A') }}<br>
        <strong>Date:</strong> {{ date('Y-m-d') }}<br>
        <strong>Quotation #:</strong> QT-{{ $request->id }}
    </div>

    @if(isset($message) && $message)
    <div style="margin-bottom: 20px; padding: 10px; background: #fafafa; border: 1px solid #eee;">
        <strong>Note:</strong> {{ $message }}
    </div>
    @endif

    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @php $grandTotal = 0; @endphp
            @foreach($items as $item)
                @php 
                    $total = $item['quantity'] * $item['price'];
                    $grandTotal += $total;
                @endphp
                <tr>
                    <td>{{ $item['name'] }}</td>
                    <td>{{ $item['quantity'] }}</td>
                    <td>${{ number_format($item['price'], 2) }}</td>
                    <td>${{ number_format($total, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3" class="total">Grand Total</td>
                <td>${{ number_format($grandTotal, 2) }}</td>
            </tr>
        </tfoot>
    </table>

    <p style="font-size: 12px; color: #666;">This quotation is valid for 30 days.</p>
</body>
</html>
