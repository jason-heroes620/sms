<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Invoices extends Model
{
    use HasUuids;
    protected $table = 'invoices';
    protected $primaryKey = 'invoice_id';
    protected $fillable = [
        'user_id',
        'invoice_no',
        'invoice_date',
        'due_date',
        'student_id',
        'invoice_amount',
        'paid',
        'balance',
        'invoice_status',
        'notes',
    ];
}
