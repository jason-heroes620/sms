<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use HasUuids;

    protected $table = 'user_role';
    protected $primaryKey = 'user_role_id';
    protected $fillable = [
        'user_id',
        'role_id',
        'branch_id'
    ];

    public $timestamps = false;
}
