<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Positions extends Model
{
    use HasUuids;

    protected $table = 'positions';
    protected $primaryKey = 'position_id';
    protected $fillable = [
        'position',
        'payroll_position_id'
    ];
}
