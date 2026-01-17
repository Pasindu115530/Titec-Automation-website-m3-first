<!DOCTYPE html>
<html>
<head>
    <title>Quotation Reply</title>
</head>
<body>
    <h1>Hello,</h1>
    <p>Thank you for your inquiry. Please find the attached quotation for your request.</p>
    
    @if($adminMessage)
        <p><strong>Message from Admin:</strong></p>
        <p style="white-space: pre-wrap;">{{ $adminMessage }}</p>
    @endif

    <p>Best regards,<br>Titec Automation</p>
</body>
</html>
