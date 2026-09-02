<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; }
        .header { display: table; width: 100%; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
        .header > div { display: table-cell; vertical-align: top; }
        .company-info { text-align: right; }
        .company-name { font-size: 18px; font-weight: bold; color: #0f4c81; }
        .invoice-title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 10px; text-transform: uppercase; }
        .details-container { display: table; width: 100%; margin-bottom: 20px; }
        .details-container > div { display: table-cell; width: 50%; vertical-align: top; }
        .section-title { font-weight: bold; margin-bottom: 5px; color: #555; text-transform: uppercase; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background-color: #f5f5f5; border: 1px solid #ddd; padding: 8px; text-align: left; }
        td { border: 1px solid #ddd; padding: 8px; }
        .totals-table { width: 40%; float: right; border: none; }
        .totals-table td { border: none; padding: 5px; }
        .totals-table .total-row { font-weight: bold; border-top: 2px solid #333; }
        .footer { clear: both; margin-top: 50px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 10px; color: #777; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
    </style>
</head>
<body>

<div class="header">
    <div>
        <div class="invoice-title">Invoice</div>
        <strong>No:</strong> {{ $invoice->invoice_number }}<br>
        <strong>Date:</strong> {{ $invoice->created_at->format('Y-m-d') }}<br>
        <strong>Due Date:</strong> {{ $invoice->due_date ? $invoice->due_date->format('Y-m-d') : 'On Receipt' }}<br>
    </div>
    <div class="company-info">
        <div class="company-name">{{ $company['name'] }}</div>
        {{ $company['address'] }}<br>
        Phone: {{ $company['phone'] }}<br>
        Email: {{ $company['email'] }}<br>
        BR No: {{ $company['registration_number'] }}<br>
        TIN: {{ $company['tin'] }}
    </div>
</div>

<div class="details-container">
    <div>
        <div class="section-title">Bill To:</div>
        <strong>{{ $invoice->client->company_name ?: $invoice->client->contact_person }}</strong><br>
        @if($invoice->client->company_name)
            Attn: {{ $invoice->client->contact_person }}<br>
        @endif
        {!! nl2br(e($invoice->client->address)) !!}<br>
        {{ $invoice->client->city }}<br>
        Phone: {{ $invoice->client->phone }}<br>
        @if($invoice->client->tax_id)
            TIN: {{ $invoice->client->tax_id }}
        @endif
    </div>
    <div>
        <div class="section-title">Payment Terms:</div>
        {!! nl2br(e($invoice->terms)) !!}
    </div>
</div>

<table>
    <thead>
        <tr>
            <th width="5%">#</th>
            <th width="40%">Description</th>
            <th width="10%" class="text-center">Qty</th>
            <th width="20%" class="text-right">Unit Price</th>
            <th width="25%" class="text-right">Total</th>
        </tr>
    </thead>
    <tbody>
        @foreach($invoice->items as $index => $item)
        <tr>
            <td>{{ $index + 1 }}</td>
            <td>
                <strong>{{ $item->product_name }}</strong>
                @if($item->product_model)<br><small>Model: {{ $item->product_model }}</small>@endif
                @if($item->serial_number)<br><small>S/N: {{ $item->serial_number }}</small>@endif
                @if($item->warranty_months > 0)<br><small>Warranty: {{ $item->warranty_months }} months</small>@endif
            </td>
            <td class="text-center">{{ $item->quantity }} {{ $item->unit }}</td>
            <td class="text-right">{{ number_format($item->unit_price, 2) }}</td>
            <td class="text-right">{{ number_format($item->line_total, 2) }}</td>
        </tr>
        @endforeach
    </tbody>
</table>

<table class="totals-table">
    <tr>
        <td>Subtotal:</td>
        <td class="text-right">{{ number_format($invoice->subtotal, 2) }}</td>
    </tr>
    @if($invoice->discount_amount > 0)
    <tr>
        <td>Discount:</td>
        <td class="text-right">-{{ number_format($invoice->discount_amount, 2) }}</td>
    </tr>
    @endif
    @if($invoice->tax_amount > 0)
    <tr>
        <td>Tax ({{ $invoice->tax_rate }}%):</td>
        <td class="text-right">{{ number_format($invoice->tax_amount, 2) }}</td>
    </tr>
    @endif
    <tr class="total-row">
        <td>Grand Total:</td>
        <td class="text-right">{{ number_format($invoice->grand_total, 2) }}</td>
    </tr>
    @if($invoice->amount_paid > 0)
    <tr>
        <td>Amount Paid:</td>
        <td class="text-right">-{{ number_format($invoice->amount_paid, 2) }}</td>
    </tr>
    <tr class="total-row">
        <td>Balance Due:</td>
        <td class="text-right">{{ number_format($invoice->balance_due, 2) }}</td>
    </tr>
    @endif
</table>

<div class="footer">
    <div style="float: left; width: 50%;">
        <strong>Bank Details:</strong><br>
        Bank: {{ $company['bank_name'] }}<br>
        Branch: {{ $company['bank_branch'] }}<br>
        A/C Name: {{ $company['bank_account_name'] }}<br>
        A/C No: {{ $company['bank_account_number'] }}
    </div>
    <div style="float: right; width: 50%; text-align: right; padding-top: 40px;">
        ___________________________<br>
        Authorized Signature
    </div>
    <div style="clear: both; padding-top: 20px; text-align: center;">
        Thank you for your business!
    </div>
</div>

</body>
</html>
