<!DOCTYPE html>
<html>
<head>
    <title>New Contact Form Submission</title>
</head>
<body>
    <h2>New Contact Form Submission from {{ $contactMessage->name }}</h2>
    <p><strong>Name:</strong> {{ $contactMessage->name }}</p>
    <p><strong>Company:</strong> {{ $contactMessage->company ?? 'N/A' }}</p>
    <p><strong>Email:</strong> {{ $contactMessage->email }}</p>
    <p><strong>Phone:</strong> {{ $contactMessage->phone ?? 'N/A' }}</p>
    <p><strong>Message:</strong></p>
    <p>{{ $contactMessage->message }}</p>
</body>
</html>
