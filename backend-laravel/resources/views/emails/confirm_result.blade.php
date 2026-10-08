<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Email Provisioning Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f5;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .card {
            max-width: 500px;
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .icon {
            font-size: 48px;
            margin-bottom: 16px;
        }
        .success { color: #16a34a; }
        .error { color: #dc2626; }
        h1 {
            font-size: 22px;
            margin: 0 0 12px;
            color: #111827;
        }
        p {
            font-size: 15px;
            color: #6b7280;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="card">
        @if($success)
            <div class="icon success">✅</div>
            <h1>Email Provisioned Successfully</h1>
        @else
            <div class="icon error">❌</div>
            <h1>Confirmation Failed</h1>
        @endif
        <p>{{ $message }}</p>
    </div>
</body>
</html>
