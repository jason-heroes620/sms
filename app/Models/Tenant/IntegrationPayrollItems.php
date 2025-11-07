<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;

class IntegrationPayrollItems extends Model
{
    public $table = 'integration_payroll_items';
    protected $fillable = [
        'integration_payroll_item_id',
        'payroll_items'
    ];

    public $timestamps = false;
}
