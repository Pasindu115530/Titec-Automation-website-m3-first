<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Email Account Creation Request</title>
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
            background-color: #dc2626;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 22px;
        }
        .header p {
            color: #fecaca;
            margin: 5px 0 0;
            font-size: 14px;
        }
        .content {
            padding: 30px;
        }
        .content h2 {
            font-size: 18px;
            color: #111827;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .details-table td {
            padding: 10px 12px;
            font-size: 14px;
            border-bottom: 1px solid #f3f4f6;
        }
        .details-table td:first-child {
            font-weight: bold;
            color: #6b7280;
            width: 140px;
        }
        .credentials {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            font-family: monospace;
            font-size: 15px;
        }
        .credentials strong {
            color: #92400e;
        }
        .button-container {
            text-align: center;
            margin-top: 30px;
        }
        .button {
            background-color: #16a34a;
            color: #ffffff;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            font-size: 16px;
            display: inline-block;
        }
        .steps {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 6px;
            padding: 15px 20px;
            margin: 20px 0;
        }
        .steps ol {
            margin: 5px 0;
            padding-left: 20px;
        }
        .steps li {
            margin: 6px 0;
            font-size: 14px;
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
            <h1>⚡ Email Account Creation Required</h1>
            <p>Action needed by a developer</p>
        </div>
        <div class="content">
            <h2>New Employee Email Request</h2>
            <p>A super admin has added a new employee to the ERP system. Please create the following email account in cPanel.</p>

            <table class="details-table">
                <tr>
                    <td>Employee Name</td>
                    <td>{{ $user->name }}</td>
                </tr>
                <tr>
                    <td>Email to Create</td>
                    <td><strong>{{ $user->email }}</strong></td>
                </tr>
                @if($user->employee && $user->employee->department)
                <tr>
                    <td>Department</td>
                    <td>{{ $user->employee->department }}</td>
                </tr>
                @endif
                @if($user->employee && $user->employee->designation)
                <tr>
                    <td>Designation</td>
                    <td>{{ $user->employee->designation }}</td>
                </tr>
                @endif
            </table>

            <div class="credentials">
                <strong>Set this password in cPanel:</strong><br><br>
                <span style="font-size: 18px; letter-spacing: 1px;">{{ $password }}</span>
            </div>

            <div class="steps">
                <strong>Steps to follow:</strong>
                <ol>
                    <li>Log in to cPanel (register.lk)</li>
                    <li>Go to <strong>Email Accounts</strong></li>
                    <li>Create email: <strong>{{ $user->email }}</strong></li>
                    <li>Set the password shown above</li>
                    <li>Click the green button below to confirm</li>
                </ol>
            </div>

            <div class="button-container">
                <a href="{{ $confirmUrl }}" class="button">✅ Confirm Email Created</a>
            </div>

            <p style="margin-top: 20px; font-size: 13px; color: #6b7280; text-align: center;">
                Only click the button above <strong>after</strong> you have successfully created the email account in cPanel.
            </p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Titec Automation — ERP System Notification
        </div>
    </div>
</body>
</html>
