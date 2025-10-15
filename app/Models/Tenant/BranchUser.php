<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;

class BranchUser extends Model
{
    protected $table = 'branch_user';
    protected $primaryKey = 'branch_user_id';
    protected $fillable = [
        'branch_id',
        'user_id',
        'role_id',
        'created_by'
    ];

    public static function getUserBranchIds($user)
    {
        return self::where('user_id', $user)->pluck('branch_id')->toArray();
    }
}
