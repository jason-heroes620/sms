<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Permissions extends Model
{
    use HasUuids;

    protected $connection = 'sms_central';
    protected $table = 'permissions';
    protected $primaryKey = 'permission_id';
    protected $fillable = [
        'permission',
        'permission_group_id',
        'allowed',
    ];

    public $timestamps = false;

    public function permissionGroup()
    {
        return $this->belongsTo(PermissionGroups::class, 'permission_group_id', 'permission_group_id');
    }
}
