<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12px;
            color: #000;
            line-height: 1.4;
        }
        .header-table {
            width: 100%;
            margin-bottom: 20px;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #003366; /* Dark Blue */
            margin-bottom: 5px;
        }
        .doc-title {
            font-size: 24px;
            font-weight: bold;
            color: #003366;
            text-align: right;
        }
        .info-cell {
            vertical-align: top;
        }
        .right-align {
            text-align: right;
        }
        .address-block {
            margin-bottom: 20px;
        }
        .attention-box {
            background-color: #003366;
            color: white;
            padding: 5px 10px;
            font-weight: bold;
            display: inline-block;
            width: 100px; /* Approximate width */
            margin-bottom: 5px;
        }
        .client-info {
            margin-top: 5px;
        }
        
        /* Items Table */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 11px;
        }
        .items-table th {
            background-color: #003366;
            color: white;
            padding: 8px 5px;
            text-align: center;
            font-weight: bold;
            border: 1px solid #003366;
        }
        .items-table td {
            border: 1px solid #000;
            padding: 6px 5px;
            vertical-align: middle;
        }
        .col-desc { text-align: left; }
        .col-qty { text-align: center; width: 50px; }
        .col-unit { text-align: center; width: 50px; }
        .col-price { text-align: right; width: 85px; }
        .col-total { text-align: right; width: 95px; }
        
        /* Totals */
        .totals-row td {
            font-weight: bold;
            border: 1px solid #000;
        }
        .no-border {
            border: none !important;
        }
        
        /* Footer */
        .footer-section {
            margin-top: 30px;
            page-break-inside: avoid;
        }
        .section-title {
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 10px;
            font-size: 12px;
        }
        .terms-list {
            margin: 0;
            padding-left: 0;
            list-style: none;
        }
        .terms-list li {
            margin-bottom: 5px;
        }
        .payment-details table {
            width: 50%;
            margin-top: 10px;
            border-collapse: collapse;
        }
        .payment-details td {
            padding: 2px 0;
            border: none;
        }

        .thank-you {
            margin-top: 30px;
            font-style: italic;
        }
    </style>
</head>
<body>

    <!-- Header Section -->
    <table class="header-table">
        <tr>
            <td width="60%" class="info-cell">
                <div class="company-name">TiTec Automation Solutions</div>
                <div class="address-block">
                    190/3, Bulugahalanda,<br>
                    Yatiyana, Minuwangoda,<br>
                    Sri Lanka.<br>
                    Phone: 0770417564<br>
                    Email: lahiru@titecautomation.lk
                </div>

                <div class="attention-box">Attention :</div>
                <div class="client-info">
                    @if($invoice->client)
                        <strong>{{ $invoice->client->company_name ?: $invoice->client->contact_person }}</strong><br>
                        @if($invoice->client->company_name && $invoice->client->contact_person)
                            Attn: {{ $invoice->client->contact_person }}<br>
                        @endif
                        @if($invoice->client->email)
                            {{ $invoice->client->email }}<br>
                        @endif
                        @if($invoice->client->phone)
                            {{ $invoice->client->phone }}<br>
                        @endif
                        @if($invoice->client->address)
                            {{ $invoice->client->address }}<br>
                        @endif
                        @if($invoice->client->tax_id)
                            TIN: {{ $invoice->client->tax_id }}<br>
                        @endif
                    @else
                        <strong>Walk-in Customer</strong><br>
                    @endif
                </div>
            </td>
            <td width="40%" class="info-cell right-align">
                <div class="doc-title">Invoice</div>
                <br>
                <table style="width: 100%; margin-top: 10px;">
                    <tr>
                        <td class="right-align" style="padding-right: 15px;"><strong>Date</strong></td>
                        <td class="right-align">{{ $invoice->created_at ? $invoice->created_at->format('d/m/Y') : date('d/m/Y') }}</td>
                    </tr>
                    <tr>
                        <td class="right-align" style="padding-right: 15px;"><strong>Inv No.</strong></td>
                        <td class="right-align">{{ $invoice->invoice_number }}</td>
                    </tr>
                    @if($invoice->due_date)
                    <tr>
                        <td class="right-align" style="padding-right: 15px;"><strong>Due Date</strong></td>
                        <td class="right-align">{{ $invoice->due_date->format('d/m/Y') }}</td>
                    </tr>
                    @endif
                    @if($invoice->status)
                    <tr>
                        <td class="right-align" style="padding-right: 15px;"><strong>Status</strong></td>
                        <td class="right-align" style="text-transform: uppercase; font-weight: bold; color: #003366;">{{ $invoice->status }}</td>
                    </tr>
                    @endif
                </table>
            </td>
        </tr>
    </table>

    <!-- Items Table -->
    <table class="items-table">
        <thead>
            <tr>
                <th class="col-desc">Item Description</th>
                <th class="col-qty">Qty</th>
                <th class="col-unit">Unit</th>
                <th class="col-price">Unit Price</th>
                <th class="col-total">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $item)
            <tr>
                <td class="col-desc">
                    <strong>{{ $item->product_name }}</strong>
                    @if($item->product_model)<br><span style="font-size: 10px; color: #555;">Model: {{ $item->product_model }}</span>@endif
                    @if($item->serial_number)<br><span style="font-size: 10px; color: #555;">S/N: {{ $item->serial_number }}</span>@endif
                    @if($item->warranty_months > 0)
                        <br><span style="font-size: 10px; color: #003366; font-weight: bold;">Warranty: {{ $item->warranty_months }} Months</span>
                        @if($item->warranty_start_date && $item->warranty_end_date)
                            <span style="font-size: 9px; color: #555;">({{ $item->warranty_start_date->format('d/m/Y') }} – {{ $item->warranty_end_date->format('d/m/Y') }})</span>
                        @endif
                    @endif
                </td>
                <td class="col-qty">{{ number_format($item->quantity, 2) }}</td>
                <td class="col-unit">{{ $item->unit ?: 'pcs' }}</td>
                <td class="col-price">{{ number_format($item->unit_price, 2) }}</td>
                <td class="col-total">{{ number_format($item->line_total, 2) }}</td>
            </tr>
            @endforeach

            <!-- Sub Total -->
            <tr class="totals-row">
                <td colspan="3" class="no-border"></td>
                <td style="background-color: #f0f0f0;">Sub Total</td>
                <td style="text-align: right;">{{ number_format($invoice->subtotal, 2) }}</td>
            </tr>

            <!-- Discount (if applicable) -->
            @if($invoice->discount_amount > 0)
            <tr class="totals-row">
                <td colspan="3" class="no-border"></td>
                <td style="background-color: #f0f0f0;">Discount</td>
                <td style="text-align: right;">-{{ number_format($invoice->discount_amount, 2) }}</td>
            </tr>
            @endif

            <!-- VAT / Tax (if applicable) -->
            @if($invoice->tax_amount > 0)
            <tr class="totals-row">
                <td colspan="3" class="no-border"></td>
                <td style="background-color: #f0f0f0;">VAT({{ (float)$invoice->tax_rate }}%)</td>
                <td style="text-align: right;">{{ number_format($invoice->tax_amount, 2) }}</td>
            </tr>
            @endif

            <!-- Total -->
            <tr class="totals-row">
                <td colspan="3" class="no-border"></td>
                <td style="background-color: #d9d9d9;">Total</td>
                <td style="text-align: right;">{{ number_format($invoice->grand_total, 2) }}</td>
            </tr>

            <!-- Amount Paid (if applicable) -->
            @if($invoice->amount_paid > 0)
            <tr class="totals-row">
                <td colspan="3" class="no-border"></td>
                <td style="background-color: #f0f0f0;">Amount Paid</td>
                <td style="text-align: right;">-{{ number_format($invoice->amount_paid, 2) }}</td>
            </tr>
            <tr class="totals-row">
                <td colspan="3" class="no-border"></td>
                <td style="background-color: #f8d7da; color: #721c24;">Balance Due</td>
                <td style="text-align: right; color: #721c24;">{{ number_format($invoice->balance_due, 2) }}</td>
            </tr>
            @endif
        </tbody>
    </table>

    <!-- Footer Section -->
    <div class="footer-section">
        <div class="section-title">Terms and Conditions</div>
        <ul class="terms-list">
            @if($invoice->terms)
                <li>{!! nl2br(e($invoice->terms)) !!}</li>
            @else
                <li><strong>Advance Payment</strong> – 70% of the total project value is required as an advance payment to initiate work.</li>
                <li><strong>Delivery Time</strong> – Standard delivery time is 30 days after receiving the Purchase Order (PO). However, this may vary depending on the project scope.</li>
                <li><strong>Payment Terms</strong> – The remaining payment is to be made within 30 days from the date of delivery of the completed work.</li>
                <li><strong>Warranty</strong> – A 1-year warranty is provided for manufacturing defects. This does not cover damages due to misuse, improper handling, or external factors.</li>
            @endif
        </ul>

        <div class="section-title" style="margin-top: 15px;">Payment details</div>
        <div class="payment-details">
            <table>
                <tr>
                    <td style="width: 80px;"><strong>Name</strong></td>
                    <td>{{ !empty($company['bank_account_name']) && $company['bank_account_name'] !== 'TiTEC Automation (Pvt) Ltd' ? $company['bank_account_name'] : 'M.K.L.M.Premarathne' }}</td>
                </tr>
                <tr>
                    <td><strong>ACC No</strong></td>
                    <td>{{ !empty($company['bank_account_number']) ? $company['bank_account_number'] : '006550013781' }}</td>
                </tr>
                <tr>
                    <td><strong>Bank</strong></td>
                    <td>{{ !empty($company['bank_name']) ? $company['bank_name'] : 'Sampath Bank' }}</td>
                </tr>
                <tr>
                    <td><strong>Branch</strong></td>
                    <td>{{ !empty($company['bank_branch']) ? $company['bank_branch'] : 'Minuwangoda' }}</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="thank-you">
        Thank you for your business. We are looking forward to serving you again.
    </div>

</body>
</html>
