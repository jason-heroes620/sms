<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Branches extends Model
{
    use HasUuids;

    protected $table = 'branches';
    protected $primaryKey = 'branch_id';

    protected $fillable = [
        'branch_name',
        'branch_address',
        'branch_contact_no',
        'branch_email',
        'branch_status',
        'created_by',
        'payroll_location_id',
        'jibble_location_id',
        'branch_location',
    ];

    protected $casts = [
        'branch_address' => 'array',
    ];

    public function users(): BelongsToMany
    {
        // This method tells Eloquent that a Branch has many Users.
        // It will automatically look for a pivot table named 'branch_user'.
        return $this->belongsToMany(User::class, 'branch_user', 'branch_id', 'user_id');
    }
}
