<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Billings extends Model
{
    use HasUuids;

    protected $table = 'billings';
    protected $primaryKey = 'billing_id';
    protected $fillable = [
        'billing_year',
        'billing_month',
        'billing_status',
        'created_by'
    ];
}
