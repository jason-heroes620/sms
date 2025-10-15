<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class PackageFees extends Model
{
    use HasUuids;

    protected $table = 'package_fees';
    protected $primaryKey = 'package_fee_id';
    protected $fillable = [
        'package_id',
        'fee_id',
    ];

    public $timestamps = false;
}
