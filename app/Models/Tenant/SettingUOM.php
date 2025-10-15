<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;

class SettingUOM extends Model
{
    protected $connection = 'central';
    protected $table = 'setting_uom';
    protected $primaryKey = 'setting_uom_id';
}
