<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class UserProfiles extends Model
{

    use HasUuids;

    // protected $connection = '';
    protected $table = 'user_profiles';
    protected $primaryKey = 'user_profile_id';
    protected $fillable = [
        'user_id',
        'payroll_id',
        'first_name',
        'last_name',
        'email',
        'contact_no',
        'address',
        'profile_picture',
        'gender',
        'race',
        'dob',
        'residential_status',
        'nic',
        'passport',
        'marital_status',
        'residential_status',
        'ability_status',
        'user_status',
        'employment_date',
        'spouse_info',
        'position_id',
        'payroll_employee_id',
        'branch_id',
    ];

    protected $casts = [
        'address' => 'array',
        'spuse_info' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
