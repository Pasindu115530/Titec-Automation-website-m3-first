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
            -webkit-font-smoothing: antialiased;
            color: #333333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-top: 20px;
            margin-bottom: 20px;
        }
        .header {
            background-color: #2563eb;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 30px 20px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
        }
        .message {
            line-height: 1.6;
            color: #4b5563;
            margin-bottom: 25px;
        }
        .details-box {
            background-color: #f3f4f6;
            border-left: 4px solid #2563eb;
            padding: 20px;
            margin-bottom: 25px;
            border-radius: 4px;
        }
        .details-box h3 {
            margin-top: 0;
            color: #1f2937;
            font-size: 16px;
        }
        .details-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .details-list li {
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
        }
        .details-list li:last-child {
            border-bottom: none;
        }
        .item-row {
            display: flex;
            justify-content: space-between;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
        }
        .button {
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 500;
            margin-top: 10px;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100%;
                margin: 0;
                border-radius: 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Quotation Request Received</h1>
        </div>
        <div class="content">
            <h2 class="greeting">Hello {{ $requestData->name }},</h2>
            <p class="message">
                Thank you for your interest in Titec Automation. We have received your quotation request effectively. 
                Our sales team will review your requirements and send you a detailed quotation shortly.
            </p>

            <div class="details-box">
                <h3>Request Details</h3>
                <ul class="details-list">
                    <li><strong>Reference No:</strong> #{{ $requestData->id }}</li>
                    <li><strong>Date:</strong> {{ $requestData->created_at->format('M d, Y') }}</li>
                    @if($requestData->phone)
                    <li><strong>Contact:</strong> {{ $requestData->phone }}</li>
                    @endif
                </ul>
            </div>

            @if(count($requestData->products) > 0)
            <div class="details-box">
                <h3>Requested Items</h3>
                <ul class="details-list">
                    @foreach($requestData->products as $product)
                    <li class="item-row">
                        <span>{{ $product->name }}</span>
                        <span>x{{ $product->pivot->quantity }}</span>
                    </li>
                    @endforeach
                </ul>
            </div>
            @endif
            
            <p class="message">
                If you have any urgent queries, please don't hesitate to contact us directly.
            </p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Titec Automation. All rights reserved.</p>
            <p>This is an automated message, please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html>
