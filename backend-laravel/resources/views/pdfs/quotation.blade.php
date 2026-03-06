<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Quotation</title>
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
            padding: 8px;
            text-align: center;
            font-weight: bold;
            border: 1px solid #003366;
        }
        .items-table td {
            border: 1px solid #000;
            padding: 5px;
            vertical-align: middle;
        }
        .col-desc { text-align: left; }
        .col-qty { text-align: center; width: 50px; }
        .col-unit { text-align: center; width: 50px; }
        .col-price { text-align: right; width: 80px; }
        .col-total { text-align: right; width: 90px; }
        
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
            list-style: none; /* Removing default bullets to match style if needed, or keeping them */
        }
        .terms-list li {
            margin-bottom: 5px;
        }
        .payment-details table {
            width: 50%;
            margin-top: 10px;
        }
        .payment-details td {
            padding: 2px 0;
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
                    <strong>{{ $request->name }}</strong><br>
                    @if($request->company) {{ $request->company }}<br> @endif
                    {{ $request->email }}<br>
                    {{ $request->phone }}
                </div>
            </td>
            <td width="40%" class="info-cell right-align">
                <div class="doc-title">Quotation</div>
                <br>
                <table style="width: 100%; margin-top: 10px;">
                    <tr>
                        <td class="right-align" style="padding-right: 15px;"><strong>Date</strong></td>
                        <td class="right-align">{{ date('d/m/Y') }}</td>
                    </tr>
                    <tr>
                        <td class="right-align" style="padding-right: 15px;"><strong>Qt No.</strong></td>
                        <td class="right-align">Q{{ str_pad($request->id, 4, '0', STR_PAD_LEFT) }}</td>
                    </tr>
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
            @php 
                $subTotal = 0; 
            @endphp
            @foreach($items as $item)
            @php
                $qty = (float)$item['quantity'];
                $price = (float)$item['price'];
                $lineTotal = $qty * $price;
                $subTotal += $lineTotal;
            @endphp
            <tr>
                <td class="col-desc">{{ $item['name'] }}</td>
                <td class="col-qty">{{ number_format($qty, 2) }}</td>
                <td class="col-unit">{{ $item['unit'] ?? 'Nos' }}</td>
                <td class="col-price">{{ number_format($price, 2) }}</td>
                <td class="col-total">{{ number_format($lineTotal, 2) }}</td>
            </tr>
            @endforeach

            <!-- Sub Total -->
            <tr class="totals-row">
                <td colspan="3" class="no-border"></td>
                <td style="background-color: #f0f0f0;">Sub Total</td>
                <td style="text-align: right;">{{ number_format($subTotal, 2) }}</td>
            </tr>
            <!-- VAT -->
            @if($vat > 0)
            <tr class="totals-row">
                <td colspan="3" class="no-border"></td>
                <td style="background-color: #f0f0f0;">VAT({{ $vat }}%)</td>
                <td style="text-align: right;">{{ number_format($subTotal * ($vat / 100), 2) }}</td>
            </tr>
            @endif
            <!-- Grand Total -->
            <tr class="totals-row">
                <td colspan="3" class="no-border"></td>
                <td style="background-color: #d9d9d9;">Total</td>
                <td style="text-align: right;">{{ number_format($subTotal * (1 + ($vat / 100)), 2) }}</td>
            </tr>
        </tbody>
    </table>

    <!-- Footer Section -->
    <div class="footer-section">
        <div class="section-title">Terms and Conditions</div>
        <ul class="terms-list">
            @if(isset($terms) && is_array($terms))
                @foreach($terms as $term)
                    <li>{!! $term !!}</li>
                @endforeach
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
                    <td><strong>Name</strong></td>
                    <td>M.K.L.M.Premarathne</td>
                </tr>
                <tr>
                    <td><strong>ACC No</strong></td>
                    <td>006550013781</td>
                </tr>
                <tr>
                    <td><strong>Bank</strong></td>
                    <td>Sampath Bank</td>
                </tr>
                <tr>
                    <td><strong>Branch</strong></td>
                    <td>Minuwangoda</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="thank-you">
        Thank you for your inquiry. We are looking forward to Your business.
    </div>

</body>
</html>
