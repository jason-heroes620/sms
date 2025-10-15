<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Packages extends Model
{
    use HasUuids;

    protected $table = 'packages';
    protected $primaryKey = 'package_id';
    protected $fillable = [
        'package_name',
        'package_description',
        'package_price',
        'effective_start_date',
        'effective_end_date',
        'package_status',
        'recurring',
        'frequency',
        'created_by'
    ];

    protected $casts = [
        'recurring' => 'boolean',
    ];
}
