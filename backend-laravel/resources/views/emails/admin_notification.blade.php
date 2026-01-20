<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f6f6f6;
            margin: 0;
            padding: 0;
            color: #333333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-top: 5px solid #d946ef; /* Different color for Admin */
        }
        .header {
            background-color: #f3f4f6;
            padding: 20px;
            border-bottom: 1px solid #e5e7eb;
        }
        .header h1 {
            margin: 0;
            font-size: 20px;
            color: #111827;
        }
        .content {
            padding: 20px;
        }
        .detail-row {
            margin-bottom: 10px;
        }
        .label {
            font-weight: bold;
            color: #4b5563;
            width: 120px;
            display: inline-block;
        }
        .value {
            color: #111827;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .items-table th, .items-table td {
            text-align: left;
            padding: 10px;
            border-bottom: 1px solid #e5e7eb;
        }
        .items-table th {
            background-color: #f9fafb;
            font-weight: 600;
            font-size: 14px;
        }
        .btn {
            display: inline-block;
            background-color: #1f2937;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Quotation Request</h1>
        </div>
        <div class="content">
            <p>You have received a new quotation request from the website.</p>
            
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <div class="detail-row">
                    <span class="label">Customer:</span>
                    <span class="value">{{ $requestData->name }}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Email:</span>
                    <span class="value">{{ $requestData->email }}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Phone:</span>
                    <span class="value">{{ $requestData->phone ?? 'N/A' }}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Date:</span>
                    <span class="value">{{ $requestData->created_at->format('Y-m-d H:i') }}</span>
                </div>
            </div>

            @if($requestData->customer_notes)
            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 16px; margin-bottom: 5px;">Customer Notes:</h3>
                <p style="background-color: #fffbeb; padding: 10px; border-radius: 4px; margin: 0;">{{ $requestData->customer_notes }}</p>
            </div>
            @endif

            <h3>Requested Items:</h3>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th style="text-align: right;">Qty</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($requestData->products as $product)
                    <tr>
                        <td>{{ $product->name }}</td>
                        <td style="text-align: right;">{{ $product->pivot->quantity }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <div style="text-align: center;">
                <a href="https://titecautomation.lk/admin/quotations/{{ $requestData->id }}" class="btn">View in Admin Panel</a>
            </div>
        </div>
    </div>
</body>
</html>
