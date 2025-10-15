<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;

class SettingRelationship extends Model
{
    protected $connection = 'central';
    protected $table = 'setting_relationship';
    protected $primaryKey = 'setting_relationship_id';
    public $timestamps = false;
}
