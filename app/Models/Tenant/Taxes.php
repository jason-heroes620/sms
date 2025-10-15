<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Taxes extends Model
{
    use HasUuids;

    protected $connection = 'central';
    protected $table = 'taxes';
    protected $primaryKey = 'tax_id';
    protected $fillable = [
        'tax_name',
        'tax',
        'tax_status',
        'effective_start_date',
        'effective_end_date',
        'created_by',
    ];
}
