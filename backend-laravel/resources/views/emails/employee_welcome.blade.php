<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to Titec Automation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f5;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #0ea5e9;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
        }
        .content h2 {
            font-size: 20px;
            color: #111827;
        }
        .credentials {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            font-family: monospace;
            font-size: 16px;
        }
        .button-container {
            text-align: center;
            margin-top: 30px;
        }
        .button {
            background-color: #0284c7;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            display: inline-block;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Titec Automation!</h1>
        </div>
        <div class="content">
            <h2>Hello {{ $user->name }},</h2>
            <p>Your ERP account has been created successfully. Welcome to the team!</p>
            <p>Below are your temporary login credentials. You will be required to change your password upon your first login.</p>
            
            <div class="credentials">
                <strong>Email:</strong> {{ $user->email }}<br><br>
                <strong>Password:</strong> {{ $password }}
            </div>
            
            <div class="button-container">
                <a href="{{ $loginUrl }}" class="button">Log in to ERP</a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                If you have any issues accessing your account, please contact your system administrator.
            </p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Titec Automation. All rights reserved.
        </div>
    </div>
</body>
</html>
