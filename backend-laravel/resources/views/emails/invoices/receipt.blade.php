<x-mail::message>
# Invoice #{{ $invoice->invoice_number }}

Dear {{ $invoice->client->company_name ?: $invoice->client->contact_person }},

@if($amount > 0)
Thank you for your payment! We have successfully received **Rs. {{ number_format($amount, 2) }}**.
@else
Here is your invoice for your recent order.
@endif

**Status:** {{ strtoupper(str_replace('_', ' ', $invoice->status)) }}

## Details
- **Invoice Number:** {{ $invoice->invoice_number }}
- **Grand Total:** Rs. {{ number_format($invoice->grand_total, 2) }}
- **Total Paid to Date:** Rs. {{ number_format($invoice->amount_paid, 2) }}
- **Balance Remaining:** Rs. {{ number_format($invoice->grand_total - $invoice->amount_paid, 2) }}

Please find the attached PDF for your records.

If you have any questions, please contact us.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
