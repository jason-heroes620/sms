<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class BillingItems extends Model
{
    use HasUuids;

    protected $table = 'billing_items';
    protected $primaryKey = 'billing_item_id';
    protected $fillable = [
        'billing_id',
        'fee_id',
        'tax_id',
        'tax_amount',
        'fee_amount',
        'amount'
    ];
}
