<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Fees extends Model
{
    use HasUuids;

    protected $table = 'fees';
    protected $primaryKey = 'fee_id';
    protected $fillable = [
        'fee_label',
        'fee_code',
        'uom',
        'amount',
        'fee_status',
        'fee_type',
        'tax_id',
        'tax_code',
        'tax_rate',
        'classification_code'
    ];
}
